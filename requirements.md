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

## 4. Implementation Roadmap

### 4.1 Documentation and Setup

1. Fork the Myco Rewards Indexer
2. Clone it locally
3. Set up development environment with Cursor IDE
4. Create requirements.md
5. Document all core functionality and methods.

### 4.2 Join Fam

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
