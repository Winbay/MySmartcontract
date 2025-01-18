import { ethers } from "hardhat";

async function main() {
  // Déploie le contrat Greeter avec un message initial
  const Greeter = await ethers.deployContract("Greeter", ["Hello, world!"]);
  await Greeter.waitForDeployment();
  console.log(`Greeter deployed to: ${Greeter.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});