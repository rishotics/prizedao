import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function TaskDetail() {
    const navigate = useNavigate();

    const [task, setTask] = useState({});
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        getTaskData()
        getSubmission()
    }, [])

    const getTaskData = async () => {
        let data = await fetch("https://bafyreigk6nckyppnusy6gksyh2hoymi4ni4adu5tzaogqx5e5tvkuzqkxq.ipfs.dweb.link/metadata.json")
        data = await data.json()
        let arr = data.image.slice(7)
        arr = arr.split("/")
        data.url = `https://${arr[0]}.ipfs.nftstorage.link/${arr[1]}`
        console.log(data)
        setTask(data)
    }

    const getSubmission = async () => {
        let data = await fetch("https://bafybeieaedrdbe2ve3ym766qiggnvzrifwbf6cfuzizlxplnncuuxtcciu.ipfs.dweb.link/metadata.json")
        data = await data.json()
        console.log(data)
        setSubmissions([data])
    }

    return (
        <div className='container'>
            <div className="card" style={{ height: '50vh'}}>
                <div className='row'>
                    <div className="col-sm-12 col-md-6 mb-3">
                        <div className="card-body mt-5">
                            <h1 className="card-title">{task.name}</h1>
                            <p className="card-text">
                                {task.description}
                            </p>
                            <p className="card-text">
                                Price: 0.2 ETH
                            </p>
                            <p className="card-text">
                                Duration: 1 Week
                            </p>
                            <button className="btn btn-primary" onClick={() => navigate('/create-submission')}>
                                Submit your Submission
                            </button>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 mb-3">
                        <img src={task.url}  style={{ width: '400px'}} alt="Cover Photo" />
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
        </div>
    )
}

export default TaskDetail