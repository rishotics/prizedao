import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { GOVERNOR_CONTRACT_ADDRESS } from '../config'

function TaskDetail({ govContract, pDaoContract, ethWallet, daiContract }) {
    const { id } = useParams()
    const navigate = useNavigate()

    const [task, setTask] = useState({})
    const [submissions, setSubmissions] = useState([])
    const [isRegisted, setIsRegisted] = useState(false)
    const [userId, setUserId] = useState('')
    const [loading, setLoading] = useState(false)
    const [daiBalance, setDaiBalance] = useState('')
    const [pDaoBalance, setpDaoBalance] = useState('')
    const [amount, setAmount] = useState('')

    useEffect(() => {
        if(govContract) {
            getTaskData()
            getSubmission()
            getIfRegistedForHackathon()
        }
    }, [govContract])

    useEffect(() => {
        if(daiContract) {
            getDaiBalance()
        }
        if(pDaoContract) {
            getPDAOBalance()
        }
    }, [daiContract, pDaoContract])

    useEffect(() => {
        
    }, [pDaoContract])

    const getDaiBalance = async () => {
        const a = await daiContract.balanceOf(ethWallet)
        console.log(a.toString())
        setDaiBalance(a.toString())
    }

    const getPDAOBalance = async () => {
        console.log("eeeed")
        const b = await pDaoContract.balanceOf(ethWallet)
        console.log(b.toString(),  "eeeed")
        setpDaoBalance(b.toString())
    }

    const getTaskData = async () => {
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
        setTask(data)
    }

    const getSubmission = async () => {
        const proposalId = await govContract.getProposalId(id)
        console.log(proposalId.toString())

        // const res = await govContract.getHackerSubmission(proposalId.toString(), id)
        // console.log(res)

        let data = await fetch("https://bafybeieaedrdbe2ve3ym766qiggnvzrifwbf6cfuzizlxplnncuuxtcciu.ipfs.dweb.link/metadata.json")
        data = await data.json()
        console.log(data)
        setSubmissions([data])
    }

    const getIfRegistedForHackathon = async () => {
        const res = await govContract.hasHackerRegistedForHackathon(id)
        console.log(res)
        setIsRegisted(res)

        const userId = await govContract.hackerId()
        console.log(userId.toString())
        setUserId(userId)
    }

    const registerForHackathon = async () => {
        setLoading(true)

        // string memory _name,
        // uint _hackathonId
        const transaction = await govContract.register_hacker("Guest", id)
        const tx = await transaction.wait()
        console.log(tx)

        setIsRegisted(true)
        setLoading(false)
    }

    const swap = async () => {
        const transaction1 = await daiContract.approve(GOVERNOR_CONTRACT_ADDRESS, (+amount * 10 ** 18).toString())
        const tx1 = await transaction1.wait()
        console.log(tx1)

        const transaction2 = await govContract.addMember((+amount * 10 ** 18).toString())
        const tx2 = await transaction2.wait()
        console.log(tx2)

        await getDaiBalance()
        //await getPDAOBalance()
    }

    const makeProposal = async () => {
        const transferCalldata = await govContract.interface.encodeFunctionData(
            "setWinnerAddress",
            [1]
        )

        var txn = await govContract.createProposal(
            [GOVERNOR_CONTRACT_ADDRESS],
            [0],
            [transferCalldata],
            "Hackathon 1",
            4
            );
        var rc = await txn.wait();
        const e = rc.events.find(
            (event) => event.event === "ProposalCreated"
            );
        const [proposalId] = e.args;
        console.log("Proposal Id: ", proposalId.toString())
    }

    return (
        <div className='container'>
            <div className="card mt-3">
                <div className='row'>
                    <div className="col-sm-12 col-md-6 mb-3">
                        <div className="card-body mt-3">
                            <h1 className="card-title">{task.name}</h1>
                            <p className="card-text">
                                {task.description}
                            </p>
                            <p className="card-text">
                                Prize: {task.prizeMoney / 10 ** 18} MATIC
                            </p>
                            <p className="card-text">
                                End Date: {task.endDate}
                            </p>
                            {isRegisted
                                ? <button className="btn btn-primary" onClick={() => navigate(`/create-submission/${task.hackathonId}/${userId}`)}>
                                    Submit your Submission
                                </button>
                                : !loading
                                    ? <button className="btn btn-primary" onClick={registerForHackathon}>
                                        Register for Hackathon
                                    </button>
                                    : <p>Loading...</p>
                            }
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 mb-3">
                        <img className='mt-4' src={task.url} style={{ width: '400px'}} alt="Cover Photo" />
                    </div>
                </div>
            </div>

            <h2 className='text-center mt-1'>Submissions</h2>
            <div className="row mt-3">
                {submissions.map(submission => (
                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3" key="1">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{submission.name}</h5>
                                <p className="card-text">
                                    {submission.githubURL}
                                </p>
                                <p className="card-text">
                                    {submission.videoURL}
                                </p>
                                <button className="btn btn-primary" onClick={makeProposal}>
                                    Vote
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className='text-center mt-1'>Governor</h2>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Get PDAO</h5>
                    <div className='row'>
                        <div className="col-sm-12 col-md-6">
                        <p>Your DAI balance is {daiBalance / 10 ** 18}</p>
                        {/* <p>Your PDAO balance is {pDaoBalance / 10 ** 18}</p> */}
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">DAI amount to swap for PDAO (1 DAI = 1 PDAO)</label>
                                <input className="form-control" id="name" onChange={(e) => setAmount(e.target.value)}/>
                            </div>
                        
                            <button className="btn btn-primary" onClick={swap}>
                                Swap
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskDetail