const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const compiledSupplyChain = require('./build/MedicineSupplyChain.json')

const provider = new HDWalletProvider(
    'mechanic slide lock food become cargo catch orchard obscure canvas peasant scare',
    'https://sepolia.infura.io/v3/44fb24f80d7547c8b41c2c2449498e19'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledSupplyChain.interface))
        .deploy({ data: compiledSupplyChain.bytecode })
        .send({ gas: 1000000, from: accounts[0] });

    console.log('Contract deployed to', result.options.address);
};

deploy();

// 0x379822572274A7A08A38789753ac9e858e50BCdE