import { Signer } from "ethers";
import { ethers } from "hardhat";
import PDAOToken from '../artifacts/contracts/PDAOToken.sol/PDAOToken.json';
import PrizeDAOGovernor from '../artifacts/contracts/PrizeDAOGovernor.sol/PrizeDAOGovernor.json';

const GOVERNOR_CONTRACT_ADDRESS = '0xee9678889459F22659F92BB518eF80cD35DB10A5';
const PDAO_ADRESS = '0x10aaF70E19532C3389e21d09E71d5972f174ae2e';

const main = async () => {
  let accounts: Signer[];
  accounts = await ethers.getSigners();
  let signer = accounts[0];

  let gov_con = new ethers.Contract(GOVERNOR_CONTRACT_ADDRESS, PrizeDAOGovernor.abi, signer);
  let token_contract = new ethers.Contract(PDAO_ADRESS, PDAOToken.abi, signer);
//   const txn  = await token_contract.mint(GOVERNOR_CONTRACT_ADDRESS, ethers.utils.parseEther("1000000"));
//   txn.wait();
  const list_of_hcks = await gov_con.getHackersIdsForHackathon("1");
  console.log(` list_of_hcks: ${list_of_hcks}`);

  const info = await gov_con.getHackerList(list_of_hcks[1]);
  console.log(` info: ${info}`);


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
