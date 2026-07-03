/**
 * Reçoit le callback GitHub et renvoie le token à Decap CMS (fenêtre parente).
 * Route Cloudflare Pages : GET /api/callback
 */

function renderBody(status, content) {
  return `<!doctype html>
<html lang="fr">
  <head><meta charset="utf-8" /><title>Connexion Decap CMS</title></head>
  <body>
    <script>
      (function () {
        function receiveMessage(message) {
          window.opener.postMessage(
            'authorization:github:${status}:${JSON.stringify(content)}',
            message.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>`;
}

export async function onRequest({ request, env }) {
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(
      "Variables GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET manquantes. Ajoutez-les dans Cloudflare Pages → Settings → Environment variables.",
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Code OAuth absent.", { status: 400 });
  }

  try {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          "user-agent": "benedicte-donet-decap-oauth",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      },
    );

    const result = await tokenResponse.json();

    if (result.error) {
      return new Response(renderBody("error", result), {
        status: 401,
        headers: { "content-type": "text/html; charset=UTF-8" },
      });
    }

    return new Response(
      renderBody("success", { token: result.access_token, provider: "github" }),
      {
        status: 200,
        headers: { "content-type": "text/html; charset=UTF-8" },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(message, {
      status: 500,
      headers: { "content-type": "text/plain; charset=UTF-8" },
    });
  }
}
