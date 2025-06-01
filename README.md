# Weather Tour Application

## 애플리케이션 실행 방법

### 사전 준비
- Docker Desktop 설치
- Git 설치
- 로컬 MySQL 서버 (8.0 권장)

### 1. 프로젝트 클론
GitHub에서 프로젝트 클론

    #bash
    git clone https://github.com/alongleeyoung/docker_weather.git
    cd docker_weather


### 2. 데이터베이스 설정
로컬 MySQL 서비스 시작

    #bash
    net start mysql
    
덤프 파일로 데이터 복원

    #bash
    mysql -u root -p weather < dump.sql

### 3. 환경변수 설정
루트 디렉토리에서 환경변수 파일 생성

    #bash
    cp .env.example .env

백엔드 환경변수 파일 생성

    #bash
    cd backend
    cp .env.example .env

**루트, 백엔드 각각 환경변수 값들을 자신의 키값들로 채워준다.**

### 4. Docker 컨테이너 실행
루트 디렉토리에서 Docker Compose 실행

    #bash
    docker-compose up --build

### 5. 애플리케이션 접속
- 브라우저에서 **http://localhost:3000** 접속
- AWS Cognito로 로그인
- 관광지 검색 및 날씨 정보 확인

### 6. 컨테이너 상태 확인 (선택사항)

    #bash
    docker-compose ps
    docker-compose logs -f

---

**GitHub 저장소**: https://github.com/alongleeyoung/docker_weather
