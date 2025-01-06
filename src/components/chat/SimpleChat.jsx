import styled from 'styled-components';
import { Button, Typography, Space, Divider} from 'antd';
import 'antd/dist/antd.css';
import React, { useState, useEffect} from 'react';
import AppNavbar from './../nav_bar/GeneralNavBar.jsx';
import { Link } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp, Client } from '@stomp/stompjs';
import './Chat.css';
import {showError} from './../../common/error-handler.jsx';
import {resolveCSRFToken} from './../../common/csrf-resolver.jsx';
import { useCookies } from 'react-cookie';

let language = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";




const SimpleChat =  () =>{
    const [currentLanguage, setLanguage] = useState(language);
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [cookies, setCookie] = useCookies(['csrf']);

    const handleSend = () => {
      if (input.trim() !== '') {

        var newMessage = {
            message: input,
            userId: user.id
        }
        fetch('/simple-chat/message/send', {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': cookies.csrf,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(newMessage)
        })
        .then(response => response.status !== 200 ? showError(response) :
           response.json())
        .then(data => processMessageSendResponse(data));
      }
    };

    const processMessageSendResponse = (data) => {
        if(data !== null && data !== undefined && data.status === 200){
            var messageItem = {
                id:data.data.id,
                text:data.data.message,
                sender:'user'
            }
            setMessages(prevMessages => [...prevMessages, messageItem])
            setInput('')
        }
    }

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    };

    const processWbeSocketMessage = (message) =>{
        if (message.body) {
            if(message.body !== null && message.body !== undefined){
              var newMessage = JSON.parse(message.body)
              if(newMessage !== undefined && newMessage.data.userId.toString() !== user.id.toString()){
                  var messageItem = {
                      id:newMessage.data.id,
                      text: newMessage.data.message,
                      sender: 'other'
                  }
                  setMessages(prevMessages => [...prevMessages, messageItem])
              }
            }
        }
    }

    useEffect(() => {
        resolveCSRFToken()
            .then(token => setCookie('csrf', token, { path: '/' }))

        fetch('/user/get-active')
            .then(response => response.status !== 200 ? showError(response) : response.url.includes("login_in") ?
                window.location.href = "/login_in" : response.json())
            .then(data => setUserData(data));

    }, []);

    useEffect(() => {
        if (user !== null) {
            const socket = new SockJS('/simple_chat_web_socket');
            const stompClient = Stomp.over(socket);
            stompClient.connect({}, (frame) => {
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/simple_chat_message', (message) => {
                    processWbeSocketMessage(message);
                });
            }, (error) => {
                console.error('Connection error:', error);
            });
        }
    }, [user]);

    const setUserData = (user) => {
        try {
            setUser(user);
            if (user !== null) {
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("language", user.language);
                setLanguage(user.language);

                fetch('/simple-chat/message/get-all', {})
                     .then(response => response.status !== 200 ? showError(response) : response.json())
                     .then(data => setMessagesData(data, user))
            }
        } catch (err) {
            console.log(err)
        }
    }

    const setMessagesData = (data, user) => {
        if(data !== null && data.length > 0 && user !== null){
            var messageItems = []
            for(var i = 0; i < data.length; i++){
                var message = {
                    id:data[i].id,
                    text: data[i].message,
                    sender: data[i].userId.toString() === user.id.toString() ? 'user' : 'other'
                }
                messageItems.push(message)
            }
            setMessages(messageItems)
        }
    }

    return(
        <div>
            <AppNavbar setFunction={setLanguage}/>
                <div className="chat-container">
                  <div className="chat-messages">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`chat-message ${message.sender === 'user' ? 'user' : 'other'}`}
                      >
                        {message.text}
                      </div>
                    ))}
                  </div>
                  <div className="chat-input">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                    <button onClick={handleSend}>Send</button>
                  </div>
                </div>
        </div>

    )

}

export default function SimpleChatPage(){
    return <SimpleChat/>
}