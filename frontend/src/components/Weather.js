import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import TMAP from "./TMAP";
import "../css/Weather.css"; // CSS 파일 가져오기

function Weather() {
  const location = useLocation();
  const tourInfo = location.state?.tourInfo;
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tourInfo) {
      setLoading(false);
      return;
    }

    const { local_name, county_district_name } = tourInfo;
    console.log("지역이름 시군구 데이터 값: ", tourInfo);
    // 백엔드 API 호출하여 x, y 좌표 가져오기
    axios
      .get(
        `http://localhost:3001/api/weather/${tourInfo.local_name}/${tourInfo.county_district_name}`
      )
      .then((response) => {
        const { success, xCoordinate, yCoordinate } = response.data;
        console.log("데이터 값: ", response.data);

        if (success) {
          // 날씨 API 호출
          const serviceKey =
            "ZnSDLYX6GBQJhwHEovc9Ksjru51LMlYNCiUKsH7%2FdWg6yjvtR9j%2BsqrsSIUMpmgoOEKSrgBOuOc5eLBzA3zmpQ%3D%3D"; // 환경 변수에서 가져옴
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const day = String(now.getDate()).padStart(2, "0");
          const baseTime = "0200";
          const apiUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${serviceKey}&numOfRows=1000&pageNo=1&base_date=${year}${month}${day}&base_time=${baseTime}&nx=${xCoordinate}&ny=${yCoordinate}&dataType=JSON`;

          axios
            .get(apiUrl)
            .then((response) => {
              const data = response.data.response.body.items.item;

              // 필요한 날씨 데이터 추출
              const maxTemp = data.find(
                (item) => item.category === "TMX"
              )?.fcstValue; // 최고 기온
              const minTemp = data.find(
                (item) => item.category === "TMN"
              )?.fcstValue; // 최저 기온
              const currentTemp = data.find(
                (item) =>
                  item.category === "TMP" &&
                  item.fcstTime ===
                    now.getHours().toString().padStart(2, "0") + "00"
              )?.fcstValue; // 실시간 기온
              const skyCode = data.find(
                (item) =>
                  item.category === "SKY" &&
                  item.fcstTime ===
                    now.getHours().toString().padStart(2, "0") + "00"
              )?.fcstValue; // 하늘상태 코드
              const precipitationProb = data.find(
                (item) =>
                  item.category === "POP" &&
                  item.fcstTime ===
                    now.getHours().toString().padStart(2, "0") + "00"
              )?.fcstValue; // 강수 확률

              // 하늘상태 코드에 따른 설명
              let skyCondition;
              switch (skyCode) {
                case "1":
                  skyCondition = "맑음";
                  break;
                case "3":
                  skyCondition = "구름많음";
                  break;
                case "4":
                  skyCondition = "흐림";
                  break;
                default:
                  skyCondition = "알 수 없음";
                  break;
              }

              // 날씨 데이터 상태 업데이트
              setWeatherData({
                maxTemp,
                minTemp,
                currentTemp,
                skyCondition,
                precipitationProb,
              });
              setLoading(false);
            })
            .catch((error) => {
              console.error("날씨 데이터를 가져오는 중 오류 발생:", error);
              setLoading(false);
            });
        } else {
          console.error(
            "날씨 정보를 가져오는 중 에러 발생:",
            response.data.message
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("날씨 API 호출 중 에러 발생:", error);
        setLoading(false);
      });
  }, [tourInfo]);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="weather-container">
      <div className="map-container">
        <TMAP
          xCoordinate={tourInfo.x_coordinate}
          yCoordinate={tourInfo.y_coordinate}
        />
      </div>
      <div className="info-container">
        {tourInfo && (
          <div className="tour-info">
            <h2>관광지: {tourInfo.tour_name}</h2>
            <p>주소: {tourInfo.address}</p>
          </div>
        )}
        <div className="weather-info">
          {weatherData ? (
            <div>
              <p>
                <h1>날씨 정보</h1>
              </p>
              <p>
                <span>최고 기온:</span> {weatherData.maxTemp} °C
              </p>
              <p>
                <span>최저 기온:</span> {weatherData.minTemp} °C
              </p>
              <p>
                <span>실시간 기온:</span> {weatherData.currentTemp} °C
              </p>
              <p>
                <span>하늘 상태:</span> {weatherData.skyCondition}
              </p>
              <p>
                <span>강수 확률:</span> {weatherData.precipitationProb} %
              </p>
            </div>
          ) : (
            <p>날씨 정보를 가져오는 중...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Weather;
