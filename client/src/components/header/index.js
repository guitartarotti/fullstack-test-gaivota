import React from 'react';
import logo from './img/logo-gaivota.png';

import "./styles.css";

const Header = () => (
   <header id='main-header'>
     <img src={logo} className="logo" alt="logo" />
     <h1>Login</h1>
   </header>
);

export default Header;