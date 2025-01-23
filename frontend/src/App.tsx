import {createVehicle} from "./utils/createVehicle.ts";
import {getVehicle} from "./utils/getVehicle.ts";
import {sellProposal} from "./utils/sellProposal.ts";
import {getUserInfo} from "./utils/getUserInfo.ts";
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {AccountRoles} from "./types/AccountRoles.ts";
import {cancelSell} from "./utils/cancelSell.ts";
import useMetaMaskAccountListener from "./utils/useMetaMaskAccountListener.tsx";

const vehicleContractAdress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Remplace par l'adresse de ton contrat déployé

const App: React.FC = () => {
    useMetaMaskAccountListener();
    
    const [userName, setUserName] = useState<string | null>(null);
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [userBalance, setUserBalance] = useState<string | null>(null);

    const [target, setTarget] = useState<string>("");

    const plaqueImatriculation = "VIN12";

    const handleCreateVehicle = () => {
        createVehicle(vehicleContractAdress);
    };

    const handleGetVehicle = () => {
        getVehicle(plaqueImatriculation, vehicleContractAdress);
    };

    const handleSellProposal = () => {
        sellProposal(vehicleContractAdress, plaqueImatriculation, target, ethers.parseEther("1"))
    }

    const handleCancelSell = () => {
        cancelSell(vehicleContractAdress, plaqueImatriculation)
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

    const handleTargetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTarget(event.target.value);
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userInfo = await getUserInfo();
            if (userInfo) {
                setUserName(userInfo.name);
                setUserAddress(userInfo.address);
                setUserBalance(userInfo.balanceInEther);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <div style={styles.main}>
            <header style={{padding: "5px", backgroundColor: "#3a3a3a", textAlign: "center"}}>
                <p><strong>Utilisateur actuel :</strong> {userName}</p>
                <p><strong>Adresse :</strong> {userAddress}</p>
                <p><strong>Solde :</strong> {userBalance} ETH</p>
            </header>

            <div style={styles.container}>
                {userAddress === AccountRoles.CONSTRUCTEUR && (
                    <button style={styles.button} onClick={handleCreateVehicle}>🚗 Création d'un véhicule</button>
                )}
                <button style={styles.button} onClick={handleGetVehicle}>Récupération des infos du véhicule</button>
            </div>

            <hr/>

            <div style={styles.container}>
                <button
                    style={{
                        ...styles.button,
                        opacity: target ? 1 : 0.5,
                        cursor: target ? "pointer" : "not-allowed"
                    }}
                    onClick={handleSellProposal}
                    disabled={!target}
                >
                    💰 Proposition de vente d'un véhicule
                </button>
                <select
                    id="role-selector"
                    value={target}
                    onChange={handleTargetChange}
                    style={{padding: "5px", display: "flex"}}
                >
                    <option value="">-- Choisissez la cible --</option>
                    {Object.entries(AccountRoles).map(([role, address]) => (
                        <option key={address} value={address}>{role}</option>
                    ))}
                </select>
            </div>

            <div style={styles.container}>
                <button style={styles.button} onClick={handleSellAcceptation}>✅ Acceptation d'une vente</button>
                <button style={styles.button} onClick={handleCancelSell}>❌ Annulation d'une vente</button>
            </div>

            <hr/>

            <div style={styles.container}>
                <button style={styles.button} onClick={handleMaintenanceDemand}>🛠️ Demande de maintenance</button>
            </div>

            <div style={styles.container}>
                <button style={styles.button} onClick={handleMaintenanceFinalisation}>✅ Finalisation de la maintenance</button>
                <button style={styles.button} onClick={handleMaintenanceCancel}>❌ Annulation d'une maintenance</button>
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