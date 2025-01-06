import 'antd/dist/antd.css';
import { PageHeader, Select, Button, Descriptions } from 'antd';
import React, { useState, useEffect} from 'react';
import styled from 'styled-components'
import  './NavBar.css';
import { Link } from 'react-router-dom';
import logo from './../logo/logo.jpg';
import properties from './../../properties.js';


const { Option } = Select;
const guildName = properties.guildName
let languages = []
let languageLocal = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";

languages.push(<Option style={{color:"#022715"}} key="EN">EN</Option>)
languages.push(<Option style={{color:"#022715"}} key="UA">UA</Option>)



const LoginButton = (props) =>{

    const StyledLogOutButton = styled(Button)`
    position:relative;
    right:3%;
    top:25%;
    color:#cd641b;
    font-family: "Trebuchet MS";
    text-decoration: underline;`

    let language = props.language;
    if(language === "UA"){
        props.setLoginText("Увійти");

    }

    if(language === "EN"){
       props.setLoginText("Log in");

    }

     return (
            <StyledLogOutButton type="link"><Link to="/login_in">
                 {props.loginText}</Link>
               </StyledLogOutButton>
               )


}

const Language = (props) =>{
    let lang = localStorage.getItem("language");
    if(lang == null){
        localStorage.setItem("language","EN");
    }

    const setLanguage = (value) =>{
        localStorage.setItem("language",value);
        languageLocal = value;
        props.setFunction(value);
        props.setFunction2(value);
    }

    return(
            <Select
             style={{position:'relative', right:'5%', top:'25%', color:"#63baf2" }}
              placeholder="Please select"
              onChange={setLanguage}
              defaultValue = {languageLocal}
            >
             {languages}
            </Select>

    )
}

const Logo = (props) =>{
     let language = props.language;
     if(language === "UA"){
         props.setLogoText(guildName);
     }

     if(language === "EN"){
         props.setLogoText(guildName);
     }
     return (<Link className="logo" to="/" ><img alt = "here must be a logo" style={{maxWidth:'20%', height:'auto'}} src={logo} />{props.logoText}</Link>
     )
}

const Menu = (props) =>{
    let language = props.language;
    if (language === "UA"){
        props.setAboutText("Про нас")
    }

    if (language === "EN"){
        props.setAboutText("About us")
    }

    return(
        <Descriptions size='large' column={1} style={{width:'4%', position:'relative', left:'48%'}}>
           <Descriptions.Item>
               <Link className="header_menu" to="/about_us">{props.aboutText}</Link>
           </Descriptions.Item>
        </Descriptions>
    )
}


const NavBar = (props)=>{
    const [currentLanguage, setLanguage] = useState(languageLocal);
    const [logoText, setLogoText] = useState("");
    const [aboutText, setAboutText] = useState("");
    const [loginText, setLoginText] = useState("");

    const StyledPageHeader = styled(PageHeader)`
      maxHeight:20%;
      width:100%;
      border: 1px solid rgb(0, 0, 0);
      background-color:rgb(0, 0, 0);
    `

          return(<StyledPageHeader

             className="site-page-header"

             title=<Logo logoText = {logoText} setLogoText={setLogoText}  language = {currentLanguage}/>
             extra = {[<LoginButton key='1' language = {currentLanguage} setLoginText={setLoginText} loginText={loginText}/>,
                        <Language key='0' setFunction2={setLanguage} setFunction={props.setFunction}/>,

             ]}
             >
             <Menu
                language = {currentLanguage}
                aboutText = {aboutText}
                setAboutText = {setAboutText}
             />

             </StyledPageHeader>)
}


export default function AppNavBar(props){
  return <NavBar {... props}/>;
}
