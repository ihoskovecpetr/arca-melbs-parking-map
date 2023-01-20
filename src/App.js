import React, { useEffect, useState } from "react";
import "./App.css";
import Map from "./Components/Map";
const set1 = new Set();

function App() {
  const [isOccupied, setIsOccupied] = useState(true);
  const [fetchCount, setFetchCount] = useState(20);
  const [markersState, setMarkersState] = useState([]);
  const [parkingZones, setParkingZones] = useState([]);
  const [selectedParkingZone, setSelectedParkingZone] = useState();

  const fetchData = (isOccupied, parkingZoneNr, fetchCount) => {
    fetch(
      `https://data.melbourne.vic.gov.au/api/records/1.0/search/?dataset=on-street-parking-bay-sensors&q=${
        isOccupied ? "status%3DPresent" : ""
      }${
        parkingZoneNr ? "&q=parking_zone%3D" + parkingZoneNr : ""
      }&rows=${fetchCount}&facet=status&facet=parking_zone&facet=last_updated`
    )
      .then((response) => response.json())
      .then((data) => {
        setMarkersState(
          data.records.map((record) => {
            set1.add(record.fields.parking_zone);

            return {
              position: {
                lat: record.geometry.coordinates[1],
                lng: record.geometry.coordinates[0],
              },
              meta: {
                ...record.fields,
              },
              isVisible: true,
            };
          })
        );

        setParkingZones(Array.from(set1));
      });
  };

  useEffect(() => {
    fetchData(isOccupied, selectedParkingZone, fetchCount);
  }, [isOccupied, selectedParkingZone, fetchCount]);

  return (
    <div className="App">
      <Map markersState={markersState} setMarkersState={setMarkersState} />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-around",
        }}
      >
        <div style={{ width: "200px", height: "400px", overflow: "scroll" }}>
          {markersState?.map((parking, index) => (
            <p style={{ textAlign: "left" }}>
              bay_id: {parking.meta.bay_id}
              {"\n"}
              parking_zone:
              {parking.meta.parking_zone}
              <input
                type="checkbox"
                checked={parking.isVisible}
                onChange={(e) => {
                  const newMarkers = [...markersState];
                  newMarkers[index].isVisible = e.target.checked;
                  setMarkersState(newMarkers);
                }}
              />
            </p>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "inline" }}>
            <label style={{ fontSize: "14px" }} for="isOccupied">
              Only is occupied?
            </label>
            <input
              type="checkbox"
              name="isOccupied"
              checked={isOccupied}
              onChange={(e) => {
                console.log("setFetchdMarkers", { target: e.target.checked });
                setIsOccupied(e.target.checked);
              }}
            />
          </div>
          <select
            name="cars"
            id="cars"
            onChange={(e) => {
              console.log({ e: e.target.value });
              setSelectedParkingZone(e.target.value);
            }}
          >
            {parkingZones.map((zone) => (
              <option value={zone}>{zone}</option>
            ))}
          </select>
          <div style={{ display: "inline" }}>
            <label style={{ fontSize: "14px" }} for="isOccupied">
              Number of Parking places?
            </label>
            <input
              type="number"
              name="isOccupied"
              value={fetchCount}
              onChange={(e) => {
                setFetchCount(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
