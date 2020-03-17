import React, { Component } from "react";
import PaymentCard from 'react-payment-card-component';

import api from '../services/api';

import "./styles.css";
import logo from './img/paypal.png';


export default class Buy extends Component {
  state = {
    card: {
      fName: '',
      sName: '',
      number: '',
      expiration: '',
      ccv: '',
    },
    show: 2,
    farm: {},
    state: {},
    type: 0,
    bid: 0,
    total: 0
  };

  callApi = async () => {
    const { id } = this.props.match.params;
    var bid = Number(this.props.match.params.bid);
    if(bid > 0){this.setState({type: 1, bid: bid, total: bid})}
    const response = await api.get('buy/'+id);
    const body = response.data;
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  componentDidMount() {
    this.callApi()
      .then((res) => {
        this.setState(prevState =>({farm: res[0],  lat: res[0].latitude, lng: res[0].longitude}));
        fetch('http://open.mapquestapi.com/geocoding/v1/reverse?key=yO3Vp8LpnaQqHHEnaAwOYoukQMrXxLNB&location='+this.state.lat+','+this.state.lng+'&includeRoadMetadata=true&includeNearestIntersection=true')
        .then((res) => {
          var body = res.json()
          body.then((result)=> {
            this.setState({city: result.results[0].locations[0].adminArea5, country: result.results[0].locations[0].adminArea1, state: result.results[0].locations[0].adminArea3})
          })
        })
        .catch(console.log)
      })
      .catch(err => console.log(err));
  }

  flipCard = (t) => {
    if(t == 0 && this.state.flipped){
      const flipped = !this.state.flipped
      this.setState({ flipped })
    } else if(t == 1 && !this.state.flipped) {
      const flipped = !this.state.flipped
      this.setState({ flipped })
    }
  }

  changeField = (value, field) => {
    this.state.card[field] = value.target.value
    this.forceUpdate()
    if(field == 'ccv'){var t = 1} else {var t = 0}
    this.flipCard(t)
  }

  changeMethod = (type) => {
    this.setState({show: type})
  }

  changeBid = (value) => {
    this.setState(prevState =>({bid: value, total: value}))
  }


  render() {
    const { card, flipped, show, state, city, country, farm, type, bid, total } = this.state;

    return (
      <div className="content-buy-now">
       <div className="content-bid">
          <div className="content-info-farm">
            <strong>{`${farm.name} - (${farm.farm_id})`}</strong>
            <p>{`${city}, ${state} - ${country} `}</p>
          </div>
          <div className="bid" disabled={type == 0}>
            <p>Price: <small>{farm.price}</small> $/sac</p>
            <div className="content-input">
              <title>Offer Bid</title>
              <input type="number" name="bid" placeholder="Bid" value={bid} onChange={(e) => this.changeBid(e.target.value)}/>
              <title>$</title>
            </div>
            <h5>Total: <small>{total}</small>$</h5>
          </div>
          <div className="divisor x"></div>
          <div className="content-type-method">
            <strong>Tipo de Pagamento</strong>
            <div className="content-buy">
              <button className="buy" disabled={show == 0} onClick={() => this.changeMethod(0)}>Credit Card</button>
              <button className="more" disabled={show == 1} onClick={() => this.changeMethod(1)}>PayPal</button>
            </div>
          </div>
       </div>
       <div className="divisor"></div>
       <div className="methodpag">
            <form className="form-credit-card" disabled={show == 1 || show == 2}>
              <div className="form-container">
                <div className="personal-information">
                  <h1>Payment Information</h1>
                </div>
                 
                <input id="column-left" type="text" name="first-name" placeholder="First Name" onChange={(e) => this.changeField(e, 'fName')}/>
                <input id="column-right" type="text" name="last-name" placeholder="Surname" onChange={(e) => this.changeField(e, 'sName')}/>
                <input id="input-field" type="text" name="number" placeholder="Card Number" onChange={(e) => this.changeField(e, 'number')}/>
                <input id="column-left" type="text" name="expiry" placeholder="MM / YY" onChange={(e) => this.changeField(e, 'expiration')}/>
                <input id="column-right" type="text" name="cvc" placeholder="CCV" onChange={(e) => this.changeField(e, 'ccv')}/>
               
                <div className="card-wrapper">
                  <PaymentCard
                    bank="default"
                    brand="mastercard"
                    number={card.number}
                    cvv={card.ccv}
                    holderName={`${card.fName} ${card.sName}`}
                    expiration={card.expiration}
                    flipped={flipped}
                  />
                </div>
  
              </div>
            </form>

           <div className="paypal-login" disabled={show == 0 || show == 2}>
             <div className="login-paypal">
              <div className="content-icon">
                <img src={logo}/>
              </div>
              <div className="login">
                <input type="email" name="first-name" placeholder="Email"/>
                <input type="password" name="last-name" placeholder="Password"/>
              </div>
             </div>
           </div>
           <div className="content-buy" disabled={show == 2}>
             <button className="buy">Buy</button>
           </div>
        </div>
      </div>
    )
  }
}