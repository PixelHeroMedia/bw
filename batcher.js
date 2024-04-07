const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3 = require("web3");
const MNEMONIC = process.env.MNEMONIC;

// TESTNET
const BATCHER_CONTRACT_ADDRESS = "0xbfdF50d9379473F82D15d79f3Ec59554a493976c"; 
const TOKEN_CONTRACT_ADDRESS = "0x9F597bD9b35301330Ec3011D4912A2AA2B19Ef3e"; 
//const LP_CONTRACT_ADDRESS = "0x2626664c2603336E57B271c5C0b26F421741e481"; //base
const LP_CONTRACT_ADDRESS = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E"; //sep
const WETH_CONTRACT_ADDRESS = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"; // sep
const DEV_WALLET = "0x1a620be9A3f160f781b53709509BF643987a3297";
const LIQUID = "0xe057b5fb811f555ad85def53c0dc032ae283c185"; //the lp holding token address
const BUY_AMOUNT = 300000000000000;

const BATCHER = require('./build/contracts/Batcher.json');
const BATCHER_ABI = BATCHER.abi;
const TOKEN = require('./build/contracts/BasedWhales.json');
const TOKEN_ABI = TOKEN.abi;
const LP_ABI = require('./uniswap.json');
const WETH_ABI = require('./weth.json');



async function main() {
  const provider = new HDWalletProvider(
   MNEMONIC,"wss://eth-sepolia.g.alchemy.com/v2/"
  );
  const web3Instance = new web3(provider);

  const batcherContract = new web3Instance.eth.Contract(
      BATCHER_ABI,
      BATCHER_CONTRACT_ADDRESS,
  );

  const tokenContract = new web3Instance.eth.Contract(
    TOKEN_ABI,
    TOKEN_CONTRACT_ADDRESS,
  );

  const lpContract = new web3Instance.eth.Contract(
    LP_ABI,
    LP_CONTRACT_ADDRESS,
  );

  const wethContract = new web3Instance.eth.Contract(
    WETH_ABI,
    WETH_CONTRACT_ADDRESS,
  );

  
const targets = []
const values = []
const datas = []

// create web3 transactions as you would normally

const tx1 = wethContract.methods.approve(LP_CONTRACT_ADDRESS,BUY_AMOUNT).encodeABI();
targets.push(WETH_CONTRACT_ADDRESS);
values.push(0);
datas.push(tx1);

const tx2 = tokenContract.methods.launch().encodeABI();
targets.push(TOKEN_CONTRACT_ADDRESS);
values.push(0);
datas.push(tx2);

const tx3 = lpContract.methods.exactInputSingle([
    WETH_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ADDRESS,
    3000,
    DEV_WALLET,
    BUY_AMOUNT,
    0,
    0
]).encodeABI();
targets.push(LP_CONTRACT_ADDRESS);
values.push(0);
datas.push(tx3);

const tx4 = tokenContract.methods.enableLimits(true).encodeABI();
targets.push(TOKEN_CONTRACT_ADDRESS);
values.push(0);
datas.push(tx4);

const tx5 = tokenContract.methods.excludeFromLimits([LIQUID],true).encodeABI();
targets.push(TOKEN_CONTRACT_ADDRESS);
values.push(0);
datas.push(tx5);

const tx6 = tokenContract.methods.transferOwnership(DEV_WALLET).encodeABI();
targets.push(TOKEN_CONTRACT_ADDRESS);
values.push(0);
datas.push(tx6);


const receipt = await batcherContract.methods.batchSend(targets, values, datas).send({from:DEV_WALLET});
console.log(receipt.events);



}

main();
