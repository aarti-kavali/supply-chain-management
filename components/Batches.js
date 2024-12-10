import { useEffect, useState } from "react";
import supplychain from "../ethereum/supplychain.js";

const Batches = () => {
    const [batches, setBatches] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const batchCount = await supplychain.methods.getBatchCount().call();
                const batchData = [];

                let batch, address, manufacturer;

                for (let i = 1; i <= batchCount; i++) {
                    batch = await supplychain.methods.batches(i).call();
                    address = batch.manufacturer
                    manufacturer = await supplychain.methods.participants(address).call();
                    batchData.push({
                        batchId: batch.batchId,
                        batchName: batch.name,
                        manufacturer: manufacturer.name,
                        status: batch.status
                    });
                }
                setBatches(batchData);
                console.log(batchData);
                setLoading(false);
            } catch(error) {
                console.log("Error fetching batch data: ", error);
                setLoading(false);
            }
        }

        fetchBatches();
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <table className="ui celled table">
            <thead>
                <tr>
                    <th>Batch ID</th>
                    <th>Batch Name</th>
                    <th>Manufacturer</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {batches.map((batch) => (
                    <tr>
                    <td data-label="Batch ID">{batch.batchId}</td>
                    <td data-label="Batch Name">{batch.batchName}</td>
                    <td data-label="Manufacturer">{batch.manufacturer}</td>
                    <td data-label="status">{batch.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Batches;