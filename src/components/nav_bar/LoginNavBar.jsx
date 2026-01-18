import 'antd/dist/antd.css';
import {PageHeader, Select} from 'antd';
import styled from 'styled-components'
import './NavBar.css';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import logo from './../logo/logo.jpg';
import properties from './../../properties.js';
import {API_BASE_URL} from "../../constants/apiConstants";

const {Option} = Select;
const guildName = properties.guildName
let languages = []
let languageLocal = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";


languages.push(<Option style={{color: "#022715"}} key="EN">EN</Option>)
languages.push(<Option style={{color: "#022715"}} key="UA">UA</Option>)


const Logo = (props) => {
    let language = props.language;
    if (language === "UA") {
        props.setLogoText(guildName);
    }
    if (language === "EN") {
        props.setLogoText(guildName);
    }

    return (<Link className="logo" to="/"><img alt="here must be a logo" style={{maxWidth: '20%', height: 'auto'}}
                                               src={logo}/>{props.logoText}</Link>)
}

const Language = (props) => {
    let lang = localStorage.getItem("language");
    if (lang == null) {
        localStorage.setItem("language", "EN");
    }

    const setLanguage = (value) => {
        localStorage.setItem("language", value);
        languageLocal = value;
        props.setFunction(value);
        props.setLanguage(value);
    }

    return (


        <Select
            style={{position: 'relative', right: '5%', top: '15%', color: "#63baf2"}}
            onChange={setLanguage}
            defaultValue={languageLocal}
        >
            {languages}
        </Select>

    )
}


function NavBar(props) {
    const [user, setUser] = useState(null);
    const [logoText, setLogoText] = useState(null);
    const [language, setLanguage] = useState(null);
    const StyledPageHeader = styled(PageHeader)`
        position: relative;
        height: 30%;
        minWidth: 100%;
        border: 1px solid rgb(0, 0, 0);
        background-color: rgb(0, 0, 0);
    `

    const setData = (data) => {
        try {
            setUser(data);
            // localStorage.setItem("user", data);
            setLanguage(languageLocal);
        } catch (err) {
            console.log(err)
            setUser(null)
        }
    }
    useEffect(() => {
        fetch(API_BASE_URL + '/user/get-active', {credentials: 'include'})
            .then(response => {
                try {
                    if (response.ok) {
                        return response.json()
                    }
                    return null
                } catch (err) {
                    return null
                    console.log(err)
                }
            })
            .then(data => setData(data));
    }, []);

    if (user !== null) {
        window.location.href = "/home";
    } else {
        return (<StyledPageHeader
            className="site-page-header"
            title=<Logo logoText={logoText} setLogoText={setLogoText} language={language}/>
        extra = {[<Language setFunction={props.setFunction} setLanguage={setLanguage}/>]}
            >

            < /StyledPageHeader>)
    }
}


export default function AppNavBar(props) {
    return <NavBar {...props}/>;
}
