/**
 * Unified Backend Engine Connector
 * 
 * Strategy:
 * 1. Checks configured environment variable (VITE_API_URL).
 * 2. Primary: Direct Render cloud backend (https://deepguard-backend-ug4e.onrender.com).
 * 3. Secondary: Same-origin Vercel proxy (/api) if cross-origin is blocked.
 * 4. Fallback: Localhost / local development engine (http://127.0.0.1:8000).
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

  // 1. Direct Render Cloud (handles full video durations without Vercel edge timeout)
  if (!urls.includes(DEFAULT_RENDER_URL)) {
    urls.push(DEFAULT_RENDER_URL);
  }

  // 2. Same-origin Vercel rewrite proxy
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    const sameOriginApi = `${window.location.origin}/api`;
    if (!urls.includes(sameOriginApi)) {
      urls.push(sameOriginApi);
    }
  }

  // 3. Fallback: Localhost
  if (!urls.includes(DEFAULT_LOCAL_URL)) {
    urls.push(DEFAULT_LOCAL_URL);
  }

  return urls;
};

export type ProgressCallback = (progress: number, stageIdx: number, message: string) => void;

/**
 * Sends media to the backend with automatic streaming & REST failover across candidate endpoints.
 */
export async function analyzeMediaWithFallback(
  formData: FormData,
  onProgress?: ProgressCallback
): Promise<{ data: any; usedUrl: string }> {
  const candidateUrls = getCandidateUrls();
  const errors: string[] = [];

  for (const baseUrl of candidateUrls) {
    try {
      console.info(`[DeepGuard Engine] Initiating forensic analysis at: ${baseUrl}`);
      
      const controller = new AbortController();
      // 3-minute timeout to allow video upload + neural inference + Render CPU processing
      const timeoutId = setTimeout(() => {
        try { controller.abort(); } catch (_) {}
      }, 180000);

      onProgress?.(10, 0, "Transmitting media to inference engine...");

      let response: Response | null = null;
      let isStreaming = true;

      try {
        response = await fetch(`${baseUrl}/analyze?stream=true`, {
          method: "POST",
          body: formData,
          headers: {
            "Accept": "application/x-ndjson, application/json",
          },
          signal: controller.signal,
        });
      } catch (streamErr) {
        console.warn(`[DeepGuard] Stream fetch failed on ${baseUrl}, trying standard REST POST:`, streamErr);
        isStreaming = false;
        response = await fetch(`${baseUrl}/analyze`, {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        errors.push(`${baseUrl} responded with status ${response.status}: ${errText}`);
        continue;
      }

      const contentType = response.headers.get("content-type") || "";

      // Handle NDJSON stream
      if (isStreaming && (contentType.includes("ndjson") || contentType.includes("stream"))) {
        if (!response.body) {
          throw new Error("ReadableStream not supported by browser response");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        let finalData: any = null;
        let streamSucceeded = false;

        try {
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

              // Ignore keep-alive heartbeats
              if (msg.type === "ping") {
                continue;
              }

              if (msg.type === "progress") {
                onProgress?.(msg.progress, msg.stage ?? 0, msg.message ?? "");
              } else if (msg.type === "complete") {
                finalData = msg.data;
                streamSucceeded = true;
              } else if (msg.type === "error") {
                throw new Error(msg.message || "Engine reported an error during analysis");
              }
            }
          }
        } catch (streamReadErr) {
          console.warn("[DeepGuard] Stream interrupted, falling back to standard REST POST:", streamReadErr);
        }

        if (streamSucceeded && finalData) {
          onProgress?.(100, 3, "Forensic analysis complete!");
          return { data: finalData, usedUrl: baseUrl };
        }

        // Seamless REST fallback if stream was prematurely closed
        console.info(`[DeepGuard] Stream closed without payload, attempting seamless REST fallback on ${baseUrl}...`);
        onProgress?.(70, 2, "Compiling forensic outputs via REST engine...");
        const restResponse = await fetch(`${baseUrl}/analyze`, {
          method: "POST",
          body: formData,
        });

        if (restResponse.ok) {
          const restData = await restResponse.json();
          onProgress?.(100, 3, "Forensic analysis complete!");
          return { data: restData, usedUrl: baseUrl };
        } else {
          const restErr = await restResponse.text();
          throw new Error(`REST fallback failed with status ${restResponse.status}: ${restErr}`);
        }
      } else {
        // Standard JSON response
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
 * Wakes up the backend immediately when the user lands on the website.
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
    } catch (_) {}
  }
  return { status: "waking_up" };
}
