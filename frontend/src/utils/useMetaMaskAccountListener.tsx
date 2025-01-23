import { useEffect } from "react";

// Listener pour refresh la page en cas de changement de compte MetaMask
const useMetaMaskAccountListener = () => {
    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length > 0) {
                    console.log("Compte changé :", accounts[0]);
                    window.location.reload(); // Recharge la page
                } else {
                    console.log("Aucun compte MetaMask connecté");
                }
            };

            window.ethereum.on("accountsChanged", handleAccountsChanged);

            // Nettoyage pour éviter d'attacher plusieurs fois l'écouteur
            return () => {
                window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
            };
        } else {
            console.error("MetaMask n'est pas installé !");
        }
    }, []);
};

export default useMetaMaskAccountListener;