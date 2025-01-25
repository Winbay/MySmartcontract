import { ethers } from "ethers";
import vehicleContractJSON from "../artifacts/contracts/VehicleContract.sol/VehicleContract.json";

export const maintenanceDemand = async (
    vehicleContractAdress: string,
    vehicleVIN: string,
    targetAddress: string,
    priceInEther: string,
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

            // Lancer une demande de maintenance
            await vehicleContract.connect(signer).askForMaintenance(vehicleVIN, targetAddress, ethers.parseEther(priceInEther), { value: ethers.parseEther(priceInEther) });
            console.log(`Demande de maintenance du véhicule avec le VIN "${vehicleVIN}" à l'adresse ${targetAddress} lancée avec succès !`);

        } catch (error) {
            console.error("Erreur lors de la demande de maintenance :", error);
        }
    } else {
        console.error("MetaMask n'est pas installé !");
    }
};
