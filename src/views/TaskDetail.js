import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function TaskDetail({ govContract, pDaoContract }) {
    const { id } = useParams()
    const navigate = useNavigate()

    const [task, setTask] = useState({})
    const [submissions, setSubmissions] = useState([])
    const [isRegisted, setIsRegisted] = useState(false)
    const [userId, setUserId] = useState('')

    useEffect(() => {
        if(govContract) {
            getTaskData()
            getSubmission()
            getIfRegistedForHackathon()
        }
    }, [govContract])

    const getTaskData = async () => {
        const hackathon = await govContract.hackathonIdToHackathon(id)
        console.log(hackathon)
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
        console.log(data)
        setTask(data)
    }

    const getSubmission = async () => {
        let data = await fetch("https://bafybeieaedrdbe2ve3ym766qiggnvzrifwbf6cfuzizlxplnncuuxtcciu.ipfs.dweb.link/metadata.json")
        data = await data.json()
        console.log(data)
        setSubmissions([data])

        const res = await pDaoContract._daiToken()
        console.log(res)
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
        // string memory _name,
        // uint _hackathonId
        const transaction = await govContract.register_hacker("Guest", id)
        const tx = await transaction.wait()
        console.log(tx)

        setIsRegisted(true)
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
                                : <button className="btn btn-primary" onClick={registerForHackathon}>
                                    Register for Hackathon
                                </button>
                            }
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 mb-3">
                        <img className='mt-4' src={task.url} style={{ width: '400px'}} alt="Cover Photo" />
                    </div>
                </div>
            </div>

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
                                <button className="btn btn-primary">
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

export default TaskDetail