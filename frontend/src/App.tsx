import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

// Import ABI
import vehicleContractJSON from "./artifacts/contracts/VehicleContract.sol/VehicleContract.json";

const vehicleContractAdress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Remplace par l'adresse de ton contrat déployé

const App: React.FC = () => {
  // Fonction pour se connecter à MetaMask et interagir avec le contrat
  const connectToBlockchain = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        console.log("Connexion à MetaMask en cours...");
        // Demande à l'utilisateur de se connecter à MetaMask
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("Connecté à MetaMask !");

        // TODO: déplace ça dans un autre fichier / function
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

        const plaqueImatriculation = "VIN12";
        const owner = await signer.getAddress();
        console.log("Owner de l'adresse :", owner);
        const addr1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        const oneEther  = ethers.parseEther("1");
        const gasEstimate = await vehicleContract.createVehicle.estimateGas(
          plaqueImatriculation,
          owner,
          oneEther,
          { value: ethers.parseEther("1"), blockTag: "latest" }
        );
        await vehicleContract.createVehicle(plaqueImatriculation, signer, oneEther, {
          value: ethers.parseEther("1"),
          gasLimit: gasEstimate * 2n, // Multipliez légèrement pour éviter les erreurs.
          blocktag: "latest",
        });
        console.log("Véhicule probablement crée !");
        
        // TODO NORMAL qu'il RECUP RIEN car il y a un temps d'attente avant que les données soient "écrites"
        const vehicle = await vehicleContract.getVehicle(plaqueImatriculation, { blockTag: "latest" });
        console.log("Véhicule récupéré :", vehicle);
        
      } catch (error) {
        console.error("Erreur lors de la connexion à la blockchain :", error);
      }
    } else {
      console.error("MetaMask n'est pas installé !");
    }
  };

  const getVehicle = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        console.log("Connexion à MetaMask en cours...");
        // Demande à l'utilisateur de se connecter à MetaMask
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("Connecté à MetaMask !");
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

        const plaqueImatriculation = "VIN12";
        const vehicle = await vehicleContract.getVehicle(plaqueImatriculation, { blockTag: "latest" });
        console.log("Véhicule récupéré :", vehicle);
      } catch (error) {
        console.error("Erreur lors de la connexion à la blockchain :", error);
      }
    } else {
      console.error("MetaMask n'est pas installé !");
    }
  };

  useEffect(() => {
  }, []);

  return (
    <div>
      <h1>Bienvenue sur l'application Vehicle</h1>
      <button onClick={connectToBlockchain}>Créer vehicle.</button>
      <button onClick={getVehicle}>Récupérer vehicle.</button>
    </div>
  );
};

export default App;