import React, {useEffect, useState} from 'react';
import AppNavbar from './../nav_bar/GeneralNavBar.jsx';
import 'antd/dist/antd.css';
import {Button, Form, Input, message, Select, Space} from 'antd';
import {useHistory} from 'react-router-dom';
import {showError} from './../../common/error-handler.jsx';
import {resolveCSRFToken} from './../../common/csrf-resolver.jsx';
import { useCookies } from 'react-cookie';

const {TextArea} = Input;

let userRole;
let isActive;
let languageLocal;


let user2;
const {Option} = Select;
const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};


const UserRoles = []
UserRoles.push(<Option style={{color: "#022715"}} key="USER">USER</Option>);
UserRoles.push(<Option style={{color: "#022715"}} key="ADMIN">ADMIN</Option>);
UserRoles.push(<Option style={{color: "#022715"}} key="RAIDER">RAIDER</Option>);
UserRoles.push(<Option style={{color: "#022715"}} key="OFFICER">OFFICER</Option>);


const UserActivities = []
UserActivities.push(<Option style={{color: "#022715"}} key="true">true</Option>);
UserActivities.push(<Option style={{color: "#022715"}} key="false">false</Option>);


function setUserRole(value) {
    userRole = value;

}

function setUserActivity(value) {
    isActive = value;

}


const processUserEditinApiResponse = (data, language) => {
    if (data !== undefined && data !== null) {
        if (data.message === "Exist") {
            if (language == "UA") {
                message.warning("Користувач із зазначеним іменем вже зареєстрований");
            }
            if (language == "EN") {
                message.warning("The user with the specified name already exist");
            }

        } else {
            data.message !== "Saved" ? message.error(data.message) : window.location.href = "/admin";
        }
    }
}


const EditForm = (props) => {
    let id = props.id;
    const [form] = Form.useForm();
    const [user, setUser] = useState(null);
    const [cookies, setCookie] = useCookies(['csrf']);
    const history = useHistory();
    const back = () => history.goBack();
    const goBack = () => {
        window.location.href = "/admin";
    }

    const onFinish = (values) => {
        let isNameChanged = false;
        if (user2.username.trim() != values.login.trim()) {
            isNameChanged = true;
        }
        var userObject = {
            id: user2.id,
            username: values.login,
            password: values.password,
            email: values.email,
            active: isActive,
            roles: userRole,
            language: localStorage.getItem("language"),
        }

        fetch("/user/edit?is_name_changed=" + isNameChanged, {
                        method: 'PUT',
                        headers: {
                            'X-XSRF-TOKEN': cookies.csrf,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify(userObject)
                    })
                        .then(response => response.status != 200 ? showError(response) :
                            response.json())
                        .then(data => processUserEditinApiResponse(data, props.language))
    };

    useEffect(() => {
        resolveCSRFToken()
                    .then(token => setCookie('csrf', token, { path: '/' }))

        fetch('/user/get-one/' + id)
            .then(response => response.status != 200 ? showError(response) : response.json())
            .then(data => setUserData(data));
    }, []);

    const setUserData = (data) => {
        if (data !== null && data !== undefined) {
            form.setFieldsValue({login: data.username});
            form.setFieldsValue({email: data.email});
            form.setFieldsValue({user_role: data.roles});
            form.setFieldsValue({isActive: data.active.toString()});
            userRole = data.roles;
            isActive = data.active;

            setUser(data)
            user2 = data;
        }
    }

    const clickHandler = (event) => {
        if (event.key === 'Enter' && event.target.tagName !== "INPUT") {
            form.submit();
        }
    }

    if (props.language === "EN") {
        props.setLoginFieldName("User Login")
        props.setEmailFieldName('Email')
        props.setTypeFieldName("Roles")
        props.setPassFieldName("Password")
        props.setActiveFieldName("Active")
        props.setSaveButtonText("Save")
        props.setCancelButtonText("Cancel")
        props.setLoginErrorText("Please input user name!")
        props.setEmailErrorText("input email");
    }
    if (props.language === "UA") {
        props.setLoginFieldName("Логін")
        props.setEmailFieldName('Пошта')
        props.setTypeFieldName("Ролі")
        props.setPassFieldName("Пароль")
        props.setActiveFieldName("Активність")
        props.setSaveButtonText("Зберегти")
        props.setCancelButtonText("Відміна")
        props.setLoginErrorText("Введіть логін!")
        props.setEmailErrorText("Введіть пошту");
    }


    return (<div tabIndex={0} onKeyPress={clickHandler} className="sent-form">
            <br/>
            <br/>
            <p/>
            <Form form={form}  {...layout} name="nest-messages" onFinish={onFinish}>
                <Form.Item
                    name='login'
                    label={props.loginFieldName}
                    rules={[{required: true, message: props.loginErrorText}]}
                >
                    <Input name='login' key="name" style={{width: 400}} placeholder={props.loginErrorText}/>
                </Form.Item>
                <Form.Item
                    name="email"
                    label={props.emailFieldName}
                    rules={[{type: "email"}]}
                >
                    <Input name='email' key="email" style={{width: 400}} placeholder={props.emailErrorText}/>
                </Form.Item>
                <Form.Item
                    name="user_role"
                    label={props.typeFieldName}
                >
                    <Select
                        mode="multiple"
                        style={{width: 400, color: "#63baf2", border: "1px solid grey"}}
                        onChange={setUserRole}
                    >
                        {UserRoles}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="password"
                    label={props.passFieldName}
                    rules={[{message: 'Please input password!'}]}
                >
                    <Input.Password id="password" name="password" key="password" style={{width: 400}}
                                    placeholder="input a password"/>
                </Form.Item>
                <Form.Item
                    name="isActive"
                    label={props.activeFieldName}
                >
                    <Select
                        style={{width: 400, color: "#63baf2", border: "1px solid grey"}}
                        onChange={setUserActivity}
                    >
                        {UserActivities}
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{...layout.wrapperCol, offset: 8}}>
                    <Space>
                        <Button onClick={goBack}>{props.cancelButtonText}</Button>
                        <Button type="primary" htmlType="submit"> {props.saveButtonText} </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>

    );


}


