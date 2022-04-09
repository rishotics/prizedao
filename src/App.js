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
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route
          path="/create-task"
          element={
            <CreateTask />} />
        <Route
          path="/tasks"
          element={
            <LisfofTasks />} />
        <Route
          path="/task"
          element={
            <TaskDetail />} />
        <Route
          path="/create-submission"
          element={
            <CreateSubmission />} />
        <Route
          path="/"
          element={
            <Home />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
