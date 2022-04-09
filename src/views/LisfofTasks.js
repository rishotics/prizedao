import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function LisfofTasks({ govContract }) {
    const navigate = useNavigate()

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        if(govContract) getTaskData();
    }, [govContract])

    const getTaskData = async () => {
        let hackathonCount = await govContract.hackathonId()
        hackathonCount = hackathonCount.toString()

        let temp = []

        for(let i = 0; i <= +hackathonCount; i++){
            const hackathon = await govContract.hackathonIdToHackathon(i)

            if(hackathon.name[0] === 'i'){
                let harr = hackathon.name.slice(7)
                harr = harr.split("/")
                let data = await fetch(`https://${harr[0]}.ipfs.nftstorage.link/${harr[1]}`)
                data = await data.json()
                let arr = data.image.slice(7)
                arr = arr.split("/")
                data.url = `https://${arr[0]}.ipfs.nftstorage.link/${arr[1]}`
                data.hackathonId = hackathon.hackathonId;
                data.endDate = hackathon.endDate;
                console.log(data)
                temp.push(data);
            }
        }
        setTasks(temp)
    }
    
    return (
        <div className="container">
            <h1 className='mt-2'>
                List of Hackathons
            </h1>

            <div className="row mt-3">
                {tasks.map(task => (
                     <div className="col-sm-12 col-md-6 col-lg-3 mb-3" key={task.hackathonId}>
                        <div className="card">
                            <img src={task.url} className="card-img-top" alt="Cover Photo" />
                            <div className="card-body">
                                <h5 className="card-title">{task.name}</h5>
                                <p className="card-text">
                                    End on {task.endDate}
                                </p>
                                <button className="btn btn-primary" onClick={() => navigate('/task/' + task.hackathonId)}>
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LisfofTasks