import React from 'react'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

import { COVALENT_APIKEY, GOVERNOR_CONTRACT_ADDRESS, DAI_ADDRESS, PDAO_ADRESS } from '../../config'
import PDAOToken from '../../artifacts/contracts/PDAOToken.sol/PDAOToken.json';
import Dai from '../../artifacts/contracts/Test_Dai.sol/Dai.json';
import PrizeDAOGovernor from '../../artifacts/contracts/PrizeDAOGovernor.sol/PrizeDAOGovernor.json';

function Navbar({ 
    ethWallet,
    setEthWallet,
    maticBalance,
    setmaticBalance,
    setGovContract,
    setDaiContract,
    setPDaoContract
}) {
    const loadBlockchain = async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);  
        console.log(provider);

        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setEthWallet(address);

        let contract = new ethers.Contract(GOVERNOR_CONTRACT_ADDRESS, PrizeDAOGovernor.abi, signer);
        setGovContract(contract);
        console.log("GOVERNOR_CONTRACT_ADDRESS", contract.interface.encodeFunctionData(
            "setWinnerAddress",
            [1]
          ))

        let contract1 = new ethers.Contract(DAI_ADDRESS, Dai.abi, signer);
        setDaiContract(contract1);

        let contract2 = new ethers.Contract(PDAO_ADRESS, PDAOToken.abi, signer);
        //setPDaoContract(contract2);

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
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/faucet">Faucet</Link>
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