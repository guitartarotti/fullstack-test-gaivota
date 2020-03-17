import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import Cookie from "js-cookie"

import api from '../services/api';

import "./styles.css";

export default class Farm extends Component {
  state = {
    video: 'https://s3.amazonaws.com/appmysystem/wall/wallsystem.mp4'
  }
  
  signIn = async () => {
    try {
      const response = await api.post('login', {
        email: this.state.email, //'admin@gaivota',
        password: this.state.password, //'admin',
      });
  
      const { user, token } = response.data;
      Cookie.set("token", token);
      const { history } = this.props;
      history.push('/farms');
    } catch (err) {
      console.log(err)
      return err
    }
  }
  


  render() {

    return (
      <div className="app-farms">
        <video width="100%" height="100%" autoplay="" className="videotag"  loop={true} muted="">
           <source src={this.state.video} type="video/mp4"></source>
        </video>
        <div className="content-login">
         <div className="login">
          <input type="email" placeholder="Email" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})}/>
          <input type="password" placeholder="Password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/>
          <button onClick={() => this.signIn()}>Entrar</button>
         </div>
        </div>
      </div>
    )
  }
}