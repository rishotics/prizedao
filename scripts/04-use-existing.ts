import { Signer } from "ethers";
import { ethers } from "hardhat";
import PDAOToken from '../artifacts/contracts/PDAOToken.sol/PDAOToken.json';
import PrizeDAOGovernor from '../artifacts/contracts/PrizeDAOGovernor.sol/PrizeDAOGovernor.json';

const GOVERNOR_CONTRACT_ADDRESS = '0x536ccb4A799e49F8357C1e86396E1c6aA0451a07';
const PDAO_ADRESS = '0x87086dc8Adc22a21085b0cEc43Eded0E1a0188A2';

const main = async () => {
  let accounts: Signer[];
  accounts = await ethers.getSigners();
  let signer = accounts[0];

  let gov_con = new ethers.Contract(GOVERNOR_CONTRACT_ADDRESS, PrizeDAOGovernor.abi, signer);
  let token_contract = new ethers.Contract(PDAO_ADRESS, PDAOToken.abi, signer);
//   const txn  = await token_contract.mint(GOVERNOR_CONTRACT_ADDRESS, ethers.utils.parseEther("1000000"));
//   txn.wait();
  const gov_bal = await token_contract.balanceOf('0xd93ba786a4E93b84A49341e4283ea92435725f6B');
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
