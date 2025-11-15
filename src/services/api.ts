/**
 * API 클라이언트 - 백엔드와 통신
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  picture?: string;
  authType: string;
}

/**
 * 회원가입
 */
export async function registerAPI(
  payload: RegisterPayload
): Promise<ApiResponse<UserData>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '회원가입에 실패했습니다.');
    }

    return data;
  } catch (error: any) {
    console.error('회원가입 API 오류:', error);
    return {
      success: false,
      message: error.message || '회원가입 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 로그인
 */
export async function loginAPI(
  payload: LoginPayload
): Promise<ApiResponse<UserData>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '로그인에 실패했습니다.');
    }

    return data;
  } catch (error: any) {
    console.error('로그인 API 오류:', error);
    return {
      success: false,
      message: error.message || '로그인 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 이메일 중복 확인
 */
export async function checkEmailAPI(email: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/check-email/${encodeURIComponent(email)}`
    );

    const data = await response.json();

    if (!response.ok) {
      return false;
    }

    return data.data?.exists ?? false;
  } catch (error) {
    console.error('이메일 확인 API 오류:', error);
    return false;
  }
}

/**
 * 프로필 조회
 */
export async function getProfileAPI(userId: string): Promise<ApiResponse<UserData>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '프로필 조회에 실패했습니다.');
    }

    return data;
  } catch (error: any) {
    console.error('프로필 조회 API 오류:', error);
    return {
      success: false,
      message: error.message || '프로필 조회 중 오류가 발생했습니다.',
    };
  }
}

/**
 * API 상태 확인
 */
export async function healthCheckAPI(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.ok;
  } catch (error) {
    console.error('API 상태 확인 오류:', error);
    return false;
  }
}
