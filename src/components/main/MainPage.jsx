import styled from 'styled-components';
import { Button, Typography, Space, Divider} from 'antd';
import 'antd/dist/antd.css';
import React, { useState, useEffect} from 'react';
import AppNavbar from './../nav_bar/GeneralNavBar.jsx';
import { Link } from 'react-router-dom';

const { Text, Title, Paragraph  } = Typography;
let language = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";


const Main =  () =>{
    const [currentLanguage, setLanguage] = useState(language);



    return(
        <div>
            <AppNavbar setFunction={setLanguage}/>
            <Space className="greeting_form"  align="center" direction="vertical">

            </Space>
        </div>

    )

}

export default function MainPage(){
    return <Main/>
}