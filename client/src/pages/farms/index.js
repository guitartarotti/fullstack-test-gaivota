import React, { Component } from "react";
import { Map, Marker, Popup, TileLayer, Polygon, GeoJSON } from 'react-leaflet';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import { Link } from 'react-router-dom';
import api from '../services/api';

import "./styles.css";

// adiciona os popups no geojson

const GeoJSONWithLayer = props => {
  const handleOnEachFeature = (feature, layer) => {
    let popupContent = "";
    if (props.popupContent.length) popupContent = props.popupContent;
    else if (feature.properties && feature.properties.g_name) {
      popupContent = feature.properties.g_name;
    }

    console.log(layer)

    layer.bindPopup(popupContent);
    layer.on({
      mouseover: e => {
        layer.openPopup();
      },
      mouseout: e => {
        layer.closePopup();
      }
    });
  };
  console.log(props)
  return <GeoJSON {...props} onEachFeature={handleOnEachFeature} popupContent={props.data[0].properties.g_name} />;
}


GeoJSONWithLayer.defaultProps = {
  popupContent: '',
}


export default class Farms extends Component {
  state = {
    farms: [],
    features: [{properties: {g_name: '0'}}],
    lat: 0,
    lng: 0,
    zoom: 16,
    keyMAP: Math.random(),
    ct: 0,
    search: '',
    farm_now: 0,
  };

  constructor(props) {
    super(props);

    this.setMap = this.setMap.bind(this);
  }

  callApi = async () => {
    const response = await api.get('fazendas');
    console.log(response)
    const body = response;
    if (response.status !== 200) throw Error(body.message);
    for (var i = 0; i < body.data.length; i++) {
    	body.data[i].show = 1
      body.data[i].bid = 0
    	if(i == 0){body.data[i].show = 0}
    }
    return body.data;
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ farms: res,  farm_now: res[0].farm_id, lat: res[0].latitude, lng: res[0].longitude, features: res[0].geojson.features}))
      .catch(err => console.log(err));
    setInterval(this.changeActiveMedia.bind(this), 1000);
  }

  //para o mapa ser renderizado com as informações do servidor é rodado a funcão: 'changeActiveMedia'

  changeActiveMedia(){
  	if(this.state.ct < 2){this.setState(prevState =>({ct: 2, keyMAP: Math.random()}))}
  }

  changeBid = (farm_id, value) => {
    this.state.farms[this.state.farms.findIndex(x=> x.farm_id == farm_id)].bid = value
    this.forceUpdate()
  }

  //propriedades do GeoJson

  geoJSONStyle() {
    return {
      color: '#1d2d44',
      weight: '1',
      height: "1",
      fillOpacity: .5,
      fillColor: '#1d2d44',
    }
  }

  //muda o mapa de acordo com a fazenda escolhida, utilizando a mudança do 'keyMAP' para forçar a rederização do mapa

  setMap(farm) {
   if(this.state.farm_now != farm.farm_id){
    this.setState(prevState =>({farm_now: farm.farm_id, lat: farm.latitude, lng: farm.longitude, features: farm.geojson.features, keyMAP: Math.random()}));
    for (var i = 0; i < this.state.farms.length; i++) {
    	if(this.state.farms[i].farm_id != farm.farm_id){
          this.state.farms[i].show = 1
    	} else {
          this.state.farms[i].show = 0
    	}
    }
    this.forceUpdate()
   }
  }


  render() {
  	const { farms } = this.state;
  	const position = [this.state.lat, this.state.lng]
  	let farmsList;
    if (this.state.search.length) {
      const searchPattern = new RegExp(this.state.search.map(term => `(?=.*${term})`).join(''), 'i');
      farmsList = this.state.farms.filter(farm => 
        farm.name.match(searchPattern)
      );
    } else {
      farmsList = this.state.farms;
    }

  	return (
      <div className="app-farms">
    	<div className="content-map">
          <Map key={this.state.keyMAP} style={{ width: "130vh", height: "80vh" }} center={position} zoom={this.state.zoom}>
          <ReactLeafletGoogleLayer googleMapsLoaderConf={{KEY: 'AIzaSyDfQBS6Oeg1M88Vp7zpHES8PKLTeaFE46I'}} type={'satellite'} />
          
           <GeoJSONWithLayer
             key={1}
             data={this.state.features}
             style={this.geoJSONStyle}
           />
         </Map>
    	</div>
    	<div className="content-list">
    	 <input type="text" placeholder="Search" onChange={(e) => this.setState({search: e.target.value.split(' ')})}/>
    	 <div className="list">
          {farmsList.map(farm => (
          	<article key={farm.farm_id} className="farm" onClick={() => this.setMap(farm)}>
                <strong>{farm.name}</strong>
                <div disabled={farm.show == 1} className="info-farm">
                  <p>Culture: <small>{farm.culture}</small></p>
                  <p>Variety: <small>{farm.variety}</small></p>
                  <p>Area: <small>{farm.farm_id}</small></p>
                  <p>Yield estimation: <small>{farm.yield_estimation}</small></p>
                  <p>Total area: <small>{farm.total_area}</small></p>
                  <p>Price: <small>{farm.price}</small></p>
                  <div className="content-buy">
                    <Link className="buy" to={`/buy/${farm.farm_id}/${farm.bid}`}>Buy</Link>
                    <div className="content-input">
                      <input className="x" type="number" name="bid" placeholder="Bid" onChange={(e) => this.changeBid(farm.farm_id, e.target.value)}/>
                    </div>
                    <Link className="more" to={`/farm/${farm.farm_id}`}>Ver mais</Link>
                  </div>
                </div>
              </article>
          ))}
         </div>
        </div>
      </div>
    )
  }
}