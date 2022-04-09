import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function LisfofTasks() {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        getTaskData();
    }, [])

    const getTaskData = async () => {
        let data = await fetch("https://bafyreigk6nckyppnusy6gksyh2hoymi4ni4adu5tzaogqx5e5tvkuzqkxq.ipfs.dweb.link/metadata.json")
        data = await data.json()
        let arr = data.image.slice(7)
        arr = arr.split("/")
        data.url = `https://${arr[0]}.ipfs.nftstorage.link/${arr[1]}`
        console.log(data)
        setTasks([data])
    }
    
    return (
        <div className="container">
            <div className="row mt-3">
                {tasks.map(task => (
                     <div className="col-sm-12 col-md-6 col-lg-3 mb-3" key="1">
                        <div className="card">
                            <img src={task.url} className="card-img-top" alt="Cover Photo" />
                            <div className="card-body">
                                <h5 className="card-title">{task.name}</h5>
                                <p className="card-text">
                                    {task.description}
                                </p>
                                <button className="btn btn-primary" onClick={() => navigate('/task')}>
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