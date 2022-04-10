// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @dev Extension of {Governor}. Adapted from OpenZepplin and modified to our use case
 */
abstract contract GovernorCountingSimpleSelf is Governor{
    
    using Counters for Counters.Counter;
    Counters.Counter public hackathonId;
    Counters.Counter public hackerId;
    using SafeMath for uint256;
    
    struct Hacker{
        uint256 hackerId;
        address hackerAdd;
        string name;
        string ipfsHash;
        uint256 votesGot;
    }

    struct Hackathon{
        uint hackathonId;
        string name;
        uint prizeMoney;
        Hacker[] hackers;
        string startDate;
        string endDate;
        uint256 proposalId;
        address sponsorAddress;
        uint256 blockNum;
    }

    struct ProposalVote {
        uint256 [] hackerIdToVotesGot;
        mapping(address => bool) hasVoted;
    }

    mapping ( uint256 => Hackathon ) public hackathonIdToHackathon;
    mapping ( uint256 => Hackathon ) public hackerIdToHackathon;
    mapping ( uint256 => uint256 ) public ProposalIdToHackathonId;
    mapping ( uint256 => bool ) proposalState;
    mapping(uint256 => ProposalVote) private _proposalVotes;

    event HackathonCreated(uint256 HackathonId);
    event HackerRegisted(uint256 HackerId);
    event SubmissionDone(uint256 HackerId);
    event HackathonEvent( Hackathon hackathon);
    event HackerIpfsSubmission( string hackerIpfsSubmission);
    event CurrentProposalID( uint256 currentProposalID);
    event TotalVotes ( uint256 totalVotes);
    event NoHackerWon(uint256 TotalVotesLastOptionGot);
    event WinnerIs( address winnerAddress);
    event NumOfHackers( uint256 numOfHackers);
    event VotesPresent( uint256 votesPresent);

    function add_hackathon(
        string memory _name, 
        string memory _startDate,
        string memory _endDate, 
        uint _prizeMoney,
        address payable _sponsorAddress
        ) 
    public 
    returns (uint) 
    {
                hackathonId.increment();

                Hackathon storage hackathon = hackathonIdToHackathon[hackathonId.current()];
                
                hackathon.hackathonId= hackathonId.current();
                hackathon.name= _name;
                hackathon.prizeMoney= _prizeMoney;
                hackathon.startDate= _startDate;
                hackathon.endDate= _endDate;
                hackathon.sponsorAddress = _sponsorAddress;
                emit HackathonCreated(hackathonId.current());
                return hackathon.hackathonId;
    }


    function hackerHasRegisteredBefore(uint256 _hackathonId)
    public
    returns(bool){
        Hackathon storage hackathon = hackathonIdToHackathon[_hackathonId];
        Hacker[] storage hackers = hackathon.hackers;
        for(uint256 i =0; i<hackers.length; i++){
            if(hackers[i].hackerAdd == msg.sender){
                return true;
            }
        }
        return false;
        
    }


    // /**
    //  * @dev Register new hacker 
    //  */
    function register_hacker(
        string memory _name,
        uint _hackathonId
    ) 
    public
    returns(uint256){
            // require(!hackerHasRegisteredBefore(_hackathonId), "You are already registerd"); 
            Hacker memory hacker;      
            hackerId.increment();
            hacker.hackerId = hackerId.current();
            hacker.hackerAdd = msg.sender;
            hacker.name = _name;
            hackathonIdToHackathon[_hackathonId].hackers.push(hacker);
            emit HackerRegisted(hackerId.current());
            // emit HackathonEvent(hackathonIdToHackathon[_hackathonId]);
            return hacker.hackerId;
    }



    /**
     * @dev check if a user has registered for a hackathon
     */
    function hasHackerRegistedForHackathon(uint _hackathonId) 
    public 
    view 
    returns (bool){
            bool result = false;
            Hacker[] storage hackers = hackathonIdToHackathon[_hackathonId].hackers;
            uint numOfHackers = hackers.length;
            for(uint i = 0; i < numOfHackers; i++){
                if(hackers[i].hackerAdd == msg.sender){
                    result = true;
                    break;
                }
            }
            return result;
    }


    /**
     * @dev Add new submission
     */
    function add_submission(
        uint256 _hackerId,
        string memory _ipfsHash,
        uint256 _hackathonId
    ) public {
        
        require(hasHackerRegistedForHackathon(_hackathonId), "Hacker NOT registered! Please register yourself");
        Hacker[] storage hackers = hackathonIdToHackathon[_hackathonId].hackers;
        for (uint i = 0; i< hackers.length; i++){
            if(hackers[i].hackerId == _hackerId){
                Hacker storage hacker = hackers[i];
                hacker.ipfsHash = _ipfsHash;
                break;
            }
        }
        emit SubmissionDone(_hackerId);
    }

    function _getHackerSubmission(uint256 _proposalId, uint256 _hackerId)
    internal
    view
    returns(string memory){
        string memory submissionIpfsHash;
        Hackathon memory hackathon = hackathonIdToHackathon[ProposalIdToHackathonId[_proposalId]];
        Hacker[] memory hackers = hackathon.hackers;
        for (uint256 i = 0; i <= hackers.length; i ++){
            if(hackers[i].hackerId == _hackerId){
                submissionIpfsHash = hackers[i].ipfsHash;
                break;
            }
        }
        // emit HackerIpfsSubmission(submissionIpfsHash);
        return submissionIpfsHash;
    }


    /**
     * @dev See {IGovernor-COUNTING_MODE}.
     */
    // solhint-disable-next-line func-name-mixedcase
    function COUNTING_MODE() public pure virtual override returns (string memory) {
        return "support=bravo&quorum=for,abstain";
    }

    /**
     * @dev See {IGovernor-hasVoted}.
     */
    function hasVoted(uint256 proposalId, address account) public view virtual override returns (bool) {
        return _proposalVotes[proposalId].hasVoted[account];
    }

    
    /**
     * @dev See {Governor-_quorumReached}.
     */
    function _quorumReached(uint256 proposalId) internal view virtual override returns (bool) {
        return true;
    }

    /**
     * @dev See {Governor-_voteSucceeded}. In this module, the forVotes must be strictly over the againstVotes.
     */
    function _voteSucceeded(uint256 proposalId) internal view virtual override returns (bool) {
        return true;
    }

    function _addNoneOfTheseHacker(uint256 _hackathonId)
    internal{
        uint256 hackerId = register_hacker("NoneOfTheAbove", _hackathonId);
        add_submission(hackerId, "x", _hackathonId);
    }

    function _mapProposalIdToHackathonId(uint256 _hackathonId, uint256 _proposalId) 
    internal {
        ProposalIdToHackathonId[_proposalId] = _hackathonId;
        hackathonIdToHackathon[_hackathonId].proposalId = _proposalId;
        hackathonIdToHackathon[_hackathonId].blockNum = block.number;

    }



    function _getProposalId(uint256 _hackathonId)
    internal
    view
    returns(uint256){
        return hackathonIdToHackathon[_hackathonId].proposalId;
    }


    function _getBlockNumber(uint256 _proposalId)
    internal
    view
    returns(uint256){
        return hackathonIdToHackathon[ProposalIdToHackathonId[_proposalId]].blockNum;
    }


    function _setWinnerAddress(uint256 _hackathonId)  
    internal 
    returns(address, uint256){
        Hackathon storage hackathon = hackathonIdToHackathon[_hackathonId];

        Hacker[] storage hackers = hackathon.hackers;
        uint256 winnerVotes = 0;
        uint256 totalVotes = 0;
        address winnerAdd = address(0);

        for (uint256 i = 1; i < hackers.length -1 ; i++){
            totalVotes += hackers[i].votesGot;
            if(hackers[i].votesGot > winnerVotes){
                winnerVotes = hackers[i].votesGot;
                winnerAdd = hackers[i].hackerAdd;
            }
        }
        // emit TotalVotes(totalVotes);
        // emit VotesPresent(hackers[1].votesGot);
        
        // If None of these which is last option got more than equal to 60% votes sponsors get their money back
        if (hackers[hackers.length-1].votesGot >= totalVotes.div(5).mul(3)){
            emit NoHackerWon(hackers[hackers.length-1].votesGot);
            winnerAdd = hackathon.sponsorAddress;
        }
        // emit WinnerIs(winnerAdd);
        return  (winnerAdd, hackathon.prizeMoney*10);
    }

    /**
     * @dev See {Governor-_countVote}. In this module, the support follows the `VoteType` enum (from Governor Bravo).
     */
    function _countVote(
        uint256 proposalId,
        address account,
        uint8 support,
        uint256 weight
    ) internal virtual override {
        ProposalVote storage proposalvote = _proposalVotes[proposalId];
        
        require(!proposalvote.hasVoted[account], "GovernorVotingSimpleSelf: vote already cast");
        proposalvote.hasVoted[account] = true;

        uint256 hId = ProposalIdToHackathonId[proposalId];
        Hackathon storage hackathon = hackathonIdToHackathon[hId];

        Hacker[] storage hcks = hackathon.hackers;
        emit HackathonEvent(hackathon);
        emit NumOfHackers(hcks.length);
         
        //  when support == hcks.length i.e last element which is None of These.
        if (support <= hcks.length ){
            hcks[support].votesGot += weight;
            emit VotesPresent(hcks[support].votesGot);
        }
        else{
            revert("GovernorVotingSimple: invalid value for enum VoteType");
        }
     
    }
}
