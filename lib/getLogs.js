import rpcRequest from "./rpcRequest.js";
import getEventSignature from "./viem/getEventSignature.js";
import getTransactionDetails from "./viem/getTransactionDetails.js";

async function getLogs(network, fromBlock, toBlock) {
  const CHUNK_SIZE = 1000n;
  let allLogs = [];

  for (
    let chunkStart = fromBlock;
    chunkStart <= toBlock;
    chunkStart += CHUNK_SIZE
  ) {
    const chunkEnd =
      chunkStart + CHUNK_SIZE - 1n > toBlock
        ? toBlock
        : chunkStart + CHUNK_SIZE - 1n;
    console.log(
      `${network} - Fetching logs for blocks ${chunkStart} to ${chunkEnd}`
    );
    const logs = await rpcRequest(network, "eth_getLogs", [
      {
        topics: [getEventSignature()],
        fromBlock: `0x${chunkStart.toString(16)}`,
        toBlock: `0x${chunkEnd.toString(16)}`,
      },
    ]);

    const logPromises = logs.map((log) =>
      getTransactionDetails(network, log.transactionHash).then((allTxLogs) => ({
        matchedLog: log,
        allTxLogs: allTxLogs,
      }))
    );

    allLogs.push(...(await Promise.all(logPromises)));
  }

  return allLogs;
}

export default getLogs;
