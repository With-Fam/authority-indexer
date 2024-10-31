import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  reservoir: 100, // Total number of requests allowed
  reservoirRefreshAmount: 200, // Number of requests to add at each refresh
  reservoirRefreshInterval: 10 * 1000, // Refresh interval in milliseconds
  maxConcurrent: 10, // Increased concurrency to handle multiple requests
  minTime: 50, // Minimum time between requests to prevent burst
});

export default limiter;
