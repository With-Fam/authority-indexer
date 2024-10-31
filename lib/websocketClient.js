import { createPublicClient, webSocket } from "viem";
import { RPC_URLS } from "./rpc.js";
import { protocolRewardsABI } from "@zoralabs/protocol-deployments";

const clients = {};

export function getWebSocketClient(network) {
  if (clients[network]) {
    return clients[network];
  }

  const wsUrl = RPC_URLS[network].ws;
  if (!wsUrl) {
    throw new Error(`WebSocket URL not defined for network: ${network}`);
  }

  const transport = webSocket(wsUrl);
  const client = createPublicClient({
    transport,
  });

  clients[network] = client;
  return client;
}

export async function subscribeToEvents(network, eventName, callback) {
  const client = getWebSocketClient(network);

  try {
    const unwatch = await client.watchContractEvent({
      abi: protocolRewardsABI,
      eventName,
      onLogs: (logs) => {
        callback(logs);
      },
    });

    console.log(
      `Subscribed to ${eventName} events on ${network} via WebSocket.`
    );
    return unwatch; // Return the unwatch function for later use if needed
  } catch (error) {
    console.error(`Failed to subscribe to events on ${network}:`, error);
  }
}
