import AppNavbar from './nav_bar/AppNavBar.jsx';
import GreetingPage from './GreetingPage.jsx';
import { Button, Input } from 'antd';
import 'antd/dist/antd.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

function Home (){
     const [user, setUser] = useState(null);

     useEffect(() => {
        fetch("/user/get-active")
        .then(response => {
            try {
                if (response.ok){
                    return response.json()
                }
                return null
            } catch (err) {
                return null
                console.log(err)
            }
        })
        .then(data=>setUser(data));
    }, []);


    if(user != null && user != "null"){
       window.location.href = "/home";
    }else{
            return(<GreetingPage/>)


    }
}


export default function Recipients(){
    return <Home/>
}