import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {NFTStorage, File} from 'nft.storage'
import { ethers } from 'ethers'
import {creating_hackathon} from './utils';
import Web3Modal from 'web3modal'


function ListHackathons ({govContract, currHackId, serCurrHackId}){
    const navigate = useNavigate();
    const [hacks, setHacks] = useState([])
    useEffect(()=> {
        if(govContract){
            listings();
        }
    },[govContract])
    
    const listings = async () => {
        
        let temp = [];

        let hackathon_count = await govContract.hackathonId();
        hackathon_count = hackathon_count.toString();
        console.log(`Hack count: ${hackathon_count}`)
        for (let i =1;i <= +hackathon_count; i++){
            const hackathon = await govContract.hackathonIdToHackathon(i);

            // console.log(`Hackathon i= ${i}: ${hackathon.name[0]}`);
            if (hackathon.name[0] === 'i'){
                console.log(`hackathon.name = ${hackathon.name}`)
                let harr = hackathon.name.slice(7);
                console.log(`harr 2 = ${harr}`)
                harr = harr.split("/")
                console.log(`harr 3 = ${harr}`)
                let data = await fetch(`https://${harr[0]}.ipfs.nftstorage.link/${harr[1]}`);
                console.log(data);
                data = await data.json()
                let arr = data.image.slice(7);
                arr = arr.split("/")
                data.url = `https://${arr[0]}.ipfs.nftstorage.link/${arr[1]}`
                data.hackathonId = hackathon.hackathonId;
                data.endDate = hackathon.endDate;
                console.log(data);
                temp.push(data);
            }
            setHacks(temp)
        }
    }

    return (
        <div className="container">
            <h1 className='mt-2'>
                List of Hackathons
            </h1>
            <div className="row mt-3">
                {hacks.map(hack => (
                    <div className="col-sm-12 col-md-6 col-lg-3 mb-3" key={hack.hackathonId}>
                        <div className="card">
                            <img src={hack.url} className="card-img-top" alt="Cover Photo"/>
                            <div className="card-body">
                                <h5 className="card-title">{hack.name}</h5>
                                <p className="card-text">
                                    End on {hack.endDate}
                                </p>
                                <button className="btn btn-primary" onClick={() => 
                                        navigate('hackathons/'+hack.hackathonId)
                                    }>
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {
                hacks.length > 0
                ?<h4 className='mt-2'>
                    Apply soon!
                    </h4>
                :<h4 className='mt-2'>
                    No active hackathons!
                    </h4>
            }
        </div>
    );

}

export default ListHackathons