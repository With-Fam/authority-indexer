# Product Requirements Document: Fam Indexer

## 1. Product Overview

### 1.1 Product Vision

Fam Indexer is a service that monitors Hypersub subscription contract events to manage Party Protocol membership through the ManageFamAuthority contract. It automatically indexes subscription events to trigger addPartyCards and removePartyCards functions, enabling seamless integration between Hypersub's subscription system and Party Protocol's membership management.

## 2. Core Features

### 2.1 Subscription Indexing

- Monitor Hypersub contract events for new subscriptions
- Execute addPartyCards function through ManageFamAuthority
- Track successful membership additions
- Handle transaction failures and retries

### 2.2 Unsubscribed Indexing

- Monitor Hypersub contract events for subscription expirations
- Execute removePartyCards function through ManageFamAuthority
- Track successful membership removals
- Implement grace period handling

## 3. Technical Architecture

### 3.1 Infrastructure

- Host: Digital Ocean Droplet (Ubuntu)
- Deployment: Github Actions CI/CD pipeline
- Monitoring: Standard Ubuntu system monitoring
- Database: None

### 3.2 Core Components

1. Indexer Service (forked from Myco Rewards Indexer)

   - Hypersub subscription monitoring
   - RPC integration via viem
   - Subscription activity tracking

2. Authority Service
   - Viem library integration
   - Ethereum wallet management
   - Base interaction handling
   - ManageFamAuthority contract interaction

### 3.3 Technology Stack

- Backend: NodeJS
- Blockchain: Base
- Subscription Protocol: Hypersub
- Proposal Protocol: Party
- Smart Contract Interaction: Viem
- Development: Cursor IDE
- Version Control: Github
- Indexing: RPC (free + public)

### 3.4 Subscription Transfer Indexing

#### 3.4.1 Overview

The subscription indexing system monitors ERC721 Transfer events emitted during minting operations to track new Hypersub Subscription Membership Minting / Transfer events. This component integrates with the ManageFamAuthority contract to manage Party Protocol access.

#### 3.4.2 Technical Implementation

The indexer will monitor Transfer events using the following approach:

1. Event Monitoring

   - Use eth_getLogs RPC method to fetch Transfer events
   - Monitor events from the Hypersub NFT contract address
   - Track the Transfer event signature: `Transfer(address,address,uint256)`

2. Event Processing

   - For each Transfer event:
     - If `from` is zero address (0x0): Handle as new subscription mint
     - If `to` is zero address (0x0): Handle as subscription burn/expiration
     - Otherwise: Handle as subscription transfer between addresses

3. Implementation Details

```javascript
// Event signature for Transfer
const TRANSFER_EVENT = "Transfer(address,address,uint256)";
// Fetch logs using rpcRequest utility
const logs = await rpcRequest("base", "eth_getLogs", [
  {
    topics: [ethers.utils.id(TRANSFER_EVENT)],
    fromBlock: LAST_PROCESSED_BLOCK,
    toBlock: "latest",
  },
]);
// Process each Transfer event
for (const log of logs) {
  const [from, to, tokenId] = ethers.utils.defaultAbiCoder.decode(
    ["address", "address", "uint256"],
    log.data
  );
  if (from === "0x0") {
    // New subscription minted
    await handleNewSubscription(to, tokenId);
  } else if (to === "0x0") {
    // Subscription expired/burned
    await handleExpiredSubscription(from, tokenId);
  } else {
    // Subscription transferred
    await handleTransferredSubscription(from, to, tokenId);
  }
}
```

4. Error Handling

   - Implement exponential backoff for RPC failures
   - Cache successful responses to minimize RPC calls
   - Track failed transactions for retry
   - Log all errors for monitoring

5. Block Management
   - Track last processed block number
   - Handle chain reorganizations
   - Process blocks in batches for efficiency
   - Maintain safe confirmation depth

## 4. Implementation Roadmap

### 4.1 Documentation and Setup

1. Fork the Myco Rewards Indexer
2. Clone it locally
3. Set up development environment with Cursor IDE
4. Create requirements.md
5. Document all core functionality and methods.

### 4.2 Join Fam

#### 4.2.1 Implementation Steps

1. Create Event Monitoring Service

   - Update event signature to monitor ERC721 Transfer events
   - Configure Base network RPC endpoints

