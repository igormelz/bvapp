import React, { useRef, useEffect } from "react";
import axios from "axios";
import { Container, Header, Content } from "rsuite";
import { loadModules } from "esri-loader";
import { fmtDate } from "../utils/helper";
import "./SubMap.css";

const SubMap = () => {
  const mapRef = useRef();

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
        "esri/widgets/BasemapToggle",
      ],
      { css: true }
    ).then(([ArcGISMap, MapView, Graphic, GraphicsLayer, BasemapToggle]) => {
      // contruct layer
      const sublayer = new GraphicsLayer();
      // add point
      axios
        .get(`${process.env.REACT_APP_API_URL}/public/submarine/location`)
        .then((response) => {
          sublayer.graphics = response.data.submarine.map(
            (s) =>
              new Graphic({
                geometry: {
                  type: "point",
                  longitude: s.location.coordinates[1],
                  latitude: s.location.coordinates[0],
                },
                symbol: {
                  type: "simple-marker",
                  color: [226, 119, 40], // orange
                  style: "triangle",
                  outline: {
                    color: [255, 255, 255], // white
                    width: 1,
                  },
                },
                attributes: {
                  Name: s.label,
                  Fate: s.fate,
                  End: fmtDate(s.enddate),
                },
                popupTemplate: {
                  title: "{Name}",
                  content: "{Fate}<br/>{End}",
                },
              })
          );
        })
        .catch((e) => console.log("err:" + e));

      // seeigel
      // let seeigel = new FeatureLayer({
      //   url: 'https://services3.arcgis.com/CIDdHOPU5KZYnaS8/arcgis/rest/services/seeigel/FeatureServer/0'
      // })

      const map = new ArcGISMap({
        basemap: "oceans",
        layers: [sublayer],
      });

      // add seeigel
      //map.add(seeigel, 0);

      // load the map view at the ref's DOM node
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [23, 58],
        zoom: 6,
      });

      // add baseselect
      var basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "hybrid",
      });
      view.ui.add(basemapToggle, "bottom-right");

      return () => {
        if (view) {
          // destroy the map view
          view.container = null;
        }
      };
    });
  }, []);

  return (
    <Container>
      <Header>Map</Header>
      <Content>
        <div className="webmap" ref={mapRef} />
      </Content>
    </Container>
  );
};

export default SubMap;
