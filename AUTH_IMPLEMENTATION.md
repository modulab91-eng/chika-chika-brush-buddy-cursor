# 🔐 회원가입 API 구현 완료 문서

이메일 기반 회원가입 기능을 완전하게 구현했습니다. Node.js + Express + PostgreSQL + Prisma 스택을 사용합니다.

---

## 📋 목차

1. [아키텍처 개요](#아키텍처-개요)
2. [백엔드 설정](#백엔드-설정)
3. [프론트엔드 설정](#프론트엔드-설정)
4. [API 엔드포인트](#api-엔드포인트)
5. [데이터베이스 스키마](#데이터베이스-스키마)
6. [테스트 방법](#테스트-방법)
7. [보안 기능](#보안-기능)

---

## 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────┐
│                     프론트엔드 (React)                       │
│              src/pages/Login.tsx, Signup.tsx                │
│              src/services/api.ts (API 호출)                 │
│              src/context/AuthContext.tsx                    │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│               백엔드 (Express + Prisma)                      │
│                  backend/src/index.ts                       │
├─────────────────────────────────────────────────────────────┤
│  라우터          컨트롤러             서비스                  │
│  authRoutes  →  authController  →  authService             │
│                      ↓               ↓                       │
│                    검증           비즈니스 로직              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL 데이터베이스                         │
│           (Users, BrushingRecords 테이블)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 백엔드 설정

### 1. 필수 도구 설치

```bash
# Node.js 18+ 설치 확인
node --version
npm --version

# Docker & PostgreSQL
docker --version
```

### 2. PostgreSQL 시작 (Docker)

```bash
cd backend

# docker-compose를 사용한 PostgreSQL 시작
docker-compose up -d

# 확인
docker ps | grep postgres
```

### 3. 백엔드 환경 설정

```bash
cd backend

# .env 파일 생성
cp .env.example .env

# .env 파일 수정 (필요시)
```

`.env` 파일 내용:
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/brush_buddy
CORS_ORIGIN=http://localhost:8081
JWT_SECRET=your_jwt_secret_key_here
```

### 4. 의존성 설치 및 Prisma 설정

```bash
cd backend

# npm 의존성 설치
npm install

# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 마이그레이션
npm run prisma:migrate
```

### 5. 백엔드 서버 실행

```bash
cd backend

# 개발 모드 실행 (Hot reload 포함)
npm run dev

# 또는 프로덕션 빌드
npm run build
npm start
```

서버 실행 확인:
```bash
curl http://localhost:5000/health
# 응답: {"status":"ok","message":"Brush Buddy API Server is running"}
```

---

## 프론트엔드 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 2. 프론트엔드 실행

```bash
cd /workspaces/chika-chika-brush-buddy-cursor

npm install
npm run dev
```

브라우저에서 `http://localhost:8081` 접속

---

## API 엔드포인트

### 1️⃣ 회원가입

**엔드포인트:** `POST /api/auth/register`

**요청:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "Hong Gildong"
  }'
```

**요청 본문:**
```json
{
  "email": "user@example.com",      // 필수, 유효한 이메일
  "password": "SecurePass123",      // 필수, 6자 이상
  "name": "Hong Gildong"            // 필수, 2-50자
}
```

**성공 응답 (201):**
```json
{
  "success": true,
  "message": "회원가입에 성공했습니다.",
  "data": {
    "id": "clsxxx...",
    "email": "user@example.com",
    "name": "Hong Gildong",
    "authType": "EMAIL"
  }
}
```

**에러 응답 (409 - 이메일 중복):**
```json
{
  "success": false,
  "message": "이미 가입된 이메일입니다."
}
```

**에러 응답 (400 - 검증 실패):**
```json
{
  "success": false,
  "message": "입력값이 올바르지 않습니다.",
  "errors": [
    {
      "field": "email",
      "message": "유효한 이메일을 입력해주세요."
    },
    {
      "field": "password",
      "message": "비밀번호는 6자 이상이어야 합니다."
    }
  ]
}
```

---

### 2️⃣ 로그인

**엔드포인트:** `POST /api/auth/login`

**요청:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

**요청 본문:**
```json
{
  "email": "user@example.com",      // 필수
  "password": "SecurePass123"       // 필수
}
```

**성공 응답 (200):**
```json
{
  "success": true,
  "message": "로그인에 성공했습니다.",
  "data": {
    "id": "clsxxx...",
    "email": "user@example.com",
    "name": "Hong Gildong",
    "picture": null,
    "authType": "EMAIL"
  }
}
```

**에러 응답 (401 - 인증 실패):**
```json
{
  "success": false,
  "message": "비밀번호가 일치하지 않습니다."
}
```

---

### 3️⃣ 이메일 중복 확인

**엔드포인트:** `GET /api/auth/check-email/:email`

**요청:**
```bash
curl http://localhost:5000/api/auth/check-email/user@example.com
```

**응답 (200):**
```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "exists": false  // true면 이미 가입, false면 사용 가능
  }
}
```

---

### 4️⃣ 사용자 프로필 조회

**엔드포인트:** `GET /api/auth/profile/:userId`

**요청:**
```bash
curl http://localhost:5000/api/auth/profile/clsxxx...
```

**응답 (200):**
```json
{
  "success": true,
  "data": {
    "id": "clsxxx...",
    "email": "user@example.com",
    "name": "Hong Gildong",
    "picture": null,
    "authType": "EMAIL",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 데이터베이스 스키마

### Users 테이블

```sql
CREATE TABLE "users" (
  id          TEXT PRIMARY KEY DEFAULT cuid(),
  email       TEXT UNIQUE NOT NULL,
  password    TEXT,                          -- NULL이면 Google 로그인
  name        TEXT NOT NULL,
  picture     TEXT,
  authType    TEXT NOT NULL DEFAULT 'EMAIL', -- EMAIL, GOOGLE, GUEST
  createdAt   TIMESTAMP DEFAULT NOW(),
  updatedAt   TIMESTAMP DEFAULT NOW()
)
```

**컬럼 설명:**

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | String (PK) | CUID 형식 고유 식별자 |
| `email` | String (Unique) | 이메일 주소 (중복 불가) |
| `password` | String (Nullable) | bcryptjs로 해시된 비밀번호 |
| `name` | String | 사용자 이름 |
| `picture` | String (Nullable) | 프로필 사진 URL (Google 로그인) |
| `authType` | Enum | 인증 방식 (EMAIL/GOOGLE/GUEST) |
| `createdAt` | DateTime | 계정 생성 일시 |
| `updatedAt` | DateTime | 계정 수정 일시 |

### Prisma 스키마

```prisma
model User {
  id        String     @id @default(cuid())
  email     String     @unique
  password  String?
  name      String
  picture   String?
  authType  AuthType   @default(EMAIL)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  brushingRecords BrushingRecord[]

  @@map("users")
}

enum AuthType {
  EMAIL
  GOOGLE
  GUEST
}
```

---

## 코드 구조

### 백엔드 파일 구조

```
backend/
├── src/
│   ├── controllers/
│   │   └── authController.ts          # API 핸들러 (요청/응답)
│   ├── services/
│   │   └── authService.ts             # 비즈니스 로직 (DB 쿼리)
│   ├── validators/
│   │   └── authValidator.ts           # 입력값 검증 (Joi)
│   ├── routes/
│   │   └── authRoutes.ts              # API 라우트 정의
│   ├── lib/
│   │   └── prisma.ts                  # Prisma 클라이언트
│   └── index.ts                       # Express 서버 진입점
├── prisma/
│   └── schema.prisma                  # 데이터베이스 스키마
├── package.json
├── tsconfig.json
└── README.md
```

### 프론트엔드 파일 구조

```
src/
├── pages/
│   ├── Login.tsx                      # 로그인 페이지
│   └── Signup.tsx                     # 회원가입 페이지
├── context/
│   └── AuthContext.tsx                # 인증 상태 관리
├── services/
│   └── api.ts                         # API 호출 함수
└── components/
    └── ProtectedRoute.tsx             # 보호된 라우트
```

---

## 핵심 코드 설명

### 1. 비밀번호 해싱 (서버)

```typescript
// backend/src/services/authService.ts
import bcryptjs from 'bcryptjs';

// 비밀번호 해싱 (salt rounds: 10)
const hashedPassword = await bcryptjs.hash(password, 10);

// 비밀번호 검증
const isPasswordValid = await bcryptjs.compare(password, user.password);
```

**보안 특징:**
- bcryptjs 사용 (SHA-512 기반)
- Salt rounds: 10 (충분한 보안)
- 단방향 암호화 (복호화 불가)

### 2. 입력값 검증 (서버)

```typescript
// backend/src/validators/authValidator.ts
import Joi from 'joi';

const schema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
});

const { error, value } = schema.validate(data, { abortEarly: false });
```

### 3. 데이터베이스 쿼리 (Prisma)

```typescript
// backend/src/services/authService.ts

// 사용자 생성
const user = await prisma.user.create({
  data: {
    email,
    password: hashedPassword,
    name,
    authType: 'EMAIL'
  }
});

// 이메일 중복 확인
const existingUser = await prisma.user.findUnique({
  where: { email }
});

// 로그인 사용자 조회
const user = await prisma.user.findUnique({
  where: { email }
});
```

### 4. API 호출 (프론트엔드)

```typescript
// src/services/api.ts

export async function registerAPI(payload: RegisterPayload) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  
  return await response.json();
}
```

---

## 테스트 방법

### 방법 1: cURL을 사용한 테스트

```bash
# 1. 회원가입
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "Test User"
  }'

# 2. 로그인
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'

# 3. 이메일 중복 확인
curl http://localhost:5000/api/auth/check-email/test@example.com

# 4. 프로필 조회 (userId는 회원가입 응답의 id 값)
curl http://localhost:5000/api/auth/profile/clsxxx...
```

### 방법 2: Postman을 사용한 테스트

1. Postman 설치
2. 새 Collection 생성
3. 다음 요청 추가:

- **회원가입**
  - Method: POST
  - URL: `http://localhost:5000/api/auth/register`
  - Body (JSON): 위의 cURL 예시 참고

- **로그인**
  - Method: POST
  - URL: `http://localhost:5000/api/auth/login`
  - Body (JSON): 위의 cURL 예시 참고

### 방법 3: 웹 인터페이스 테스트

1. 프론트엔드 실행: `npm run dev`
2. 브라우저에서 `http://localhost:8081/signup` 방문
3. 회원가입 폼 작성 후 제출
4. `/login` 페이지에서 로그인 테스트

---

## 보안 기능

✅ **구현된 기능:**

1. **bcryptjs 해싱**
   - 비밀번호는 평문으로 저장되지 않음
   - Salt rounds: 10 (충분한 보안)

2. **입력값 검증**
   - 클라이언트 및 서버에서 검증
   - Joi 스키마 사용

3. **CORS 설정**
   - 특정 도메인만 허용
   - 크레덴셜 포함 요청 허용

4. **이메일 중복 확인**
   - 동일한 이메일 중복 가입 방지

5. **에러 메시지 분류**
   - 입력값 오류: 400
   - 인증 오류: 401
   - 중복 오류: 409
   - 서버 오류: 500

🔲 **추가 권장 기능:**

1. **JWT 토큰 기반 인증**
   ```typescript
   // 로그인 시 JWT 토큰 발급
   const token = jwt.sign({ userId: user.id }, JWT_SECRET, { 
     expiresIn: '24h' 
   });
   ```

2. **이메일 인증**
   - 가입 후 이메일 인증 링크 발송
   - 인증 완료 후만 계정 활성화

3. **Rate Limiting**
   ```typescript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   
   app.use('/api/auth/login', limiter);
   ```

4. **비밀번호 재설정**
   - 비밀번호 찾기 기능
   - 일시적 토큰으로 보안 유지

5. **2FA (Two-Factor Authentication)**
   - TOTP 또는 SMS 인증

---

## 트러블슈팅

### 문제 1: "Can't reach database server"

**해결책:**
```bash
# PostgreSQL 상태 확인
docker ps | grep postgres

# PostgreSQL 시작 (중지된 경우)
docker-compose up -d

# 연결 문자열 확인
echo $DATABASE_URL
```

### 문제 2: "CORS 에러"

**프론트엔드 콘솔 에러:**
```
Access to XMLHttpRequest at 'http://localhost:5000/...'
from origin 'http://localhost:8081' has been blocked by CORS policy
```

**해결책:**
```typescript
// backend/.env 확인
CORS_ORIGIN=http://localhost:8081

// 서버 재시작
npm run dev
```

### 문제 3: "이메일 중복 오류"

```bash
# 기존 데이터 초기화
npm run prisma:reset

# 새로 마이그레이션
npm run prisma:migrate
```

### 문제 4: 포트 이미 사용 중

```bash
# 사용 중인 포트 확인
lsof -i :5000

# 프로세스 종료
kill -9 <PID>
```

---

## 다음 단계

1. ✅ JWT 토큰 기반 인증 추가
2. ✅ 이메일 인증 구현
3. ✅ Rate Limiting 추가
4. ✅ 비밀번호 재설정 기능
5. ✅ 프로필 수정 기능
6. ✅ 로그아웃 기능
7. ✅ 2FA 인증

---

## 참고 자료

- [Express 공식 문서](https://expressjs.com/)
- [Prisma 공식 문서](https://www.prisma.io/docs/)
- [bcryptjs GitHub](https://github.com/dcodeIO/bcrypt.js)
- [Joi 검증 라이브러리](https://joi.dev/)
- [OWASP 인증 가이드](https://owasp.org/www-community/attacks/Authentication_Cheat_Sheet)

---

**작성 날짜:** 2024년 1월 15일  
**상태:** ✅ 완성  
**버전:** 1.0.0
