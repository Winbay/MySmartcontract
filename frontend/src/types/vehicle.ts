// Les types ici sont représentatifs des types utilisés en solidity pour les smart contracts (ce n'est pas exactement cela)

export interface History {
    garagist: string; // Adresse du garagiste
    description: string; // Description de l'intervention
}

export interface Vehicle {
    vin: string; // vehicule identification number
    owner: string; // Adresse de l'owner
    isArchived: boolean; // Indique si le véhicule est archivé
    histories: { [key: number]: History }; // Historique des maintenances
    historyCount: number; // Nombre de maintenances (length de histories)
    historyIndices: number[]; // Liste des indices des maintenances

    reward: number; // Récompense pour la maintenance à destination des garagistes (se divise par 2 à chaque maintenance afin de toujours en avoir en stock)
}

// Mapping des véhicules (par leur VIN)
export interface Vehicles {
    [vin: string]: Vehicle;
}

export interface Sale {
    seller: string; // Adresse du vendeur
    buyer: string; // Adresse de l'acheteur
    price: bigint; // Prix de vente
    isActive: boolean; // Indique si la vente est active
}

// Stockage des propositions de vente
export interface Sales {
    [vin: string]: Sale;
}

export interface Maintenance {
    vin: string; // VIN du véhicule
    garagist: string; // Adresse du garagiste
    owner: string; // Adresse du propriétaire
    price: bigint; // Prix de la maintenance proposé par le owner
    isFinished: boolean; // Indique si la maintenance est terminée
}

// Stockage des maintenances
export interface Maintenances {
    [vin: string]: Maintenance;
}