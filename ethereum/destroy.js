const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const compiledSupplyChain = require('./build/MedicineSupplyChain.json')

const provider = new HDWalletProvider(
    'mechanic slide lock food become cargo catch orchard obscure canvas peasant scare',
    'https://sepolia.infura.io/v3/44fb24f80d7547c8b41c2c2449498e19'
);

const web3 = new Web3(provider);
const address = '';

const destroy = async () => {
    const accounts = await web3.eth.getAccounts();

    const contract = await new web3.eth.Contract(JSON.parse(compiledSupplyChain.interface), address);
    
    console.log('Attempting to self-destruct contract at', address);

    // Call the destroy function from the owner's account
    await contract.methods.destroy().send({ from: accounts[0] });
    console.log('Contract self-destructed');
};

destroy();
