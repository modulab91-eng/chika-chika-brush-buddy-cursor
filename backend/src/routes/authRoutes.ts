import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const router = Router();

/**
 * POST /api/auth/register - 회원가입
 */
router.post('/register', authController.register);

/**
 * POST /api/auth/login - 로그인
 */
router.post('/login', authController.login);

/**
 * GET /api/auth/check-email/:email - 이메일 중복 확인
 */
router.get('/check-email/:email', authController.checkEmail);

/**
 * GET /api/auth/profile/:userId - 사용자 프로필 조회
 */
router.get('/profile/:userId', authController.getProfile);

export default router;
