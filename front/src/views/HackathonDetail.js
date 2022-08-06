import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {NFTStorage, File} from 'nft.storage'
import { ethers } from 'ethers'
import {creating_hackathon} from './utils';
import Web3Modal from 'web3modal'
import {GOVERNOR_CONTRACT_ADDRESS} from './utils'


const CastVote = (props) => {
    <button className="btn btn-primary" onClick={() => props.onClick(props.choice)}>
        Vote
    </button>
    
}

function HackathonDetail({pDaoContract, ethWallet, govContract}) {
    const { id } = useParams()
    const navigate = useNavigate()
    const [hackerName, setHackerName] = useState('')
    const [userId, setUserId] = useState('');
    const [isRegisted, setIsRegistered] = useState(false);
    const [hack, setHack] = useState({})
    const [loading, setLoading] = useState(false);
    const [proposalId, setProposalId] = useState(0);
    const [hackers, setHackers] = useState([]);
    const [votingState, setVotingState] = useState(-1);

    useEffect(()=>{
        if(govContract){
            getHackathonData();
            getIfRegistedForHackathon();
            getHackers();
        }
    },[govContract])

    const ifProposalNotMade = proposalId == 0;
    const ifProposalMadeAndReadyToVote = proposalId >0 && votingState == 1;


    const getHackers = async() => {
        const h = await govContract.getHackersIdsForHackathon(id);
        console.log('Hackers ids')
        console.log(h.toString())
        const h1 = h[2].toString();
        console.log(`h1: ${h1}`)
        for(let i=1;i <= +h1; i++){
            const de = await govContract.getHackerList(i);
            console.log(`details`)
            console.log(de)
        }
        const temp = []
        const hcks = {
            "name": "H1",
            "hackerId": "1",
            "ipfsHash": "dqsawd",
            "hackerAdd": "0x1AEb23bdC154f227De6b009936e1eBc0D4a9db20"
          }
        
        const hcks2 = {
            "name": "H2",
            "hackerId": "2",
            "ipfsHash": "ajnfao",
            "hackerAdd": "0x1AEb23bdC154f227De6b009936e1eBc0D4a9db21"
          }

        temp.push(hcks);
        temp.push(hcks2);
        setHackers(temp);
        
        hackers.map((hacker) => (
            console.log(`Hacker name: ${hacker.name}`)
            
        ))
    }

    const getIfRegistedForHackathon = async () => {
        const res = await govContract.hasHackerRegistedForHackathon(id)
        console.log(res)
        setIsRegistered(res)

        const userId = await govContract.hackerId()
        console.log(userId.toString())
        setUserId(userId);

        const pid = await govContract.getProposalId(id);
        console.log(`pid: ${pid}`);
        setProposalId(pid);

        if (pid>0){
            const temp_hackathon = await govContract.hackathonIdToHackathon(id);
            console.log(`hackathon: ${temp_hackathon.hackers}`);

            const v = await govContract.state(pid);
            console.log(`proposal state: ${v}`)
            setVotingState(v);
        }
    }

    const getHackathonData = async () => {
        const hackathon = await govContract.hackathonIdToHackathon(id)
        let harr = hackathon.name.slice(7)
        harr = harr.split("/")

        let data = await fetch(`https://${harr[0]}.ipfs.nftstorage.link/${harr[1]}`)
        data = await data.json()
        let arr = data.image.slice(7)
        arr = arr.split("/")
        data.url = `https://${arr[0]}.ipfs.nftstorage.link/${arr[1]}`
        data.prizeMoney = hackathon.prizeMoney.toString()
        data.endDate = hackathon.endDate;
        data.hackathonId = hackathon.hackathonId.toString()
        setHack(data)
        // const txn = await govContract.register_hacker(hackerName, id);
    }

    const register_hacker = async () => {
        setLoading(true)

        // string memory _name,
        // uint _hackathonId
        const transaction = await govContract.register_hacker("Guest", id)
        const tx = await transaction.wait()
        console.log(tx)

        setIsRegistered(true)
        setLoading(false)
    }

    const makeProposal = async () => {
        const transferCalldata = await govContract.interface.encodeFunctionData(
            "setWinnerAddress",
            [id]
        )

        var txn = await govContract.createProposal(
            [GOVERNOR_CONTRACT_ADDRESS],
            [0],
            [transferCalldata],
            "Hackathon 1",
            id
            );
        var rc = await txn.wait();
        const e = rc.events.find(
            (event) => event.event === "ProposalCreated"
            );
        const [proposalId] = e.args;
        console.log("Proposal Id: ", proposalId.toString())
    }

    const voteForHim = async(choice) => {
        if(proposalId > 0){
            console.log(`Voting for : ${choice}`)
            var txn = await govContract.castVote(proposalId, choice);
            await txn.wait()   
        } else {
            console.log(`Proposal Not made`)
        }
    }


    

    return(
        
        <div className="container">
            <h1>Details</h1>
            <div className="card mt-3">
                    <div className="card-body mt-3">
                            <h1 className="card-title">{hack.name}</h1>
                            <p className="card-text">
                                {hack.description}
                            </p>
                            <p className="card-text">
                                Prize: {hack.prizeMoney / 10 ** 18} MATIC
                            </p>
                            <p className="card-text">
                                End Date: {hack.endDate}
                            </p>
                            {
                                isRegisted
                                    ? <button  onClick={() => navigate(`/create-submission/${hack.hackathonId}/${userId}`)}>
                                        Create Submission
                                    </button>
                                    : !loading
                                        ? <button onClick={register_hacker}>
                                            Register
                                        </button>
                                        : <p>Loading...</p>
                            }
                    </div>

                    <div className="col-sm-12 col-md-6 mb-3">
                        <img className='mt-4' src={hack.url} style={{ width: '400px'}} alt="Cover Photo" />
                    </div>
            </div>


            <h2 className='text-center mt-1'>Governor</h2>
                <div className="card mb-5">
                    <div className="card-body">
                        
                        {ifProposalNotMade && <button className="btn btn-primary" onClick={makeProposal}>
                                Make Proposal
                        </button>}
                    </div>
                </div>
                    <div className="row mt-3">
                        {hackers.map(hacker => (
                            <div className="col-sm-12 col-md-6 col-lg-3 mb-3" key={hacker.hackerId}> 
                                <div className="card"> 
                                    <div className="card-body"> 
                                        <h5 className="card-title">{hacker.name}</h5>
                                        <p className="card-text">
                                            Hacker Submission: {hacker.ipfsHash}   
                                        </p>
                                        <button className="btn btn-primary" onClick={() => voteForHim(hacker.hackerId)}>
                                            Vote
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
        </div>
    )
}

export default HackathonDetail