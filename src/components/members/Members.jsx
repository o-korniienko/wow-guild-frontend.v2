import AppNavbar from './../nav_bar/GeneralNavBar.jsx';
import MembersList from './/MembersList.jsx';
import Stars from './/Stars.jsx';
import {Affix, Card, Input, Layout, Menu, message, Spin, Button} from 'antd';
import 'antd/dist/antd.css';
import './MembersStyle.css';
import {BarChartOutlined, SyncOutlined, TeamOutlined, UnorderedListOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {showError, showErrorAndSetFalse} from './../../common/error-handler.jsx';
import {resolveCSRFToken} from './../../common/csrf-resolver.jsx';
import { useCookies } from 'react-cookie';

const {Search} = Input;
const {Sider, Content} = Layout;
const {Meta} = Card;


const {SubMenu} = Menu;

let MEMBERS = []
let languageLocal;


function isAdmin(user) {
    if(user !== null && user !== undefined){
        let roles = user.roles;
        for (var i = 0; i < roles.length; i++) {
            if (roles[i] === "ADMIN") {
                return true;
            }
        }
    }
    return false;
}


const MenuComponent = (props) => {
    const [collapsed, setCollapsed] = useState(true);
    const toggleCollapsed = () => {
        collapsed ? setCollapsed(false) : setCollapsed(true);
    };
    const [hoverList, setHoverList] = useState(false);
    const [hoverUpdateAll, setHoverUpdateAll] = useState(false);
    const [hoverRateList, setHoverRateList] = useState(false);
    const [hoverUpdateLogAll, setHoverUpdateLogAll] = useState(false);
    const [hoverUpdateWowLogsRaidData, setHoverUpdateWowLogsRaidData] = useState(false);


    let language = props.language;
    let updateText = "Update Blizzard Data";
    let starsText = "Rating";
    let memberListText = "Members"
    let listText = "Members List"
    let updateRankText = "Update WOWLogs ranks"
    let updateRaidsDataText = "Update raids (WOWLogs)"
    let adminElementsDisplayStyle = isAdmin(props.user) ? "block" : "none"


    if (language === "UA") {
        updateText = "Оновити Blizzard Дані";
        starsText = "Рейтинг";
        memberListText = "Учасники"
        listText = "Список"
        updateRankText = "Оновити WOWLogs рейтинги"
        updateRaidsDataText = "Оновити рейди (WOWLogs)"
    }

    const handleMouseEnter = (index) => {
        switch (index) {
            case 1:
                setHoverList(true);
                ;
                break;
            case 2:
                setHoverUpdateAll(true);
                break;
            case 3:
                setHoverRateList(true);
                break;
            case 4:
                setHoverUpdateLogAll(true);
                break;
            case 5:
                setHoverUpdateWowLogsRaidData(true);
                break;
            default:

        }
    };

    const handleMouseLeave = (index) => {
        switch (index) {
            case 1:
                setHoverList(false);
                ;
                break;
            case 2:
                setHoverUpdateAll(false);
                break;
            case 3:
                setHoverRateList(false);
                break;
            case 4:
                setHoverUpdateLogAll(false);
                break;
            case 5:
                setHoverUpdateWowLogsRaidData(false);
                break;
            default:
        }
    };

    const proccessError = (response, mainDiv) => {
        showErrorAndSetFalse(response, props.setLoading);

        if (mainDiv !== null && mainDiv !== undefined){
            mainDiv.className = 'main_div_enabled';
        }
    }

    const updateMembersFromBlizzard = () => {
        props.setLoading(true);

        let mainDiv = document.getElementById('mainDiv');
        if (mainDiv !== null && mainDiv !== undefined) {
            mainDiv.className = 'main_div_disabled';
        }

        fetch('/member/update-all-bz', {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': props.cookies.csrf,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'

        })
            .then(response => response.status !== 200 ? proccessError(response, mainDiv) : response.url.includes("login_in") ? window.location.href = "/login_in" : response.json())
            .then(data => props.setBzData(data));

    }

    const setContent = (value) => {
        window.location.href = "/members/" + value
        // props.setContentType(value)
    }

    const updateRankingData = () => {
        props.setLoading(true);

        let mainDiv = document.getElementById('mainDiv');
        if (mainDiv !== null && mainDiv !== undefined) {
            mainDiv.className = 'main_div_disabled';
        }
        fetch('/member/update-all-rank', {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': props.cookies.csrf,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'

        })
            .then(response => response.status !== 200 ? proccessError(response, mainDiv) :
                response.url.includes("login_in") ? window.location.href = "/login_in" : response.json())
            .then(data => rankingUpdateResult(data));
    }

    const updateWowLogsRaidsData = () => {
        props.setLoading(true);

        let mainDiv = document.getElementById('mainDiv');
        if (mainDiv !== null && mainDiv !== undefined) {
            mainDiv.className = 'main_div_disabled';
        }
        fetch('/raid/update-wow-logs-data', {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': props.cookies.csrf,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'

        })
            .then(response => response.status !== 200 ? proccessError(response, mainDiv) :
                response.url.includes("login_in") ? window.location.href = "/login_in" : response.json())
            .then(data => wowLogsRaidsUpdateResult(data));
    }


    const rankingUpdateResult = (data) => {
        props.setLoading(false);

        if (data !== null && data !== undefined) {
            if (data.message === 'Successful') {
                message.success(data.message)
            } else {
                message.info(data.message)
            }
            let mainDiv = document.getElementById('mainDiv');
            if (mainDiv != null) {
                mainDiv.className = 'main_div_enabled';
            }
        }

    }

    const wowLogsRaidsUpdateResult = (data) => {
        props.setLoading(false);

        if (data !== null && data !== undefined) {
            if (data.message === 'Successful') {
                message.success(data.message)
            } else {
                message.info(data.message)
            }
            let mainDiv = document.getElementById('mainDiv');
            if (mainDiv != null) {
                mainDiv.className = 'main_div_enabled';
            }
        }

    }

    return (<Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        <Affix offsetTop={5}>

            <Menu
                mode="inline"

                inlineCollapsed={collapsed}
                style={{height: '100%', borderRight: 0}}
            >


                <SubMenu title={memberListText} icon={<TeamOutlined style={{color: '#1a854f', fontSize: '150%'}}/>}>
                    <Menu.Item key="0" icon={<UnorderedListOutlined style={{
                        color: '#1a854f',
                        fontSize: '150%',

                    }}/>}>
                        <Link style={{
                            color: hoverList ? '#1e7ce4' : '#1a854f',
                            fontSize: '100%'
                        }}
                              onClick={() => setContent("list")}
                              onMouseEnter={() => handleMouseEnter(1)}
                              onMouseLeave={() => handleMouseLeave(1)}
                        >
                            {listText}
                        </Link>
                    </Menu.Item>
                    <Menu.Item style={{display:adminElementsDisplayStyle}} key="1" >
                        <Button type="link" style={{
                            color: hoverUpdateAll ? '#1e7ce4' : '#1a854f',
                            fontSize: '100%', size:'50%'
                        }}
                              onClick={updateMembersFromBlizzard}
                              onMouseEnter={() => handleMouseEnter(2)}
                              onMouseLeave={() => handleMouseLeave(2)}
                        >
                            {updateText}
                        </Button>
                    </Menu.Item>


                    <SubMenu title={starsText} icon={<BarChartOutlined style={{color: '#1a854f', fontSize: '150%'}}/>}>
                        <Menu.Item key="2">
                            <Link style={{
                                color: hoverRateList ? '#1e7ce4' : '#1a854f',
                                fontSize: '100%'
                            }}
                                  onClick={() => setContent("stars")}
                                  onMouseEnter={() => handleMouseEnter(3)}
                                  onMouseLeave={() => handleMouseLeave(3)}
                            >
                                {starsText}
                            </Link>
                        </Menu.Item>
                        <Menu.Item style={{display:adminElementsDisplayStyle}} key="3">
                            <Button type="link" style={{
                                color: hoverUpdateLogAll ? '#1e7ce4' : '#1a854f',
                                fontSize: '100%'
                            }}
                                  onClick={updateRankingData}
                                  onMouseEnter={() => handleMouseEnter(4)}
                                  onMouseLeave={() => handleMouseLeave(4)}
                            >
                                {updateRankText}
                            </Button>
                        </Menu.Item>
                        <Menu.Item style={{display:adminElementsDisplayStyle}} key="4">
                            <Button type="link" style={{
                                color: hoverUpdateWowLogsRaidData ? '#1e7ce4' : '#1a854f',
                                fontSize: '100%'
                            }}
                                  onClick={updateWowLogsRaidsData}
                                  onMouseEnter={() => handleMouseEnter(5)}
                                  onMouseLeave={() => handleMouseLeave(5)}
                            >
                                {updateRaidsDataText}
                            </Button>
                        </Menu.Item>

                    </SubMenu>
                </SubMenu>

            </Menu>
        </Affix>
    </Sider>)

}

function Members(props) {
    languageLocal = localStorage.getItem("language") != null ? localStorage.getItem("language") : "EN";
    const [collapsed, setCollapsed] = useState(false);
    const [currentLanguage, setLanguage] = useState(languageLocal);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState(null)
    const [user, setUser] = useState(null);
    const [contentType, setContentType] = useState(props.match.params.tag);
    const [cookies, setCookie] = useCookies(['csrf']);

    let patchName = window.location.pathname;

    const setBzData = (value) => {
        setMembers(value);
        MEMBERS = value
        setLoading(false);

        let mainDiv = document.getElementById('mainDiv');
        if (mainDiv != null) {
            mainDiv.className = 'main_div_enabled';
        }
    }

    const ContentDiv = (props) => {
        if (contentType === "list") {
            return (<MembersList onSearch={onSearch} updateCharacterDataInTable={updateCharacterDataInTable}
                                 setMembers={setMembers} setSearchValue={setSearchValue} searchValue={searchValue}
                                 setLoading={setLoading} members={members} allMembers={MEMBERS}
                                 language={currentLanguage}
                                 cookies={props.cookies}/>)
        }
        if (contentType === "stars") {
            return (<Stars cookies={props.cookies}/>)
        }
    }

    const updateCharacterDataInTable = (data, search) => {
        setLoading(false);
        if (data !== null && data !== undefined) {
            if (data.message === 'Successful') {
                message.success(data.message)

                var updatedCharacter = data.data

                for (var i = 0; i < MEMBERS.length; i++) {
                    if (MEMBERS[i].id === updatedCharacter.id) {
                        MEMBERS[i] = updatedCharacter
                    }
                }
            } else {
                message.info(data.message)
            }
            let mainDiv = document.getElementById('mainDiv');

            if (mainDiv != null) {
                mainDiv.className = 'main_div_enabled';
            }

            if (search.trim() === "") {
                setMembers([])
                setMembers(MEMBERS)
            } else {
                onSearch(search)
            }
        }
    }

    useEffect(() => {
        setLoading(true)

        resolveCSRFToken()
            .then(token => setCookie('csrf', token, { path: '/' }))

        fetch('/user/get-active')
            .then(response => response.status !== 200 ? showErrorAndSetFalse(response, setLoading) : response.url.includes("login_in") ? window.location.href = "/login_in" : response.json())
            .then(data => setUserData(data));

        fetch('/member/get-all', {})
            .then(response => response.status !== 200 ? showError(response) : response.json())
            .then(data => setBzData(data))

    }, []);

    const setUserData = (data) => {
        if (data !== null && data !== undefined) {
            /* if(!isAdmin(data)){
                window.location.href = "/forbidden403"
            }else{
            } */
            setUser(data)
        }
    }

    const isAdmin = (user) => {
        let roles = user.roles;
        for (var i = 0; i < roles.length; i++) {
            if (roles[i] === "ADMIN") {
                return true;
            }
        }

        return false;
    }


    const onSearch = (value) => {
        let str = ""
        if (value.currentTarget != undefined) {
            str = value.currentTarget.value.trim();
        } else {
            str = value.trim();
        }


        if (str === '') {
            setMembers(MEMBERS);

        } else {
            let foundMembers = [];
            for (var i = 0; i < MEMBERS.length; i++) {
                var stringObject = MEMBERS[i].name + " " + MEMBERS[i].classEn + "" + MEMBERS[i].level + "" + MEMBERS[i].rank + "" + MEMBERS[i].race + "" +
                    MEMBERS[i].regionEn;
                if (stringObject.toLowerCase().includes(str.toLowerCase())) {
                    foundMembers.push(MEMBERS[i]);
                }

            }
            setMembers(foundMembers);
        }
        //SEARCH = str
    }


    return (
        <div id="mainDiv">
            <Layout style={{position: "absolute", minHeight: "100%", width: "100%"}}>
                <Spin size="large" spinning={loading}>
                    <AppNavbar style={{height: "10%"}} setFunction={setLanguage} patchName={patchName}/>
                </Spin>
                <Layout>
                    <MenuComponent setContentType={setContentType} user={user} loading={loading}
                                   setSearchValue={setSearchValue} setLoading={setLoading} setBzData={setBzData}
                                   language={currentLanguage}
                                   cookies={cookies}/>
                    <Layout style={{minHeight: "100%"}}>
                        <Content disabled={true}>

                            <ContentDiv cookies={cookies} contentType={contentType}/>
                        </Content>

                    </Layout>
                </Layout>

            </Layout>
        </div>
    );
}


export default function MembersPage(props) {
    return <Members {...props}/>

}