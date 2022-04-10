import { Signer } from "ethers";
import { ethers } from "hardhat";

const main = async () => {
  let accounts: Signer[];
  accounts = await ethers.getSigners();
  const daiTokenFactory = await ethers.getContractFactory("Dai");
  const daiTokenContract = await daiTokenFactory.deploy();
  await daiTokenContract.deployed();
  console.log("DAI token address:", daiTokenContract.address);
  var balance = await daiTokenContract.balanceOf(accounts[0].getAddress());
  console.log("balance", balance);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.log(`err`, err);
    process.exit(1);
  }
};

runMain();