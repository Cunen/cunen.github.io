import React from "react";
import styled from "styled-components";

import "ol/ol.css";

import { Feature, Map as OlMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Heatmap from "ol/layer/Heatmap";
import VectorSource from "ol/source/Vector";
import Polyline from "ol/format/Polyline";
import { Point } from "ol/geom";
import Coordinate from "ol/coordinate";

let map = undefined;

function generateLayer(activities) {
  /*
  const styles = {
    route: new Style({
      stroke: new Stroke({
        width: 3,
        color: [255, 0, 0, 0.8],
      }),
    }),
  };
  */

  const activitiesWithLines = activities.filter((a) => !!a.encodedPolyline);

  console.log("Activities with location:", activitiesWithLines.length);

  const coordinateSet = activitiesWithLines.map((a) => {
    return new Polyline()
      .readGeometry(a.encodedPolyline, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      })
      .getCoordinates();
  });

  console.log("Coordiante sets:", coordinateSet.length);

  const pointFeatures = coordinateSet.flatMap((set) => {
    return set.map((coord) => new Feature({ geometry: new Point(coord) }));
  });

  console.log("Heatmap points: ", pointFeatures.length);

  const features = activities
    .map((act) => {
      if (!act.encodedPolyline) return null;
      return new Feature({
        type: "route",
        geometry: new Polyline().readGeometry(act.encodedPolyline, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }),
      });
    })
    .filter(Boolean);
  const source = new VectorSource({ features: pointFeatures });
  return new Heatmap({ source, blur: 5, radius: 3, opacity: 0.8 });
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
