import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { websiteId, content, settings } = await req.json()

    console.log('📤 Deploying website:', { websiteId, contentLength: content?.length });

    // Get Netlify credentials from environment
    const NETLIFY_ACCESS_TOKEN = Deno.env.get('NETLIFY_ACCESS_TOKEN')

    if (!NETLIFY_ACCESS_TOKEN) {
      console.error('❌ Missing Netlify access token');
      throw new Error('Netlify access token not configured')
    }

    console.log('✅ Credentials found, proceeding with deployment');

    const customDomain = `site-${websiteId}.aetherwebsites.com`;
    const siteName = `site-${websiteId}`;
    
    // Check if site already exists for this website
    console.log('🔍 Checking if site exists for:', siteName);
    
    const sitesResponse = await fetch('https://api.netlify.com/api/v1/sites', {
      headers: {
        'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
      }
    });

    if (!sitesResponse.ok) {
      throw new Error(`Failed to fetch sites: ${sitesResponse.status}`);
    }

    const sites = await sitesResponse.json();
    let targetSite = sites.find((site: any) => 
      site.name === siteName ||
      site.custom_domain === customDomain ||
      (site.domain_aliases && site.domain_aliases.includes(customDomain))
    );

    let siteId;
    let siteUrl;

    if (!targetSite) {
      console.log('🆕 Creating new Netlify site for:', siteName);
      
      // Create a new site with the custom domain
      const createSiteResponse = await fetch('https://api.netlify.com/api/v1/sites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: siteName,
          custom_domain: customDomain,
        })
      });

      if (!createSiteResponse.ok) {
        const errorText = await createSiteResponse.text();
        console.error('❌ Failed to create site:', errorText);
        throw new Error(`Failed to create Netlify site: ${createSiteResponse.status} ${errorText}`);
      }

      targetSite = await createSiteResponse.json();
      siteId = targetSite.id;
      
      console.log('✅ Site created:', { siteId, name: targetSite.name });

      // Wait a moment for the site to be fully created
      await new Promise(resolve => setTimeout(resolve, 2000));

      siteUrl = `https://${customDomain}`;
    } else {
      siteId = targetSite.id;
      console.log('✅ Using existing site:', { siteId, name: targetSite.name });
      siteUrl = `https://${customDomain}`;
    }

    // Generate the website files
    const indexHTML = generateIndexHTML(content, settings, websiteId);
    const redirectsContent = generateRedirects(websiteId);
    
    console.log('📁 Generated files:', { 
      indexHTMLLength: indexHTML.length,
      redirectsLength: redirectsContent.length
    });

    // Create a proper zip file containing the website files
    const zipContent = await createProperZipFile({
      'index.html': indexHTML,
      '_redirects': redirectsContent,
      'robots.txt': 'User-agent: *\nAllow: /'
    });

    console.log('📦 Created zip file, size:', zipContent.byteLength);

    // Deploy using zip file upload
    const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
        'Content-Type': 'application/zip',
      },
      body: zipContent
    });

    console.log('📤 Netlify deploy response status:', deployResponse.status);

    if (!deployResponse.ok) {
      const errorText = await deployResponse.text();
      console.error('❌ Netlify deployment error:', errorText);
      throw new Error(`Netlify deployment failed: ${deployResponse.status} ${errorText}`);
    }

    const deployData = await deployResponse.json();
    console.log('✅ Deployment created:', { 
      deployId: deployData.id,
      state: deployData.state,
      deploy_ssl_url: deployData.deploy_ssl_url || deployData.ssl_url
    });

    // Wait for deployment to complete with reasonable timeout
    let deploymentComplete = false;
    let attempts = 0;
    const maxAttempts = 15; // Reduced from 20

    while (!deploymentComplete && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Reduced from 3000
      attempts++;

      const checkResponse = await fetch(`https://api.netlify.com/api/v1/deploys/${deployData.id}`, {
        headers: {
          'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
        }
      });

      if (checkResponse.ok) {
        const currentStatus = await checkResponse.json();
        console.log(`📋 Deployment status check ${attempts}:`, {
          state: currentStatus.state,
          deploy_ssl_url: currentStatus.deploy_ssl_url,
          error_message: currentStatus.error_message
        });

        if (currentStatus.state === 'ready') {
          deploymentComplete = true;
          console.log('✅ Deployment completed successfully!');
          break;
        } else if (currentStatus.state === 'error') {
          console.error('❌ Deployment failed with error:', currentStatus.error_message);
          throw new Error(`Deployment failed: ${currentStatus.error_message || 'Unknown error'}`);
        }
      }
    }

    if (!deploymentComplete) {
      console.log('⚠️ Deployment timeout, but returning success as deployment may complete in background');
    }

    return new Response(
      JSON.stringify({
        success: true,
        deploy_id: deployData.id,
        url: siteUrl,
        deploy_url: deployData.deploy_ssl_url || deployData.ssl_url || `https://${deployData.id}--${siteName}.netlify.app`,
        custom_domain: customDomain,
        subdomain: siteName,
        state: deployData.state,
        site_id: siteId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Netlify deployment error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check Supabase logs for more information'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

// Create a proper zip file from files object
async function createProperZipFile(files: Record<string, string>): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const zipParts: Uint8Array[] = [];
  const centralDirEntries: Uint8Array[] = [];
  let centralDirSize = 0;
  let localHeaderOffset = 0;

  // Create local file headers and file data
  for (const [filename, content] of Object.entries(files)) {
    const fileContent = encoder.encode(content);
    const filenameBytes = encoder.encode(filename);
    const crc = crc32(fileContent);
    
    // Local file header (30 bytes + filename length)
    const localHeader = new Uint8Array(30 + filenameBytes.length);
    const headerView = new DataView(localHeader.buffer);
    
    // Local file header signature
    headerView.setUint32(0, 0x04034b50, true);
    // Version needed to extract
    headerView.setUint16(4, 20, true);
    // General purpose bit flag
    headerView.setUint16(6, 0, true);
    // Compression method (0 = no compression)
    headerView.setUint16(8, 0, true);
    // File last modification time
    headerView.setUint16(10, 0, true);
    // File last modification date
    headerView.setUint16(12, 0, true);
    // CRC-32
    headerView.setUint32(14, crc, true);
    // Compressed size
    headerView.setUint32(18, fileContent.length, true);
    // Uncompressed size
    headerView.setUint32(22, fileContent.length, true);
    // File name length
    headerView.setUint16(26, filenameBytes.length, true);
    // Extra field length
    headerView.setUint16(28, 0, true);
    
    // Add filename to header
    localHeader.set(filenameBytes, 30);
    
    // Create central directory entry
    const centralDirEntry = new Uint8Array(46 + filenameBytes.length);
    const centralView = new DataView(centralDirEntry.buffer);
    
    // Central directory header signature
    centralView.setUint32(0, 0x02014b50, true);
    // Version made by
    centralView.setUint16(4, 20, true);
    // Version needed to extract
    centralView.setUint16(6, 20, true);
    // General purpose bit flag
    centralView.setUint16(8, 0, true);
    // Compression method
    centralView.setUint16(10, 0, true);
    // File last modification time
    centralView.setUint16(12, 0, true);
    // File last modification date
    centralView.setUint16(14, 0, true);
    // CRC-32
    centralView.setUint32(16, crc, true);
    // Compressed size
    centralView.setUint32(20, fileContent.length, true);
    // Uncompressed size
    centralView.setUint32(24, fileContent.length, true);
    // File name length
    centralView.setUint16(28, filenameBytes.length, true);
    // Extra field length
    centralView.setUint16(30, 0, true);
    // File comment length
    centralView.setUint16(32, 0, true);
    // Disk number start
    centralView.setUint16(34, 0, true);
    // Internal file attributes
    centralView.setUint16(36, 0, true);
    // External file attributes
    centralView.setUint32(38, 0, true);
    // Relative offset of local header
    centralView.setUint32(42, localHeaderOffset, true);
    
    // Add filename to central directory entry
    centralDirEntry.set(filenameBytes, 46);
    
    // Add to arrays
    zipParts.push(localHeader);
    zipParts.push(fileContent);
    centralDirEntries.push(centralDirEntry);
    
    // Update offsets
    localHeaderOffset += localHeader.length + fileContent.length;
    centralDirSize += centralDirEntry.length;
  }
  
  // Create end of central directory record
  const endOfCentralDir = new Uint8Array(22);
  const endView = new DataView(endOfCentralDir.buffer);
  
  // End of central directory signature
  endView.setUint32(0, 0x06054b50, true);
  // Number of this disk
  endView.setUint16(4, 0, true);
  // Number of the disk with the start of the central directory
  endView.setUint16(6, 0, true);
  // Total number of entries in the central directory on this disk
  endView.setUint16(8, Object.keys(files).length, true);
  // Total number of entries in the central directory
  endView.setUint16(10, Object.keys(files).length, true);
  // Size of the central directory
  endView.setUint32(12, centralDirSize, true);
  // Offset of start of central directory
  endView.setUint32(16, localHeaderOffset, true);
  // ZIP file comment length
  endView.setUint16(20, 0, true);
  
  // Combine all parts
  const totalLength = zipParts.reduce((sum, part) => sum + part.length, 0) + 
                     centralDirSize + endOfCentralDir.length;
  
  const result = new Uint8Array(totalLength);
  let offset = 0;
  
  // Add local headers and file data
  for (const part of zipParts) {
    result.set(part, offset);
    offset += part.length;
  }
  
  // Add central directory entries
  for (const entry of centralDirEntries) {
    result.set(entry, offset);
    offset += entry.length;
  }
  
  // Add end of central directory record
  result.set(endOfCentralDir, offset);
  
  return result;
}

// CRC32 implementation
function crc32(data: Uint8Array): number {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function generateIndexHTML(content: any[], settings: any, websiteId: string): string {
  const pageTitle = settings?.title || settings?.pages?.[0]?.title || 'Website';
  const pageDescription = settings?.description || '';
  const socialImage = settings?.socialImage || '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDescription}">
  ${socialImage ? `<meta property="og:image" content="${socialImage}">` : ''}
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${pageDescription}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://site-${websiteId}.aetherwebsites.com">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 0; }
    .website-container { min-height: 100vh; }
  </style>
</head>
<body>
  <div class="website-container" id="website-content">
    ${renderContent(content, settings)}
  </div>
  
  <script>
    console.log('Site loaded for website: ${websiteId}');
  </script>
</body>
</html>`;
}

function renderContent(content: any[], settings: any): string {
  if (!content || !Array.isArray(content)) {
    return '<div class="flex items-center justify-center min-h-screen"><p class="text-gray-500">No content available</p></div>';
  }

  return content.map(element => {
    switch (element.type) {
      case 'heading':
        const level = element.props?.level || 1;
        const headingClass = element.props?.className || getDefaultHeadingClass(level);
        return `<h${level} class="${headingClass}">${element.content || ''}</h${level}>`;
        
      case 'text':
        const textClass = element.props?.className || 'text-gray-700 mb-4';
        return `<p class="${textClass}">${element.content || ''}</p>`;
        
      case 'button':
        const buttonClass = element.props?.className || 'bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors';
        const buttonHref = element.props?.href || '#';
        return `<a href="${buttonHref}" class="${buttonClass} inline-block">${element.content || 'Button'}</a>`;
        
      case 'section':
        const sectionClass = element.props?.className || 'py-12';
        const childrenContent = element.children ? element.children.map(child => renderElement(child)).join('\n') : '';
        return `<section class="${sectionClass}">
          <div class="container mx-auto px-4">
            ${childrenContent}
          </div>
        </section>`;
        
      case 'navbar':
        return renderNavbar(element);
        
      case 'footer':
        return renderFooter(element);
        
      case 'image':
        const imageClass = element.props?.className || 'max-w-full h-auto';
        const imageSrc = element.props?.src || '';
        const imageAlt = element.props?.alt || '';
        return `<img src="${imageSrc}" alt="${imageAlt}" class="${imageClass}">`;
        
      default:
        const defaultClass = element.props?.className || '';
        return `<div class="${defaultClass}">${element.content || ''}</div>`;
    }
  }).join('\n');
}

function renderElement(element: any): string {
  switch (element.type) {
    case 'heading':
      const level = element.props?.level || 2;
      const headingClass = element.props?.className || getDefaultHeadingClass(level);
      return `<h${level} class="${headingClass}">${element.content || ''}</h${level}>`;
      
    case 'text':
      const textClass = element.props?.className || 'text-gray-700 mb-4';
      return `<p class="${textClass}">${element.content || ''}</p>`;
      
    case 'button':
      const buttonClass = element.props?.className || 'bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors';
      const buttonHref = element.props?.href || '#';
      return `<a href="${buttonHref}" class="${buttonClass} inline-block">${element.content || 'Button'}</a>`;
      
    default:
      const defaultClass = element.props?.className || '';
      return `<div class="${defaultClass}">${element.content || ''}</div>`;
  }
}

function getDefaultHeadingClass(level: number): string {
  const classes = {
    1: 'text-4xl font-bold mb-6',
    2: 'text-3xl font-bold mb-4',
    3: 'text-2xl font-bold mb-4',
    4: 'text-xl font-bold mb-3',
    5: 'text-lg font-bold mb-3',
    6: 'text-base font-bold mb-2'
  };
  return classes[level as keyof typeof classes] || classes[1];
}

function renderNavbar(element: any): string {
  const siteName = element.props?.siteName || 'Website';
  const links = element.props?.links || [];
  const variant = element.props?.variant || 'default';
  
  const navClass = variant === 'dark' 
    ? 'bg-gray-900 text-white shadow-lg' 
    : 'bg-white text-gray-900 shadow-lg';
    
  const linkClass = variant === 'dark'
    ? 'text-gray-300 hover:text-white transition-colors'
    : 'text-gray-700 hover:text-gray-900 transition-colors';

  return `<nav class="${navClass}">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <div class="text-xl font-bold">${siteName}</div>
        <div class="hidden md:flex space-x-6">
          ${links.map((link: any) => 
            `<a href="${link.url || '#'}" class="${linkClass}">${link.text || 'Link'}</a>`
          ).join('')}
        </div>
      </div>
    </div>
  </nav>`;
}

function renderFooter(element: any): string {
  const siteName = element.props?.siteName || 'Website';
  const links = element.props?.links || [];
  const variant = element.props?.variant || 'default';
  
  const footerClass = variant === 'dark' 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-100 text-gray-900';
    
  const linkClass = variant === 'dark'
    ? 'text-gray-300 hover:text-white transition-colors'
    : 'text-gray-700 hover:text-gray-900 transition-colors';

  return `<footer class="${footerClass} py-8 mt-auto">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="text-lg font-bold mb-4 md:mb-0">${siteName}</div>
        <div class="flex space-x-6">
          ${links.map((link: any) => 
            `<a href="${link.url || '#'}" class="${linkClass}">${link.text || 'Link'}</a>`
          ).join('')}
        </div>
      </div>
      <div class="text-center mt-4 pt-4 border-t border-gray-300">
        <p class="text-sm opacity-75">&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
      </div>
    </div>
  </footer>`;
}

function generateRedirects(websiteId: string): string {
  return `# Redirects for site-${websiteId}.aetherwebsites.com
/*    /index.html   200`;
}
