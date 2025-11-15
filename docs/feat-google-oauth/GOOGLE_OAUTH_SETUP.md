# Google OAuth 설정 방법

아래 문서는 Google Cloud Console에서 OAuth 클라이언트를 생성하고 로컬 환경에서 사용하는 방법을 설명합니다.

---

## 핵심 요약

- Google Cloud Console에서 OAuth 2.0 클라이언트 ID(웹 애플리케이션)를 생성해야 합니다.
- `VITE_GOOGLE_CLIENT_ID` 환경변수에 생성한 클라이언트 ID 값을 넣어야 합니다.
- 로컬 개발 시 승인된 리디렉션 URI에 `http://localhost:8081/` (또는 사용하는 포트)를 추가해야 합니다.

## 현재 상태 및 문제 (저장된 스크린샷 요약)

사용자가 실행했을 때 다음 오류가 발생했습니다:

```
액세스 차단됨: 승인 오류
The OAuth client was not found.
401 error: invalid_client
```

원인:
- 프론트엔드에 설정된 `VITE_GOOGLE_CLIENT_ID`가 Google Cloud Console에 존재하지 않거나 삭제/오타로 인해 유효하지 않습니다.
- 또는 OAuth 동의 화면 설정이 완료되지 않아 클라이언트가 동작하지 않을 수 있습니다.

권장 해결 절차:
1. Google Cloud Console → 프로젝트 선택
2. OAuth 동의 화면을 설정(외부/앱 정보 입력)
3. 사용자 인증 정보 → OAuth 클라이언트 ID 생성(웹 애플리케이션)
4. 승인된 리디렉션 URI에 `http://localhost:8081/` 추가
5. 생성된 `CLIENT_ID`를 복사하여 프로젝트 루트 `.env.local` 또는 `.env`에 `VITE_GOOGLE_CLIENT_ID=` 값으로 설정
6. 프론트엔드 개발 서버 재시작: `npm run dev`

추가 확인 사항:
- 콘솔에서 클라이언트가 삭제되었는지 확인
- 올바른 프로젝트(실제 클라이언트가 생성된 프로젝트)를 선택했는지 확인
- 프로덕션 도메인(예: `https://yourdomain.com`)을 배포 시 승인된 리디렉션 URI에 추가

```
# .env.local 예시
VITE_GOOGLE_CLIENT_ID=your_copied_client_id_here
```

문의가 있거나 클라이언트 ID를 제가 대신 설정해주길 원하시면, 클라이언트 ID 값을 알려주시거나 콘솔 접근 권한을 부여해 주세요.
