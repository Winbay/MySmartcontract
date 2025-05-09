import { ethers } from "ethers";
import vehicleContractJSON from "../artifacts/contracts/VehicleContract.sol/VehicleContract.json";

export const maintenanceFinalisation = async (
    vehicleContractAdress: string,
    vehicleVIN: string,
) => {
    if (typeof window.ethereum !== "undefined") {
        try {
            console.log("Connexion à MetaMask en cours...");
            // Demande à l'utilisateur de se connecter à MetaMask
            await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("Connecté à MetaMask !");

            // Création d'un fournisseur Ethereum
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            console.log("Connecté à MetaMask :", signer);

            // Connexion au contrat Vehicle
            const vehicleContract = new ethers.Contract(
                vehicleContractAdress,
                vehicleContractJSON.abi,
                signer
            );
            console.log("Contrat Vehicle chargé :", vehicleContract);

            // Annuler la demande de maintenance
            await vehicleContract.connect(signer).completeMaintenance(vehicleVIN, `Maintenance du véhicule '${vehicleVIN}'`);

            console.log(`Maintenance du véhicule avec le VIN "${vehicleVIN}" finalisée avec succès !`);
        } catch (error) {
            console.error(`Erreur lors de la finalisation de la maintenance du véhicule ${vehicleVIN} :`, error);
        }
    } else {
        console.error("MetaMask n'est pas installé !");
    }
};
