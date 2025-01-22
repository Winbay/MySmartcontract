import {connectToBlockchain} from "./utils/connectToBlockchain.ts";
import {getVehicle} from "./utils/getVehicle.ts";

// Import ABI
// import vehicleContractJSON from "./artifacts/contracts/VehicleContract.sol/VehicleContract.json";

const vehicleContractAdress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Remplace par l'adresse de ton contrat déployé

const App: React.FC = () => {
  const handleCreateVehicle = () => {
    connectToBlockchain(vehicleContractAdress);
  };

  const handleGetVehicle = () => {
    const plaqueImatriculation = "VIN12"; // Plaque d'immatriculation à récupérer
    getVehicle(plaqueImatriculation, vehicleContractAdress);
  };

  return (
      <div>
        <h1>Bienvenue sur l'application Vehicle</h1>
        <button onClick={handleCreateVehicle}>Créer vehicle.</button>
        <button onClick={handleGetVehicle}>Récupérer vehicle.</button>
      </div>
  );
};

export default App;