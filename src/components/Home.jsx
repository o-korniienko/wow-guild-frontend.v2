import GreetingPage from './GreetingPage.jsx';
import 'antd/dist/antd.css';
import React, {useEffect, useState} from 'react';
import {API_BASE_URL} from "../constants/apiConstants";

function Home (){
     const [user, setUser] = useState(null);

     useEffect(() => {
        fetch(API_BASE_URL + '/user/get-active', {credentials: 'include'})
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