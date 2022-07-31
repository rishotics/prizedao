import { Signer } from "ethers";
import { ethers } from "hardhat";

const main = async () => {
  let accounts: Signer[];
  accounts = await ethers.getSigners();

  const tokenFactory = await ethers.getContractFactory("PDAOToken");
  const prizeDAOFactory = await ethers.getContractFactory("PrizeDAOGovernor");
  
  const tokenContract = await tokenFactory.deploy();
  await tokenContract.deployed();
  console.log("tokenContract", tokenContract.address);
  console.log("[LOG] Token contract deployed");

  const PrizeDAOGovernorContract = await prizeDAOFactory.deploy(
    tokenContract.address,
    "PrizeDAOGovernor"
  );
  await PrizeDAOGovernorContract.deployed();
  console.log("PrizeDAOGovernorContract address", PrizeDAOGovernorContract.address);

  const txn  = await tokenContract.mint(PrizeDAOGovernorContract.address, 10**6);
  txn.wait();
  const gov_bal = await tokenContract.balanceOf(PrizeDAOGovernorContract.address);
  console.log(`Governor balance: ${gov_bal}`);
};

function sleep(time: number | undefined) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

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

// enum ProposalState {
//   Pending,
//   Active,
//   Canceled,
//   Defeated,
//   Succeeded,
//   Queued,
//   Expired,
//   Executed
// }
