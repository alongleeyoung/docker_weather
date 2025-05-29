import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Main.css";

// Cognito 설정 상수
const COGNITO_DOMAIN = "https://ap-northeast-2aspxc0lqo.auth.ap-northeast-2.amazoncognito.com";
const CLIENT_ID = "1g7tqsl41uav7sa9bh43lfliju";
const REDIRECT_URI = "http://localhost:3000"; // 리액트 앱 실행되는 URL로 변경 필요
const LOGOUT_URI = "http://localhost:3000"; // 로그아웃 후 리다이렉트할 URL

function Main() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL에서 인증 코드 파라미터 체크
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    
    if (code) {
      // 코드가 있으면 백엔드에서 토큰 교환 처리
      handleAuthCode(code);
    } else {
      // 로컬 스토리지에서 인증 상태 확인
      checkAuthState();
    }
  }, [location]);

  // 인증 코드로 토큰 교환 및 사용자 정보 가져오기
  const handleAuthCode = async (code) => {
    try {
      
      localStorage.setItem("isAuthenticated", "true");
      
      // 인증 코드 파라미터 제거를 위한 URL 재설정
      window.history.replaceState({}, document.title, "/");
      
      setIsAuthenticated(true);
      
      
      setUserInfo({
        username: "사용자"
      });
    } catch (error) {
      console.error("인증 처리 중 오류:", error);
      localStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
    }
  };

  // 인증 상태 확인
  const checkAuthState = () => {
    const authState = localStorage.getItem("isAuthenticated");
    if (authState === "true") {
      setIsAuthenticated(true);
      
      setUserInfo({
        username: "사용자"
      });
    } else {
      setIsAuthenticated(false);
    }
  };

  // Cognito 로그인 페이지로 이동
  const handleLogin = () => {
    const loginUrl = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+phone&redirect_uri=${REDIRECT_URI}`;
    window.location.href = loginUrl;
  };

  // Cognito 로그아웃
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    setUserInfo(null);
    
    // Cognito 로그아웃 엔드포인트로 리다이렉션
    const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${LOGOUT_URI}`;
    window.location.href = logoutUrl;
  };

  // Tour 페이지로 이동
  const goToTour = () => {
    navigate("/tour");
  };
  

  return (
    <div className="main-container">
      <div className="header">
        <h1>관광지 날씨 정보 서비스</h1>
      </div>
      
      <div className="content">
        {isAuthenticated ? (
          <div className="authenticated">
            <h2>환영합니다 {"leeyoungjae"}님!</h2>
            <p>관광지 정보와 날씨를 확인하려면 아래 버튼을 클릭하세요.</p>
            <div className="button-container">
              <button className="tour-button" onClick={goToTour}>
                관광지 검색
              </button>
              <button className="logout-button" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-container">
            <div className="login-message">
              <h2>관광지 날씨 정보 서비스에 오신 것을 환영합니다</h2>
              <p>서비스를 이용하려면 로그인이 필요합니다.</p>
              <button className="login-button" onClick={handleLogin}>
                Amazon Cognito로 로그인
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="footer">
        <p>&copy; 2025 관광지 날씨 정보 서비스. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Main;