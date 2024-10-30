import './chatStyle.css'
import React, {useEffect,useState } from "react";

function Chat({socket}){
    const [message, setMessage] = useState('');
    const [convo, setConvo] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [users, setUsers] = useState([]);

    useEffect(()=>{
        console.log("in chat")
        socket.on("socketID", (data)=>{
            console.log("socket id: ", data.id)
        })

        socket.on("users", (users) => {
            const processedUsers = users.map((user) => {
                return {
                    ...user,
                    self: user.userID === socket.id, // Identify the current user
                };
            });

            // Sort users
            processedUsers.sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                return a.username.localeCompare(b.username);
            });

            // Update state with sorted users
            setUsers(processedUsers);
          });

          socket.on("user connected", (user) => {
            console.log("User connected:", user);
            // Add the new user to the users state
            setUsers(prevUsers => {
                // Optionally check if the user already exists
                if (!prevUsers.some(existingUser => existingUser.userID === user.userID)) {
                    return [...prevUsers, user];
                }
                return prevUsers; // If user exists, return the same array
            });
        });

          socket.on("private message", ({ content, from }) => {
            console.log(`Received message from ${from}: ${content}`);
            // Add incoming message to the conversation
            setConvo(prevConvo => [
                ...prevConvo,
                { message: content, fromSelf: false }
            ]);
        });

        return () => {
            socket.off("socketID");
            socket.off("users");
            socket.off("private message");
        };
    }, [socket]);

    useEffect(()=>{

    },[users])

    function messageSubmitHandler(e) {
        e.preventDefault();
        if(message){
        if (selectedUser) {
            socket.emit("private message", {
              content:message,
              to: selectedUser.userID,
            });

            setConvo(prevMessages => [
                ...prevMessages,
                { message, fromSelf: true }
            ]);
      }
      setMessage(""); 
    }
    }

    return(
        <div id='container'>
            <div class="activeusers">
                <h2>Chats</h2>
                <ul id="users">
                {users.map(user => (
                    <li id = "list" key={user.userID} onClick={() => setSelectedUser(user)}>
                        {user.username} {user.self ? "(You)" : ""}
                    </li>
                ))}
                </ul>
            </div>
            <div id='chatScreen'>
            <ul id='messageList'>
            {convo.map((msg, index) => (
                        <li key={index} className={msg.fromSelf ? 'self' : 'other'}>
                            <div className="messageBlock">
                                <span className="messageContent">{msg.message}</span>
                            </div>
                        </li>
                    ))}
                </ul>
                <form class='input' onSubmit={messageSubmitHandler}>
                    <input  value={message}
                     onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here" 
                      id='typeMessage'/>
                    <button type="submit" id='send'> Send </button>
                </form>
            </div>

        </div>
    )
}

export default Chat;
