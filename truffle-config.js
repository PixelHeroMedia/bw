const HDWalletProvider = require("@truffle/hdwallet-provider");

const MNEMONIC = process.env.MNEMONIC;

if (!MNEMONIC) {
  console.error("Please set a mnemonic");
  process.exit(0);
}

module.exports = {
  networks: {
    sepolia: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, "wss://eth-sepolia.g.alchemy.com/v2/Qn5rx_pBefC4dj93PNKp2H7PE0Imx4O7");
      },
      network_id: 11155111,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    live: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, "wss://eth-mainnet.g.alchemy.com/v2/Krob7pivXTzO6CUmt9xXHJtoWNqdzs8P");
      },
      network_id: 1,
      //gas: 3500000,
      //gasPrice: 65000000000,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200   // Optimize for how many times you intend to run the code
        },
      },
    },
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  }
};