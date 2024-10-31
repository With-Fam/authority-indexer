import getLogs from "./getLogs.js";
import trackEventsWithStack from "./stack/trackEventsWithStack.js";

const BATCH_SIZE = 99; // Adjust this value based on Stack.so API limitations

async function processBlocks(network, start, end) {
  const events = await getLogs(network, start, end);
  console.log(`${network} - Processing ${events.length} events`);

  for (let i = 0; i < events.length; i += BATCH_SIZE) {
    const batch = events.slice(i, i + BATCH_SIZE);
    await trackEventsWithStack(network, batch);
  }
}

export default processBlocks;
