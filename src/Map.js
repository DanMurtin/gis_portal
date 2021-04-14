import React from 'react';
import Cesium from "cesium";
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';

// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import { PointCloudLayer} from '@deck.gl/layers';
import {Tile3DLayer} from '@deck.gl/geo-layers';
import {MapboxLayer} from '@deck.gl/mapbox';
import { LASLoader } from '@loaders.gl/las/dist/es5/las-loader';
import {Tiles3DLoader} from '@loaders.gl/3d-tiles';

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = 'pk.eyJ1IjoiZG11cnRpbiIsImEiOiJja2xxbDEwZmUxZTJwMm5uM2p4ZHFjZDJtIn0.Gl80fK3AEJttFgk5S-P4Mw';

export class Map extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      lng: 19.8517,
      lat: 45.2461,
      zoom: 15,
      pitch: 60
      };
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    const { lng, lat, zoom, pitch} = this.state;
    const map = new mapboxgl.Map({
    container: this.mapContainer.current,
    style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
    center: [lng, lat],
    zoom: zoom,
    pitch: pitch
    });
     
    map.on('move', () => {
    this.setState({
    lng: map.getCenter().lng.toFixed(4),
    lat: map.getCenter().lat.toFixed(4),
    zoom: map.getZoom().toFixed(2)
    });
    });

    map.on('load', () => {
      const pctile = new MapboxLayer({
        id: 'Point Tiles',
        mode: 'no-cors',
        type: Tile3DLayer,
        pointSize: 2,
        data: 'http://localhost:3000/pc_tiles/tileset.json',
        loader: Tiles3DLoader
      });
      map.addLayer(pctile)

      const layer = new MapboxLayer({
        id: 'CityGML Tiles',
        type: Tile3DLayer,
        // tileset json file url
        data: 'http://localhost:3000/gml_tiles/tileset.json',
        loader: [Tiles3DLoader],
        // https://cesium.com/docs/rest-api/
        
      });
      map.addLayer(layer)
      map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
        });
        // add the DEM source as a terrain layer with exaggerated height
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
         
        // add a sky layer that will show when the map is highly pitched
        map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
        'sky-type': 'atmosphere',
        'sky-atmosphere-sun': [0.0, 0.0],
        'sky-atmosphere-sun-intensity': 15
        }
        });
        
    });

    var toggleableLayerIds = ['Point Tiles','CityGML Tiles'];
 
    // set up the corresponding toggle button for each layer
    for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function (e) {
    var clickedLayer = this.textContent;
    e.preventDefault();
    e.stopPropagation();

    var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

    // toggle layer visibility by changing the layout object's visibility property
    if (visibility === 'visible') {
    map.setLayoutProperty(clickedLayer, 'visibility', 'none');
    this.className = '';
    } else {
    this.className = 'active';
    map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
    }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
    }
    

    }

  render() {
    
    const {lng, lat, zoom} = this.state
    return (
      <div>
    <div className="latlong">
    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
    </div>
    <nav id="menu"></nav>
    <div className="map-container" ref={this.mapContainer} />
    </div>
    )

  }
  

}
  