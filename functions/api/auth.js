/**
 * Démarre le flux OAuth GitHub pour Decap CMS.
 * Route Cloudflare Pages : GET /api/auth
 */
export async function onRequest({ request, env }) {
  const clientId = env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response(
      "Variable GITHUB_CLIENT_ID manquante. Ajoutez-la dans Cloudflare Pages → Settings → Environment variables.",
      { status: 500 },
    );
  }

  const origin = new URL(request.url).origin;
  const authorize = new URL("https://github.com/login/oauth/authorize");

  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", `${origin}/api/callback`);
  authorize.searchParams.set("scope", "repo");
  authorize.searchParams.set("state", crypto.randomUUID());

  return Response.redirect(authorize.toString(), 302);
}
