import React from 'react'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

import { COVALENT_APIKEY, GOVERNOR_CONTRACT_ADDRESS } from '../../config'
import GovernorCountingSimpleSelf from '../../artifacts/contracts/GovernorCountingSimpleSelf.sol/GovernorCountingSimpleSelf.json';

function Navbar({ ethWallet, setEthWallet, maticBalance, setmaticBalance, setGovContract }) {
    const loadBlockchain = async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);  
        console.log(provider);

        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setEthWallet(address);

        let contract = new ethers.Contract(GOVERNOR_CONTRACT_ADDRESS, GovernorCountingSimpleSelf.abi, signer);
        setGovContract(contract);

        const res = await contract.hackathonId()
        console.log(res.toString())

        const balances = await fetch(`https://api.covalenthq.com/v1/80001/address/${address}/balances_v2/?key=${COVALENT_APIKEY}`);
        const { data } = await balances.json();

        console.log(data);
        setmaticBalance(data.items[0].balance)
        }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-color">
            <div className="container">
                <a className="navbar-brand" href="/">Prize DAO</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/tasks">Bounties</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/create-task">Create Bounty</Link>
                        </li>
                    </ul>
                    {maticBalance &&  <span className="badge bg-primary me-3">{maticBalance / 10 ** 18} MATIC</span>}
                    <button className="btn btn-outline-light" type="submit" onClick={loadBlockchain}>
                        {ethWallet ? ethWallet.substring(0,8) + "..." + ethWallet.substring(34,42) : "Connect to Wallet"}
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar