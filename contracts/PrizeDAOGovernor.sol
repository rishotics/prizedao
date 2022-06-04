// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
// import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "contracts/GovernorCountingSimpleSelf.sol";
import "contracts/PDAOToken.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "hardhat/console.sol";

interface ERC20Interface {
    function mint(address to, uint256 amount) external;
}

/// @custom:security-contact viral.sangani2011@gmail.com
contract PrizeDAOGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimpleSelf,
    GovernorVotes,
    GovernorVotesQuorumFraction
{
    address _governanceToken;

    PDAOToken _pdao_token;

    mapping(string => address) public acceptedProposal;
    mapping(address => uint256) sponsorsToAmount;

    event SponsorAdded(address new_sponsor);


    address winnerAddress = address(0);

    constructor(
        ERC20Votes _token,
        string memory _name
    )
        Governor(_name)
        GovernorSettings(
            0, /* 0 block by default for testing */
            25, /* 15 sec */
            0
        )
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
    {
        // _daiToken = _tokenToAccept;
        _pdao_token = PDAOToken(address(_token));
    }

    function addSponsor() public payable {
        require(msg.value >= 10 ether, "please send atleast 10 MATIC");
        _pdao_token.mint(msg.sender, msg.value * 10);
        sponsorsToAmount[msg.sender] = msg.value * 10;
        emit SponsorAdded(msg.sender);
    }

    function setWinnerAddress(uint256 _hackathonId) public {
        uint256 amount;
        (winnerAddress, amount) = _setWinnerAddress(_hackathonId);
        disburseIncentive(amount, winnerAddress);
    }

    function createProposal(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        uint256 hackathonId
    ) public returns (uint256) {
        _addNoneOfTheseHacker(hackathonId);
        uint256 proposalId = propose(targets, values, calldatas, description);
        _mapProposalIdToHackathonId(hackathonId, proposalId);
        return proposalId;
    }

    function disburseIncentive(uint256 _amount, address _user) public {
        require(winnerAddress != address(0), "Proposal not accepted");
        ERC20Interface(_governanceToken).mint(address(_user), _amount * 10);
    }

    function receiveEthForTransactions() public payable {
        require(msg.value >= 1 ether, "Minimum 1 ether required");
        console.log("Received ==> ", msg.value);
    }

    function getHackerSubmission(uint256 _proposalId, uint256 _hackerId)
        public
        view
        returns (string memory)
    {
        return _getHackerSubmission(_proposalId, _hackerId);
    }

    function getProposalId(uint256 _hackathonId) public view returns (uint256) {
        return _getProposalId(_hackathonId);
    }

    function getBlockNumber(uint256 _proposalId) public view returns (uint256) {
        return _getBlockNumber(_proposalId);
    }

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function getVotes(address account, uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotes)
        returns (uint256)
    {
        return super.getVotes(account, blockNumber);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }
}
