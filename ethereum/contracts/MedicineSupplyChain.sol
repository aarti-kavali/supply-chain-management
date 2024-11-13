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
        uint temperature;
        address manufacturer;
        uint manufactureDate;
        uint expiryDate;
        address currentOwner;
        string status; // "Manufactured", "Shipped", "In Storage", "Dispatched", "Delivered"
        bytes32 [] tracking;
    }

    struct Shipment {
        uint batchId;
        uint temperature;
        uint timestamp;
        address sender;
        address receiver;
    }

    uint count;
    address admin;
    mapping(bytes32 => Shipment) public shipments;
    mapping(uint => MedicineBatch) public batches;
    mapping(address => Participant) public participants;

    event BatchManufactured(uint indexed batchId, address indexed manufacturer, uint manufactureDate);
    event BatchShipped(bytes32 shipmentHash, uint batchId, uint temperature);
    event BatchTransferred(uint indexed batchId, address indexed sender, address indexed receiver, uint date);
    event BatchStored(bytes32 shipmentHash, uint indexed batchId, uint date);
    event BatchDelivered(bytes32 shipmentHash, uint indexed batchId, uint date);

    
    function MedicineSupplyChain() public{
        count = 0;
        admin = msg.sender;
    }

    modifier access(Role role) {
        require(participants[msg.sender].role == role);
        _;
    }

    modifier notExpired(uint batchId) {
        require(batches[batchId].expiryDate > now);
        _;
    }

    function registerParticipant(address participant, string name, Role role) public {
        participants[participant] = Participant(name, role);
    }

    function manufactureBatch(string name, uint temperature, uint expiryDate) public access(Role.Manufacturer) {
        count++;
        
        batches[count] = MedicineBatch({
            name: name,
            batchId: count,
            temperature: temperature,
            manufacturer: msg.sender,
            manufactureDate: now,
            expiryDate: expiryDate,
            currentOwner: msg.sender,
            status: "Manufactured",
            tracking: new bytes32[](0)
        });
        
        BatchManufactured(count, msg.sender, now);
    }

    function transferBatch(uint256 batchId, address receiver) public notExpired(batchId) {
        MedicineBatch storage batch = batches[batchId];

        require(batch.currentOwner == msg.sender);
        require(participants[msg.sender].role == Role.Manufacturer || participants[msg.sender].role == Role.Warehouse);
        require(participants[receiver].role == Role.Distributor);
        batch.currentOwner = receiver;
        
        BatchTransferred(batchId, msg.sender, receiver, now);
    }

    function registerShipment(uint batchId, uint temperature, address receiver) public access(Role.Distributor) notExpired(batchId) {
        bytes32 shipmentHash = keccak256(batchId, block.timestamp, uint256(msg.sender));

        require(temperature == batches[batchId].temperature);
        
        shipments[shipmentHash] = Shipment({
            batchId: batchId,
            temperature: temperature,
            timestamp: block.timestamp,
            sender: msg.sender,
            receiver: receiver
        });

        if (participants[receiver].role == Role.Pharmacy) {
            batches[batchId].status = "Dispatched";
        } 
        else {
            batches[batchId].status = "Shipped";
        }
        batches[batchId].tracking.push(shipmentHash);

        BatchShipped(shipmentHash, batchId, temperature);
    }

    function storeShipment(bytes32 shipmentHash, uint batchId) public access(Role.Warehouse) notExpired(batchId) {
        batches[batchId].status = "In Storage";
        batches[batchId].currentOwner = msg.sender;

        BatchStored(shipmentHash, batchId, now);
    }

    function deliverShipment(bytes32 shipmentHash, uint batchId) public access(Role.Pharmacy) notExpired(batchId) {
        batches[batchId].status = "Delivered";
        batches[batchId].currentOwner = msg.sender;

        BatchDelivered(shipmentHash, batchId, now);
    }

    function destroy() public {
        require(msg.sender == admin);
        selfdestruct(msg.sender);
    }
}