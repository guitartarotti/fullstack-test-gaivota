import React, {Component} from 'react';
import Routes from './routes';
import './App.css';

import '../node_modules/leaflet/dist/leaflet.css';

import Header from './components/header';
import Farms from './pages/farms';
import Farm from './pages/farm';


const App = () => (
   <div className="App">
     <Header/>
     <Routes/>
   </div>
);

export default App;