# Google OAuth 설정 방법

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com) 방문
2. 상단에서 프로젝트 선택 → "새 프로젝트" 클릭
3. 프로젝트 이름 입력 (예: "Brush Buddy") → 생성

### 1.2 OAuth 2.0 동의 화면 설정
1. 좌측 메뉴에서 "OAuth 동의 화면" 선택
2. 사용자 유형으로 "외부" 선택 → 생성
3. 필수 정보 입력:
   - 앱 이름: "Brush Buddy"
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처 정보: 본인 이메일
4. "저장 및 계속" 클릭

### 1.3 OAuth 클라이언트 ID 생성
1. 좌측 메뉴에서 "사용자 인증 정보" 선택
2. "+ 사용자 인증 정보 만들기" → "OAuth 클라이언트 ID" 선택
3. 애플리케이션 유형: "웹 애플리케이션" 선택
4. 이름 입력: "Brush Buddy Web"
5. "승인된 리디렉션 URI" 추가:
   - `http://localhost:8081/`
   - `http://localhost:3000/` (또는 사용하는 개발 포트)
   - `https://yourdomain.com/` (프로덕션용)
6. "생성" 클릭
7. 팝업에서 "클라이언트 ID" 복사

## 2. 로컬 환경 변수 설정

### 2.1 .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하고 다음과 같이 입력:

```bash
VITE_GOOGLE_CLIENT_ID=your_copied_client_id_here
```

## 3. 로컬 개발 시작

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:8081/`로 이동하면 로그인 페이지가 표시됩니다.

## 기능

### 로그인 페이지 (`/login`)
- Google OAuth를 통한 로그인
- 게스트 로그인 (테스트용)

### 메인 페이지 (`/`)
- 로그인한 사용자만 접근 가능
- 사용자 프로필 드롭다운
- 로그아웃 기능

### 인증 상태 관리
- Context API를 사용한 전역 상태 관리
- localStorage에 사용자 정보 저장
- 새로고침 후에도 로그인 상태 유지

## 테스트

1. 로그인 페이지 방문: `http://localhost:8081/login`
2. "게스트로 계속" 버튼 클릭으로 빠른 테스트 가능
3. Google OAuth 로그인 테스트 (클라이언트 ID 설정 후)
4. 우측 상단 사용자 아바타 클릭하여 로그아웃 테스트
