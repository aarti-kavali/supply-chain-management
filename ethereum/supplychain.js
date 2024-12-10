import web3 from "./web3.js";
import MedicineSupplyChain from './build/MedicineSupplyChain.json';

const instance = new web3.eth.Contract(
    JSON.parse(MedicineSupplyChain.interface),
    '0x379822572274A7A08A38789753ac9e858e50BCdE'
);

export default instance;