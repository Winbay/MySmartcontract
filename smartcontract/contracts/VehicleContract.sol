// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract VehicleContract {
    struct History {
        address garagist;
        string description;
    }

    struct Vehicle {
        string vin; // vehicule identification number
        address owner;
        bool isArchived;
        mapping(uint256 => History) histories;
        uint256 historyCount;
        uint256[] historyIndices;
        uint256 reward; // Récompense pour les garagistes
    }

    // Mapping des véhicules (par leur VIN)
    mapping(string => Vehicle) public vehicles;

    struct Sale {
        address seller;
        address buyer;
        uint256 price;
        bool isActive;
    }

    mapping(string => Sale) public sales; // Stockage des propositions de vente

    struct Maintenance {
        string vin;
        address garagist;
        address owner;
        uint256 price;
        bool isFinished;
    }

    mapping(string => Maintenance) public maintenances; // Stockage des maintenances

    event VehicleRegistered(string vin, address indexed owner);
    event SaleProposed(string vin, address indexed seller, address indexed buyer, uint256 price);
    event SaleCancelled(string vin, address indexed seller);
    event SaleCompleted(string vin, address indexed seller, address indexed buyer, uint256 price);
    event MaintenanceRequested(string vin, address indexed garagist, uint256 price);
    event MaintenanceCompleted(string vin, address indexed garagist);

    modifier onlyOwner(string memory vin) {
        require(
            vehicles[vin].owner == msg.sender,
            "Not the owner"
        );
        _;
    }

    modifier notArchived(string memory vin) {
        require(!vehicles[vin].isArchived, "This vehicle is archived.");
        _;
    }

    modifier isPositivePrice(uint256 value) {
        require(value > 0, "The value must be greater than zero.");
        _;
    }

    constructor() {}

    /**
     * @notice Get the informations of a vehicle.
     */
    function getVehicle(
        string memory vin
    ) external view returns (string memory, address, bool) {
        console.log("Getting vehicle with VIN %s", vin);
        Vehicle storage vehicle = vehicles[vin];
        console.log("Vin is %s", vehicle.vin);
        console.log("Owner is %s", vehicle.owner);
        console.log("Is archived: %s", vehicle.isArchived);
        return (vehicle.vin, vehicle.owner, vehicle.isArchived);
    }

    /**
     * @notice Create a new vehicle.
     */
    function createVehicle(string memory vin, address initialOwner, uint256 reward)
        external
        payable
        isPositivePrice(reward)
    {
        require(vehicles[vin].owner == address(0), "Vehicle already exists");
        require(msg.value == reward, "Insufficient funds");

        console.log("Creating vehicle with VIN %s", vin);
        console.log("Initial owner is %s", initialOwner);
        console.log("Reward for garagists is %s", reward);

        Vehicle storage vehicle = vehicles[vin];
        vehicle.vin = vin;
        vehicle.owner = initialOwner;
        vehicle.isArchived = false;
        vehicle.historyCount = 0;
        vehicle.reward = reward;

        emit VehicleRegistered(vin, initialOwner);
    }

    /**
     * @notice Propose a sale for a vehicle.
     */
    function proposeSale(string memory vin, address buyer, uint256 price)
        external
        notArchived(vin)
        onlyOwner(vin)
        isPositivePrice(price)
    {
        sales[vin] = Sale(msg.sender, buyer, price, true);
        emit SaleProposed(vin, msg.sender, buyer, price);
    }

    /**
     * @notice Cancel a sale proposition.
     */
    function cancelSale(string memory vin) external {
        Sale memory sale = sales[vin];
        require(sale.seller == msg.sender, "Not the owner");
        require(sale.isActive, "The sale is not active");

        delete sales[vin];
        emit SaleCancelled(vin, msg.sender);
    }

    /**
     * @notice Accept a sale proposition.
     */
    function acceptSale(string memory vin) external payable {
        Sale memory sale = sales[vin];
        require(sale.isActive, "The sale is not active");
        require(sale.buyer == msg.sender, "Not the buyer");
        require(msg.value == sale.price, "Insufficient funds");

        payable(sale.seller).transfer(msg.value);
        vehicles[vin].owner = msg.sender;

        Vehicle storage vehicle = vehicles[vin];
        uint256 historyIndex = vehicle.historyCount;
        vehicle.histories[historyIndex] = History(msg.sender, "Vehicle bought");
        vehicle.historyIndices.push(historyIndex);
        vehicle.historyCount++;

        delete sales[vin];
        emit SaleCompleted(vin, sale.seller, msg.sender, sale.price);
    }

    function archiveVehicle(string memory vin)
        external
        onlyOwner(vin)
        notArchived(vin)
    {
        vehicles[vin].isArchived = true;
    }

    function askForMaintenance(
        string memory vin,
        address garagist,
        uint256 price
    )
        external
        payable
        notArchived(vin)
        onlyOwner(vin)
        isPositivePrice(price)
    {
        require(msg.value >= price, "Insufficient funds");

        maintenances[vin] = Maintenance(vin, garagist, msg.sender, price, false);
        emit MaintenanceRequested(vin, garagist, price);
    }

    function cancelMaintenance(string memory vin) external {
        Maintenance storage maintenance = maintenances[vin];
        require(maintenance.owner == msg.sender, "Not the owner");
        require(!maintenance.isFinished, "Maintenance already completed");

        uint256 refund = maintenance.price;
        delete maintenances[vin];

        payable(msg.sender).transfer(refund);
    }

    function completeMaintenance(string memory vin, string memory description)
        external
    {
        Maintenance storage maintenance = maintenances[vin];
        require(maintenance.garagist == msg.sender, "Not the garagist");
        require(!maintenance.isFinished, "Maintenance is already completed");

        maintenance.isFinished = true;

        Vehicle storage vehicle = vehicles[vin];
        uint256 historyIndex = vehicle.historyCount;
        vehicle.histories[historyIndex] = History(msg.sender, description);
        vehicle.historyIndices.push(historyIndex);
        vehicle.historyCount++;

        payable(msg.sender).transfer(maintenance.price);

        uint256 rewardToGive = vehicle.reward / 2;
        vehicle.reward -= rewardToGive;
        payable(msg.sender).transfer(rewardToGive);

        emit MaintenanceCompleted(vin, maintenance.garagist);
    }

    function getHistories(string memory vin)
        external
        view
        returns (History[] memory)
    {
        Vehicle storage vehicle = vehicles[vin];
        uint256 historyLength = vehicle.historyIndices.length;
        History[] memory allHistories = new History[](historyLength);

        for (uint256 i = 0; i < historyLength; i++) {
            uint256 index = vehicle.historyIndices[i];
            allHistories[i] = vehicle.histories[index];
        }

        return allHistories;
    }
}
