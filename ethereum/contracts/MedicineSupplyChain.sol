pragma solidity 0.4.17;

contract MedicineSupplyChain {
    enum Role { Manufacturer, Distributor, Warehouse, Pharmacy }

    struct Participant {
        string name;
        Role role;
    }

    struct MedicineBatch {
        string name; // Name of Medicine
        uint batchId;
        address manufacturer;
        uint manufactureDate;
        uint expiryDate;
        address currentOwner;
        string status; // "Manufactured", "Shipped", "In Storage", "Dispatched", "Delivered"
    }

    struct Shipment {
        uint shipmentId;
        uint batchId;
        uint timestamp;
        address sender;
        address receiver;
    }

    uint batch_count;
    uint shipment_count;
    address admin;
    mapping(uint => Shipment) public shipments;
    mapping(uint => MedicineBatch) public batches;
    mapping(address => Participant) public participants;

    event BatchManufactured(uint indexed batchId, address indexed manufacturer, uint manufactureDate);
    event BatchShipped(uint shipmentId, uint batchId);
    event BatchTransferred(uint indexed batchId, address indexed sender, address indexed receiver, uint date);
    event BatchStored(uint shipmentId, uint indexed batchId, uint date);
    event BatchDelivered(uint shipmentId, uint indexed batchId, uint date);

    
    function MedicineSupplyChain() public{
        batch_count = 0;
        shipment_count = 0;
        admin = msg.sender;
    }

    modifier access(Role role) {
        require(participants[msg.sender].role == role);
        _;
    }

    // modifier notExpired(uint batchId) {
    //     require(batches[batchId].expiryDate > now);
    //     _;
    // }

    function registerParticipant(address participant, string name, Role role) public {
        participants[participant] = Participant(name, role);
    }

    function manufactureBatch(string name, uint expiryDate) public access(Role.Manufacturer) {
        batch_count++;
        
        batches[batch_count] = MedicineBatch({
            name: name,
            batchId: batch_count,
            manufacturer: msg.sender,
            manufactureDate: now,
            expiryDate: expiryDate,
            currentOwner: msg.sender,
            status: 'Manufactured'
        });
        
        BatchManufactured(batch_count, msg.sender, now);
    }

    function transferBatch(uint256 batchId, address receiver) public {
        MedicineBatch storage batch = batches[batchId];

        require(batch.currentOwner == msg.sender);
        batch.currentOwner = receiver;
        
        BatchTransferred(batchId, msg.sender, receiver, now);
    }

    function registerShipment(uint batchId, address receiver) public access(Role.Distributor) {
        shipment_count++;
        
        shipments[shipment_count] = Shipment({
            shipmentId: shipment_count,
            batchId: batchId,
            timestamp: block.timestamp,
            sender: msg.sender,
            receiver: receiver
        });

        if (participants[receiver].role == Role.Pharmacy) {
            batches[batchId].status = 'Dispatched';
        } 
        else {
            batches[batchId].status = 'Shipped';
        }

        BatchShipped(shipment_count, batchId);
    }

    function storeShipment(uint shipmentId, uint batchId) public access(Role.Warehouse) {
        batches[batchId].status = 'In Storage';
        batches[batchId].currentOwner = msg.sender;

        BatchStored(shipmentId, batchId, now);
    }

    function deliverShipment(uint shipmentId, uint batchId) public access(Role.Pharmacy) {
        batches[batchId].status = 'Delivered';
        batches[batchId].currentOwner = msg.sender;

        BatchDelivered(shipmentId, batchId, now);
    }

    function destroy() public {
        require(msg.sender == admin);
        selfdestruct(msg.sender);
    }
}