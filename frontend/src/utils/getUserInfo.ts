import { ethers } from "ethers";
import {AccountRoles} from "../types/AccountRoles.ts";

export const getUserInfo = async () => {
    if (typeof window.ethereum !== "undefined") {
        try {
            // Créer un fournisseur Ethereum
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // Récupérer l'adresse de l'utilisateur
            const address = await signer.getAddress();

            // Récupérer le solde de l'utilisateur en Ether
            const balance = await provider.getBalance(address);
            const balanceInEther = ethers.formatEther(balance);

            // récupérer le nom de l'utilisateur
            let name = "Name not found"
            if (address === AccountRoles.CONSTRUCTEUR) {
                name = "Constructeur";
            } else if (address === AccountRoles.PROPRIETAIRE1) {
                name = "Propriétaire 1";
            } else if (address === AccountRoles.PROPRIETAIRE2) {
                name = "Propriétaire 2";
            } else if (address === AccountRoles.GARAGISTE) {
                name = "Garagiste";
            } else if (address === AccountRoles.CASSE_AUTO) {
                name = "Casse Auto";
            }

            return {
                name,
                address,
                balanceInEther,
            };
        } catch (error) {
            console.error("Erreur lors de la récupération des informations de l'utilisateur :", error);
            return null;
        }
    } else {
        console.error("MetaMask n'est pas installé !");
        return null;
    }
};
