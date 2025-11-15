import bcryptjs from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface AuthResult {
  success: boolean;
  message: string;
  user?: any;
}

/**
 * 사용자 등록
 */
export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  try {
    const { email, password, name } = input;

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return {
        success: false,
        message: '이미 가입된 이메일입니다.'
      };
    }

    // 비밀번호 해싱
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        authType: 'EMAIL'
      }
    });

    return {
      success: true,
      message: '회원가입에 성공했습니다.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        authType: user.authType
      }
    };
  } catch (error) {
    console.error('registerUser 오류:', error);
    return {
      success: false,
      message: '회원가입 중 오류가 발생했습니다.'
    };
  }
}

/**
 * 사용자 로그인
 */
export async function loginUser(email: string, password: string): Promise<AuthResult> {
  try {
    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return {
        success: false,
        message: '등록되지 않은 이메일입니다.'
      };
    }

    if (!user.password) {
      return {
        success: false,
        message: '이 이메일은 Google 계정으로만 로그인할 수 있습니다.'
      };
    }

    // 비밀번호 검증
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: '비밀번호가 일치하지 않습니다.'
      };
    }

    return {
      success: true,
      message: '로그인에 성공했습니다.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        authType: user.authType
      }
    };
  } catch (error) {
    console.error('loginUser 오류:', error);
    return {
      success: false,
      message: '로그인 중 오류가 발생했습니다.'
    };
  }
}

/**
 * 이메일 존재 확인
 */
export async function emailExists(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    return !!user;
  } catch (error) {
    console.error('emailExists 오류:', error);
    return false;
  }
}

/**
 * ID로 사용자 조회
 */
export async function getUserById(id: string): Promise<any> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        authType: true,
        createdAt: true
      }
    });
    return user;
  } catch (error) {
    console.error('getUserById 오류:', error);
    return null;
  }
}

/**
 * Google 로그인 사용자 생성 또는 조회
 */
export async function findOrCreateGoogleUser(googleData: {
  id: string;
  email: string;
  name: string;
  picture?: string;
}): Promise<AuthResult> {
  try {
    let user = await prisma.user.findUnique({
      where: { email: googleData.email }
    });

    if (!user) {
      // Google 사용자 생성
      user = await prisma.user.create({
        data: {
          id: `google_${googleData.id}`,
          email: googleData.email,
          name: googleData.name,
          picture: googleData.picture,
          authType: 'GOOGLE'
        }
      });
    }

    return {
      success: true,
      message: 'Google 로그인에 성공했습니다.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        authType: user.authType
      }
    };
  } catch (error) {
    console.error('findOrCreateGoogleUser 오류:', error);
    return {
      success: false,
      message: 'Google 로그인 중 오류가 발생했습니다.'
    };
  }
}
