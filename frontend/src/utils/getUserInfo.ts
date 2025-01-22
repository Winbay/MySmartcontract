import { ethers } from "ethers";

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

            return {
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
