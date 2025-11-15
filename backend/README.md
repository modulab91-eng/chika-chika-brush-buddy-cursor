# Brush Buddy 백엔드 API

회원가입, 로그인 기능을 제공하는 Express + Prisma 기반의 RESTful API 서버입니다.

## 📁 프로젝트 구조

```
backend/
├── src/
│   ├── controllers/
│   │   └── authController.ts       # 인증 API 핸들러
│   ├── services/
│   │   └── authService.ts          # 비즈니스 로직
│   ├── routes/
│   │   └── authRoutes.ts           # API 라우트
│   ├── validators/
│   │   └── authValidator.ts        # 입력값 검증
│   ├── lib/
│   │   └── prisma.ts               # Prisma 클라이언트
│   └── index.ts                    # 메인 서버 파일
├── prisma/
│   └── schema.prisma               # 데이터베이스 스키마
├── .env.example                    # 환경변수 템플릿
├── package.json
├── tsconfig.json
└── SETUP.md
```

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
cd backend
npm install
```

### 2. PostgreSQL 실행

```bash
# Docker 사용
docker-compose up -d
```

### 3. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일 수정:
```
DATABASE_URL=postgresql://user:password@localhost:5432/brush_buddy
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8081
JWT_SECRET=your_jwt_secret_key_here
```

### 4. Prisma 마이그레이션

```bash
npm run prisma:migrate
```

### 5. 개발 서버 실행

```bash
npm run dev
```

## 📚 API 문서

### 회원가입

**요청:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "Hong Gildong"
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

**에러 응답 (409):**
```json
{
  "success": false,
  "message": "이미 가입된 이메일입니다."
}
```

### 로그인

**요청:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
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

**에러 응답 (401):**
```json
{
  "success": false,
  "message": "비밀번호가 일치하지 않습니다."
}
```

### 이메일 중복 확인

**요청:**
```bash
GET /api/auth/check-email/user@example.com
```

**응답 (200):**
```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "exists": false
  }
}
```

### 프로필 조회

**요청:**
```bash
GET /api/auth/profile/clsxxx...
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

## 🔐 보안 기능

✅ **구현된 기능:**
- bcryptjs를 통한 비밀번호 해싱 (salt rounds: 10)
- 입력값 검증 (Joi 스키마)
- 이메일 중복 확인
- CORS 설정
- 에러 핸들링

🔲 **추가 권장 기능:**
- JWT 토큰 기반 인증
- 이메일 인증 (OTP/링크)
- Rate limiting
- 비밀번호 재설정
- 2FA (Two-Factor Authentication)

## 🧪 테스트

### cURL을 사용한 테스트

회원가입:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

로그인:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

이메일 중복 확인:
```bash
curl http://localhost:5000/api/auth/check-email/test@example.com
```

## 💾 데이터베이스 스키마

### Users 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | String (PK) | 고유 식별자 |
| email | String (Unique) | 이메일 주소 |
| password | String (Nullable) | 해시된 비밀번호 |
| name | String | 사용자 이름 |
| picture | String (Nullable) | 프로필 사진 URL |
| authType | Enum | EMAIL / GOOGLE / GUEST |
| createdAt | DateTime | 생성 일시 |
| updatedAt | DateTime | 수정 일시 |

### BrushingRecords 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | String (PK) | 고유 식별자 |
| userId | String (FK) | 사용자 ID |
| duration | Int | 칫솔질 시간 (초) |
| score | Int | 점수 |
| mode | String | normal / kids / parent |
| topFront | Int | 상단 앞니 |
| leftBack | Int | 왼쪽 어금니 |
| rightBack | Int | 오른쪽 어금니 |
| bottomFront | Int | 하단 앞니 |
| createdAt | DateTime | 생성 일시 |

## 🔧 개발 가이드

### 새로운 API 추가

1. **Controller** 작성 (`src/controllers/authController.ts`)
2. **Service** 구현 (`src/services/authService.ts`)
3. **Validator** 추가 (`src/validators/authValidator.ts`)
4. **Route** 등록 (`src/routes/authRoutes.ts`)

### 스키마 수정

1. `prisma/schema.prisma` 수정
2. 마이그레이션 생성: `npm run prisma:migrate`
3. Prisma Client 재생성: `npm run prisma:generate`

## 📖 참고 자료

- [Express 문서](https://expressjs.com/)
- [Prisma 문서](https://www.prisma.io/docs/)
- [bcryptjs 문서](https://github.com/dcodeIO/bcrypt.js)
- [Joi 문서](https://joi.dev/)

## 라이선스

ISC
