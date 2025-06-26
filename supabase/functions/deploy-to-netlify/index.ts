
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
    
    // Check if site already exists for this website
    console.log('🔍 Checking if site exists for:', customDomain);
    
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
      site.custom_domain === customDomain || 
      site.name === `site-${websiteId}` ||
      (site.domain_aliases && site.domain_aliases.includes(customDomain))
    );

    let siteId;

    if (!targetSite) {
      console.log('🆕 Creating new Netlify site for:', customDomain);
      
      // Create a new site
      const createSiteResponse = await fetch('https://api.netlify.com/api/v1/sites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `site-${websiteId}`,
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
      
      console.log('✅ Site created:', { siteId, domain: targetSite.url });

      // Add custom domain if it's not already set
      if (targetSite.custom_domain !== customDomain) {
        console.log('🌐 Adding custom domain:', customDomain);
        
        const addDomainResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/domains`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            domain: customDomain
          })
        });

        if (!addDomainResponse.ok) {
          const errorText = await addDomainResponse.text();
          console.log('⚠️ Could not add custom domain (may already exist):', errorText);
        } else {
          console.log('✅ Custom domain added successfully');
        }
      }
    } else {
      siteId = targetSite.id;
      console.log('✅ Using existing site:', { siteId, domain: targetSite.url });
    }

    // Generate the website files
    const indexHTML = generateIndexHTML(content, settings, websiteId);
    const redirectsContent = generateRedirects(websiteId);
    
    console.log('📁 Generated files:', { 
      indexHTMLLength: indexHTML.length,
      redirectsLength: redirectsContent.length
    });

    // Create deployment using Netlify's file-based deploy API
    const formData = new FormData();
    
    // Add files to form data
    formData.append('index.html', new Blob([indexHTML], { type: 'text/html' }));
    formData.append('_redirects', new Blob([redirectsContent], { type: 'text/plain' }));
    formData.append('robots.txt', new Blob(['User-agent: *\nAllow: /'], { type: 'text/plain' }));

    console.log('📤 Sending deployment to Netlify...');

    // Use the site-specific endpoint for deployment
    const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
      },
      body: formData
    });

    console.log('📤 Netlify API response status:', deployResponse.status);

    if (!deployResponse.ok) {
      const errorText = await deployResponse.text();
      console.error('❌ Netlify API error:', errorText);
      throw new Error(`Netlify deployment failed: ${deployResponse.status} ${errorText}`);
    }

    const deployData = await deployResponse.json();
    console.log('✅ Deployment successful:', { 
      deployId: deployData.id,
      state: deployData.state,
      url: deployData.ssl_url || deployData.url
    });

    // The site should now be available at the custom domain
    const siteUrl = `https://${customDomain}`;
    console.log('🌐 Site will be available at:', siteUrl);

    return new Response(
      JSON.stringify({
        success: true,
        deploy_id: deployData.id,
        url: siteUrl,
        deploy_url: deployData.ssl_url || deployData.url,
        custom_domain: customDomain,
        subdomain: `site-${websiteId}`,
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
