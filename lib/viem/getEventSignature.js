import { protocolRewardsABI } from "@zoralabs/protocol-deployments";
import { encodeEventTopics, getAbiItem } from "viem";

const getEventSignature = () => {
  const eventName = "RewardsDeposit";
  const rewardsDepositEvent = getAbiItem({
    abi: protocolRewardsABI,
    name: eventName,
  });
  return rewardsDepositEvent
    ? encodeEventTopics({
        abi: [rewardsDepositEvent],
        eventName,
      })[0]
    : undefined;
};

export default getEventSignature;
