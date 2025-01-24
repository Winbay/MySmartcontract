import {createVehicle} from "./utils/createVehicle.ts";
import {getVehicle} from "./utils/getVehicle.ts";
import {sellProposal} from "./utils/sellProposal.ts";
import {getUserInfo} from "./utils/getUserInfo.ts";
import {useEffect, useState} from "react";
import {AccountRoles} from "./types/AccountRoles.ts";
import {cancelSell} from "./utils/cancelSell.ts";
import useMetaMaskAccountListener from "./utils/useMetaMaskAccountListener.tsx";
import {sellAcceptation} from "./utils/sellAcceptation.ts";

const vehicleContractAdress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Remplace par l'adresse de ton contrat déployé

const App: React.FC = () => {
    useMetaMaskAccountListener();

    const [userName, setUserName] = useState<string | null>(null);
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [userBalance, setUserBalance] = useState<string | null>(null);

    const [target, setTarget] = useState<string>("");
    const [plaqueImatriculation, setPlaqueImatriculation] = useState<string>(() => {
        return localStorage.getItem("plaqueImatriculation") || "";
    });

    const [priceInEther, setPriceInEther] = useState<string>(() => {
        return localStorage.getItem("priceInEther") || "0";
    });

    useEffect(() => {
        localStorage.setItem("plaqueImatriculation", plaqueImatriculation);
    }, [plaqueImatriculation]);

    useEffect(() => {
        localStorage.setItem("priceInEther", priceInEther.toString());
    }, [priceInEther]);

    const handleInputPlaqueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaqueImatriculation(event.target.value);
    };

    const handleInputPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPriceInEther(event.target.value);
    };

    const handleCreateVehicle = () => {
        createVehicle(vehicleContractAdress);
    };

    const handleGetVehicle = () => {
        getVehicle(plaqueImatriculation, vehicleContractAdress);
    };

    const handleSellProposal = () => {
        sellProposal(vehicleContractAdress, plaqueImatriculation, target, priceInEther)
    }

    const handleCancelSell = () => {
        cancelSell(vehicleContractAdress, plaqueImatriculation)
    }

    const handleSellAcceptation = () => {
        sellAcceptation(vehicleContractAdress, plaqueImatriculation, priceInEther)
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

    const handleInputTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTarget(event.target.value);
    }

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
                <p><span>Utilisateur actuel :</span> {userName}</p>
                <p><span>Adresse :</span> {userAddress}</p>
                <p><span>Solde :</span> {userBalance} ETH</p>
            </header>

            <div style={styles.container}>
                <div style={styles.verticalContainer}>
                    <label htmlFor="plaque-input">
                        Plaque d'immatriculation
                    </label>
                    <input
                        id="plaque-input"
                        type="text"
                        value={plaqueImatriculation}
                        onChange={handleInputPlaqueChange}
                        placeholder="Entrer un n° de plaque"
                        style={styles.inputBox}
                    />
                </div>

                <div style={styles.verticalContainer}>
                    <label htmlFor="price-input">
                        Prix en ethers
                    </label>
                    <input
                        id="price-input"
                        type="text"
                        value={priceInEther}
                        onChange={handleInputPriceChange}
                        placeholder="Entrer un prix en ethers"
                        style={styles.inputBox}
                    />
                </div>
            </div>

            <div style={styles.container}>
                {userAddress === AccountRoles.CONSTRUCTEUR && (
                    <button onClick={handleCreateVehicle}>🚗 Création d'un véhicule <span>"{plaqueImatriculation}"</span>
                    </button>
                )}
                <button onClick={handleGetVehicle}>Récupération des infos du
                    véhicule <span>"{plaqueImatriculation}"</span></button>
            </div>

            <hr/>

            <div style={styles.container}>
                <button
                    style={{
                        opacity: target ? 1 : 0.5,
                        cursor: target ? "pointer" : "not-allowed"
                    }}
                    onClick={handleSellProposal}
                    disabled={!target}
                >
                    💰 Proposition de vente d'un véhicule
                </button>

                <div style={styles.verticalContainer}>
                    <label htmlFor="target-input">
                        Cible
                    </label>
                    <select
                        id="role-selector"
                        value={target}
                        onChange={handleTargetChange}
                        style={{padding: "5px", display: "flex"}}
                    >
                        <option value="">-- Choisir la cible --</option>
                        {Object.entries(AccountRoles).map(([role, address]) => (
                            <option key={address} value={address}>{role}</option>
                        ))}
                    </select>
                    <input
                        id="target-input"
                        type="text"
                        value={target}
                        onChange={handleInputTargetChange}
                        placeholder="Ou entrer une adresse cible"
                        style={styles.inputBox}
                    />
                </div>
            </div>

            <div style={styles.container}>
                <button onClick={handleSellAcceptation}>✅ Acceptation d'une vente</button>
                <button onClick={handleCancelSell}>❌ Annulation d'une vente</button>
            </div>

            <hr/>

            <div style={styles.container}>
                <button onClick={handleMaintenanceDemand}>🛠️ Demande de maintenance</button>
            </div>

            <div style={styles.container}>
            <button onClick={handleMaintenanceFinalisation}>✅ Finalisation de la maintenance</button>
                <button onClick={handleMaintenanceCancel}>❌ Annulation d'une maintenance</button>
            </div>
        </div>
    );
};

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
        padding: '10px',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    verticalContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    horizontalContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
    },
    inputBox: {
        padding: "8px",
        fontSize: "16px",
        width: "100%",
        maxWidth: "200px",
        border: "1px solid #ccc",
        borderRadius: "4px",
    }
};

export default App;