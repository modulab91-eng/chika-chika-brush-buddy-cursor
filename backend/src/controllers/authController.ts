import { Request, Response } from 'express';
import * as authService from '../services/authService.js';
import { validateRegisterInput, validateLoginInput } from '../validators/authValidator.js';

/**
 * 회원가입
 * POST /api/auth/register
 */
export async function register(req: Request, res: Response) {
  try {
    // 입력값 검증
    const { error, value } = validateRegisterInput(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: '입력값이 올바르지 않습니다.',
        errors: error.details.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    // 회원가입 처리
    const result = await authService.registerUser(value);
    
    if (!result.success) {
      return res.status(409).json({
        success: false,
        message: result.message
      });
    }

    return res.status(201).json({
      success: true,
      message: '회원가입에 성공했습니다.',
      data: {
        id: result.user?.id,
        email: result.user?.email,
        name: result.user?.name,
        authType: result.user?.authType
      }
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    return res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
}

/**
 * 로그인
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response) {
  try {
    // 입력값 검증
    const { error, value } = validateLoginInput(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: '입력값이 올바르지 않습니다.',
        errors: error.details.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    // 로그인 처리
    const result = await authService.loginUser(value.email, value.password);
    
    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      message: '로그인에 성공했습니다.',
      data: {
        id: result.user?.id,
        email: result.user?.email,
        name: result.user?.name,
        picture: result.user?.picture,
        authType: result.user?.authType
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    return res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
}

/**
 * 이메일 중복 확인
 * GET /api/auth/check-email/:email
 */
export async function checkEmail(req: Request, res: Response) {
  try {
    const { email } = req.params;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: '유효한 이메일을 입력해주세요.'
      });
    }

    const exists = await authService.emailExists(email);

    return res.status(200).json({
      success: true,
      data: {
        email,
        exists
      }
    });
  } catch (error) {
    console.error('이메일 확인 오류:', error);
    return res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
}

/**
 * 사용자 정보 조회
 * GET /api/auth/profile/:userId
 */
export async function getProfile(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const user = await authService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        authType: user.authType,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
}
