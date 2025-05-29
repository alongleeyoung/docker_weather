import React, { useEffect } from "react";
const { Tmapv2 } = window;

const TMAP = ({ xCoordinate, yCoordinate }) => {


  function initTmap() {
    const map = new window.Tmapv2.Map("map_div", {
      center: new Tmapv2.LatLng(yCoordinate, xCoordinate), // Initial coordinates
      width: "800px",
      height: "600px",
      zoom: 17,
    });

    var marker = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(yCoordinate, xCoordinate), //Marker의 중심좌표 설정.
      map: map, //Marker가 표시될 Map 설정..
    });
  }

  useEffect(() => {
    // Cleanup function to remove the existing map instance
    return () => {
      const mapDiv = document.getElementById("map_div");
      if (mapDiv) {
        while (mapDiv.firstChild) {
          mapDiv.removeChild(mapDiv.firstChild);
        }
      }
    };
  }, []);

  useEffect(() => {
    // Initialize the map after the component has rendered
    initTmap();
  }, []);

  return <div id="map_div" />;
};

export default TMAP;
