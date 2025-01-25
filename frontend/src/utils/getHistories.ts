import {ethers} from "ethers";
import vehicleContractJSON from "../artifacts/contracts/VehicleContract.sol/VehicleContract.json";

export const getHistories = async (
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

            // Avoir l'historique
            const histories = await vehicleContract.connect(signer).getHistories(vehicleVIN);
            console.log(
                `Historique du véhicule ${vehicleVIN}:\n` +
                histories.map((history: any) => `- ${history.description} -> ${history.garagist}`).join("\n")
            );
        } catch (error) {
            console.error(`Erreur lors de l'obtention de l'historique du véhicule ${vehicleVIN} :`, error);
        }
    } else {
        console.error("MetaMask n'est pas installé !");
    }
};