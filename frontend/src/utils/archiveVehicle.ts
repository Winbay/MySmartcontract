import {ethers} from "ethers";
import vehicleContractJSON from "../artifacts/contracts/VehicleContract.sol/VehicleContract.json";

export const archiveVehicle = async (
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

            // Archiver le véhicule
            await vehicleContract.connect(signer).archiveVehicle(vehicleVIN);
            console.log(`Le véhicule ${vehicleVIN} a été archivé avec succès !`);

        } catch (error) {
            console.error("Erreur lors de l'archivage du véhicule :", error);
        }
    } else {
        console.error("MetaMask n'est pas installé !");
    }
};