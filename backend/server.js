const express = require('express');
const cors = require('cors');
const multer = require('multer');
const session = require('express-session');
const { Issuer, generators } = require('openid-client');
const db = require('./database/db');

const app = express();

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000', // 리액트 앱 URL
  credentials: true
}));

// 세션 설정
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // HTTPS를 사용하는 경우 true로 설정
}));

// Express 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Cognito 클라이언트 초기화
let client;
async function initializeClient() {
  const issuer = await Issuer.discover('https://cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_ASPxC0LQO');
  client = new issuer.Client({
    client_id: '1g7tqsl41uav7sa9bh43lfliju',
    client_secret: 'sveitahhur3d2sh0l7bvmrfp1dfudsk7sl0sohueb5e5gkt87pc', // 실제 클라이언트 시크릿으로 변경
    redirect_uris: ['http://localhost:3000'],
    response_types: ['code']
  });
}
initializeClient().catch(console.error);

// 인증 확인 미들웨어
const checkAuth = (req, res, next) => {
  if (!req.session.userInfo) {
    req.isAuthenticated = false;
  } else {
    req.isAuthenticated = true;
  }
  next();
};

// 보호된 API에 대한 인증 미들웨어
const requireAuth = (req, res, next) => {
  if (!req.session.userInfo) {
    return res.status(401).json({ success: false, message: '로그인이 필요합니다' });
  }
  next();
};

// ===== Cognito 인증 관련 라우트 =====

// 토큰 교환 엔드포인트
app.post('/api/auth/token', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: '인증 코드가 필요합니다' });
    }
    const tokenSet = await client.callback(
      'http://localhost:3000', // redirect_uri와 동일해야 함
      { code },
      { nonce: req.session.nonce, state: req.session.state }
    );
    const userInfo = await client.userinfo(tokenSet.access_token);
    req.session.userInfo = userInfo;
    return res.json({ success: true, userInfo, accessToken: tokenSet.access_token });
  } catch (error) {
    console.error('토큰 교환 오류:', error);
    return res.status(500).json({ success: false, message: '토큰 교환 중 오류가 발생했습니다' });
  }
});

// 로그인 URL 생성 엔드포인트
app.get('/api/auth/login-url', (req, res) => {
  const nonce = generators.nonce();
  const state = generators.state();
  req.session.nonce = nonce;
  req.session.state = state;
  const authUrl = client.authorizationUrl({
    scope: 'email openid phone',
    state: state,
    nonce: nonce,
  });
  res.json({ success: true, url: authUrl });
});

// 사용자 정보 엔드포인트
app.get('/api/auth/user', checkAuth, (req, res) => {
  if (req.isAuthenticated) {
    res.json({ success: true, userInfo: req.session.userInfo });
  } else {
    res.json({ success: false, message: '로그인이 필요합니다' });
  }
});

// 로그아웃 엔드포인트
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: '로그아웃 중 오류가 발생했습니다' });
    }
    res.json({ success: true });
  });
});

// ===== 기존 API 엔드포인트 =====

// 날씨 데이터 API
app.get("/api/weather/:localName/:countyDistrictName", (req, res) => {
  const { localName, countyDistrictName } = req.params;
  
  db.query(
    "SELECT x_coordinate, y_coordinate FROM short_term_forecast WHERE local_name = ? AND county_district_name = ?",
    [localName, countyDistrictName],
    (err, results) => {
      if (err) {
        console.error("좌표 정보 가져오는 중 오류 발생:", err);
        res.status(500).json({ success: false, message: "서버 오류" });
      } else if (results.length === 0) {
        res.json({
          success: false,
          message: "해당 지역의 좌표 정보를 찾을 수 없습니다.",
        });
      } else {
        const { x_coordinate: xCoordinate, y_coordinate: yCoordinate } = results[0];
        res.json({ success: true, xCoordinate, yCoordinate });
      }
    }
  );
});

// 지역 이름 목록 API
app.get("/api/localnames", (req, res) => {
  const sql = "SELECT DISTINCT local_name FROM tour_list";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching local names:", err);
      res.status(500).json({ success: false, message: "Failed to fetch local names" });
    } else {
      res.json({ success: true, data: results });
    }
  });
});

// 구/군 목록 API
app.get("/api/counties/:localname", (req, res) => {
  const { localname } = req.params;
  const sql = "SELECT DISTINCT county_district_name FROM tour_list WHERE local_name = ?";
  db.query(sql, [localname], (err, results) => {
    if (err) {
      console.error("Error fetching counties:", err);
      res.status(500).json({ success: false, message: "Failed to fetch counties" });
    } else {
      res.json(results);
    }
  });
});

// 관광지 목록 API
app.get("/api/tours/:localname/:countyname", (req, res) => {
  const { localname, countyname } = req.params;
  const sql = "SELECT tour_name FROM tour_list WHERE local_name = ? AND county_district_name = ?";
  db.query(sql, [localname, countyname], (err, results) => {
    if (err) {
      console.error("Error fetching tours:", err);
      res.status(500).json({ success: false, message: "Failed to fetch tours" });
    } else {
      res.json(results);
    }
  });
});

// 관광지 상세 정보 API
app.get("/api/tourinfo/:localname/:countyname/:tourname", (req, res) => {
  const { localname, countyname, tourname } = req.params;
  const sql = "SELECT * FROM tour_list WHERE local_name = ? AND county_district_name = ? AND tour_name = ?";
  db.query(sql, [localname, countyname, tourname], (err, results) => {
    if (err) {
      console.error("Error fetching tour info:", err);
      res.status(500).json({ success: false, message: "Failed to fetch tour info" });
    } else {
      res.json(results);
    }
  });
});

// 서버 시작
const port = 3001;
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다`);
});