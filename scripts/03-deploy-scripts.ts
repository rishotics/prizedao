import { Signer } from "ethers";
import { ethers } from "hardhat";
import {moveBlocks} from "./move-blocks"
var daiToken = "0x162F058633293d247ce82d0766bf1d5b0d8bc348";

const main = async () => {
  let accounts: Signer[];
  accounts = await ethers.getSigners();

  const tokenFactory = await ethers.getContractFactory("PDAOToken");
  const prizeDAOFactory = await ethers.getContractFactory("PrizeDAOGovernor");
  const daiFactory = await ethers.getContractFactory("Dai");

  const daiContract = await daiFactory.deploy();
  await daiContract.deployed();
  console.log("daiContract", daiContract.address);
  daiToken = daiContract.address;

  const tokenContract = await tokenFactory.deploy();
  await tokenContract.deployed();
  console.log("tokenContract", tokenContract.address);
  console.log("[LOG] Token contract deployed");

  var amt = await tokenContract.balanceOf(accounts[0].getAddress());
  console.log("Amout of PDAO acc0 has:", amt) ;

  await tokenContract.transfer(accounts[1].getAddress(), 1000000);
  var amt = await tokenContract.balanceOf(accounts[1].getAddress());
  console.log("Amout of PDAO acc1 has:", amt) ;


  await tokenContract.delegate(accounts[0].getAddress());

  const PrizeDAOGovernorContract = await prizeDAOFactory.deploy(
    tokenContract.address,
    "PrizeDAOGovernor",
    daiToken
  );
  await PrizeDAOGovernorContract.deployed();
  console.log("PrizeDAOGovernorContract address", PrizeDAOGovernorContract.address);

    var txn = await PrizeDAOGovernorContract.receiveEthForTransactions({
        value: ethers.utils.parseEther("5"),
    });

    await txn.wait();

    var txn = await tokenContract.setMinterRole(PrizeDAOGovernorContract.address);
    await txn.wait();

    // IMP checking transfer of dai token from 0th account to governor
    // before creating hackathon we will do this only i.e tranfer DAI from sponsors account to governor
    var txn = await daiContract.transfer(PrizeDAOGovernorContract.address, 10);
    await txn.wait();

    // var txn = await PrizeDAOGovernorContract.giveApproval( 10,accounts[1].getAddress() );
    // var rc = await txn.wait();
    // const event11111 = rc.events.find(
    //       (event: any) => event.event === "Approval"
    //     );
    // const [approval] = event11111.args;
    // console.log("Approval: ", approval);


    // var txn = await PrizeDAOGovernorContract.addMember( 10 );
    var rc = await txn.wait();
    const event1111 = rc.events.find(
          (event: any) => event.event === "Transfer"
        );
    const [transfer] = event1111.args;
    console.log("Transfer: ", transfer);


    var txn = await PrizeDAOGovernorContract.add_hackathon(
        "Test1",
        "2021-01-01",
        "2021-02-01",
        10,
        accounts[1].getAddress()
    );
    var rc = await txn.wait();
    const event = rc.events.find(
          (event: any) => event.event === "HackathonCreated"
        );
    const [HackathonId] = event.args;
    console.log("hackathonId: ", HackathonId);


    var amt = await daiContract.balanceOf(PrizeDAOGovernorContract.address);
    console.log("Amout of DAI recieved by governor from sponsor:", amt) ;



    var txn = await PrizeDAOGovernorContract.register_hacker(
        "TestHacker",
        1
    );
    var rc = await txn.wait();
    const event1 = rc.events.find(
          (event: any) => event.event === "HackerRegisted"
        );
    const [HackerId] = event1.args;
    console.log("HackerId: ", HackerId);


    var txn = await PrizeDAOGovernorContract.register_hacker(
        "TestHackerr",
        1
    );
    var rc = await txn.wait();
    const event2 = rc.events.find(
          (event: any) => event.event === "HackerRegisted"
        );
    const [HackerId2] = event2.args;
    console.log("HackerId: ", HackerId2);
    const event2hk = rc.events.find(
        (event: any) => event.event === "HackathonEvent"
      );
    const [HackerId2hk] = event2hk.args;
    // console.log("Hackathon is: ", HackerId2hk);


    var txn = await PrizeDAOGovernorContract.add_submission(
        1,
        "xxxxx",
        1
    );
    var rc = await txn.wait();
    const event3 = rc.events.find(
          (event: any) => event.event === "SubmissionDone"
        );
    const [HackerId3] = event3.args;
    console.log("Submission Done : ", HackerId3);

    var txn = await PrizeDAOGovernorContract.add_submission(
        2,
        "xxxxxx",
        1
    );
    var rc = await txn.wait();
    const event4 = rc.events.find(
          (event: any) => event.event === "SubmissionDone"
        );
    const [HackerId4] = event4.args;
    console.log("Submission Done : ", HackerId4);

    const transferCalldata = PrizeDAOGovernorContract.interface.encodeFunctionData(
          "setWinnerAddress",
          [1]
        );


    var txn = await PrizeDAOGovernorContract.createProposal(
            [PrizeDAOGovernorContract.address],
            [0],
            [transferCalldata],
            "Hackathon 1",
            HackathonId
            );
    var rc = await txn.wait();
    const e = rc.events.find(
        (event: any) => event.event === "ProposalCreated"
        );
    const [proposalId] = e.args;
    console.log("Proposal Id: ", proposalId)


// Get HackerIpfsSubmission
    var txn = await PrizeDAOGovernorContract.getHackerSubmission(proposalId, HackerId4);
    var rc = await txn.wait();
    const e1 = rc.events.find(
        (event: any) => event.event === "HackerIpfsSubmission"
        );
    const [hackerIpfsSubmission] = e1.args;
    console.log("hackerIpfsSubmission : ", hackerIpfsSubmission)
    
    
    // Get CurrentProposalIDf
    var txn = await PrizeDAOGovernorContract.getProposalId(HackathonId);
    var rc = await txn.wait();
    const e2 = rc.events.find(
        (event: any) => event.event === "CurrentProposalID"
        );
    const [currproposalId1] = e2.args;
    console.log("CurrentProposalID : ", currproposalId1)

    var state = await PrizeDAOGovernorContract.state(proposalId);
    console.log("state : ", state);

    

    var name = await PrizeDAOGovernorContract.name();
    console.log("name : ", name);

    var version = await PrizeDAOGovernorContract.version();
    console.log("version : ", version);


    var countingMode = await PrizeDAOGovernorContract.COUNTING_MODE();
    console.log("countingMode : ", countingMode);

    var votingDelay = await PrizeDAOGovernorContract.votingDelay();
    console.log("votingDelay : ", votingDelay);

    var votingPeriod = await PrizeDAOGovernorContract.votingPeriod();
    console.log("votingPeriod : ", votingPeriod);

    var proposalSnapshot = await PrizeDAOGovernorContract.proposalSnapshot(proposalId);
    console.log("proposalSnapshot : ", proposalSnapshot);

    var proposalDeadline = await PrizeDAOGovernorContract.proposalDeadline(proposalId);
    console.log("proposalDeadline : ", proposalDeadline);

    var blockNum = await ethers.provider.getBlockNumber();
    var quorum = await PrizeDAOGovernorContract.quorum(blockNum - 1);
    console.log("quorum : ", quorum);

    var getVotes = await PrizeDAOGovernorContract.getVotes(
        accounts[0].getAddress(),
        blockNum - 1
    );
    console.log("accounts[0].getAddress(),", accounts[0].getAddress());
    console.log("getVotes for address 0 : ", getVotes);

    var getVotes2 = await PrizeDAOGovernorContract.getVotes(
        accounts[1].getAddress(),
        blockNum - 1
    );
    console.log("getVotes for address 1: ", getVotes2);

    var state = await PrizeDAOGovernorContract.state(proposalId);
    console.log("state : ", state);


    

    var txn = await PrizeDAOGovernorContract.castVote(proposalId, 1);
    var rc = await txn.wait();
    const voteEvent = rc.events.find((event: any) => event.event === "VoteCast");
    console.log("voteEvent : ", voteEvent.args);
    
    const e22 = rc.events.find(
        (event: any) => event.event === "NumOfHackers"
        );
    const [numOfHackers] = e22.args;
    console.log("NumOfHackers : ", numOfHackers)

    const e23 = rc.events.find(
        (event: any) => event.event === "VotesPresent"
        );
    const [votesPresent] = e23.args;
    console.log("VotesPresent : ", votesPresent)




    var blockNum = await ethers.provider.getBlockNumber();
    console.log("blockNum", blockNum);
    await sleep(3000);
    var state = await PrizeDAOGovernorContract.state(proposalId);
    console.log("state : ", state);

    await moveBlocks(15 + 1);
    var hasVoted = await PrizeDAOGovernorContract.hasVoted(
        proposalId,
        accounts[0].getAddress()
    );
    console.log("hasVoted : ", hasVoted);

    var blockNum = await ethers.provider.getBlockNumber();
    console.log("blockNum", blockNum);
    // var proposalVotes = await PrizeDAOGovernorContract.proposalVotes(proposalId);
    // console.log("proposalVotes : ", proposalVotes);

    var state = await PrizeDAOGovernorContract.state(proposalId);
    console.log("state : ", state);
    if (state === 4) {
          var txn = await PrizeDAOGovernorContract.execute(
            [PrizeDAOGovernorContract.address],
            [0],
            [transferCalldata],
            ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes("Hackathon 1")
            )
          );
          var rc = await txn.wait();
          const e10= rc.events.find(
                    (event: any) => event.event === "WinnerIs"
                    );
          const [winnerAddress] = e10.args;

          const e11= rc.events.find(
            (event: any) => event.event === "TotalVotes"
            );
          const [totalVotes] = e11.args;
          console.log("TotalVotes : ", totalVotes);
          console.log("winnerAddress : ", winnerAddress);
          console.log("accounts[0].getAddress(),", accounts[0].getAddress());

        //   const e12 = rc.events.find(
        //     (event: any) => event.event === "VotesPresent"
        //     );
        //     // const [votesPresent1] = e12.args;
        //   console.log("VotesPresent : ", e12.args);

        //   const e123 = rc.events.find(
        //         (event: any) => event.event === "NoHackerWon"
        //         );
        //   const [noHackerWon] = e123.args;
        //   console.log("noHackerWon : ", noHackerWon)
        }



    



  // var signer: Signer = ethers.provider.getSigner();
  // var address = await accounts[0].getAddress();
  // console.log("address", address);

  // const transferCalldata = PrizeDAOGovernorContract.interface.encodeFunctionData(
  //   "setAcceptedProposal",
  //   ["#1", address]
  // );

  // var txn = await PrizeDAOGovernorContract.propose(
  //   [PrizeDAOGovernorContract.address],
  //   [0],
  //   [transferCalldata],
  //   "Proposal #1: Give grant to team"
  // );
  // var rc = await txn.wait();
  // const event = rc.events.find(
  //   (event: any) => event.event === "ProposalCreated"
  // );
  // const [proposalId] = event.args;

  // var name = await PrizeDAOGovernorContract.name();
  // console.log("name : ", name);

  // var version = await PrizeDAOGovernorContract.version();
  // console.log("version : ", version);

  // var countingMode = await PrizeDAOGovernorContract.COUNTING_MODE();
  // console.log("countingMode : ", countingMode);

  // var votingDelay = await PrizeDAOGovernorContract.votingDelay();
  // console.log("votingDelay : ", votingDelay);

  // var votingPeriod = await PrizeDAOGovernorContract.votingPeriod();
  // console.log("votingPeriod : ", votingPeriod);

  // var proposalSnapshot = await PrizeDAOGovernorContract.proposalSnapshot(proposalId);
  // console.log("proposalSnapshot : ", proposalSnapshot);

  // var proposalDeadline = await PrizeDAOGovernorContract.proposalDeadline(proposalId);
  // console.log("proposalDeadline : ", proposalDeadline);

  // var blockNum = await ethers.provider.getBlockNumber();
  // var quorum = await PrizeDAOGovernorContract.quorum(blockNum - 1);
  // console.log("quorum : ", quorum);

  // var getVotes = await PrizeDAOGovernorContract.getVotes(
  //   accounts[0].getAddress(),
  //   blockNum - 1
  // );
  // console.log("accounts[1].getAddress(),", accounts[1].getAddress());
  // console.log("getVotes[0] : ", getVotes);

  // var getVotes2 = await PrizeDAOGovernorContract.getVotes(
  //   accounts[1].getAddress(),
  //   blockNum - 1
  // );
  // console.log("getVotes[1] : ", getVotes2);

  // var txn = await PrizeDAOGovernorContract.castVote(proposalId, 1);
  // var rc = await txn.wait();
  // const voteEvent = rc.events.find((event: any) => event.event === "VoteCast");
  // console.log("voteEvent : ", voteEvent.args);

  // var blockNum = await ethers.provider.getBlockNumber();
  // console.log("blockNum", blockNum);
  // await sleep(3000);
  // var state = await PrizeDAOGovernorContract.state(proposalId);
  // console.log("state : ", state);

  // await sleep(1 * 60 * 1000);
  // var hasVoted = await PrizeDAOGovernorContract.hasVoted(
  //   proposalId,
  //   accounts[0].getAddress()
  // );
  // console.log("hasVoted : ", hasVoted);

  // var blockNum = await ethers.provider.getBlockNumber();
  // console.log("blockNum", blockNum);
  // var proposalVotes = await PrizeDAOGovernorContract.proposalVotes(proposalId);
  // console.log("proposalVotes : ", proposalVotes);

  // var state = await PrizeDAOGovernorContract.state(proposalId);
  // console.log("state : ", state);

  // if (state === 4) {
  //   var res = await PrizeDAOGovernorContract.execute(
  //     [PrizeDAOGovernorContract.address],
  //     [0],
  //     [transferCalldata],
  //     ethers.utils.keccak256(
  //       ethers.utils.toUtf8Bytes("Proposal #1: Give grant to team")
  //     )
  //   );
  //   console.log("res", res);
  //   await sleep(1000);
  //   var userAdd = await PrizeDAOGovernorContract.acceptedProposal("#1");
  //   var txn = await PrizeDAOGovernorContract.disburseIncentive("#1", userAdd, 20);
  //   await txn.wait();
  //   console.log("userAdd", userAdd);
  // }
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
