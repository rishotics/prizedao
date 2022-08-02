import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {NFTStorage, File} from 'nft.storage'
import { ethers } from 'ethers'
import {creating_hackathon} from './utils';
import Web3Modal from 'web3modal'
import {GOVERNOR_CONTRACT_ADDRESS} from './utils'

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
        }
    },[govContract])

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
                        
                        {proposalId && <button className="btn btn-primary" onClick={makeProposal}>
                                Make Proposal
                        </button>}
                    </div>

                </div>



        </div>
    )
}

export default HackathonDetail