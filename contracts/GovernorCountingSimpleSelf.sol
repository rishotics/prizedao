// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (governance/extensions/GovernorCountingSimple.sol)

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @dev Extension of {Governor} for simple, 3 options, vote counting.
 *
 * _Available since v4.3._
 */
abstract contract GovernorCountingSimpleSelf is Governor {
    /**
     * @dev Supported vote types. Matches Governor Bravo ordering.
     */
    enum VoteType {
        Against,
        For,
        Abstain
    }
    using Counters for Counters.Counter;
    Counters.Counter public hackathonId;
    Counters.Counter public hackerId;
    
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
    }

    mapping ( uint256 => Hackathon ) public hackathonIdToHackathon;
    mapping ( uint256 => Hackathon ) public hackerIdToHackathon;
    mapping ( uint256 => uint256 ) public ProposalIdToHackathonId;

    event HackathonCreated(uint256 HackathonId);
    event HackerRegisted(uint256 HackerId);
    event SubmissionDone(uint256 HackerId);
    event HackathonEvent( Hackathon hackathon);


    struct ProposalVote {
        // uint256 againstVotes;
        // uint256 forVotes;
        // uint256 abstainVotes;
        uint256 [] hackerIdToVotesGot;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => ProposalVote) private _proposalVotes;


    function add_hackathon(
        string memory _name, 
        string memory _startDate,
        string memory _endDate, 
        uint _prizeMoney
        ) 
    public 
    returns (uint) {
                hackathonId.increment();

                Hackathon storage hackathon = hackathonIdToHackathon[hackathonId.current()];
                
                hackathon.hackathonId= hackathonId.current();
                hackathon.name= _name;
                hackathon.prizeMoney= _prizeMoney;
                hackathon.startDate= _startDate;
                hackathon.endDate= _endDate;
                emit HackathonCreated(hackathonId.current());
                return hackathon.hackathonId;
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
            Hacker memory hacker;
            
            hackerId.increment();
            hacker.hackerId = hackerId.current();
            hacker.hackerAdd = msg.sender;
            hacker.name = _name;
            hackathonIdToHackathon[_hackathonId].hackers.push(hacker);
            emit HackerRegisted(hackerId.current());
            emit HackathonEvent(hackathonIdToHackathon[_hackathonId]);
            return hacker.hackerId;
    }



    /**
     * @dev check if a user has registered for a hackathon
     */
    function hasHackerRegistedForHackathon(
        uint _hackathonId
        ) public view returns (bool){
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
     * @dev Accessor to the internal vote counts.
     */
    // function proposalVotes(uint256 proposalId)
    //     public
    //     view
    //     virtual
    //     returns (
    //         uint256 againstVotes,
    //         uint256 forVotes,
    //         uint256 abstainVotes
    //     )
    // {
    //     ProposalVote storage proposalvote = _proposalVotes[proposalId];
    //     return (proposalvote.againstVotes, proposalvote.forVotes, proposalvote.abstainVotes);
    // }
    
    /**
     * @dev See {Governor-_quorumReached}.
     */
    function _quorumReached(uint256 proposalId) internal view virtual override returns (bool) {
        // ProposalVote storage proposalvote = _proposalVotes[proposalId];
        // uint256 totalVotesCasted = 0;
        // for(uint i=0;i<)
        return true;
        // return quorum(proposalSnapshot(proposalId)) <= proposalvote.forVotes + proposalvote.abstainVotes;
    }

    /**
     * @dev See {Governor-_voteSucceeded}. In this module, the forVotes must be strictly over the againstVotes.
     */
    function _voteSucceeded(uint256 proposalId) internal view virtual override returns (bool) {
        // ProposalVote storage proposalvote = _proposalVotes[proposalId];
        return true;
        // return proposalvote.forVotes > proposalvote.againstVotes;
    }

    function _mapProposalIdToHackathonId(uint256 _hackathonId, uint256 _proposalId) 
    internal {
        ProposalIdToHackathonId[_proposalId] = _hackathonId;
    }


    function _setWinnerAddress(uint256 _hackathonId) 
    view 
    internal 
    returns(address, uint256){
        Hackathon storage hackathon = hackathonIdToHackathon[_hackathonId];

        Hacker[] storage hackers = hackathon.hackers;
        uint256 winnerVotes = 0;
        address winnerAdd = address(0);

        for (uint256 i = 1; i < hackers.length ; i++){
            if(hackers[i].votesGot > winnerVotes ){
                winnerVotes = hackers[i].votesGot;
                winnerAdd = hackers[i].hackerAdd;
            }
        }
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
         
        if (support < hcks.length ){
            hcks[support].votesGot += weight;
        }
        else{
            revert("GovernorVotingSimple: invalid value for enum VoteType");
        }
        
        
        // if (support == 0) {
        //     proposalvote.againstVotes += weight;
        // } else if (support == 1) {
        //     proposalvote.forVotes += weight;
        // } else if (support == 2) {
        //     proposalvote.abstainVotes += weight;
        // } else {
        //     revert("GovernorVotingSimple: invalid value for enum VoteType");
        // }
    }
}
