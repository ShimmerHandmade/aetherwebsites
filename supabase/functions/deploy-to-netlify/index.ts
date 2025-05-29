
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

    // Get Netlify credentials from environment
    const NETLIFY_ACCESS_TOKEN = Deno.env.get('NETLIFY_ACCESS_TOKEN')
    const NETLIFY_SITE_ID = Deno.env.get('NETLIFY_SITE_ID')

    if (!NETLIFY_ACCESS_TOKEN || !NETLIFY_SITE_ID) {
      throw new Error('Netlify credentials not configured')
    }

    // Prepare the site files for deployment
    const deployFiles = {
      'index.html': generateIndexHTML(content, settings),
      '_redirects': generateRedirects(),
      'robots.txt': 'User-agent: *\nAllow: /',
    }

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

    if (deployResponse.ok) {
      return new Response(
        JSON.stringify({
          success: true,
          deploy_id: deployData.id,
          url: deployData.ssl_url || deployData.url,
          deploy_url: `https://site-${websiteId}.netlify.app`
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
    console.error('Netlify deployment error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function generateIndexHTML(content: any[], settings: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${settings?.title || 'Website'}</title>
  <meta name="description" content="${settings?.description || ''}">
  ${settings?.socialImage ? `<meta property="og:image" content="${settings.socialImage}">` : ''}
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="website-content">
    ${renderContent(content)}
  </div>
</body>
</html>`
}

function renderContent(content: any[]): string {
  return content.map(element => {
    switch (element.type) {
      case 'heading':
        return `<h${element.props?.level || 1} class="${element.props?.className || ''}">${element.content}</h${element.props?.level || 1}>`
      case 'text':
        return `<p class="${element.props?.className || ''}">${element.content}</p>`
      case 'button':
        return `<button class="${element.props?.className || 'bg-blue-500 text-white px-4 py-2 rounded'}">${element.content}</button>`
      default:
        return `<div class="${element.props?.className || ''}">${element.content || ''}</div>`
    }
  }).join('\n')
}

function generateRedirects(): string {
  return `/*    /index.html   200
/api/*  /api/:splat  200`
}
