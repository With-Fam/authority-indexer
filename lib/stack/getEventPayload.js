import convertBigIntToString from "../convertBigIntToString.js";
import decodeEventLog from "../viem/decodeEventLog.js";

const getEventPayload = (network, event) => {
  let decodedLog = decodeEventLog(event);

  const {
    creator,
    createReferral,
    mintReferral,
    firstMinter,
    zora,
    from,
    creatorReward,
    createReferralReward,
    mintReferralReward,
    firstMinterReward,
    zoraReward,
    collectionAddress,
  } = decodedLog.args;

  const convertedEvent = convertBigIntToString({
    ...decodedLog,
    decodedLog,
  });

  const feeRecipients = [
    { type: "creator", address: creator, reward: creatorReward },
    {
      type: "createReferral",
      address: createReferral,
      reward: createReferralReward,
    },
    { type: "mintReferral", address: mintReferral, reward: mintReferralReward },
    { type: "firstMinter", address: firstMinter, reward: firstMinterReward },
    { type: "zora", address: zora, reward: zoraReward },
  ];

  return feeRecipients.map((recipient) => ({
    name: `${convertedEvent.decodedLog.eventName}-${recipient.type}-${network}`,
    account: recipient.address,
    uniqueId: `${network}-${decodedLog.transactionHash}-${convertedEvent.logIndex}-${recipient.type}`,
    pointSystemId: process.env.STACK_SYSTEM_ID,
    points: (BigInt(recipient.reward) / BigInt(1e12)).toString(),
    metadata: {
      ...convertedEvent.decodedLog.args,
      ...convertBigIntToString({
        creator,
        createReferral,
        mintReferral,
        firstMinter,
        zora,
        from,
        creatorReward: creatorReward.toString(),
        createReferralReward: createReferralReward.toString(),
        mintReferralReward: mintReferralReward.toString(),
        firstMinterReward: firstMinterReward.toString(),
        zoraReward: zoraReward.toString(),
        feeType: recipient.type,
        collectionAddress,
      }),
      blockNumber: convertedEvent.blockNumber,
      network,
      protocolRewardsContract: decodedLog.address,
      transactionHash: decodedLog.transactionHash,
    },
  }));
};

export default getEventPayload;
