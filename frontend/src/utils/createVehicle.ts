import { ethers } from "ethers";
import vehicleContractJSON from "../artifacts/contracts/VehicleContract.sol/VehicleContract.json";

export const createVehicle = async (
    vehicleContractAdress: string,
    vehicleVIN: string,
    ownerAddress: string | null,
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

            const etherForCreate = ethers.parseEther(priceInEther);
            const gasEstimate = await vehicleContract.createVehicle.estimateGas(
                vehicleVIN,
                ownerAddress,
                etherForCreate,
                { value: etherForCreate, blockTag: "latest" }
            );

            await vehicleContract.createVehicle(vehicleVIN, ownerAddress, etherForCreate, {
                value: etherForCreate,
                gasLimit: gasEstimate * 2n,
                blockTag: "latest",
            });

            console.log("Véhicule probablement créé !");
        } catch (error) {
            console.error(`Erreur lors de la création du véhicule ${vehicleVIN} :`, error);
        }
    } else {
        console.error("MetaMask n'est pas installé !");
    }
};
