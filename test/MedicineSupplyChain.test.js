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
            from: accounts[0],
            gas: '1000000'
        });
});

describe('Supply Chain', () => {
    it('deploys a supply chain', () => {
        assert.ok(supplyChain.options.address);
    });

    it('register participants', async () => {
        await supplyChain.methods.registerParticipant(accounts[1], 'Manufacturer', 0).send({
            from: accounts[1],
            gas: '1000000'
        });
        var participant = await supplyChain.methods.participants(accounts[1]).call();
        assert.equal('Manufacturer', participant.name);
        assert.equal(0, participant.role);

        await supplyChain.methods.registerParticipant(accounts[2], 'Distributor', 1).send({
            from: accounts[2],
            gas: '1000000'
        });
        participant = await supplyChain.methods.participants(accounts[2]).call();
        assert.equal('Distributor', participant.name);
        assert.equal(1, participant.role);

        await supplyChain.methods.registerParticipant(accounts[3], 'Warehouse', 2).send({
            from: accounts[3],
            gas: '1000000'
        });
        participant = await supplyChain.methods.participants(accounts[3]).call();
        assert.equal('Warehouse', participant.name);
        assert.equal(2, participant.role);

        await supplyChain.methods.registerParticipant(accounts[4], 'Pharmacy', 3).send({
            from: accounts[4],
            gas: '1000000'
        });
        participant = await supplyChain.methods.participants(accounts[4]).call();
        assert.equal('Pharmacy', participant.name, 'Name');
        assert.equal(3, participant.role, 'Role');
    });

    it('manufacture a batch', async() => {
        await supplyChain.methods.registerParticipant(accounts[1], 'XYZ Lab', 0).send({
            from: accounts[1],
            gas: '1000000'
        });
        const receipt = await supplyChain.methods.manufactureBatch('Paracetamol', 30).send({
            from: accounts[1],
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
        await supplyChain.methods.registerParticipant(accounts[1], 'XYZ Lab', 0).send({
            from: accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[2], 'ABC Logistics', 1).send({
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
        assert.equal(accounts[1], event.returnValues.sender);
        assert.equal(accounts[2], event.returnValues.receiver);

        const batch = await supplyChain.methods.batches(1).call();
        assert.equal(accounts[2], batch.currentOwner);
    });

    it('register shipment', async () => {
        await supplyChain.methods.registerParticipant(accounts[1], 'XYZ Lab', 0).send({
            from: accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[2], 'ABC Logistics', 1).send({
            from: accounts[2],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[3], 'Warehouse', 2).send({
            from: accounts[3],
            gas: '1000000'
        });
        await supplyChain.methods.manufactureBatch('Paracetamol', 4, 30).send({
            from:accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.transferBatch(1, accounts[2]).send({
            from: accounts[1],
            gas: '1000000'
        });
        const receipt = await supplyChain.methods.registerShipment(1, accounts[3]).send({
            from: accounts[2],
            gas: '1000000'
        });

        const event = receipt.events.BatchShipped;
        assert(event);
        assert.equal(1, event.returnValues.shipmentId);
        assert.equal(1, event.returnValues.batchId);

        const shipment = await supplyChain.methods.shipments(1).call();
        assert.equal(1, shipment.shipmentId);
        assert.equal(1, shipment.batchId);
        assert.equal(accounts[2], shipment.sender);
        assert.equal(accounts[3], shipment.receiver);

        const batch = await supplyChain.methods.batches(1).call();
        assert.equal('Shipped', batch.status);
    });

    it('storing the batch', async () => {
        await supplyChain.methods.registerParticipant(accounts[1], 'XYZ Lab', 0).send({
            from: accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[2], 'ABC Logistics', 1).send({
            from: accounts[2],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[3], 'Warehouse1', 2).send({
            from: accounts[3],
            gas: '1000000'
        });
        await supplyChain.methods.manufactureBatch('Paracetamol', 4, 30).send({
            from:accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.transferBatch(1, accounts[2]).send({
            from: accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.registerShipment(1, accounts[3]).send({
            from: accounts[2],
            gas: '1000000'
        });
        const receipt = await supplyChain.methods.storeShipment(1, 1).send({
            from: accounts[3],
            gas: '1000000'
        });

        const event = receipt.events.BatchStored;
        assert(event);
        assert.equal(1, event.returnValues.shipmentId);
        assert.equal(1, event.returnValues.batchId);

        const batch = await supplyChain.methods.batches(1).call();
        assert.equal('In Storage', batch.status);
        assert.equal(accounts[3], batch.currentOwner);
    });

    it('dispatch the batch', async () => {
        await supplyChain.methods.registerParticipant(accounts[1], 'XYZ Lab', 0).send({
            from: accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[2], 'ABC Logistics', 1).send({
            from: accounts[2],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[3], 'Warehouse1', 2).send({
            from: accounts[3],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[4], 'PQR Pharmacy', 3).send({
            from: accounts[4],
            gas: '1000000'
        });
        await supplyChain.methods.manufactureBatch('Paracetamol', 4, 30).send({
            from:accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.transferBatch(1, accounts[2]).send({
            from: accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.registerShipment(1, accounts[3]).send({
            from: accounts[2],
            gas: '1000000'
        });
        await supplyChain.methods.storeShipment(1, 1).send({
            from: accounts[3],
            gas: '1000000'
        });
        await supplyChain.methods.transferBatch(1, accounts[2]).send({
            from: accounts[3],
            gas: '1000000'
        });
        const receipt = await supplyChain.methods.registerShipment(1, accounts[4]).send({
            from: accounts[2],
            gas: '1000000'
        });

        const event = receipt.events.BatchShipped;
        assert(event);
        assert.equal(2, event.returnValues.shipmentId);
        assert.equal(1, event.returnValues.batchId);
        
        const shipment = await supplyChain.methods.shipments(2).call();
        assert.equal(2, shipment.shipmentId);
        assert.equal(1, shipment.batchId);
        assert.equal(accounts[2], shipment.sender);
        assert.equal(accounts[4], shipment.receiver);

        const batch = await supplyChain.methods.batches(1).call();
        assert.equal('Dispatched', batch.status);
    });

    it('deliver the batch', async () => {
        await supplyChain.methods.registerParticipant(accounts[1], 'XYZ Lab', 0).send({
            from: accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[2], 'ABC Logistics', 1).send({
            from: accounts[2],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[3], 'Warehouse1', 2).send({
            from: accounts[3],
            gas: '1000000'
        });
        await supplyChain.methods.registerParticipant(accounts[4], 'PQR Pharmacy', 3).send({
            from: accounts[4],
            gas: '1000000'
        });
        await supplyChain.methods.manufactureBatch('Paracetamol', 4, 30).send({
            from:accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.transferBatch(1, accounts[2]).send({
            from: accounts[1],
            gas: '1000000'
        });
        await supplyChain.methods.registerShipment(1, accounts[3]).send({
            from: accounts[2],
            gas: '1000000'
        });
        await supplyChain.methods.storeShipment(1, 1).send({
            from: accounts[3],
            gas: '1000000'
        });
        await supplyChain.methods.transferBatch(1, accounts[2]).send({
            from: accounts[3],
            gas: '1000000'
        });
        await supplyChain.methods.registerShipment(1, accounts[4]).send({
            from: accounts[2],
            gas: '1000000'
        });
        const receipt = await supplyChain.methods.deliverShipment(2, 1).send({
            from: accounts[4],
            gas: '1000000'
        });

        const event = receipt.events.BatchDelivered;
        assert(event);
        assert.equal(2, event.returnValues.shipmentId);
        assert.equal(1, event.returnValues.batchId);
        
        const batch = await supplyChain.methods.batches(1).call();
        assert.equal('Delivered', batch.status);
        assert.equal(accounts[4], batch.currentOwner);
    });
});