import useScript from "../Hooks/useScript";
import { useEffect, useState } from "react";
let markersGoogle = [];

function MyMap({ markersState }) {
  const isLoaded = useScript();
  const [map, setMap] = useState();

  function resetMapOnAll() {
    for (let i = 0; i < markersGoogle.length; i++) {
      markersGoogle[i].setMap(null);
    }
  }

  function addMarker(markerData) {
    if (markerData.isVisible) {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map,
      });

      markersGoogle.push(marker);
    }
  }

  useEffect(() => {
    if (isLoaded) {
      const map = new window.google.maps.Map(document.getElementById("mapp"), {
        center: { lat: -37.80939542254263, lng: 144.94338958478298 },
        zoom: 14,
      });
      setMap(map);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (map) {
      markersState.map((marker) => {
        addMarker(marker);
      });
    }

    return () => {
      resetMapOnAll();
    };
  }, [map, markersState]);

  return (
    <>
      <div
        style={{
          height: "500px",
          width: "1000px",
          border: "1px solid lightgrey",
        }}
        id="mapp"
      >
        loading...
      </div>
    </>
  );
}

export default MyMap;
