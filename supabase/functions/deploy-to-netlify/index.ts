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
    const NETLIFY_SITE_ID = Deno.env.get('NETLIFY_SITE_ID')

    if (!NETLIFY_ACCESS_TOKEN || !NETLIFY_SITE_ID) {
      throw new Error('Netlify credentials not configured')
    }

    // Generate the website files for aetherwebsites.com subdomain
    const deployFiles = {
      'index.html': generateIndexHTML(content, settings, websiteId),
      '_redirects': generateRedirects(websiteId),
      'robots.txt': 'User-agent: *\nAllow: /',
    }

    console.log('📁 Deploy files prepared:', Object.keys(deployFiles));

    // Create deployment
    const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: deployFiles,
        draft: false
      })
    })

    const deployData = await deployResponse.json()
    console.log('📤 Netlify response:', deployData);

    if (deployResponse.ok) {
      // Configure custom domain for this site
      const customDomain = `site-${websiteId}.aetherwebsites.com`;
      
      // Add the custom domain to Netlify site
      const domainResponse = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/domains`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: customDomain
        })
      });

      const domainData = await domainResponse.json();
      console.log('🌐 Domain configuration:', domainData);

      const siteUrl = `https://${customDomain}`;
      
      return new Response(
        JSON.stringify({
          success: true,
          deploy_id: deployData.id,
          url: siteUrl,
          deploy_url: siteUrl,
          custom_domain: customDomain,
          subdomain: `site-${websiteId}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      throw new Error(`Netlify deployment failed: ${deployData.message}`)
    }

  } catch (error) {
    console.error('❌ Netlify deployment error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
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
    /* Custom styles for live site */
    body { margin: 0; padding: 0; }
    .website-container { min-height: 100vh; }
  </style>
</head>
<body>
  <div class="website-container" id="website-content">
    ${renderContent(content, settings)}
  </div>
  
  <!-- Analytics and tracking can be added here -->
  <script>
    // Add any necessary JavaScript for live site functionality
    console.log('Site loaded for website: ${websiteId}');
  </script>
</body>
</html>`
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
  // Helper function to render nested elements
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
  return `# Custom domain redirects for aetherwebsites.com subdomain
/*    /index.html   200`;
}
