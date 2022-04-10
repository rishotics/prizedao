import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import Navbar from './components/layout/Navbar';
import Home from './views/Home';
import CreateTask from './views/CreateTask';
import LisfofTasks from './views/LisfofTasks';
import TaskDetail from './views/TaskDetail';
import CreateSubmission from './views/CreateSubmission';
import Faucet from './views/Faucet';

function App() {
  const [ethWallet, setEthWallet] = useState('');
  const [maticBalance, setmaticBalance] = useState('');
  const [govContract, setGovContract] = useState('');
  const [daiContract, setDaiContract] = useState('');
  const [pDaoContract, setPDaoContract] = useState('')

  return (
    <HashRouter>
      <Navbar
        ethWallet={ethWallet}
        setEthWallet={setEthWallet}
        maticBalance={maticBalance}
        setmaticBalance={setmaticBalance}
        setGovContract={setGovContract}
        setDaiContract={setDaiContract}
        setPDaoContrac={setPDaoContract}  />
      <Routes>
        <Route
          path="/create-task"
          element={
            <CreateTask
              ethWallet={ethWallet}
              govContract={govContract} />} />
        <Route
          path="/tasks"
          element={
            <LisfofTasks
              govContract={govContract}/>} />
        <Route
          path="/task/:id"
          element={
            <TaskDetail
              govContract={govContract}
              pDaoContract={pDaoContract}
              ethWallet={ethWallet}
              daiContract={daiContract} />} />
        <Route
          path="/create-submission/:hackathonid/:userid"
          element={
            <CreateSubmission
              govContract={govContract} />} />
        <Route
          path="/faucet"
          element={
            <Faucet
              ethWallet={ethWallet}
              daiContract={daiContract} />} />
        <Route
          path="/"
          element={
            <Home />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
