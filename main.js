import Map from 'ol/Map';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Stroke from 'ol/style/Stroke'; 
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
import { useGeographic } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM'

const map = new Map({
  target: 'map', 
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ]
});

// necessary to use with longitude and altitude
useGeographic();

// polyigon vectors handler
const vectorSource = new VectorSource();

// vector layer handler
const vectorLayer = new VectorLayer({
  source: vectorSource
});


/**
 * JOSON provided is not in expected format.
 * Headers added and additionam [] to define circle of polygon
 */
const geojsonFormat = new GeoJSON();

/**
 * loading and proccessing json data
 */
fetch('polygon.json')
  .then(response => response.json())
  .then(data => {

    let features;
    
    try {
      // features from the data loaded
      features = geojsonFormat.readFeatures(data);
      //console.log(features);
    } catch (error) {
      // error if no features found in geoJSON
      console.log('Error parsing GeoJSON: ' + error);
      return;
    }
    
    // if features are not empty check
    if (features.length > 0) {
    
      // Style polygon fill - color that polyigon will be filled
      const fill = new Fill({
        color: 'rgba(0,125,0,0.5)'
      });

      // Style polygon outline - black outline of polyigon
      const stroke = new Stroke({
        color: 'black',
        width: 5
      });

      // Create polygon style  - define style an outline
      const style = new Style({
        fill: fill,
        stroke: stroke
      });

      // set style an outline
      vectorLayer.setStyle(style);

      // Add features
      vectorSource.addFeatures(features);
      // add additional layer
      map.addLayer(vectorLayer);

      // setup zoom levele
      const extent = vectorSource.getExtent();
      //console.log(extent)
      map.getView().fit(extent);

    } else {
      console.log('No features found'); 
    }

  });
