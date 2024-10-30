import Chat from './chat';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import socket from './Socket';
import React, {useEffect} from "react";

function App() {
  useEffect(()=>{
    const username = `User${Math.floor(Math.random() * 1000000)}`;
    socket.auth = {username}
    socket.connect()

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        console.log(err.message)
      }
    });

  })
  return (
    <div className="App">
      <header className="App-header">
        <h1 id="title">Chat Application</h1>
      </header>
      <Router>
            <Routes>
                <Route path="/" element={<Chat socket={socket}/>} />
            </Routes>
        </Router>
      </div>
  );
}

export default App;
