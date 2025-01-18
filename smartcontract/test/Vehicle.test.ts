import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("vehicle", function () {
  async function deployvehicleFixture() {
    const vehicleContract = await ethers.getContractFactory("VehicleContract");
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const vehicle = await vehicleContract.deploy();
    await vehicle.waitForDeployment();

    return { vehicle, owner, addr1, addr2, addr3 };
  }

  it("Should create a vehicle", async function () {
    const { vehicle, addr1 } = await loadFixture(deployvehicleFixture);
    await vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    const v = await vehicle.vehicles("VIN123");
    expect(v.vin).to.equal("VIN123");
    expect(v.owner).to.equal(addr1.address);
    expect(v.reward).to.equal(ethers.parseEther("1"));
    expect(v.isArchived).to.be.false;
    expect(v.historyCount).to.equal(0);
  });

  it("Should get a vehicle", async function () { 
    const { vehicle, addr1 } = await loadFixture(deployvehicleFixture);
    await vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    const [ vin, owner, isArchived ] = await vehicle.getVehicle("VIN123");
    expect(vin).to.equal("VIN123");
    expect(owner).to.equal(addr1.address);
    expect(isArchived).to.be.false;
  });

  it("Should not create a vehicle with an existing VIN", async function () {
    const { vehicle, addr1 } = await loadFixture(deployvehicleFixture);
    await vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    await expect(vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") })).to.be.revertedWith("Vehicle already exists");
  });

  it("Should propose a sale", async function () {
    const { vehicle, addr1, addr2 } = await loadFixture(deployvehicleFixture);
    await vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    await vehicle.connect(addr1).proposeSale("VIN123", addr2.address, ethers.parseEther("1"));
    const sale = await vehicle.sales("VIN123");
    expect(sale.buyer).to.equal(addr2.address);
    expect(sale.price).to.equal(ethers.parseEther("1"));
    expect(sale.isActive).to.be.true;
  });

  it("Should not allow non-owner to propose a sale", async function () {
    const { vehicle, addr1, addr2, addr3 } = await loadFixture(deployvehicleFixture);
    await vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    await expect(vehicle.connect(addr2).proposeSale("VIN123", addr3.address, ethers.parseEther("1"))).to.be.revertedWith("Not the owner");
  });

  it("Should cancel a sale", async function () {
    const { vehicle, addr1, addr2 } = await loadFixture(deployvehicleFixture);
    await vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    await vehicle.connect(addr1).proposeSale("VIN123", addr2.address, ethers.parseEther("1"));
    await vehicle.connect(addr1).cancelSale("VIN123");
    const sale = await vehicle.sales("VIN123");
    expect(sale.isActive).to.be.false;
  });

  it("Should not allow non-owner to cancel a sale", async function () {
    const { vehicle, addr1, addr2 } = await loadFixture(deployvehicleFixture);
    await vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    await vehicle.connect(addr1).proposeSale("VIN123", addr2.address, ethers.parseEther("1"));
    await expect(vehicle.connect(addr2).cancelSale("VIN123")).to.be.revertedWith("Not the owner");
  });

  it("Should accept a sale", async function () {
    const { vehicle, owner, addr1, addr2 } = await loadFixture(deployvehicleFixture);
    await vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    await vehicle.connect(addr1).proposeSale("VIN123", addr2.address, ethers.parseEther("1"));
    
    const sellerBalanceBefore = await ethers.provider.getBalance(addr1.address);
    const buyerBalanceBefore = await ethers.provider.getBalance(addr2.address);
    
    await vehicle.connect(addr2).acceptSale("VIN123", { value: ethers.parseEther("1") });
    
    const v = await vehicle.vehicles("VIN123");
    expect(v.owner).to.equal(addr2.address);
    
    const sale = await vehicle.sales("VIN123");
    expect(sale.isActive).to.be.false;
    
    const sellerBalanceAfter = await ethers.provider.getBalance(addr1.address);
    const buyerBalanceAfter = await ethers.provider.getBalance(addr2.address);
    
    expect(sellerBalanceAfter).to.equal(sellerBalanceBefore + ethers.parseEther("1"));
    expect(buyerBalanceAfter).to.be.below(buyerBalanceBefore - ethers.parseEther("1"));
  });

  it("Should not allow non-buyer to accept a sale", async function () {
    const { vehicle, addr1, addr2, addr3 } = await loadFixture(deployvehicleFixture);
    await vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    await vehicle.connect(addr1).proposeSale("VIN123", addr2.address, ethers.parseEther("1"));
    await expect(vehicle.connect(addr3).acceptSale("VIN123", { value: ethers.parseEther("1") })).to.be.revertedWith("Not the buyer");
  });

  it("Should lock funds for a repair", async function () { 
    const { vehicle, addr1, addr2: garagist } = await loadFixture(deployvehicleFixture);
    await vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });

    const addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);

    const tx = await vehicle.connect(addr1).askForMaintenance("VIN123", garagist.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });

    // Récupérer les informations sur la maintenance
    const maintenance = await vehicle.maintenances("VIN123");
    expect(maintenance.price).to.equal(ethers.parseEther("1"));

    // Obtenir les détails de la transaction (frais de gas)
    const receipt = await tx.wait();
    const gasUsed = receipt?.gasUsed ?? 0n; // Gas consommé
    const gasPrice = receipt?.gasPrice ?? 0n; // Prix du gas
    const gasCost = gasUsed * gasPrice; // Frais de transaction totaux

    // Obtenir le solde après la maintenance
    const addr1BalanceAfter = await ethers.provider.getBalance(addr1.address);

    // Vérifier que le montant retiré inclut les frais de gas
    expect(addr1BalanceBefore - addr1BalanceAfter).to.equal(ethers.parseEther("1") + gasCost);
  });

  it("Should cancel a Maintenance", async function () { 
    const { vehicle, addr1, addr2: garagist } = await loadFixture(deployvehicleFixture);
    await vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    await vehicle.connect(addr1).askForMaintenance("VIN123", garagist.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    let maintenance = await vehicle.maintenances("VIN123");
    expect(maintenance.price).to.equal(ethers.parseEther("1"));
    expect(maintenance.owner).to.equal(addr1.address);

    // Obtenir le solde d'addr1 avant l'annulation
    const addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);

    // Annuler la maintenance
    const tx = await vehicle.connect(addr1).cancelMaintenance("VIN123");

    // Obtenir les détails de la transaction (frais de gas)
    const receipt = await tx.wait();
    const gasUsed = receipt?.gasUsed ?? 0n; // Gas consommé
    const gasPrice = receipt?.gasPrice ?? 0n; // Prix du gas
    const gasCost = gasUsed * gasPrice; // Frais de transaction totaux

    // Vérification que la maintenance a été supprimée
    maintenance = await vehicle.maintenances("VIN123");
    expect(maintenance.price).to.equal(0);

    // Vérifier que le propriétaire a été remboursé
    const addr1BalanceAfter = await ethers.provider.getBalance(addr1.address);
    expect(addr1BalanceAfter).to.equal(addr1BalanceBefore + ethers.parseEther("1") - gasCost);
  });

  it("Should not allow non-owner to ask for maintenance", async function () {
    const { vehicle, addr1, addr2: garagist, addr3 } = await loadFixture(deployvehicleFixture);
    await vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    await expect(vehicle.connect(addr3).askForMaintenance("VIN123", garagist.address, ethers.parseEther("1"), { value: ethers.parseEther("1") })).to.be.revertedWith("Not the owner");
  });

  it("Should complete maintenance and transfer funds to the garagist", async function () {
    const { vehicle, owner, addr1, addr2: garagist } = await loadFixture(deployvehicleFixture);
    await vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    await vehicle.connect(addr1).askForMaintenance("VIN123", garagist.address, ethers.parseEther("0.1"), { value: ethers.parseEther("0.1") });
    const garagistBalanceBefore = await ethers.provider.getBalance(garagist.address);

    // Compléter la maintenance et capturer les frais de gaz
    const tx1 = await vehicle.connect(garagist).completeMaintenance("VIN123", "Maintenance 1");
    const receipt1 = await tx1.wait(); // Récupérer les détails de la transaction
    const gasUsed1 = receipt1?.gasUsed ?? 0n; // Gaz utilisé
    const gasPrice1 = tx1.gasPrice; // Prix du gaz
    const gasCost1 = gasUsed1 * gasPrice1; // Coût total des frais de gaz

    // Solde du garagiste après la transaction
    const garagistBalanceAfter = await ethers.provider.getBalance(garagist.address);

    // Vérifier que la récompense initiale (0.6 ETH) a été transférée en tenant compte des frais de gaz
    expect(
      garagistBalanceAfter - garagistBalanceBefore + gasCost1
    ).to.equal(ethers.parseEther("0.6"));

    // Vérification de la récompense restante (0.5 ETH)
    const vehicleData1 = await vehicle.vehicles("VIN123");
    expect(vehicleData1.reward).to.equal(ethers.parseEther("0.5"));

    // Nouvelle demande de maintenance avec 0.1 ETH
    await vehicle.connect(addr1).askForMaintenance("VIN123", garagist.address, ethers.parseEther("0.1"), { value: ethers.parseEther("0.1") });

    // Compléter la deuxième maintenance et capturer les frais de gaz
    const garagistBalanceBefore2 = await ethers.provider.getBalance(garagist.address);
    const tx2 = await vehicle.connect(garagist).completeMaintenance("VIN123", "Maintenance 2");
    const receipt2 = await tx2.wait(); // Récupérer les détails de la transaction
    const gasUsed2 = receipt2?.gasUsed ?? 0n; // Gaz utilisé
    const gasPrice2 = tx2.gasPrice; // Prix du gaz
    const gasCost2 = gasUsed2 * gasPrice2; // Coût total des frais de gaz

    // Solde du garagiste après la deuxième transaction
    const garagistBalanceAfter2 = await ethers.provider.getBalance(garagist.address);

    // Vérifier que la récompense suivante (0.35 ETH) a été transférée en tenant compte des frais de gaz
    expect(
      garagistBalanceAfter2 - garagistBalanceBefore2 + gasCost2
    ).to.equal(ethers.parseEther("0.35"));

    // Vérification de la récompense restante (0.25 ETH)
    const vehicleData2 = await vehicle.vehicles("VIN123");
    expect(vehicleData2.reward).to.equal(ethers.parseEther("0.25"));
  });

  it("Should not allow non-garagist to complete maintenance", async function () {
    const { vehicle, addr1, addr2: garagist, addr3 } = await loadFixture(deployvehicleFixture);
    await vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    await vehicle.connect(addr1).askForMaintenance("VIN123", garagist.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    await expect(vehicle.connect(addr3).completeMaintenance("VIN123", "Fixed")).to.be.revertedWith("Not the garagist");
  });

  it("Should get the history of a vehicle", async function () {
    const { vehicle, addr1, addr2: garagist } = await loadFixture(deployvehicleFixture);
    await vehicle.createVehicle("VIN123", addr1.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    await vehicle.connect(addr1).askForMaintenance("VIN123", garagist.address, ethers.parseEther("1"), { value: ethers.parseEther("1") });
    await vehicle.connect(garagist).completeMaintenance("VIN123", "Fixed");
    const histories = await vehicle.getHistories("VIN123");
    expect(histories[0].garagist).to.equal(garagist.address);
    expect(histories[0].description).to.equal("Fixed");
  });
});