function Display(props) {
    languageLocal = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";
    const [currentLanguage, setLanguage] = useState(languageLocal);
    const [loginFieldName, setLoginFieldName] = useState('');
    const [emailFieldName, setEmailFieldName] = useState('');
    const [typeFieldName, setTypeFieldName] = useState('');
    const [activeFieldName, setActiveFieldName] = useState('');
    const [passFieldName, setPassFieldName] = useState('');
    const [cancelButtonText, setCancelButtonText] = useState('');
    const [saveButtonText, setSaveButtonText] = useState('');
    const [loginErrorText, setLoginErrorText] = useState('');
    const [emailErrorText, setEmailErrorText] = useState('');
    let patchName = window.location.pathname;


    return (
        <div>
            <AppNavbar setFunction={setLanguage} patchName={patchName}/>
            <br/>
            <br/>
            <EditForm
                language={currentLanguage}
                setLanguage={setLanguage}
                loginFieldName={loginFieldName}
                setLoginFieldName={setLoginFieldName}
                emailFieldName={emailFieldName}
                setEmailFieldName={setEmailFieldName}
                typeFieldName={typeFieldName}
                setTypeFieldName={setTypeFieldName}
                activeFieldName={activeFieldName}
                setActiveFieldName={setActiveFieldName}
                passFieldName={passFieldName}
                setPassFieldName={setPassFieldName}
                cancelButtonText={cancelButtonText}
                setCancelButtonText={setCancelButtonText}
                saveButtonText={saveButtonText}
                setSaveButtonText={setSaveButtonText}
                id={props.match.params.id}
                loginErrorText={loginErrorText}
                setLoginErrorText={setLoginErrorText}
                emailErrorText={emailErrorText}
                setEmailErrorText={setEmailErrorText}


            />
        </div>
    )
}


export default function EditUser(props) {

    return <Display {...props}/>;
}
