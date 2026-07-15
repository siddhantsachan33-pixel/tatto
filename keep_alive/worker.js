/**
 * Cloudflare Worker: Render Backend Keep-Alive Waker
 * 
 * This script runs periodically on a Cloudflare Cron Trigger (e.g. every 5 minutes)
 * to wake up the Render backend and prevent its free-tier container from sleeping.
 */

export default {
  // Triggered by Cloudflare Cron Event
  async scheduled(event, env, ctx) {
    const BACKEND_URL = env.BACKEND_URL || 'https://your-inkup-backend.onrender.com/health';
    
    ctx.waitUntil(
      fetch(BACKEND_URL)
        .then(async (res) => {
          const text = await res.text();
          console.log(`Keep-Alive triggered. Status: ${res.status}. Body: ${text}`);
        })
        .catch((err) => {
          console.error(`Keep-Alive waker failed: ${err.message}`);
        })
    );
  },

  // Triggered by direct HTTP access (useful for testing or manual triggers)
  async fetch(request, env, ctx) {
    const BACKEND_URL = env.BACKEND_URL || 'https://your-inkup-backend.onrender.com/health';
    
    try {
      const res = await fetch(BACKEND_URL);
      const data = await res.json();
      return new Response(JSON.stringify({
        message: "Render Backend keep-alive ping dispatched successfully",
        target: BACKEND_URL,
        backendStatus: res.status,
        response: data
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({
        error: "Keep-alive dispatch failed",
        details: err.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
