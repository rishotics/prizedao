
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {NFTStorage, File} from 'nft.storage'
import { ethers } from 'ethers'
import {creating_hackathon} from './utils';
import Web3Modal from 'web3modal'
// import dotenv from "dotenv";

// dotenv.config({ path: "../env.local" });


// const client = new NFTStorage({ token: NFT_STORAGE_APIKEY })

function CreateHackathon({ethWallet, govContract, pDaoContract}){
    console.log(`ethWallet = ${ethWallet} and govCon= ${govContract}`);
    const navigate = useNavigate();

    const NFT_STORAGE_APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ4NEY4QTdBNjc1OUQxQjc5Nzk2NUE5OGQ4NjIwMTQxZmNmMDY2QmYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1OTEyMjU1ODU0OSwibmFtZSI6IlByaXplREFPIn0.xJbPJv-m75O_bw0rqyW0RUHPgqylJl_vD5pyh4qo1a8';

    const client = new NFTStorage({ token: NFT_STORAGE_APIKEY })

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [prizeMoney, setPrizeMoney] = useState("");
    const [duration, setDuration] = useState("");
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');
    const [sponsor, setSponsor] = useState('');
    const [sponsorAddress, setSponsorAddress] = useState("");

    const getImage = event => {
        const file = event.target.files[0]
        console.log(file)
        setImage(file)
      }


    const create_hackathon = async() => {
        try
        {
            setLoading(true);

            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);  
            setSponsor(provider.getSigner());

            const imageFile = new File([image], image.name, {type: image.type})
            console.log(`Name= ${name}`)
            const metadata = await client.store({
                name: name,
                description: 'abcd',
                image: imageFile
            })
            console.log(metadata);

            const voting_Period = await govContract.votingPeriod();
            console.log(`voting_Period = ${voting_Period}`)

            const pdao_address = await pDaoContract.address;
            console.log(`pdao_address: ${pdao_address}`);

            await creating_hackathon(govContract, sponsor, name, "abcd", "abc",(+prizeMoney * 10 ** 18).toString(),pdao_address);
            
            // const txn = await govContract.add_hackathon(name, 
            //     "abcd", 
            //     "abcd", 
            //     (+prizeMoney * 10 ** 18).toString(), 
            //     sponsorAddress, 
            //     pdao_address, {gasLimit: 1e7}
            //     );
            // const rc = await txn.wait()
            // console.log(`txn create hackathon= ${rc}`);

            setUrl(metadata.url);
            setLoading(false);
        } catch(error){
            console.log(`Error in create_hackathon ${error}`)
            setLoading(false);
        }
    }

    return (
        <div className="createHackthon ">
            <div className="card card-body m-auto mt-3" style={{ maxWidth: "600px"}}>
                <h2>Create Bounty</h2>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input className="form-control" id="name" onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="prize" className="form-label">Prize Amount (MATIC)</label>
                    <input className="form-control" id="prize" onChange={(e) => setPrizeMoney(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="duration" className="form-label">Duration</label>
                    <select className="form-select" aria-label="Default select example" onChange={(e) => setDuration(e.target.value)}>
                        <option >Select Duration</option>
                        <option value="1">24 Hours</option>
                        <option value="2">48 Hours</option>
                        <option value="3">1 Mouth</option>
                        <option value="4">3 Mouths</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="formFileMultiple" className="form-label">
                        Add Image
                    </label>
                    <input className="form-control" type="file" id="formFileMultiple" onChange={getImage} />
                </div>

                <div className="mb-3">
                    <label htmlFor="sponsor-address" className="form-label">Sponsor Address</label>
                    <input className="form-control" id="sponsor-address" onChange={(e) => setSponsorAddress(e.target.value)}/>
                </div>
                
                {
                    !loading
                        ?<button className="btn btn-primary mb-3" onClick={create_hackathon}>
                            Submit
                        </button>
                        : <p>Loading....</p>
                }
                <p>{url}</p>
            </div>
        </div>
    );
}

export default CreateHackathon