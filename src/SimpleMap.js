import React from 'react';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios'

class SimpleMap extends React.Component {
  constructor() {
    super()
    this.state = {
      lat: 0,
      lng: 0,
      zoom: 5,
      loading: true,
      currentVessels: []
    }
  }

  componentDidMount = () => {
    this.setState({loading: true})

    axios({
      url: 'https://api.vesseltracker.com/api/v1/vessels/userlist/latestpositions',
      method: 'get',
      headers: {
          'Authorization': '15dcbc0e-214a-49e0-8ed9-6f3e0c4a640b',
          'Content-Type': 'application/json'
      }
   })
   .then(response => {
      this.parseVessels(response.data)
   }) 
   .catch(err => {
      console.log(err);
   });

  }

  parseVessels = (response) => {
    this.setState({currentVessels: response.vessels})
  }


  plotCurrentVessels = (vessels) => {
    const vesselPlots = vessels.map(x => ({
      position: [
        x.aisPosition.lat, x.aisPosition.lon
      ], vessel: x.aisStatic.name
    }))

    const vesselPoints = vesselPlots.map((vessel, i) =>{
      return <Marker key={i} position={vessel.position}>
      <Popup>
        <span>{vessel.vessel}</span>
      </Popup>
    </Marker>
    })
    
    return vesselPoints
  }

  render() {
    const position = [this.state.lat, this.state.lng];

    const vessels = this.state.currentVessels

    return (
      <LeafletMap center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        {this.plotCurrentVessels(vessels)}
      </LeafletMap>
    );
  }
}

export default SimpleMap;