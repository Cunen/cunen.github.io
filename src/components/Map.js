import React from "react";
import styled from "styled-components";

import "ol/ol.css";

import { Feature, Map as OlMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Polyline from "ol/format/Polyline";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";

let map = undefined;

function generateLayer(activities) {
  const styles = {
    route: new Style({
      stroke: new Stroke({
        width: 3,
        color: [255, 0, 0, 0.8],
      }),
    }),
  };

  const features = activities
    .map((act) => {
      if (!act.encodedPolyline) return null;
      return new Feature({
        type: 'route',
        geometry: new Polyline().readGeometry(act.encodedPolyline, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }),
      });
    })
    .filter(Boolean);
  const source = new VectorSource({ features });
  return new VectorLayer({ source, style: (f) => styles[f.get("type")] });
}

function Map({ activities }) {
  const [mapInit, setMapInit] = React.useState(false);
  const [activitiesInit, setActivitiesInit] = React.useState(false);

  React.useEffect(() => {
    if (!mapInit) {
      map = new OlMap({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      });
      setMapInit(true);
    }

    // Hacky check
    if (activities.length >= 100 && !activitiesInit) {
      const layer = generateLayer(activities);
      map.addLayer(layer);
      setActivitiesInit(true);
    }
  }, [activities, activitiesInit, mapInit]);

  return <Container id="map"></Container>;
}

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default Map;
