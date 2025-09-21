// deno_api.js

// Deno Deploy is a Serverless platform.
// It exposes the API through a single HTTP request handler.

// This function will handle all incoming requests.
Deno.serve(async (req) => {
    // Use URL to parse the request path
    const url = new URL(req.url);

    // Use a simple switch statement to handle different API paths.
    // This mimics the behavior of a simple router.
    switch (url.pathname) {
        case "/":
            return new Response("This is the root path of the Deno API!", {
                headers: { "Content-Type": "text/plain" },
                status: 200,
            });

        case "/greet":
            const name = url.searchParams.get("name") || "World";
            return new Response(`Hello, ${name}! This is the Deno API.`, {
                headers: { "Content-Type": "text/plain" },
                status: 200,
            });

        default:
            return new Response("404 Not Found", {
                headers: { "Content-Type": "text/plain" },
                status: 404,
            });
    }
});

console.log("Deno API is running and ready to serve requests!");
