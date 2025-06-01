# Node.js 18 Alpine 이미지 사용 (경량화)
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (프로덕션 모드)
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 비루트 사용자 생성 및 권한 설정 (보안)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S express -u 1001 -G nodejs && \
    chown -R express:nodejs /app

# 사용자 변경
USER express

# 포트 노출
EXPOSE 3001

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/ || exit 1

# 애플리케이션 실행
CMD ["node", "server.js"]