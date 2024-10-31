import { protocolRewardsABI } from "@zoralabs/protocol-deployments";
import { parseEventLogs } from "viem";
import getTransferSingleLog from "./getTransferSingleLog.js";
import getTransferLog from "./getTransferLog.js";

const decodeEventLog = (event) => {
  let parsedLog;
  try {
    parsedLog = parseEventLogs({
      abi: protocolRewardsABI,
      logs: event.allTxLogs,
    })[0];
    const collectionLog = getTransferSingleLog(event.allTxLogs);
    const transferLog = getTransferLog(event.allTxLogs);
    parsedLog.args = {
      ...parsedLog.args,
      ...collectionLog,
      ...transferLog,
    };
  } catch (parseError) {
    console.error("Error parsing event log:", parseError);
    if (!parsedLog) parsedLog = { eventName: "Unknown", args: {} };
  }
  return parsedLog;
};

export default decodeEventLog;
