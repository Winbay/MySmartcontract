# Installation

## Backend (Smart Contract)

To install:  
(You need to have `node` and `npm` already installed)
```bash
cd smartcontract/
npm install
```

To start the blockchain:  
```bash
npx hardhat compile
npx hardhat node
```

You should have this URL: `http://127.0.0.1:8545/` with 20 accounts created along with their private keys.

In another terminal, to deploy the smart contract `VehicleContract`:  
```bash
npx hardhat run scripts/deploy-vehicle.ts --network localhost
```

To run unit tests:  
```bash
npx hardhat test
```

## Frontend

To install:  
(You need to have `node` and `npm` already installed)
```bash
cd frontend/
npm install
```

To start:  
```bash
npm run dev
```