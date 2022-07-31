import { Signer, utils } from "ethers";
import { ethers } from "hardhat";
import {moveBlocks} from "./move-blocks"

const cast_vote = async(
  PrizeDAOGovernorContract: any,
  voter: any,
  proposalId: any,
  voteTo: any
) => {
  var txn = await PrizeDAOGovernorContract
                    .connect(voter)
                    .castVote(proposalId, voteTo);
  var rc = await txn.wait();

  const num_hackers = rc.events.find(
    (event: any) => event.event === "NumOfHackers"
    );
  const [numOfHackers] = num_hackers.args;
  console.log("NumOfHackers : ", numOfHackers)

  const votes_present = rc.events.find(
    (event: any) => event.event === "VotesPresent"
    );
  const [votesPresent] = votes_present.args;
  console.log("Amount of Votes Casted : ", ethers.utils.formatEther(votesPresent))
}

const delegate_vote_to_self = async (
  tokenContract: any,
  acc: any
) => {
  var txn = await tokenContract
                    .connect(acc)
                    .delegate(acc.getAddress());
  await txn.wait();
}

const getHash = async (
  PrizeDAOGovernorContract: any, 
  hacker: any,
  proposalId: any,
  hackerId: any) => {
  var ipfs_hash = await PrizeDAOGovernorContract
                  .connect(hacker)
                  .getHackerSubmission(proposalId, hackerId);
  return ipfs_hash;
}


const get_proposal_id = async (
  PrizeDAOGovernorContract: any, 
  sponsor: any,
  HackathonId: any) => {
  var proposal_id = await PrizeDAOGovernorContract
                          .connect(sponsor)
                          .getProposalId(HackathonId);
  return proposal_id;
}


const get_current_block_num = async (
  PrizeDAOGovernorContract: any, 
  sponsor: any,
  proposalId: any) => {
  var block_number = await PrizeDAOGovernorContract
                          .connect(sponsor)
                          .getBlockNumber(proposalId);
  return block_number;
}


const register_hacker = async (
  PrizeDAOGovernorContract: any, 
  hacker: any,
  hacker_name: any,
  hackathonId: any
) => {
    console.log('NEW Hacker getting registered');
    var txn = await PrizeDAOGovernorContract
                      .connect(hacker)
                      .register_hacker(
                        hacker_name,
                        hackathonId
                      );
    var rc = await txn.wait();
    const event1 = rc.events.find(
          (event: any) => event.event === "HackerRegisted"
        );
    const [HackerId] = event1.args;
    console.log("Hacker Id of newly registered hacker:", HackerId);
    return HackerId;
}


const add_submission_for_hacker = async(
  PrizeDAOGovernorContract: any, 
  hacker: any,
  hacker_id: any,
  ipfs_hash: any,
  hackathon_id: any
) => {
  console.log('Hacker adding his submission');
    var txn = await PrizeDAOGovernorContract
                    .connect(hacker)
                    .add_submission(
                            hacker_id,
                            ipfs_hash,
                            hackathon_id
                      );
    var rc = await txn.wait();
    const event_subimission_doine = rc.events.find(
          (event: any) => event.event === "SubmissionDone"
        );
    const [HackerId] = event_subimission_doine.args;
    console.log("Submission Done for hackerId: ", HackerId);
}


const get_transfer_call_data = async(
  PrizeDAOGovernorContract: any,
  function_to_execute: any,
  hackathon_id: any
) => {
  const transferCalldata = PrizeDAOGovernorContract.interface.encodeFunctionData(
    function_to_execute,
    [hackathon_id]
  );
  return transferCalldata
}


const make_proposal = async(
  PrizeDAOGovernorContract: any, 
  sponsor: any,
  hackathon_info: any,
  hackathon_id: any
) => {
      console.log('Making a proposal')
      const transferCalldata = PrizeDAOGovernorContract.interface.encodeFunctionData(
              "setWinnerAddress",
              [1]
            );
      var txn = await PrizeDAOGovernorContract
            .connect(sponsor)
            .createProposal(
                [PrizeDAOGovernorContract.address],
                [0],
                [transferCalldata],
                hackathon_info,
                hackathon_id
                );
    var rc = await txn.wait();
    const event_proposal_created = rc.events.find(
    (event: any) => event.event === "ProposalCreated"
    );
    const [proposalId] = event_proposal_created.args;
    console.log("New Proposal Id: ", proposalId)
    return proposalId;
}


const create_hackathon = async(
  PrizeDAOGovernorContract: any,
  sponsor: any,
  hackathon_name: any,
  start_date: any,
  end_date: any,
  prize_money: any,
  token_address: any
) => {
  console.log('Sponsor creating a hackathon!!');
    const options_add_hackathon = {value: ethers.utils.parseEther("10")}
    var txn = await PrizeDAOGovernorContract
                    .connect(sponsor)
                    .add_hackathon( 
                                hackathon_name,
                                start_date,
                                end_date,
                                prize_money, //PDAO tokens
                                sponsor.getAddress(),
                                token_address,
                                options_add_hackathon
                      );
    var rc = await txn.wait();
    const event_hackathonCreated = rc.events.find(
          (event: any) => event.event === "HackathonCreated"
        );
    const [HackathonId] = event_hackathonCreated.args;
    console.log("NEW hackathon created with ID: ", HackathonId);
    return HackathonId;
}


