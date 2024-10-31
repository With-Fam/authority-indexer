import { zoraCreator1155ImplABI } from "@zoralabs/protocol-deployments";
import { parseEventLogs } from "viem";

const getTransferSingleLog = (logs) => {
  const collectionLogs = parseEventLogs({
    abi: zoraCreator1155ImplABI,
    eventName: "TransferSingle",
    logs,
  });
  try {
    const { to, id, value } = collectionLogs[0].args;
    return {
      collector: to,
      tokenId: id,
      quantity: value,
      collectionAddress: collectionLogs[0].address,
    };
  } catch (error) {
    console.log("No TransferSingle logs found");
    return {};
  }
};

export default getTransferSingleLog;