2. Fetch Transfer Logs

```javascript
import rpcRequest from "../rpcRequest.js";
import { parseEventLogs } from "viem";

const TRANSFER_EVENT = "Transfer(address,address,uint256)";

async function fetchTransferLogs(fromBlock, toBlock) {
  try {
    const logs = await rpcRequest("base", "eth_getLogs", [
      {
        topics: [ethers.utils.id(TRANSFER_EVENT)],
        fromBlock: fromBlock.toString(16), // Convert to hex
        toBlock: toBlock.toString(16), // Convert to hex
        address: process.env.HYPERSUB_CONTRACT_ADDRESS, // Add contract address
      },
    ]);

    return logs;
  } catch (error) {
    console.error("Error fetching transfer logs:", error);
    throw error;
  }
}

export default fetchTransferLogs;
```

3. Implement Transfer Event Processing

```javascript
// Event signature for Transfer
const TRANSFER_EVENT = "Transfer(address,address,uint256)";

const handleNewSubscription = async (to, tokenId) => {
  try {
    // Call ManageFamAuthority contract
    await manageFamAuthority.addPartyCards(to, [tokenId]);
    console.log(`Added party cards for ${to} with token ${tokenId}`);
  } catch (error) {
    console.error(`Failed to add party cards: ${error}`);
    // Implement retry mechanism
  }
};
```

4. Process Transfer Logs

```javascript
import { parseEventLogs } from "viem";
import getTransferLog from "./viem/getTransferLog.js";

async function processTransferLogs(logs) {
  try {
    for (const log of logs) {
      const transferLog = getTransferLog([log]);
      const { collector: to, tokenId, collectionAddress } = transferLog;

      // Get the 'from' address from the original log topics
      const from = log.topics[1]; // First indexed parameter is 'from'

      if (from === "0x0000000000000000000000000000000000000000") {
        // New subscription minted
        await handleNewSubscription(to, tokenId);
      } else if (to === "0x0000000000000000000000000000000000000000") {
        // Subscription expired/burned
        await handleExpiredSubscription(from, tokenId);
      } else {
        // Subscription transferred
        await handleTransferredSubscription(from, to, tokenId);
      }

      console.log(`Processed transfer event in block ${log.blockNumber}`);
    }
  } catch (error) {
    console.error("Error processing transfer logs:", error);
    throw error;
  }
}

export default processTransferLogs;
```

5. Implement Block Management

```javascript
const processBlocks = async () => {
  const currentBlock = await rpcRequest("base", "eth_blockNumber", []);
  const fromBlock = LAST_PROCESSED_BLOCK;
  const toBlock = Math.min(
    BigInt(currentBlock),
    LAST_PROCESSED_BLOCK + BATCH_SIZE
  );

  // Fetch and process logs
  const logs = await fetchTransferLogs(fromBlock, toBlock);
  await processTransferLogs(logs);

  // Update last processed block
  LAST_PROCESSED_BLOCK = toBlock;
};
```

#### 4.2.2 Integration Points

1. Hypersub Contract

   - Monitor Transfer events from subscription NFT contract
   - Track subscription status changes

2. ManageFamAuthority Contract

   - Execute addPartyCards function
   - Handle transaction confirmations
   - Manage gas fees and transaction priorities

3. Party Protocol
   - Verify successful membership updates
   - Monitor membership status changes

#### 4.2.3 Success Criteria

- Successfully detect new subscription mints
- Properly execute addPartyCards transactions
- Handle errors and retries effectively
- Maintain accurate membership status
- Process events within 5-second target window

### 4.3 Leave Fam

### 4.4 Deployment

## 5. Monitoring and Maintenance

### 5.1 Performance Metrics

- Response time to new subscription events
- System uptime
- Blockchain interaction success rate

### 5.2 Maintenance Requirements

- Blockchain gas fee management
- System security updates
- Backup management for indexed events

## 6. References and Resources

### 6.1 Technical Documentation

- Viem Documentation: viem.sh

## 7. Success Criteria

### 7.1 Technical Success Metrics

- 99.9% uptime for core services
- <5s response time to subscription events
- Successful blockchain interactions
- Proper event indexing and persistence

### 7.2 Interaction Success Metrics

- Successful Fam membership additions and removals
