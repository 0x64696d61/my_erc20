// npx hardhat verify --network rinkeby 0xa75945f1281180a7329c394B9b49802ae4af2dbf
// npx hardhat run --network rinkeby scripts/deploy.js
// Donations contract deployed to: 0xAB25a26bDc289b1F6005AD650d1712E6212D4c27

import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

const contract_name = 'ERC20'
const prefix = 'my' + contract_name + '_'

task(prefix + "transfer", "Transfer tokens")
    .addParam("address", "Contract address")
    .addParam("toAddress", "To address")
    .addParam("amount", "The amount of donations in wei")
    .setAction(async (taskArgs, hre) => {
        const [acc1] = await hre.ethers.getSigners()
        const Contract = await hre.ethers.getContractFactory(contract_name);
        const contract = await Contract.attach(taskArgs.address)
        await contract.connect(acc1).transfer(taskArgs.toAddress, taskArgs.amount)
    });

task(prefix + "transferFrom", "Transfer approved tokens")
    .addParam("address", "Contract address")
    .addParam("fromAddress", "From address")
    .addParam("toAddress", "To address")
    .addParam("amount", "The amount of donations in wei")
    .setAction(async (taskArgs, hre) => {
        const [acc1] = await hre.ethers.getSigners()
        const Contract = await hre.ethers.getContractFactory(contract_name);
        const contract = await Contract.attach(taskArgs.address)
        await contract.connect(acc1).transferFrom(taskArgs.fromAddress, taskArgs.toAddress, taskArgs.amount)
    });

task(prefix + "approve", "Approve allow token transfer")
    .addParam("address", "Contract address")
    .addParam("toAddress", "To address")
    .addParam("amount", "The amount of donations in wei")
    .setAction(async (taskArgs, hre) => {
        const [acc1] = await hre.ethers.getSigners()
        const Contract = await hre.ethers.getContractFactory(contract_name);
        const contract = await Contract.attach(taskArgs.address)
        await contract.connect(acc1).approve(taskArgs.toAddress, taskArgs.amount)
    });
