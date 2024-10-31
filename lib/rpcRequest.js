import fetch from "node-fetch";
import { RPC_URLS } from "./rpc.js";
import limiter from "./rateLimiter.js";
import { getCached, setCached } from "./cache.js";

async function rpcRequest(network, method, params) {
  const urls = RPC_URLS[network].http;
  let lastError;
  const cacheKey = `${network}_${method}_${JSON.stringify(params)}`;
  const cachedResult = getCached(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  const makeRequest = async (url) => {
    return limiter.schedule(async () => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        });
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error(`Rate limit exceeded for ${url}`);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.result;
      } catch (error) {
        console.log(`${network} - Request failed for ${url}: ${error.message}`);
        throw error;
      }
    });
  };

  for (let attempt = 0; attempt < 5; attempt++) {
    for (const url of urls) {
      try {
        return await makeRequest(url);
      } catch (error) {
        if (error.message.includes("Rate limit exceeded")) {
          // Specific handling for rate limit errors
          const retryAfter = Math.pow(2, attempt) * 1000;
          console.error(`Rate limit hit. Retrying after ${retryAfter}ms`);
          await new Promise((resolve) => setTimeout(resolve, retryAfter));
        } else {
          lastError = error;
        }
      }
    }
    // Exponential backoff
    await new Promise((resolve) =>
      setTimeout(resolve, Math.pow(2, attempt) * 1000)
    );
  }

  const result = await makeRequest(urls[0]);
  setCached(cacheKey, result);
  return result;
}

export default rpcRequest;
