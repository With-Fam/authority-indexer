# Myco Rewards Indexer for Zora on Base

This project is a Node.js-based indexer for Zora protocol reward events on Base, Base Sepolia, Zora & Zora Sepolia networks, designed to help developers building applications on Zora.

## Benefits for Zora Developers

This indexer provides several advantages for developers building applications on Zora:

1. **Stack.so Integration**: Automatically tracks reward events with Stack.so, enabling easy analytics and user engagement features.
2. **Real-time Event Tracking**: Automatically indexes and tracks Zora protocol reward events on Base & Zora networks.
3. **Customizable**: Can be easily modified to focus on specific Zora events or contracts of interest.
4. **Network Flexibility**: Supports both Base mainnet and Base Sepolia testnet.
5. **Efficient Data Processing**: Uses chunked requests and multiple RPC endpoints for reliable data fetching.
6. **Easy Integration**: Simplifies the process of accessing historical and real-time Zora reward event data.

By using this indexer, developers can focus on building their Zora applications without worrying about the complexities of reward event indexing and data management.

## Prerequisites

- Node.js (version 14 or higher recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/SweetmanTech/myco-rewards-indexer
   cd myco-rewards-indexer
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up your environment variables:
   Copy the `.env.example` file to `.env` in the root directory and add any necessary environment variables.

## Usage

To run the indexer:

1. Start the indexer:

   ```
   npm start
   ```

2. The indexer will start processing reward events from the specified network (Base, Base Sepolia, Zora or Zora Sepolia).

3. To switch between networks or customize the indexing process, you can modify the following environment variables in your `.env` file:

   - `NETWORK`: Set to either `mainnet` for Base or `sepolia` for Base Sepolia
   - `START_BLOCK`: The block number to start indexing from (optional)
   - `END_BLOCK`: The block number to end indexing at (optional)

4. Monitor the console output for indexing progress and any potential errors.

5. The indexed data will be stored according to the implementation in `indexEventsForNetwork.js`.

## Event Indexed

This indexer specifically tracks the `RewardsDeposit` event from the Zora Protocol Rewards contract. This event is emitted when rewards are deposited. It includes the following information:

- `creator`: The address of the creator receiving the reward.
- `createReferral`: The address of the create referral.
- `mintReferral`: The address of the mint referral.
- `firstMinter`: The address of the first minter.
- `zora`: The address of the Zora protocol.
- `from`: The address from which the rewards are sent.
- `creatorReward`: The amount of reward for the creator.
- `createReferralReward`: The amount of reward for the create referral.
- `mintReferralReward`: The amount of reward for the mint referral.
- `firstMinterReward`: The amount of reward for the first minter.
- `zoraReward`: The amount of reward for the Zora protocol.

By tracking this event, the indexer provides valuable data about reward distributions within the Zora protocol, which can be useful for analyzing protocol activity and reward patterns.

## Customization

- To index different events or contracts, modify the `getEventSignature.js` file in the `lib/viem` directory to change the event being tracked.
- Adjust RPC endpoints in `lib/rpc.js` if needed.
- To modify how event data is processed or stored, update the `getEventPayload.js` file in the `lib/stack` directory.
- The point calculation can be adjusted in `getEventPayload.js` by modifying the `points` field in the returned payload.
- The batch size for processing events can be adjusted in `processBlocks.js` by changing the `BATCH_SIZE` constant.

## Deployment

This project is set up for automatic deployment to a DigitalOcean Droplet using GitHub Actions. Here's how to set up your own droplet for deployment:

1. **Create a DigitalOcean Droplet**:

   - Sign up for a DigitalOcean account if you haven't already.
   - Create a new Droplet, choosing Ubuntu as the operating system.
   - Select a plan that suits your needs (Basic plan is often sufficient for starting).
   - Choose a datacenter region close to your target audience.
   - Add your SSH key for secure access.

2. **Initial Droplet Setup**:

   - SSH into your new Droplet: `ssh root@your_droplet_ip`
   - Update the system:
     ```
     sudo apt update
     sudo apt upgrade -y
     ```
   - Install Node.js and npm:
     ```
     curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
     sudo apt-get install -y nodejs
     ```
   - Install PM2 globally: `sudo npm install -g pm2`

3. **Configure GitHub Secrets**:
   In your GitHub repository, go to Settings > Secrets and add the following:

   - `DROPLET_IP`: Your DigitalOcean Droplet's IP address
   - `DROPLET_USER`: The username for SSH access (usually 'root')
   - `DROPLET_PASSWORD`: Your Droplet's root password or SSH key passphrase

4. **Prepare the Droplet for Deployment**:

   - Create the project directory: `mkdir -p ~/myco-rewards-indexer`
   - Set up Node.js version management (optional but recommended):
     ```
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
     source ~/.bashrc
     nvm install 20
     nvm use 20
     ```

5. **Configure Environment Variables**:

   - Create a `.env` file in the project directory on your Droplet:
     ```
     nano ~/myco-rewards-indexer/.env
     ```
   - Add necessary environment variables (e.g., `STACK_API_KEY`, `BASE_SEPOLIA_FIRST_BLOCK`, etc.)
   - Save the file by pressing `Ctrl + X`, then `Y`, and finally `Enter`.

6. **Update GitHub Workflow**:
   Ensure your `.github/workflows/deploy.yml` file is correctly set up. It should include steps to:

   - Check out the code
   - Set up Node.js
   - Install dependencies
   - Run tests
   - Deploy to the DigitalOcean Droplet

7. **Trigger Deployment**:

   - Push changes to your GitHub repository.
   - The GitHub Action will automatically deploy your project to the Droplet.

8. **Verify Deployment**:
   - SSH into your Droplet and check if the process is running:
     ```
     pm2 list
     ```
   - You should see `myco-rewards-indexer` in the list of processes.

With these steps, your project should be automatically deployed to your DigitalOcean Droplet whenever you push changes to your GitHub repository.

## Troubleshooting

If you encounter any issues during deployment:

1. Check the GitHub Actions logs for any error messages.
2. Ensure all secrets are correctly set in your GitHub repository.
3. Verify that your Droplet has sufficient resources (CPU, RAM, disk space).
4. Check the PM2 logs on your Droplet: `pm2 logs myco-rewards-indexer`

For more detailed logs, you can modify the logging level in the indexer code.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
