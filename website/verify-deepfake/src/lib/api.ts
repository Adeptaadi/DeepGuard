/**
 * Unified Backend Engine Connector
 * 
 * Strategy:
 * 1. Checks configured environment variable (VITE_API_URL / VITE_RENDER_API_URL).
 * 2. Primary: Render cloud backend (e.g., https://deepguard-backend.onrender.com or custom domain).
 * 3. Fallback: Localhost / local development engine (http://127.0.0.1:8000).
 */

const DEFAULT_RENDER_URL = "https://deepguard-backend-ug4e.onrender.com";
const DEFAULT_LOCAL_URL = "http://127.0.0.1:8000";

// Prioritize explicit env var, then default Render cloud deployment, then localhost
export const getCandidateUrls = (): string[] => {
  const envUrl = import.meta.env.VITE_API_URL;
  const urls: string[] = [];

  if (envUrl) {
    const cleanedEnv = envUrl.replace(/\/+$/, "");
    if (!urls.includes(cleanedEnv)) urls.push(cleanedEnv);
  }
  
  if (!urls.includes(DEFAULT_RENDER_URL)) {
    urls.push(DEFAULT_RENDER_URL);
  }

  if (!urls.includes(DEFAULT_LOCAL_URL)) {
    urls.push(DEFAULT_LOCAL_URL);
  }

  return urls;
};

/**
 * Sends media to the backend, attempting the primary Cloud (Render) server first.
 * If the Cloud server fails or is unreachable, smoothly fails over to the Local backend.
 */
export async function analyzeMediaWithFallback(formData: FormData): Promise<{ data: any; usedUrl: string }> {
  const candidateUrls = getCandidateUrls();
  const errors: string[] = [];

  for (const baseUrl of candidateUrls) {
    try {
      console.info(`[DeepGuard Engine] Attempting inference connection at: ${baseUrl}/analyze`);
      
      const controller = new AbortController();
      // 2-minute timeout to allow for video upload + neural inference + Render cold-start
      const timeoutId = setTimeout(() => {
        try {
          controller.abort();
        } catch (_) {}
      }, 120000);

      const response = await fetch(`${baseUrl}/analyze`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.info(`[DeepGuard Engine] Successfully analyzed media using endpoint: ${baseUrl}`);
        return { data, usedUrl: baseUrl };
      } else {
        const errText = await response.text();
        errors.push(`${baseUrl} responded with status ${response.status}: ${errText}`);
      }
    } catch (err: any) {
      console.warn(`[DeepGuard Engine] Connection to ${baseUrl} failed:`, err.message || err);
      errors.push(`${baseUrl}: ${err.message || "Network request failed"}`);
    }
  }

  throw new Error(
    `Unable to reach DeepGuard AI engine.\n` +
    `Attempted endpoints:\n` +
    errors.map((e) => `• ${e}`).join("\n") +
    `\n\nIf using Render free tier, the instance might be waking up (allow 30-45s) or ensure your local backend is running with 'python -m uvicorn backend.main:app'.`
  );
}
