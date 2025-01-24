import {ethers} from "ethers";
import vehicleContractJSON from "../artifacts/contracts/VehicleContract.sol/VehicleContract.json";

export const sellAcceptation = async (
    vehicleContractAdress: string,
    vehicleVIN: string,
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

            // TODO : Annulation de la proposition de vente si pas assez de ethers sur un des comptes
            // const sellerBalanceBefore = await ethers.provider.getBalance(addr1.address);
            // const buyerBalanceBefore = await ethers.provider.getBalance(addr2.address);

            // Validation de la proposition de vente
            await vehicleContract.connect(signer).acceptSale(vehicleVIN, { value: ethers.parseEther(priceInEther) });

            console.log(`Proposition de vente du véhicule avec le VIN "${vehicleVIN}" acceptée avec succès !`);

        } catch (error) {
            console.error("Erreur lors de la proposition de vente :", error);
        }
    } else {
        console.error("MetaMask n'est pas installé !");
    }
};
