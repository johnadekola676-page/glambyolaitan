// ============================================================================
// Cloudflare Pages Function — Injects environment variables into the page
// ============================================================================
// This edge function intercepts requests to index.html and injects
// the WEBHOOK_URL and other env vars so the frontend JS can read them
// from window.__ENV__ without exposing secrets in source code.
//
// Deploy: Place this file at /functions/_middleware.js in your Pages project.
// Set env vars in: Cloudflare Dashboard > Pages > Settings > Environment Variables
// ============================================================================

export async function onRequest(context) {
    const response = await context.next();
    const contentType = response.headers.get('content-type') || '';

    // Only transform HTML responses
    if (!contentType.includes('text/html')) {
        return response;
    }

    const html = await response.text();

    // Build the env injection script
    const envScript = `
    <script>
        window.__ENV__ = {
            WEBHOOK_URL:    "${context.env.WEBHOOK_URL || ''}",
            BUSINESS_NAME:  "${context.env.BUSINESS_NAME || 'Glam By Olaitan'}",
            BUSINESS_PHONE: "${context.env.BUSINESS_PHONE || '+2349069602020'}",
            BUSINESS_EMAIL: "${context.env.BUSINESS_EMAIL || 'glam@olaitan.ng'}",
            BUSINESS_SLUG:  "${context.env.BUSINESS_SLUG || 'glam9069'}"
        };
    </script>`;

    // Inject just before the existing __ENV__ script or before </head>
    const modifiedHtml = html.replace(
        '<script>\n        // Runtime config',
        envScript + '\n    <script>\n        // Runtime config'
    );

    return new Response(modifiedHtml, {
        status: response.status,
        headers: response.headers,
    });
}
