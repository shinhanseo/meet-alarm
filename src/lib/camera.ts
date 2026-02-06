// src/lib/camera.ts
import * as FileSystem from "expo-file-system/legacy";

export type ShoeProofVerdict =
  | {
    ok: true;
    capturedAt: number;
    deltaMsFromDeparture: number;
    distanceMFromHome: number;
  }
  | {
    ok: false;
    reason: "too_early" | "too_late" | "too_far" | "unknown";
    capturedAt?: number;
    deltaMsFromDeparture?: number;
    distanceMFromHome?: number;
  };

export type ShoeProofRules = {
  /** 출발 예정 시각 (epoch ms) */
  departureAtMs: number;

  /** 촬영 시각 (기본: Date.now()) */
  capturedAtMs?: number;

  /** 집(출발지) 좌표 */
  homeLat: number;
  homeLng: number;

  /** 촬영 직전 위치 */
  currentLat: number;
  currentLng: number;

  /** 허용 반경 (meter, default 200) */
  allowedRadiusM?: number;

  /** 출발 전 허용 시간 (ms, default 10분) */
  allowEarlyMs?: number;

  /** 출발 후 허용 시간 (ms, default 10분) */
  allowLateMs?: number;
};

/**
 * - 출발 시간 근처인지
 * - 집 근처인지
 */
export function evaluateShoeProof(r: ShoeProofRules): ShoeProofVerdict {
  try {
    const capturedAt = r.capturedAtMs ?? Date.now();

    const allowedRadiusM = r.allowedRadiusM ?? 200;
    const allowEarlyMs = r.allowEarlyMs ?? 10 * 60 * 1000;
    const allowLateMs = r.allowLateMs ?? 5 * 60 * 1000;

    const deltaMs = capturedAt - r.departureAtMs;
    const distanceM = haversineMeters(
      r.homeLat,
      r.homeLng,
      r.currentLat,
      r.currentLng
    );

    // 시간 조건
    if (deltaMs < -allowEarlyMs) {
      return {
        ok: false,
        reason: "too_early",
        capturedAt,
        deltaMsFromDeparture: deltaMs,
        distanceMFromHome: distanceM,
      };
    }

    if (deltaMs > allowLateMs) {
      return {
        ok: false,
        reason: "too_late",
        capturedAt,
        deltaMsFromDeparture: deltaMs,
        distanceMFromHome: distanceM,
      };
    }

    // 위치 조건
    if (distanceM > allowedRadiusM) {
      return {
        ok: false,
        reason: "too_far",
        capturedAt,
        deltaMsFromDeparture: deltaMs,
        distanceMFromHome: distanceM,
      };
    }

    return {
      ok: true,
      capturedAt,
      deltaMsFromDeparture: deltaMs,
      distanceMFromHome: distanceM,
    };
  } catch {
    return { ok: false, reason: "unknown" };
  }
}

/**
 * 촬영된 사진 즉시 삭제 (캐시 정리)
 */
export async function deleteCapturedPhotoSafely(uri: string) {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {
  }
}

/**
 * 두 좌표 간 거리 계산 (Haversine, meter)
 */
function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (v: number) => (v * Math.PI) / 180;

  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
