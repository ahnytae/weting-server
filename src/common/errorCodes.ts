/**
 * ERR_001 ~ ERR_010 : Auth 관련 에러 코드
 * ERR_011 ~ ERR_020 : Email 관련 에러 코드
 * ERR_021 ~ ERR_030 : User 관련 에러 코드
 */
export const ERROR_CODES = {
  ERR_001: {
    code: 'USER_NOT_FOUND',
    message: '사용자를 찾을 수 없습니다.',
  } as const,
  ERR_002: {
    code: 'INVALID_REFRESH_TOKEN',
    message: '유효하지 않은 refresh token 입니다.',
  } as const,
  ERR_003: {
    code: 'INVALID_ACCESS_TOKEN',
    message: '유효하지 않은 access token 입니다.',
  } as const,
  ERR_004: {
    code: 'EXPIRED_ACCESS_TOKEN',
    message: 'access token이 만료되었습니다.',
  } as const,
  ERR_005: {
    code: 'EXPIRED_REFRESH_TOKEN',
    message: 'refresh token이 만료되었습니다.',
  } as const,
  ERR_006: {
    code: 'ALREADY_JOINED_IN',
    message: '이미 가입된 회원 입니다.',
  } as const,

  ERR_011: {
    code: 'INVALID_EMAIL_CODE',
    message: '유효하지 않은 이메일 인증 코드입니다.',
  } as const,
  ERR_012: {
    code: 'EMAIL_ALREADY_REGISTERED',
    message: '이미 등록된 이메일입니다.',
  } as const,
  ERR_013: {
    code: 'EMAIL_NOT_REGISTERED',
    message: '등록되지 않은 이메일입니다.',
  } as const,
  ERR_014: {
    code: 'INVALID_CODE',
    message: '이메일 인증 코드가 유효하지 않습니다.',
  } as const,
  ERR_015: {
    code: 'NOT_VERIFY_EMAIL',
    message: '이메일 인증을 먼저 해주세요.',
  } as const,
};
