import {Button, Form, Input, message, Space} from 'antd';
import AppNavbar from './../nav_bar/LoginNavBar.jsx';
import 'antd/dist/antd.css';
import React, {useState} from 'react';
import Cookies from 'universal-cookie';
import {Link} from 'react-router-dom';
import './Auth.css';
import {showError} from './../../common/error-handler.jsx';
import {API_BASE_URL} from "../../constants/apiConstants";
import {USER_LOGIN_FAIL_MSG, USER_LOGIN_RESULT_MSG_C, USER_LOGIN_SUCCESS_MSG} from "../../constants/cookiesConstants";


const cookies = new Cookies();
let language = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";

const proccessLoginResult = (data, language) => {
    let mess = data.message
    if (mess === USER_LOGIN_FAIL_MSG) {
        if (language === "UA") {
            message.warning("Не вірний логін або пароль");
        }
        if (language === "EN") {
            message.warning("Invalid username or password");
        }
    } else {
        if (mess === USER_LOGIN_SUCCESS_MSG) {
            window.location.href = "/home";
        }else{
            message.error("unknown login result")
        }
    }
}

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};
const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
};

const LoginForm = (props) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        let username = values.username;
        let password = values.password;

        fetch(API_BASE_URL +'/perform_login?username=' + username + '&password=' + password, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include'
        }).then(response => response.status !== 200 && response.status !== 401 ? showError(response) : response.json())
            .then(data => proccessLoginResult(data, props.currentLanguage))
            .catch(err => console.error('Fetch or JSON error:', err));

    }

    if (props.currentLanguage === "EN") {
        props.setBtnText("Log in");
        props.setPassErrText("Please input your password!");
        props.setPassLabelText("Password");
        props.setUserErrText("Please input your username!");
        props.setUserLabelText("UserName");
        props.setRegText("or register");
    }
    if (props.currentLanguage === "UA") {
        props.setBtnText("Увійти");
        props.setPassErrText("Будь ласка, введіть Ваш пароль");
        props.setPassLabelText("Пароль");
        props.setUserErrText("Будь ласка, введіть Ваш логін");
        props.setUserLabelText("Логін");
        props.setRegText("або зареєструватися");
    }


    return (<div className="login_form">
        <Form form={form}
              {...layout}
              name="basic"
              onFinish={onFinish}
        >
            <Form.Item
                label={props.userLabelText}
                name="username"
                rules={[{required: true, message: props.userErrText}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label={props.passLabelText}
                name="password"
                rules={[{required: true, message: props.passErrText}]}
            >
                <Input.Password/>
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Space>
                    <Button type="primary" htmlType="submit">
                        {props.btnText}
                    </Button>
                    <Link to="/registration">{props.regText}</Link>
                </Space>
            </Form.Item>
        </Form>
    </div>)

}

const LoginPage = () => {

    const [currentLanguage, setLanguage] = useState(language);
    const [userLabelText, setUserLabelText] = useState("");
    const [passLabelText, setPassLabelText] = useState("");
    const [userErrText, setUserErrText] = useState("");
    const [passErrText, setPassErrText] = useState("");
    const [btnText, setBtnText] = useState("");
    const [regText, setRegText] = useState("");

    return (

        <div>
            <AppNavbar setFunction={setLanguage}/>

            <LoginForm
                currentLanguage={currentLanguage}
                setUserLabelText={setUserLabelText}
                setPassLabelText={setPassLabelText}
                setUserErrText={setUserErrText}
                setPassErrText={setPassErrText}
                setBtnText={setBtnText}
                userLabelText={userLabelText}
                passLabelText={passLabelText}
                userErrText={userErrText}
                passErrText={passErrText}
                btnText={btnText}
                regText={regText}
                setRegText={setRegText}
            />
        </div>
    );
};

export default function Login() {
    return (
        <LoginPage/>
    )
}