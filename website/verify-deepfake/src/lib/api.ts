/**
 * Unified Backend Engine Connector
 * 
 * Strategy:
 * 1. Checks configured environment variable (VITE_API_URL / VITE_RENDER_API_URL).
 * 2. Same-origin Vercel proxy (/api) to bypass Brave Shields & adblocker false-positives.
 * 3. Direct Render cloud backend (https://deepguard-backend-ug4e.onrender.com).
 * 4. Localhost / local development engine (http://127.0.0.1:8000).
 */

const DEFAULT_RENDER_URL = "https://deepguard-backend-ug4e.onrender.com";
const DEFAULT_LOCAL_URL = "http://127.0.0.1:8000";

export const getCandidateUrls = (): string[] => {
  const envUrl = import.meta.env.VITE_API_URL;
  const urls: string[] = [];

  if (envUrl) {
    const cleanedEnv = envUrl.replace(/\/+$/, "");
    if (!urls.includes(cleanedEnv)) urls.push(cleanedEnv);
  }

  // 1. Same-origin Vercel rewrite proxy (bypasses Brave Shields & adblockers)
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    const sameOriginApi = `${window.location.origin}/api`;
    if (!urls.includes(sameOriginApi)) {
      urls.push(sameOriginApi);
    }
  }
  
  // 2. Direct Render Cloud
  if (!urls.includes(DEFAULT_RENDER_URL)) {
    urls.push(DEFAULT_RENDER_URL);
  }

  // 3. Fallback: Localhost
  if (!urls.includes(DEFAULT_LOCAL_URL)) {
    urls.push(DEFAULT_LOCAL_URL);
  }

  return urls;
};

export type ProgressCallback = (progress: number, stageIdx: number, message: string) => void;

/**
 * Sends media to the backend, attempting same-origin proxy, Render Cloud, and Localhost in order.
 * Supports real-time streaming progress (NDJSON) so progress maps directly to the active AI process.
 */
export async function analyzeMediaWithFallback(
  formData: FormData,
  onProgress?: ProgressCallback
): Promise<{ data: any; usedUrl: string }> {
  const candidateUrls = getCandidateUrls();
  const errors: string[] = [];

  for (const baseUrl of candidateUrls) {
    try {
      console.info(`[DeepGuard Engine] Attempting inference connection at: ${baseUrl}/analyze?stream=true`);
      
      const controller = new AbortController();
      // 3-minute timeout to allow for video upload + neural inference + Render CPU processing
      const timeoutId = setTimeout(() => {
        try {
          controller.abort();
        } catch (_) {}
      }, 180000);

      onProgress?.(10, 0, "Transmitting media to inference engine...");

      const response = await fetch(`${baseUrl}/analyze?stream=true`, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/x-ndjson, application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        errors.push(`${baseUrl} responded with status ${response.status}: ${errText}`);
        continue;
      }

      const contentType = response.headers.get("content-type") || "";

      // If streaming response (NDJSON)
      if (contentType.includes("ndjson") || contentType.includes("stream")) {
        if (!response.body) {
          throw new Error("ReadableStream not supported by browser response");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        let finalData: any = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            
            let msg: any = null;
            try {
              msg = JSON.parse(trimmed);
            } catch (parseErr: any) {
              console.warn("[DeepGuard] Error parsing stream line:", parseErr);
              continue;
            }

            if (msg.type === "progress") {
              onProgress?.(msg.progress, msg.stage ?? 0, msg.message ?? "");
            } else if (msg.type === "complete") {
              finalData = msg.data;
            } else if (msg.type === "error") {
              throw new Error(msg.message || "Engine reported an error during analysis");
            }
          }
        }

        if (finalData) {
          onProgress?.(100, 3, "Forensic analysis complete!");
          return { data: finalData, usedUrl: baseUrl };
        } else {
          throw new Error("Stream closed before completion payload was received");
        }
      } else {
        // Standard JSON fallback
        onProgress?.(85, 2, "Processing neural outputs & heatmaps...");
        const data = await response.json();
        onProgress?.(100, 3, "Forensic analysis complete!");
        console.info(`[DeepGuard Engine] Successfully analyzed media using endpoint: ${baseUrl}`);
        return { data, usedUrl: baseUrl };
      }
    } catch (err: any) {
      console.warn(`[DeepGuard Engine] Connection to ${baseUrl} failed:`, err.message || err);
      errors.push(`${baseUrl}: ${err.message || "Network request failed"}`);
    }
  }

  const isBlockedByBrowser = errors.some(
    (e) => e.toLowerCase().includes("blocked") || e.toLowerCase().includes("failed to fetch")
  );

  const browserBlockerAdvice = isBlockedByBrowser
    ? `\n\n🛡️ Brave Shields / Adblocker Detected:\nYour browser (Brave Shields, uBlock Origin, or Adblock) is blocking cross-domain requests (ERR_BLOCKED_BY_CLIENT). Click the Brave Lion icon in the address bar and turn Shields OFF for this site.`
    : "";

  throw new Error(
    `Unable to reach DeepGuard AI engine.\n` +
    `Attempted endpoints:\n` +
    errors.map((e) => `• ${e}`).join("\n") +
    browserBlockerAdvice +
    `\n\nIf using Render free tier, the instance might be waking up (allow 30-45s) or ensure your local backend is running with 'python -m uvicorn backend.main:app'.`
  );
}

/**
 * Wakes up the Render backend immediately when the user lands on the website.
 * Tries the same-origin proxy first, then direct Render, then Localhost.
 */
export async function warmUpBackend(): Promise<{ status: "online" | "waking_up"; url?: string }> {
  const candidateUrls = getCandidateUrls();
  
  for (const baseUrl of candidateUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        try { controller.abort(); } catch (_) {}
      }, 5000);

      const res = await fetch(`${baseUrl}/health`, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        console.info(`[DeepGuard Engine] Instant Warmup Success from ${baseUrl}:`, data);
        return { status: "online", url: baseUrl };
      }
    } catch (_) {
      // Warmup ping quietly attempts candidates in background
    }
  }
  return { status: "waking_up" };
}
