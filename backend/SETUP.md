# 백엔드 설정 가이드

## PostgreSQL 설치 (Docker 권장)

### Docker를 사용한 PostgreSQL 실행

```bash
docker run --name brush-buddy-postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=brush_buddy \
  -p 5432:5432 \
  -d postgres:15
```

또는 docker-compose.yml 사용:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: brush_buddy
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
docker-compose up -d
```

## 환경 설정

1. `.env` 파일 생성:

```bash
cp .env.example .env
```

2. `.env` 파일에 데이터베이스 연결 정보 입력:

```
DATABASE_URL=postgresql://user:password@localhost:5432/brush_buddy
```

## Prisma 마이그레이션

### 1. 마이그레이션 생성 및 적용

```bash
# 초기 마이그레이션 생성 및 적용
npm run prisma:migrate

# 마이그레이션 이름을 지정하여 생성
npm run prisma:migrate init
```

### 2. Prisma Client 생성

```bash
npm run prisma:generate
```

### 3. Prisma Studio (GUI 관리)

```bash
npm run prisma:studio
```

## 서버 실행

### 개발 모드

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
npm start
```

## API 엔드포인트

### 회원가입

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동"
}
```

**응답 예시:**
```json
{
  "success": true,
  "message": "회원가입에 성공했습니다.",
  "data": {
    "id": "clsxxx...",
    "email": "user@example.com",
    "name": "홍길동",
    "authType": "EMAIL"
  }
}
```

### 로그인

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답 예시:**
```json
{
  "success": true,
  "message": "로그인에 성공했습니다.",
  "data": {
    "id": "clsxxx...",
    "email": "user@example.com",
    "name": "홍길동",
    "authType": "EMAIL"
  }
}
```

### 이메일 중복 확인

```bash
GET /api/auth/check-email/user@example.com
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "exists": false
  }
}
```

### 사용자 프로필 조회

```bash
GET /api/auth/profile/:userId
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "id": "clsxxx...",
    "email": "user@example.com",
    "name": "홍길동",
    "picture": null,
    "authType": "EMAIL",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## 트러블슈팅

### "Can't reach database server"

1. PostgreSQL이 실행 중인지 확인:
```bash
docker ps | grep postgres
```

2. 연결 문자열 확인:
```bash
echo $DATABASE_URL
```

### Prisma 마이그레이션 초기화

```bash
npm run prisma:reset
```

## 보안 주의사항

⚠️ **프로덕션 환경에서:**
- `JWT_SECRET`을 강력한 값으로 설정
- 이메일 인증 추가 구현 필요
- HTTPS 강제
- CORS 설정 제한
- Rate limiting 적용
- 입력값 검증 강화
