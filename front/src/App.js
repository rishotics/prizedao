import './App.css';
import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom'; 

import Home from './views/Home';
import Navbar from './components/layout/Navbar';
import CreateHackathon from './views/CreateHackathon';
import Faucet from './views/Faucet';
import ListHackathons from './views/ListHackathons';

function App() {
  const [ethWallet, setEthWallet] = useState('');
  const [user, setUser] = useState('');
  const [maticBalance, setmaticBalance] = useState('');
  const [govContract, setGovContract] = useState('');
  const [pDaoContract, setPDaoContract] = useState('')
  return (
  <HashRouter>
    <Navbar
      ethWallet={ethWallet}
      setEthWallet={setEthWallet}
      maticBalance={maticBalance}
      setmaticBalance={setmaticBalance}
      setGovContract={setGovContract}
      setPDaoContract={setPDaoContract}
      pDaoContract={pDaoContract}
      user={user}
      setUser={setUser}/>
    <Routes>
      <Route 
        path="/create-hackathon"
        element={
          <CreateHackathon 
            ethWallet={ethWallet}
            govContract={govContract}
            pDaoContract={pDaoContract}/>}/>
      <Route
        path="/faucet"
        element={
          <Faucet
            govContract={govContract}
            pDaoContract={pDaoContract}
            user={user}/>}/>
      <Route
        path="/hackathons"
        element={
          <ListHackathons
            govContract={govContract}/>}/>
      <Route
        path="/"
        element={
          <Home />} />
    </Routes>
  </HashRouter>);
}

export default App;
