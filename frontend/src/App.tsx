import {createVehicle} from "./utils/createVehicle.ts";
import {getVehicle} from "./utils/getVehicle.ts";
import {sellProposal} from "./utils/sellProposal.ts";
import {getUserInfo} from "./utils/getUserInfo.ts";
import {useEffect, useState} from "react";
import {AccountRoles} from "./types/AccountRoles.ts";
import {cancelSell} from "./utils/cancelSell.ts";
import useMetaMaskAccountListener from "./utils/useMetaMaskAccountListener.ts";
import {sellAcceptation} from "./utils/sellAcceptation.ts";

// TODO : Remplacer par l'adresse de ton contrat déployé
const vehicleContractAdress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const App: React.FC = () => {
    useMetaMaskAccountListener();

    const [userName, setUserName] = useState<string | null>(null);
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [userBalance, setUserBalance] = useState<string | null>(null);

    const [proposalTarget, setProposalTarget] = useState<string>("");
    const [maintenanceTarget, setMaintenanceTarget] = useState<string>("");

    const [plaqueImatriculation, setPlaqueImatriculation] = useState<string>(() => {
        return localStorage.getItem("plaqueImatriculation") || "";
    });
    useEffect(() => {
        localStorage.setItem("plaqueImatriculation", plaqueImatriculation);
    }, [plaqueImatriculation]);

    const [priceInEther, setPriceInEther] = useState<string>(() => {
        return localStorage.getItem("priceInEther") || "0";
    });
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
        sellProposal(vehicleContractAdress, plaqueImatriculation, proposalTarget, priceInEther)
    }

    const handleCancelSell = () => {
        cancelSell(vehicleContractAdress, plaqueImatriculation)
    }

    const handleSellAcceptation = () => {
        sellAcceptation(vehicleContractAdress, plaqueImatriculation, priceInEther)
    }

    const handleMaintenanceDemand = () => {
        // TODO maintenanceDemand
    }

    const handleMaintenanceCancel = () => {
        // TODO maintenanceCancel
    }

    const handleMaintenanceFinalisation = () => {
        // TODO maintenanceFinalisation
    }

    const handleProposalTargetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setProposalTarget(event.target.value);
    };

    const handleInputProposalTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProposalTarget(event.target.value);
    }

    const handleMaintenanceTargetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMaintenanceTarget(event.target.value);
    };

    const handleInputMaintenanceTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMaintenanceTarget(event.target.value);
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
            {/* Affichage des informations de l'utilisateur actuel */}
            <header style={{padding: "5px", backgroundColor: "#3a3a3a", textAlign: "center"}}>
                <p><span>Utilisateur actuel :</span> {userName}</p>
                <p><span>Adresse :</span> {userAddress}</p>
                <p><span>Solde :</span> {userBalance} ETH</p>
            </header>

            <div>(ces deux champs ci-dessous s'appliquent partout)</div>

            <div style={styles.container}>
                {/* Input pour la plaque d'immatriculation */}
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

                {/* Input pour le prix en ethers */}
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

            <div style={styles.whiteLine}/>

            <div style={styles.container}>
                {/* Création du véhicule */}
                {userAddress === AccountRoles.CONSTRUCTEUR && (
                    <button onClick={handleCreateVehicle}>🚗 Création d'un véhicule <span>"{plaqueImatriculation}"</span>
                    </button>
                )}

                {/* Récupération des infos du véhicule */}
                <button onClick={handleGetVehicle}>Récupération des infos du
                    véhicule <span>"{plaqueImatriculation}"</span></button>
            </div>

            <div style={styles.whiteLine}/>

            <div style={styles.container}>
                {/* Proposition de vente */}
                <button
                    style={{
                        opacity: proposalTarget ? 1 : 0.5,
                        cursor: proposalTarget ? "pointer" : "not-allowed"
                    }}
                    onClick={handleSellProposal}
                    disabled={!proposalTarget}
                >
                    💰 Proposition de vente d'un véhicule
                </button>

                {/* Sélection de la cible pour la proposition de vente */}
                <div style={styles.verticalContainer}>
                    <label htmlFor="target-input">
                        Cible
                    </label>
                    <select
                        value={proposalTarget}
                        onChange={handleProposalTargetChange}
                        style={{padding: "5px", display: "flex"}}
                    >
                        <option value="">-- Choisir la cible --</option>
                        {Object.entries(AccountRoles).map(([role, address]) => (
                            <option key={address} value={address}>{role}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={proposalTarget}
                        onChange={handleInputProposalTargetChange}
                        placeholder="Ou entrer une adresse cible"
                        style={styles.inputBox}
                    />
                </div>
            </div>

            <div style={styles.container}>
                {/* Acceptation ou annulation de la vente */}
                <button onClick={handleSellAcceptation}>✅ Acceptation d'une vente</button>
                <button onClick={handleCancelSell}>❌ Annulation d'une vente</button>
            </div>

            <div style={styles.whiteLine}/>

            <div style={styles.container}>
                {/* Demande de maintenance */}
                <button
                    style={{
                        opacity: maintenanceTarget ? 1 : 0.5,
                        cursor: maintenanceTarget ? "pointer" : "not-allowed"
                    }}
                    onClick={handleMaintenanceDemand}
                    disabled={!maintenanceTarget}
                >
                    ️ Demande de maintenance
                </button>

                {/* Sélection de la cible pour la maintenance */}
                <div style={styles.verticalContainer}>
                    <label htmlFor="target-input">
                        Cible
                    </label>
                    <select
                        value={maintenanceTarget}
                        onChange={handleMaintenanceTargetChange}
                        style={{padding: "5px", display: "flex"}}
                    >
                        <option value="">-- Choisir la cible --</option>
                        {Object.entries(AccountRoles).map(([role, address]) => (
                            <option key={address} value={address}>{role}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={maintenanceTarget}
                        onChange={handleInputMaintenanceTargetChange}
                        placeholder="Ou entrer une adresse cible"
                        style={styles.inputBox}
                    />
                </div>
            </div>

            <div style={styles.container}>
                {/* Finalisation ou annulation de la maintenance */}
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
        gap: '5px',
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
    },
    whiteLine: {
        height: 1,
        backgroundColor: "#fff",
        width: "70%",
    }
};

export default App;