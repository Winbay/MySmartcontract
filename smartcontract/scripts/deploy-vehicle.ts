import { ethers } from "hardhat";

async function main() {
  // Get the contract factory
  const Vehicle = await ethers.getContractFactory("VehicleContract");

  // Deploy the contract
  const vehicle = await Vehicle.deploy();

  // Wait for the deployment to be mined
  await vehicle.waitForDeployment();

  // Log the address of the deployed contract
  console.log(`Vehicle deployed to: ${vehicle.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});