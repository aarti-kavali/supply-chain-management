pragma solidity 0.4.17;

contract MedicineSupplyChain {
    enum Role { Manufacturer, Distributor, Pharmacy, Consumer }

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
        string status; // "Manufactured", "In Transit", "In Stock", "Sold"
    }

    uint count;
    mapping(uint => MedicineBatch) public batches;
    mapping(address => Participant) public participants;

    event BatchManufactured(uint indexed batchId, address indexed manufacturer, uint manufactureDate);
    event BatchTransferred(uint indexed batchId, address indexed from, address indexed to, uint date);
    event BatchSold(uint indexed batchId, address indexed pharmacy, address indexed consumer, uint date);

    modifier access(Role role) {
        require(participants[msg.sender].role == role);
        _;
    }

    function MedicineSupplyChain() public{
        count = 0;
    }

    function registerParticipant(address participant, string name, Role role) public {
        participants[participant] = Participant(name, role);
    }

    function manufactureBatch(string name, uint256 expiryDate) public access(Role.Manufacturer) {
        count++;
        
        batches[count] = MedicineBatch({
            name: name,
            batchId:count,
            manufacturer: msg.sender,
            manufactureDate: now,
            expiryDate: expiryDate,
            currentOwner: msg.sender,
            status: "Manufactured"
        });
        
        BatchManufactured(count, msg.sender, now);
    }

    function transferBatch(uint256 batchId, address to) public {
        MedicineBatch storage batch = batches[batchId];
        
        require(batch.batchId != 0);
        require(batch.currentOwner == msg.sender);
        
        batch.currentOwner = to;
        batch.status = "In Transit";
        
        BatchTransferred(batchId, msg.sender, to, now);
    }

    function markInStock(uint256 batchId) public access(Role.Pharmacy) {
        MedicineBatch storage batch = batches[batchId];
        require(batch.currentOwner == msg.sender);
        
        batch.status = "In Stock";
    }

    function sellBatch(uint256 batchId, address consumer) public access(Role.Pharmacy) {
        MedicineBatch storage batch = batches[batchId];
        require(batch.currentOwner == msg.sender);
        
        batch.currentOwner = consumer;
        batch.status = "Sold";
        
        BatchSold(batchId, msg.sender, consumer, now);
    }

    function verifyBatch(uint256 batchId) public view returns (string, string, address, uint256) {
        MedicineBatch storage batch = batches[batchId];
        require(batch.batchId != 0);
        
        return (batch.name, batch.status, batch.currentOwner, batch.expiryDate);
    }
}