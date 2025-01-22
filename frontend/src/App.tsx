import {connectToBlockchain, createVehicle} from "./utils/createVehicle.ts";
import {getVehicle} from "./utils/getVehicle.ts";
import {sellProposal} from "./utils/sellProposal.ts";
import {getUserInfo} from "./utils/getUserInfo.ts";
import {useEffect, useState} from "react";
import {ethers} from "ethers";

const vehicleContractAdress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"; // Remplace par l'adresse de ton contrat déployé

const App: React.FC = () => {
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [userBalance, setUserBalance] = useState<string | null>(null);

    const handleCreateVehicle = () => {
        createVehicle(vehicleContractAdress);
    };

    const handleGetVehicle = () => {
        const plaqueImatriculation = "VIN12";
        getVehicle(plaqueImatriculation, vehicleContractAdress);
    };

    const handleSellProposal = () => {
        const plaqueImatriculation = "VIN12";
        sellProposal(vehicleContractAdress, plaqueImatriculation, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", ethers.parseEther("1"))
    }

    const handleCancelSell = () => {
        // Annulation
    }

    const handleSellAcceptation = () => {
        // Acceptation
    }

    const handleMaintenanceDemand = () => {
        // Demande
    }

    const handleMaintenanceCancel = () => {
        // Annulation
    }

    const handleMaintenanceFinalisation = () => {
        // Finalisation
    }

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userInfo = await getUserInfo();
            if (userInfo) {
                setUserAddress(userInfo.address);
                setUserBalance(userInfo.balanceInEther);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <div style={styles.main}>
            <header style={{padding: "5px", backgroundColor: "#3a3a3a", textAlign: "center"}}>
                <h3>Utilisateur actuel</h3>
                <p><strong>Adresse :</strong> {userAddress}</p>
                <p><strong>Solde :</strong> {userBalance} ETH</p>
            </header>

            <div style={styles.container}>
                <button style={styles.button} onClick={handleCreateVehicle}>Création d'un véhicule</button>
                <button style={styles.button} onClick={handleGetVehicle}>Récupération d'un véhicule</button>
            </div>

            <div style={styles.container}>
                <button style={styles.button} onClick={handleSellProposal}>Proposition de vente d'un véhicule</button>
                <button style={styles.button} onClick={handleSellAcceptation}>Acceptation d'une vente</button>
                <button style={styles.button} onClick={handleCancelSell}>Annulation d'une vente</button>
            </div>

            <div style={styles.container}>
                <button style={styles.button} onClick={handleMaintenanceDemand}>Demande de maintenance</button>
                <button style={styles.button} onClick={handleMaintenanceFinalisation}>Finalisation de la maintenance</button>
                <button style={styles.button} onClick={handleMaintenanceCancel}>Annulation d'une maintenance</button>
            </div>
        </div>
    );
};

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        padding: '10px',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
    },
};

export default App;