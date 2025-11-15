import Joi from 'joi';

/**
 * 회원가입 입력값 검증
 */
export function validateRegisterInput(data: any) {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': '유효한 이메일을 입력해주세요.',
        'any.required': '이메일을 입력해주세요.'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': '비밀번호는 6자 이상이어야 합니다.',
        'any.required': '비밀번호를 입력해주세요.'
      }),
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': '이름은 2자 이상이어야 합니다.',
        'string.max': '이름은 50자 이하여야 합니다.',
        'any.required': '이름을 입력해주세요.'
      })
  });

  return schema.validate(data, { abortEarly: false });
}

/**
 * 로그인 입력값 검증
 */
export function validateLoginInput(data: any) {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': '유효한 이메일을 입력해주세요.',
        'any.required': '이메일을 입력해주세요.'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': '비밀번호를 입력해주세요.'
      })
  });

  return schema.validate(data, { abortEarly: false });
}
