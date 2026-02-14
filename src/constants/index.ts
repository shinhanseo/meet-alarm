// 공통 상수 정의

// 시간 관련 상수 (밀리초)
export const TIME_CONSTANTS = {
  SECOND_MS: 1000,
  MINUTE_MS: 60 * 1000,
  HOUR_MS: 60 * 60 * 1000,
  DAY_MS: 24 * 60 * 60 * 1000,
} as const;

// 출발 알림 관련 상수
export const DEPARTURE_CONSTANTS = {
  BUFFER_MINUTES: 10,
  EARLY_ALLOWANCE_MINUTES: 10,
  LATE_ALLOWANCE_MINUTES: 5,
  CAMERA_WINDOW_EARLY_MINUTES: 10,
  CAMERA_WINDOW_LATE_MINUTES: 5,
  CAMERA_DISABLED_SECONDS: 600, // 10분
} as const;

// 위치 관련 상수
export const LOCATION_CONSTANTS = {
  ALLOWED_RADIUS_METERS: 200,
} as const;

// 사진 인증 관련 상수
export const PHOTO_CONSTANTS = {
  MIN_CONFIDENCE: 0.55,
  RESIZE_WIDTH: 768,
  COMPRESS_QUALITY: 0.75,
  API_TIMEOUT: 20_000,
} as const;

// API 관련 상수
export const API_CONSTANTS = {
  SEARCH_DEBOUNCE_MS: 250,
  SEARCH_TIMEOUT: 5000,
  WEATHER_TIMEOUT: 8000,
} as const;

// 타이머 스테이지 상수 (초)
export const TIMER_STAGES = {
  URGENT: 120,      // 2분
  VERY_URGENT: 300, // 5분
  PREPARE: 600,     // 10분
  DRESS: 900,       // 15분
  SHOWER: 1800,     // 30분
} as const;

