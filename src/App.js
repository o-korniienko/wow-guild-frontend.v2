import React  from 'react';
import Home from './components/Home.jsx';
import Login from './components/auth/Login.jsx';
import Registration from './components/auth/RegistrationPage.jsx';
import MainPage from './components/main/MainPage.jsx';
import AboutPage from './components/main/AboutPage.jsx';
import Admin from './components/admin/Admin.jsx';
import EditUser from './components/admin/EditUser.jsx';
import UserSettings from './components/user/UserSettings.jsx';
import Members from './components/members/Members.jsx';
import Stars from './components/members/Stars.jsx';
import SimpleChat from './components/chat/SimpleChat.jsx';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

function App() {
  return (
    <CookiesProvider>
     <Router>
       <Switch>
         <Route path='/' exact={true} component={Home}/>
         <Route path='/login_in' exact={true} component={Login}/>
         <Route path='/registration' exact={true} component={Registration}/>
         <Route path='/home' exact={true} component={MainPage}/>
         <Route path='/about_us' exact={true} component={AboutPage}/>
         <Route path='/admin' exact={true} component={Admin}/>
         <Route path='/edit_user/:id' exact={true} component={EditUser}/>
         <Route path='/usr_settings/' exact={true} component={UserSettings}/>
         <Route path='/members/:tag' exact={true} component={Members}/>
         <Route path='/stars/' exact={true} component={Stars}/>
         <Route path='/simple-chat/' exact={true} component={SimpleChat}/>
       </Switch>
     </Router>
    </CookiesProvider>
  );
}

export default App;
