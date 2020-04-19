import React, { Component } from 'react'
import { Controls, Map, Popup, LayerPanel, loadDataLayer } from '@bayer/ol-kit'
import olStyle from 'ol/style/style'
import olStroke from 'ol/style/stroke'
import olFill from 'ol/style/fill'
import olExtent from 'ol/extent'
import olProj from 'ol/proj';
import olMap from 'ol/map'
import olView from 'ol/view'
import TileLayer from 'ol/layer/tile';
import BingMaps from 'ol/source/bingmaps';
import OSM from 'ol/source/osm';

class App extends Component {
  constructor(props) {
    super(props)

  }
  render() {
    const onMapInit = async map => {
      console.log('we got a map!', map)
      window.map = map
      console.log(map.getLayers())
      const dataLayer2 = await loadDataLayer(map, 'https://maps6.stlouis-mo.gov/arcgis/rest/services/Hosted/Neighborhood_Boundaries/FeatureServer/0/query?f=geojson&where=1=1&returnGeometry=true&outSR=4326&cacheHint=true')

      const features=dataLayer2.getSource().getFeatures()
      console.log(features)
      const tif=features.find(f=>f.get('nhd_name')=='West End')
      console.log(tif)
      tif.setStyle(new olStyle({
        fill: new olFill({
          color: 'rgba(0, 0, 255, 0.3)'
        }),
        stroke: new olStroke({//
          color: 'black'
        })
      }))
      function zoomToFeature(feature) {
        const extent=feature.getGeometry().getExtent()
        const center=olProj.toLonLat(olExtent.getCenter(extent))
        //centerAndZoom(map,{y:center[1],x:center[0],zoom:16})

        // var extent = my_vector_layer.getSource().getExtent();
        map.getView().fit(extent, map.getSize());
      }
      zoomToFeature(tif)
      // const request = await fetch('https://maps6.stlouis-mo.gov/arcgis/rest/services/Hosted/Neighborhood_Boundaries/FeatureServer/0/query?f=geojson&where=1=1&returnGeometry=true&outSR=4326&cacheHint=true')
      // const data = await request.json()
      // const names=data.features.map(f=>f.properties.nhd_name)
      // console.log(names)

      console.log('dataLayer', dataLayer2)
      // centerAndZoom(map,{y:38.622042,x:-90.280927,zoom:12.52})
    }

    var myStyle = {
      "elements": {
          "water": { "fillColor": "#a1e0ff" },
          "waterPoint": { "iconColor": "#a1e0ff" },
          "transportation": { "strokeColor": "#aa6de0" },
          "road": { "fillColor": "#b892db" },
          "railway": { "strokeColor": "#a495b2" },
          "structure": { "fillColor": "#ffffff" },
          "runway": { "fillColor": "#ff7fed" },
          "area": { "fillColor": "#f39ebd" },
          "political": { "borderStrokeColor": "#fe6850", "borderOutlineColor": "#55ffff" },
          "point": { "iconColor": "#ffffff", "fillColor": "#FF6FA0", "strokeColor": "#DB4680" },
          "transit": { "fillColor": "#AA6DE0" }
      },
        "version": "1.0"
    };
    const bingOptions={
      key:'AkmzPc-MgCT7p-2b7GXljWNSVrJRMNnVcNC_WZZrMn7IPoVb5L5VbeiZu8lwcIEQ',
      customMapStyle: myStyle
    }
    const myMap = new olMap({
      view: new olView({
        center: [0, 0],
        zoom: 1
      }),
      layers: [
        new TileLayer({
          source: new BingMaps({
            sourceOpts:bingOptions
          })
        })
      ],
      target: 'map'
    })

    return (
      <Map map={myMap} onMapInit={onMapInit} fullScreen>
        <Controls />
        <Popup />
        <LayerPanel />
      </Map>
    )
  }

}

export default App
