import {Button, Form, Input, message, Space} from 'antd';
import AppNavbar from './../nav_bar/LoginNavBar.jsx';
import 'antd/dist/antd.css';
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import './Auth.css';
import {showError} from './../../common/error-handler.jsx';


let language = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";

function ToLoginPage() {
    window.location.href = "/login_in";
}

const processRegistrationApiResponse = (data, language) => {
    if (data !== null && data !== undefined) {
        if (data.message === 'Exist') {
            if (language == "UA") {
                message.warning("Користувач із зазначеним іменем вже зареєстрований");
            }
            if (language == "EN") {
                message.warning("The user with the specified name already exist");
            }
        } else {
            if (data.message === "Success") {
                if (language == "UA") {
                    message.success("Користувач '" + data.data + "' успішно зареєстрований");
                }
                if (language == "EN") {
                    message.success("User '" + data.data + "' registered successfully");
                }
                window.setTimeout(ToLoginPage, 3000);
            } else {
                message.error(data.message);
            }
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

const RegistrationForm = (props) => {
    const [form] = Form.useForm();


    const onFinish = (values) => {
        let username = values.username;
        let password = values.password;
        let language = localStorage.getItem("language");

        let user = {
            username:username,
            pass:password,
            language:language
        }
        fetch('/user/registration', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(response => response.status !== 200 ? showError(response) :
            response.json())
            .then(data => processRegistrationApiResponse(data, props.currentLanguage));
    }

    if (props.currentLanguage === "EN") {
        props.setBtnText("or login");
        props.setPassErrText("Please input your password!");
        props.setPassLabelText("Password");
        props.setUserErrText("Please input your username!");
        props.setUserLabelText("UserName");
        props.setRegText("Register");
    }
    if (props.currentLanguage === "UA") {
        props.setBtnText("або увійти");
        props.setPassErrText("Будь ласка, введіть Ваш пароль");
        props.setPassLabelText("Пароль");
        props.setUserErrText("Будь ласка, введіть Ваш логін");
        props.setUserLabelText("Логін");
        props.setRegText("Зареєструватися");
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
                <Input name='login' key="name" placeholder="input a login"/>
            </Form.Item>
            <Form.Item
                label={props.passLabelText}
                name="password"
                rules={[{required: true, message: props.passErrText}]}
            >
                <Input.Password autoComplete="new-password" id="password" name="password" key="password"
                                                    placeholder="input a password"/>
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Space>
                    <Button type="primary" htmlType="submit">
                        {props.regText}
                    </Button>
                    <Link to="/login_in">{props.btnText}</Link>
                </Space>
            </Form.Item>
        </Form>
    </div>)

}

const RegistrationPage = () => {

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

            <RegistrationForm
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

export default function Registration() {
    return (
        <RegistrationPage/>
    )
}