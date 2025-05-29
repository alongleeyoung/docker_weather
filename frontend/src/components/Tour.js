import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Tour() {
  const [localNames, setLocalNames] = useState([]);
  const [counties, setCounties] = useState([]);
  const [tours, setTours] = useState([]);
  const [selectedLocalName, setSelectedLocalName] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedTour, setSelectedTour] = useState("");
  const [tourInfo, setTourInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/localnames")
      .then((response) => {
        setLocalNames(response.data.data);
        console.log("지역이름 값: ", response);
      })
      .catch((error) => console.error("Error fetching local names:", error));
  }, []);

  const handleLocalNameChange = (e) => {
    const localName = e.target.value;
    setSelectedLocalName(localName);
    setSelectedCounty("");
    setSelectedTour("");
    setTourInfo(null);

    axios
      .get(`http://localhost:3001/api/counties/${localName}`)
      .then((response) => {
        setCounties(response.data);
        setTours([]);
      })
      .catch((error) => console.error("Error fetching counties:", error));
  };

  const handleCountyChange = (e) => {
    const county = e.target.value;
    setSelectedCounty(county);
    setSelectedTour("");
    setTourInfo(null);

    axios
      .get(`http://localhost:3001/api/tours/${selectedLocalName}/${county}`)
      .then((response) => {
        setTours(response.data);
      })
      .catch((error) => console.error("Error fetching tours:", error));
  };

  const handleTourChange = (e) => {
    const tour = e.target.value;
    setSelectedTour(tour);

    axios
      .get(
        `http://localhost:3001/api/tourinfo/${selectedLocalName}/${selectedCounty}/${tour}`
      )
      .then((response) => {
        setTourInfo(response.data[0]);
      })
      .catch((error) => console.error("Error fetching tour info:", error));
  };

  const handleSendToWeather = () => {
    navigate("/weather", { state: { tourInfo } });
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ fontSize: "28px", marginBottom: "20px", color: "#4CAF50" }}>
        관광지 검색
      </h2>
      <div>
        <label
          style={{ display: "block", marginBottom: "15px", color: "#555" }}
        >
          지역이름:
          <select
            value={selectedLocalName}
            onChange={handleLocalNameChange}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              marginBottom: "20px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              backgroundColor: "#fff",
              color: "#333",
              fontSize: "16px",
            }}
          >
            <option value="">Select Local Name</option>
            {localNames.map((local) => (
              <option key={local.local_name} value={local.local_name}>
                {local.local_name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {counties.length > 0 && (
        <div>
          <label
            style={{ display: "block", marginBottom: "15px", color: "#555" }}
          >
            시/군/구:
            <select
              value={selectedCounty}
              onChange={handleCountyChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                marginBottom: "20px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                backgroundColor: "#fff",
                color: "#333",
                fontSize: "16px",
              }}
            >
              <option value="">Select County/District</option>
              {counties.map((county) => (
                <option
                  key={county.county_district_name}
                  value={county.county_district_name}
                >
                  {county.county_district_name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      {tours.length > 0 && (
        <div>
          <label
            style={{ display: "block", marginBottom: "15px", color: "#555" }}
          >
            관광지:
            <select
              value={selectedTour}
              onChange={handleTourChange}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                marginBottom: "20px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                backgroundColor: "#fff",
                color: "#333",
                fontSize: "16px",
              }}
            >
              <option value="">Select Tour</option>
              {tours.map((tour) => (
                <option key={tour.tour_name} value={tour.tour_name}>
                  {tour.tour_name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      {tourInfo && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{ fontSize: "22px", marginBottom: "15px", color: "#2196F3" }}
          >
            관광지
          </h3>
          <p style={{ margin: "5px 0", color: "#333" }}>
            지역이름: {tourInfo.local_name}
          </p>
          <p style={{ margin: "5px 0", color: "#333" }}>
            시/군/구: {tourInfo.county_district_name}
          </p>
          <p style={{ margin: "5px 0", color: "#333" }}>
            관광지 이름: {tourInfo.tour_name}
          </p>
          <p style={{ margin: "5px 0", color: "#333" }}>
            X 좌표: {tourInfo.x_coordinate}
          </p>
          <p style={{ margin: "5px 0", color: "#333" }}>
            Y 좌표: {tourInfo.y_coordinate}
          </p>
          <p style={{ margin: "5px 0", color: "#333" }}>
            주소: {tourInfo.address}
          </p>
          <p style={{ margin: "5px 0", color: "#333" }}>
            컨텐츠 유형: {tourInfo.content_type}
          </p>
          <button
            onClick={handleSendToWeather}
            style={{
              marginTop: "10px",
              padding: "10px 15px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            날씨 확인
          </button>
        </div>
      )}
    </div>
  );
}

export default Tour;
