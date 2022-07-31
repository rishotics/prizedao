import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {NFTStorage, File} from 'nft.storage'
import { ethers } from 'ethers'
import {creating_hackathon} from './utils';
import Web3Modal from 'web3modal'

function Faucet({govContract, pDaoContract, user}) {

    const [val, setVal] = useState('')
    const [loading, setLoading] = useState(false);
    const [currBal, setCurrBal] = useState(0)

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    useEffect(() => {
        if(pDaoContract) {
            get_balance();
        }
    }, [setCurrBal])



    const get_balance = async () => {
        const address = await user.getAddress();
        const curr_bal = await pDaoContract.balanceOf(address);
        setCurrBal((ethers.utils.formatEther(curr_bal)).toString());
        console.log(`user balance: ${currBal}`)
    }
    
    const get_faucet = async () => {
        setLoading(true)
        try{
            get_balance();

            console.log(`val : ${ethers.utils.parseEther(val)}`)
            const txn = await govContract.addSponsor(
                {
                    value: ethers.utils.parseEther(val),
                    gasLimit: 1e7
                });
            txn.wait();
            get_balance();
            setLoading(false);
        } catch(error){
            console.log(`Error in getting PDAO token: ${error}`)
            setLoading(false);
        }
        
    }

    return(
        <div className="getfaucet">
            <div className="card card-body m-auto mt-3" style={{ maxWidth: "600px"}}>
                <h2>Get Faucet</h2>
                <div className="mb-3">
                    <label htmlFor="val" className="form-label">Value Min val=0.001</label>
                    <input className="form-control" id="val" onChange={(e) => setVal(e.target.value)}/>
                </div>
                {
                    !loading
                        ?<button className="btn btn-primary mb-3" onClick={get_faucet}>
                            Claim
                        </button>
                        : <p>Loading...</p>
                }
                <button className="btn btn-primary mb-3" onClick={get_balance}>
                    Get current balance
                </button>
                <p>Your PDAO balance: {currBal} PDAO</p>
            </div>
        </div>
    );
    
}

export default Faucet;