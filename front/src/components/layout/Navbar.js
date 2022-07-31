import React from 'react'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import PDAOToken from '../../artifacts/contracts/PDAOToken.sol/PDAOToken.json';
import PrizeDAOGovernor from '../../artifacts/contracts/PrizeDAOGovernor.sol/PrizeDAOGovernor.json';

const GOVERNOR_CONTRACT_ADDRESS = '0x536ccb4A799e49F8357C1e86396E1c6aA0451a07';
const PDAO_ADRESS = '0x87086dc8Adc22a21085b0cEc43Eded0E1a0188A2';


function Navbar({ 
    ethWallet,
    setEthWallet,
    maticBalance,
    setMaticBalance,
    setGovContract,
    setPDaoContract,
    pDaoContract,
    user,
    setUser
}) {
    const loadBlockchain = async () => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);  

        const signer = provider.getSigner();
        setUser(signer);
        const address = await signer.getAddress();
        setEthWallet(address);
        console.log(`balance of add = ${ethers.utils.formatEther(await (provider.getBalance(address)))}`);

        let gov_contract = new ethers.Contract(GOVERNOR_CONTRACT_ADDRESS, PrizeDAOGovernor.abi, signer);
        console.log(`Navbar gov_contract= ${await gov_contract.address}`)
        setGovContract(gov_contract);

        let token_contract = new ethers.Contract(PDAO_ADRESS, PDAOToken.abi, signer);
        console.log(`Navbar token_contract= ${await token_contract.address}`)
        setPDaoContract(token_contract);
        console.log(`Navbar pDaoContract= ${await pDaoContract.address}`)
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
                            <Link className="text-dark nav-link" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="text-dark nav-link" aria-current="page" to="/hackathons">Hackathons</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="text-dark nav-link" aria-current="page" to="/create-hackathon">Create Hackathon</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="text-dark nav-link" aria-current="page" to="/faucet">Faucet</Link>
                        </li>
                        {maticBalance &&  <span className="text-dark badge bg-primary me-3">{maticBalance / 10 ** 18} MATIC</span>}
                            <button className="text-dark  btn btn-outline-light" type="submit" onClick={loadBlockchain}>
                        {ethWallet ? ethWallet.substring(0,8) + "..." + ethWallet.substring(34,42) : "Connect to Wallet"}
                    </button>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar