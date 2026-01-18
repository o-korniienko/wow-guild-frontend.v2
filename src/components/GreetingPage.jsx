import {Space, Typography} from 'antd';
import 'antd/dist/antd.css';
import React, {useState} from 'react';
import './Greeting.css';
import AppNavbar from './nav_bar/AppNavBar.jsx';
import {Link} from 'react-router-dom';
import properties from '../properties';

const { Text, Title, Paragraph  } = Typography;
const guildName = properties.guildName;
let language = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";


const GreetingText = (props) =>{
     let greeting = '';
     if(props.currentLanguage === "EN"){
        props.setGreetingText("       Greeting in guild " + guildName);
        props.setJoinText("to get more information about us. Or, just  ");
        props.setJoinText2("Join ");
        props.setLogInText("log in");
     }
     if(props.currentLanguage === "UA"){
        props.setGreetingText("Вітаємо в гільдії " + guildName);
        props.setJoinText(", щоб отримати більше інформації про нас. \nАбо, просто ");
        props.setJoinText2("Приєднуйтесь ");
        props.setLogInText("увійдіть");
     }
    return(
        <label className="greeting_text"> {props.greetingText}</label>
    )
}

const Emoji = props => (
  <span
    className="emoji"
    role="img"
    aria-label={props.label ? props.label : ""}
    aria-hidden={props.label ? "false" : "true"}
  >
    {props.symbol}
  </span>
)

const Greeting =  () =>{
    const [currentLanguage, setLanguage] = useState(language);
    const [greetingText, setGreetingText] = useState('');
    const [joinText, setJoinText] = useState('');
    const [joinText2, setJoinText2] = useState('');
    const [logInText, setLogInText] = useState('');



    return(
        <div>
            <AppNavbar setFunction={setLanguage}/>
            <Space className="greeting_form"  align="center" direction="vertical">


                    <GreetingText key="1" style={{width:'100%'}}
                    setJoinText={setJoinText}
                    setJoinText2={setJoinText2}
                    setLogInText={setLogInText}
                    greetingText={greetingText}
                    currentLanguage={currentLanguage}
                    setGreetingText={setGreetingText}/>

                    <br/>
                    <br/>

                    <label key="2" className = "login_register_label"><Link type="primary" to={"/registration"}>{joinText2}</Link>{joinText}
                        <Link type="primary" to={"/login_in"}>{logInText}</Link> <Emoji symbol = "👿" />
                    </label>


            </Space>
        </div>

    )

}

export default function GreetingPage(){
return <Greeting/>
}