import React, { Component } from "react";
import { Map, Marker, Popup, TileLayer, Polygon, GeoJSON } from 'react-leaflet';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
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
  
  return <GeoJSON {...props} onEachFeature={handleOnEachFeature} popupContent={props.data[0].properties.g_name} />;
}


GeoJSONWithLayer.defaultProps = {
  popupContent: '',
}


export default class Farm extends Component {
  state = {
    farm: [],
    features: [{properties: {g_name: '0'}}],
    lat: 0,
    lng: 0,
    zoom: 16,
    keyMAP: Math.random(),
    ct: 0,
    optionChart: {},
    // dados default para o grafico ser apresentado com dados antes mesmo da api trazer os dados do servidor
    dataChart: {
        datasets: [{
            label: 'Precipitação',
            data: [10, 20, 30, 40],
            order: 1,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 0.5)',
            borderWidth: 2,
            yAxisID: 'A'
        }, {
            label: 'NDVI',
            data: [30, 20, 60, 40],
            type: 'line',
            order: 2,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 0.5)',
            borderWidth: 2,
            yAxisID: 'B'
        }],
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        options: {
          scales: {
            yAxes: [{
              id: 'A',
              type: 'linear',
              position: 'left'
            }, {
              id: 'B',
              type: 'linear',
              position: 'right',
              ticks: {
                max: 10,
                min: 0
              }
            }]
          }
        }
    },
    bid: 0,
  };

  callApi = async () => {
    const { id } = this.props.match.params;
    const response = await api.get('fazenda/'+id);
    const body = response.data;
    if (response.status !== 200) throw Error(body.message);
    console.log(body[0].precipitation)
    this.refactorData(body[0].precipitation, 0)
    this.refactorData(body[0].ndvis, 1)
    return body;
  };

  componentDidMount() {
    this.callApi()
      .then((res) => {
        this.setState(prevState =>({ farm: res[0],  lat: res[0].latitude, lng: res[0].longitude, features: res[0].geojson.features, crs: res[0].geojson.crs}))
        fetch('http://open.mapquestapi.com/geocoding/v1/reverse?key=yO3Vp8LpnaQqHHEnaAwOYoukQMrXxLNB&location='+this.state.lat+','+this.state.lng+'&includeRoadMetadata=true&includeNearestIntersection=true')
        .then((res) => {
          var body = res.json()
          body.then((result)=> {
            this.setState({city: result.results[0].locations[0].adminArea5, country: result.results[0].locations[0].adminArea1, state: result.results[0].locations[0].adminArea3})
          })
        })
        .catch(console.log)
        setInterval(this.changeActiveMedia.bind(this), 500);
      })
      .catch(err => console.log(err));
  }

  //para o mapa ser renderizado com as informações do servidor é rodado a funcão: 'changeActiveMedia'

  changeActiveMedia(){
    if(this.state.ct < 2){
      this.setState(prevState =>({ct: 2, keyMAP: Math.random()}))
    }
  }

  //refatora todas informações: Precipitation e NDVI, transformando para o padrão do chart.js

  refactorData = (dados, t) => {
    var datas = []
    for (var i = 0; i < dados.length; i++) {
      datas.push({year: dados[i].year, array:[0,0,0,0,0,0,0,0,0,0,0,0]})
      var last = datas.length-1
      for (var ii = 0; ii < dados[i].array.length; ii++) {
        datas[last].array[new Date(dados[i].array[ii].date).getMonth()] = dados[i].array[ii].data +  datas[last].array[new Date(dados[i].array[ii].date).getMonth()]
      }
    }
    if(t == 0){
      this.setState({precipitation: datas, search: datas[datas.length-1].year})
      this.state.dataChart.datasets[0].data = datas[datas.length-1].array
      this.forceUpdate()
    } else {
      this.setState({ndvis: datas, search: datas[datas.length-1].year}) 
      this.state.dataChart.datasets[1].data = datas[datas.length-1].array
      this.forceUpdate()
    }
  }

  //muda as informações: Precipitation e NDVI, do grafico para o ano desejado

  changeYear = (year) => {
    var precipitation = this.state.precipitation
    var ndvis = this.state.ndvis
    var newPrecipitation = [0,0,0,0,0,0,0,0,0,0,0,0]
    var newNdvis = [0,0,0,0,0,0,0,0,0,0,0,0]
    for (var i = 0; i < precipitation.length; i++) {
      if(year == precipitation[i].year){
        newPrecipitation = precipitation[i].array
      }
    }
    for (var i = 0; i < ndvis.length; i++) {
      if(year == ndvis[i].year){
        newNdvis = ndvis[i].array
      }
    }
    this.state.search = year
    this.state.dataChart.datasets[0].data = newPrecipitation
    this.state.dataChart.datasets[1].data = newNdvis
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


  render() {
    const { farm, bid } = this.state;
    const position = [this.state.lat, this.state.lng]

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
       <strong>{`${this.state.city}, ${this.state.state} - ${this.state.country} `}</strong>
       <div className="content-chart">
         <Bar data={this.state.dataChart} options={this.state.dataChart.options} width={100} height={100}/>
       </div>
       <input type="text" value={this.state.search} onChange={(e) => this.changeYear(e.target.value)}/>
       <div className="list">
          
            <article className="farm">
                <strong>{farm.name}</strong>
                <div disabled={farm.show == 1} className="info-farm">
                  <p>Culture: <small>{farm.culture}</small></p>
                  <p>Variety: <small>{farm.variety}</small></p>
                  <p>Area: <small>{farm.farm_id}</small></p>
                  <p>Yield estimation: <small>{farm.yield_estimation}</small></p>
                  <p>Total area: <small>{farm.total_area}</small></p>
                  <p>Price: <small>{farm.price}</small></p>
                  <div className="content-buy">
                    <Link className="buy" to={`/buy/${farm.farm_id}/${bid}`}>Buy</Link>
                    <div className="content-input">
                      <input type="number" name="bid" placeholder="Bid" onChange={(e) => this.setState({bid: e.target.value})}/>
                    </div>
                  </div>
                </div>
              </article>
          
         </div>
        </div>
      </div>
    )
  }
}