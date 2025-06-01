# 멀티 스테이지 빌드
# 1단계: 빌드 스테이지
FROM node:18-alpine as build

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# React 앱 빌드
RUN npm run build

# 2단계: 프로덕션 스테이지
FROM nginx:alpine

# 빌드된 파일을 nginx로 복사
COPY --from=build /app/build /usr/share/nginx/html

# nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 포트 노출
EXPOSE 3000

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]