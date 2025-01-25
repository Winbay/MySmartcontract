import { ethers } from "ethers";
import vehicleContractJSON from "../artifacts/contracts/VehicleContract.sol/VehicleContract.json";

export const getVehicle = async (plaqueImatriculation: string, vehicleContractAdress: string) => {
    if (typeof window.ethereum !== "undefined") {
        try {
            console.log("Connexion à MetaMask en cours...");
            // Demande à l'utilisateur de se connecter à MetaMask
            await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("Connecté à MetaMask !");

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

            const vehicle = await vehicleContract.getVehicle(plaqueImatriculation, {
                blockTag: "latest",
            });

            console.log("Véhicule récupéré :", vehicle);
            return vehicle;
        } catch (error) {
            console.error(`Erreur lors de l'obtention des infos du véhicule ${plaqueImatriculation} :`, error);
        }
    } else {
        console.error("MetaMask n'est pas installé !");
    }
};
