import React, { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import Navbar from './components/layout/Navbar';
import Home from './views/Home';
import CreateTask from './views/CreateTask';
import LisfofTasks from './views/LisfofTasks';
import TaskDetail from './views/TaskDetail';
import CreateSubmission from './views/CreateSubmission';

function App() {
  const [ethWallet, setEthWallet] = useState('');
  const [maticBalance, setmaticBalance] = useState('');
  const [govContract, setGovContract] = useState('');

  return (
    <HashRouter>
      <Navbar
        ethWallet={ethWallet}
        setEthWallet={setEthWallet}
        maticBalance={maticBalance}
        setmaticBalance={setmaticBalance}
        setGovContract={setGovContract}  />
      <Routes>
        <Route
          path="/create-task"
          element={
            <CreateTask
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
              govContract={govContract} />} />
        <Route
          path="/create-submission/:hackathonid/:userid"
          element={
            <CreateSubmission
              govContract={govContract} />} />
        <Route
          path="/"
          element={
            <Home />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
