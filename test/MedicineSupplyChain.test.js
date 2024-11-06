const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());
const { beforeEach } = require('mocha');

const compiledSuplyChain = require('../ethereum/build/MedicineSupplyChain.json');

let accounts;
let supplyChain;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    supplyChain = await new web3.eth.Contract(JSON.parse(compiledSuplyChain.interface))
        .deploy({
            data: compiledSuplyChain.bytecode
        })
        .send({
            from:accounts[0],
            gas: '1000000'
        });
});

describe('Supply Chain', () => {
    it('deploys a supply chain', () => {
        assert.ok(supplyChain.options.address);
    });

    it('register a manufacturer', async () => {
        await supplyChain.methods.registerParticipant(accounts[1], 'Manufacturer', 0).send({
            from: accounts[1],
            gas: '1000000'
        });

        const participant = await supplyChain.methods.participants(accounts[1]).call();
        assert.equal('Manufacturer', participant.name);
        assert.equal(0, participant.role);
    });

    it('register a distributor', async () => {
        await supplyChain.methods.registerParticipant(accounts[2], 'Distributor', 1).send({
            from: accounts[2],
            gas: '1000000'
        });

        const participant = await supplyChain.methods.participants(accounts[2]).call();
        assert.equal('Distributor', participant.name, "Name");
        assert.equal(1, participant.role, "Role");
    });

    it('register a pharmacy', async () => {
        await supplyChain.methods.registerParticipant(accounts[3], 'Pharmacy', 2).send({
            from: accounts[3],
            gas: '1000000'
        });

        const participant = await supplyChain.methods.participants(accounts[3]).call();
        assert.equal('Pharmacy', participant.name, "Name");
        assert.equal(2, participant.role, "Role");
    });

    it('register a consumer', async () => {
        await supplyChain.methods.registerParticipant(accounts[4], 'Consumer', 3).send({
            from: accounts[4],
            gas: '1000000'
        });

        const participant = await supplyChain.methods.participants(accounts[4]).call();
        assert.equal('Consumer', participant.name, "Name");
        assert.equal(3, participant.role, "Role");
    });

    it('manufacture a batch', async() => {
        await supplyChain.methods.registerParticipant(accounts[1], 'Manufacturer', 0).send({
            from: accounts[1],
            gas: '1000000'
        });
        const receipt = await supplyChain.methods.manufactureBatch('Paracetamol', 30).send({
            from:accounts[1],
            gas: '1000000'
        });

        const event = receipt.events.BatchManufactured;
        assert(event);
        assert.equal(1, event.returnValues.batchId);
        assert.equal(accounts[1], event.returnValues.manufacturer);
        assert(event.returnValues.manufactureDate > 0);

        const batch = await supplyChain.methods.batches(1).call();
        assert.equal('Paracetamol', batch.name);
        assert.equal(1, batch.batchId);
        assert.equal(accounts[1], batch.manufacturer);
        assert.equal(30, batch.expiryDate);
        assert.equal(accounts[1], batch.currentOwner);
        assert.equal('Manufactured', batch.status);
    });

    it('transfer batch', async () => {
        await supplyChain.methods.registerParticipant(accounts[1], 'Manufacturer', 0).send({
            from: accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[2], 'Distributor', 1).send({
            from: accounts[2],
            gas: '1000000'
        });
        await supplyChain.methods.manufactureBatch('Paracetamol', 30).send({
            from:accounts[1],
            gas: '1000000'
        });
        const receipt = await supplyChain.methods.transferBatch(1, accounts[2]).send({
            from: accounts[1],
            gas: '1000000'
        });

        const event = receipt.events.BatchTransferred;
        assert(event);
        assert.equal(1, event.returnValues.batchId);
        assert.equal(accounts[1], event.returnValues.from);
        assert.equal(accounts[2], event.returnValues.to);

        const batch = await supplyChain.methods.batches(1).call();
        assert.equal(accounts[2], batch.currentOwner);
        assert.equal("In Transit", batch.status);
    });

    it('marking stock', async () => {
        await supplyChain.methods.registerParticipant(accounts[1], 'Manufacturer', 0).send({
            from: accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[2], 'Distributor', 1).send({
            from: accounts[2],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[3], 'Pharmacy', 2).send({
            from: accounts[3],
            gas: '1000000'
        });
        await supplyChain.methods.manufactureBatch('Paracetamol', 30).send({
            from:accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.transferBatch(1, accounts[2]).send({
            from: accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.transferBatch(1, accounts[3]).send({
            from: accounts[2],
            gas: '1000000'
        });
        const receipt = await supplyChain.methods.markInStock(1).send({
            from: accounts[3],
            gas: '1000000'
        });

        const event = receipt.events.BatchInStock;
        assert(event);
        assert.equal(1, event.returnValues.batchId);
        assert.equal(accounts[3], event.returnValues.pharmacy);

        const batch = await supplyChain.methods.batches(1).call();
        assert.equal("In Stock", batch.status);
    });

    it('selling batch', async () => {
        await supplyChain.methods.registerParticipant(accounts[1], 'Manufacturer', 0).send({
            from: accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[2], 'Distributor', 1).send({
            from: accounts[2],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[3], 'Pharmacy', 2).send({
            from: accounts[3],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[4], 'Consumer', 3).send({
            from: accounts[4],
            gas: '1000000'
        });
        await supplyChain.methods.manufactureBatch('Paracetamol', 30).send({
            from:accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.transferBatch(1, accounts[2]).send({
            from: accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.transferBatch(1, accounts[3]).send({
            from: accounts[2],
            gas: '1000000'
        });
        await supplyChain.methods.markInStock(1).send({
            from: accounts[3],
            gas: '1000000'
        });
        const receipt = await supplyChain.methods.sellBatch(1, accounts[4]).send({
            from: accounts[3],
            gas: '1000000'
        });

        const event = receipt.events.BatchSold;
        assert(event);
        assert.equal(1, event.returnValues.batchId);
        assert.equal(accounts[3], event.returnValues.pharmacy);
        assert.equal(accounts[4], event.returnValues.consumer);

        const batch = await supplyChain.methods.batches(1).call();
        assert.equal("Sold", batch.status);
    });
});