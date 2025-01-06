import {Card, Col, Input, List, message, Space} from 'antd';
import './MembersStyle.css';
import React, {useState} from 'react';
import wowLogo from './../logo/wow.png';
import wowLogsLogo from './../logo/wowLogs.png';
import RaiderIo from './../logo/raiderIo.png';
import {SyncOutlined} from '@ant-design/icons';
import { showError, showErrorAndSetFalse} from './../../common/error-handler.jsx';

let SEARCH = ""

const MembersList = (props) => {
    const [pageSize, setPageSize] = useState(15)
    const [members, setMembers] = useState(props.members)
    const [searchText, setSearchText] = useState(SEARCH)

    var MEMBERS = props.allMembers;

    let language = props.language;
    const goTo = (url) => {
        window.open(url);
    }
    let hunterName = "Hunter";
    let warName = "Warrior";
    let paladinName = "Paladin";
    let rogueName = "Rogue";
    let priestName = "Priest";
    let deathName = "DeathKnight";
    let shamanName = "Shaman";
    let mageName = "Mage";
    let warlockName = "Warlock";
    let monkName = "Monk";
    let druidName = "Druid";
    let demonName = "DemonHunter";
    let evokerName = "Evoker";
    let lvlName = "lvl";
    if (language === "EN") {
        hunterName = "Hunter";
        lvlName = "lvl";
        warName = "Warrior";
        paladinName = "Paladin";
        rogueName = "Rogue";
        priestName = "Priest";
        deathName = "DeathKnight";
        shamanName = "Shaman";
        mageName = "Mage";
        warlockName = "Warlock";
        monkName = "Monk";
        druidName = "Druid";
        demonName = "DemonHunter";
        evokerName = "Evoker";
    }
    if (language === "UA") {
        hunterName = "Мисливець";
        lvlName = "рівня";
        paladinName = "Паладін"
        rogueName = "Пройдисвіт"
        priestName = "Жрець"
        deathName = "Рицарь Смерті"
        shamanName = "Шаман"
        mageName = "Маг"
        warlockName = "Чорнокнижник"
        monkName = "Монах"
        druidName = "Друїд"
        demonName = "Мисливець на Демонів"
        warName = "Воїн"
        evokerName = "Евокер"
    }

    function showTotal(total) {
        return `${total}  `;
    }

    const updateCharacterData = (id) => {
        if (SEARCH.trim() !== "") {
            props.onSearch(SEARCH)
        }
        props.setLoading(true);

        let mainDiv = document.getElementById('mainDiv');
        if (mainDiv != null) {
            mainDiv.className = 'main_div_disabled';
        }
        fetch('/member/update/' + id, {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': props.cookies.csrf,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => response.status !== 200 ? showErrorAndSetFalse(response, props.setLoading) :
                response.url.includes("login_in") ? window.location.href = "/login_in" : response.json())
            .then(data => props.updateCharacterDataInTable(data, SEARCH));
        /* setTimeout(function(){
            props.setLoading(false)
        }, 2000); */


    }

    const onSearch = value => {
        let str = ""
        if (value.currentTarget != undefined) {
            str = value.currentTarget.value.trim();
        } else {
            str = value;
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
        setSearchText(str)
        SEARCH = str
    }

    const ListData = () => {
        if (members != undefined && members != null && members.length > 0) {

            return (
                <>

                    <List style={{position: 'relative', width: 'auto', marginLeft: "2%", marginTop: '3%'}}
                          itemLayout="horizontal"
                          grid={{gutter: 0, column: 3}}

                          pagination={{
                              total: members.length,
                              showTotal: showTotal,
                              pageSizeOptions: ['15', '30', '45', '60', '75', '90', '105', '120'],
                              onChange: (_, size) =>
                                  setPageSize(size),
                              pageSize: pageSize,
                          }}
                          dataSource={members}
                          renderItem={member => {
                              let color = "white";
                              let className = "Warlock";

                              switch (member.classEn) {
                                  case "Warrior" : {
                                      color = "#C69B6D";
                                      className = warName;
                                  }
                                      break
                                  case "Paladin" : {
                                      color = "#F48CBA";
                                      className = paladinName;
                                  }
                                      break
                                  case "Hunter" : {
                                      color = "#AAD372";
                                      className = hunterName;
                                  }
                                      break
                                  case "Rogue" : {
                                      color = "#FFF468";
                                      className = rogueName
                                  }
                                      break
                                  case "Priest" : {
                                      color = "#FFFFFF";
                                      className = priestName;
                                  }
                                      break
                                  case "DeathKnight" : {
                                      color = "#C41E3A";
                                      className = deathName;
                                  }
                                      break
                                  case "Shaman" : {
                                      color = "#0070DD";
                                      className = shamanName;
                                  }
                                      break
                                  case "Mage" : {
                                      color = "#3FC7EB";
                                      className = mageName;
                                  }
                                      break
                                  case "Warlock" : {
                                      color = "#8788EE";
                                      className = warlockName;
                                  }
                                      break
                                  case "Monk" : {
                                      color = "#00FF98";
                                      className = monkName;
                                  }
                                      break
                                  case "Druid" : {
                                      color = "#FF7C0A";
                                      className = druidName;
                                  }
                                      break
                                  case "DemonHunter" : {
                                      color = "#A330C9";
                                      className = demonName;
                                  }
                                      break
                                  case "Evoker" : {
                                      color = "#479099";
                                      className = evokerName;
                                  }
                                      break

                              }
                              let iconUrl = member.iconURL

                              if (iconUrl === null || iconUrl === undefined) {
                                  iconUrl = "https://worldofwarcraft.com/character/eu/tarren-mill";
                              }

                              let title = member.name + ", " + className + " - " + member.level + lvlName;
                              let urlWOW = "https://worldofwarcraft.com/character/eu/" + member.regionEn + "/" + member.name;
                              let urlWOWLogs = "https://warcraftlogs.com/character/eu/" + member.regionEn + "/" + member.name;
                              let urlRaiderIo = "https://raider.io/characters/eu/" + member.regionEn + "/" + member.name;

                              return (<>
                                      <Col span={8}>
                                          <Card hoverable
                                                title={title}
                                                style={{textAlign: 'center', width: 370, backgroundColor: color}}
                                                cover={<img alt="example" src={iconUrl}/>}
                                                actions={[<SyncOutlined onClick={() => updateCharacterData(member.id)}
                                                                        style={{color: '#1a854f', fontSize: '200%'}}/>]}
                                          >
                                              <Space>
                                                  <a className="logo" target="_blank" href={urlWOW}><img
                                                      style={{maxWidth: '100%', height: 'auto'}} src={wowLogo}/></a>
                                                  <a className="logo" target="_blank" href={urlWOWLogs}><img
                                                      style={{maxWidth: '100%', height: 'auto'}} src={wowLogsLogo}/></a>
                                                  <a className="logo" target="_blank" href={urlRaiderIo}><img
                                                      style={{maxWidth: '100%', height: 'auto'}} src={RaiderIo}/></a>
                                              </Space>
                                          </Card>
                                      </Col>
                                      <br></br>
                                  </>
                              )
                          }}
                    />
                </>)
        } else {
            return (<div>

            </div>)
        }
    }

    return (
        <>
            <Input id="search_input" value={searchText}
                   style={{position: " relative", top: '24px', left: "2%", width: '340px'}}
                   placeholder="input search text" onChange={onSearch} enterButton/>
            <ListData/>
        </>
    )
}

export default function ListMembers(props) {
    return <MembersList {...props}/>
}