const get_total_votes = async(
  tokenContract: any,
  block_number: any
) => {
  var total_votes = await tokenContract.getPastTotalSupply(block_number);
  return total_votes;
}



const main = async () => {
  let accounts: Signer[];

  
  accounts = await ethers.getSigners();
  const deployer = accounts[0];
  const sponsor = accounts[1];
  const hacker = accounts[2];
  const hacker2 = accounts[3];

  const tokenFactory = await ethers.getContractFactory("PDAOToken");
  const prizeDAOFactory = await ethers.getContractFactory("PrizeDAOGovernor");
  
  const tokenContract = await tokenFactory.deploy();
  await tokenContract.deployed();
  console.log("tokenContract", tokenContract.address);
  console.log("[LOG] Token contract deployed");

  // await tokenContract.connect()

  var balanceOfDeployer = await tokenContract.balanceOf(deployer.getAddress());
  console.log("Balance Of Deployer:", utils.formatEther(balanceOfDeployer));

  await tokenContract.connect(deployer).transfer(sponsor.getAddress(), utils.parseEther("1000"));
  var balanceOfSponsor = await tokenContract.balanceOf(sponsor.getAddress());
  console.log("Balance Of Sponsor:", utils.formatEther(balanceOfSponsor));

  await tokenContract.connect(deployer).transfer(hacker.getAddress(), utils.parseEther("1000"));
  var balanceOfHacker1 = await tokenContract.balanceOf(hacker.getAddress());
  console.log("Balance Of hacker 1:", utils.formatEther(balanceOfHacker1));

  await tokenContract.connect(deployer).transfer(hacker2.getAddress(), utils.parseEther("1000"));
  var balanceOfHacker2 = await tokenContract.balanceOf(hacker2.getAddress());
  console.log("Balance Of hacker 2:", utils.formatEther(balanceOfHacker2));
  
  console.log("Delegating votes to self");
  await delegate_vote_to_self(tokenContract, deployer);
  await delegate_vote_to_self(tokenContract, sponsor);
  await delegate_vote_to_self(tokenContract, hacker);
  await delegate_vote_to_self(tokenContract, hacker2);

  var getVotes = await tokenContract.getVotes(hacker.getAddress());
  console.log("getVotes for hacker 1 : ", utils.formatEther(getVotes));

  var getVotes2 = await tokenContract.getVotes(hacker2.getAddress());
  console.log("getVotes for hacker 2: ", utils.formatEther(getVotes2));

  var get_for_deployer = await tokenContract.getVotes(deployer.getAddress());
  console.log("getVotes for deployer: ", utils.formatEther(get_for_deployer));

  var get_for_sponsor = await tokenContract.getVotes(sponsor.getAddress());
  console.log("getVotes for sponsor: ", utils.formatEther(get_for_sponsor));
  
  var blockNum = await ethers.provider.getBlockNumber();
  console.log("Current block num:", blockNum)

  var total_votes = await get_total_votes(tokenContract, blockNum -1);
  console.log("Total votes = ", utils.formatEther(total_votes));

  // var amt = await tokenContract.balanceOf(accounts[0].getAddress());
  // console.log("Amout of PDAO acc0 has:", amt) ;

//   await tokenContract.transfer(accounts[1].getAddress(), 1000000);
//   var amt = await tokenContract.balanceOf(accounts[1].getAddress());
//   console.log("Amout of PDAO acc1 has:", amt) ;


//   await tokenContract.delegate(accounts[0].getAddress());

  const PrizeDAOGovernorContract = await prizeDAOFactory.deploy(
    tokenContract.address,
    "PrizeDAOGovernor"
  );
  await PrizeDAOGovernorContract.deployed();
  console.log("PrizeDAOGovernorContract address", PrizeDAOGovernorContract.address);

    // var txn = await PrizeDAOGovernorContract.receiveEthForTransactions({
    //     value: ethers.utils.parseEther("5"),
    // });

    // await txn.wait();

    var txn = await tokenContract.setMinterRole(PrizeDAOGovernorContract.address);
    await txn.wait();

    // IMP checking transfer of dai token from 0th account to governor
    // before creating hackathon we will do this only i.e tranfer DAI from sponsors account to governor
    // var txn = await daiContract.transfer(PrizeDAOGovernorContract.address, 10);
    // await txn.wait();

    // var txn = await PrizeDAOGovernorContract.giveApproval( 10,accounts[1].getAddress() );
    // var rc = await txn.wait();
    // const event11111 = rc.events.find(
    //       (event: any) => event.event === "Approval"
    //     );
    // const [approval] = event11111.args;
    // console.log("Approval: ", approval);


    var txn = await PrizeDAOGovernorContract
                    .connect(sponsor)
                    .addSponsor({ value: ethers.utils.parseEther("10") });
    var rc = await txn.wait();
    const event_memberadded = rc.events.find(
          (event: any) => event.event === "SponsorAdded"
        );
    const [new_sponsor] = event_memberadded.args;
    console.log("new_sponsor: ", new_sponsor);


    var balanceOfSponsor = await tokenContract.balanceOf(sponsor.getAddress());
    console.log("Balance Of Sponsor:", utils.formatEther(balanceOfSponsor));

  

    console.log('sponsor approving Governor to spend 100 PDAO');
    await tokenContract.connect(sponsor).approve(PrizeDAOGovernorContract.address, utils.parseEther('100'));
    
    // console.log('sponsor creating a hackathon');
    // const options_add_hackathon = {value: ethers.utils.parseEther("10")}
    // var txn = await PrizeDAOGovernorContract
    //                 .connect(sponsor)
    //                 .add_hackathon( 
    //                             "Test1",
    //                             "2021-01-01",
    //                             "2021-02-01",
    //                             100,
    //                             sponsor.getAddress(),
    //                             tokenContract.address,
    //                             options_add_hackathon
    //                   );
    // var rc = await txn.wait();
    // const event_hackathonCreated = rc.events.find(
    //       (event: any) => event.event === "HackathonCreated"
    //     );
    // const [HackathonId] = event_hackathonCreated.args;
    // console.log("hackathonId: ", HackathonId);

    var HackathonId = await create_hackathon(PrizeDAOGovernorContract,
                                            sponsor, 
                                            "Test 1", 
                                            "2021-01-01",
                                            "2021-02-01", 
                                            100, 
                                            tokenContract.address);


    var hacker_id1 = await register_hacker(PrizeDAOGovernorContract, hacker, "TestHacker1", HackathonId);
    var hacker_id2 = await register_hacker(PrizeDAOGovernorContract, hacker2, "TestHacker2", HackathonId);

    await add_submission_for_hacker(PrizeDAOGovernorContract, hacker, hacker_id1, "xxxxx1", HackathonId);
    await add_submission_for_hacker(PrizeDAOGovernorContract, hacker2, hacker_id2, "xxxxx2", HackathonId);
    
    var proposalId = await make_proposal(PrizeDAOGovernorContract, sponsor, "Hackathon 1", HackathonId);



    var hash1 = await getHash(PrizeDAOGovernorContract, hacker, proposalId, hacker_id1);
    console.log("IPFS HASH of hacker's submission:", hash1);
    
    // // Get CurrentProposalIDf
    var proposal_id = await get_proposal_id(PrizeDAOGovernorContract, sponsor, HackathonId);
    console.log("Proposal id for hackathon id 1:", proposal_id);
    
    
    var block_num = await get_current_block_num(PrizeDAOGovernorContract, sponsor, proposalId);
    console.log("Current block num:", block_num)

    var state = await PrizeDAOGovernorContract.state(proposalId);
    console.log("Current state : ", state);

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
    console.log("Current block num:", blockNum)

    var quorum = await PrizeDAOGovernorContract.quorum(blockNum - 1);
    console.log("quorum : ", utils.formatEther(quorum));

    var state = await PrizeDAOGovernorContract.state(proposalId);
    console.log("state : ", state);


    await cast_vote(PrizeDAOGovernorContract, deployer, proposalId, 1);
    await cast_vote(PrizeDAOGovernorContract, sponsor, proposalId, 0);
  
    var blockNum = await ethers.provider.getBlockNumber();
    console.log("blockNum", blockNum);
    await sleep(3000);
    var state = await PrizeDAOGovernorContract.state(proposalId);
    console.log("state : ", state);

    await moveBlocks(23 + 1);
    var hasVoted = await PrizeDAOGovernorContract.hasVoted(
        proposalId,
        accounts[0].getAddress()
    );
    console.log("hasVoted : ", hasVoted);

    var blockNum = await ethers.provider.getBlockNumber();
    console.log("blockNum", blockNum);

    var state = await PrizeDAOGovernorContract.state(proposalId);
    console.log("state : ", state);
    if (state === 4) {
          const transferCalldata = PrizeDAOGovernorContract.interface.encodeFunctionData(
            "setWinnerAddress",
            [1]
          );
          var txn = await PrizeDAOGovernorContract.execute(
            [PrizeDAOGovernorContract.address],
            [0],
            [transferCalldata],
            ethers.utils.keccak256(
              ethers.utils.toUtf8Bytes("Hackathon 1")
            )
          );
          var rc = await txn.wait();
        //   const e10= rc.events.find(
        //             (event: any) => event.event === "WinnerIs"
        //             );
        //   const [winnerAddress] = e10.args;

        //   const e11= rc.events.find(
        //     (event: any) => event.event === "TotalVotes"
        //     );
        //   const [totalVotes] = e11.args;
        //   console.log("TotalVotes : ", totalVotes);
        //   console.log("winnerAddress : ", winnerAddress);

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
