import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * 앱이 켜져 있을 때(포그라운드) 알림이 왔을 때의 동작 설정
 * - 배너로 보여줄지
 * - 알림 목록에 표시할지
 * - 소리 재생할지
 */
export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,   // 상단 배너 표시
      shouldShowList: true,     // 알림센터 리스트에 표시
      shouldPlaySound: true,   // 소리 재생
      shouldSetBadge: false,   // 앱 아이콘 뱃지 숫자 표시 안 함
    }),
  });
}

/**
 * 알림 시스템 초기화 함수
 * 1. 포그라운드 알림 동작 설정
 * 2. 알림 권한 요청
 * 3. Android 알림 채널 생성
 */
export async function initNotifications() {
  // 포그라운드 알림 정책 설정
  configureNotificationHandler();

  // 현재 알림 권한 상태 확인
  const perm = await Notifications.getPermissionsAsync();

  // 권한이 없으면 요청
  if (perm.status !== "granted") {
    const req = await Notifications.requestPermissionsAsync();

    // 사용자가 거절하면 알람 기능 못 쓰게 에러 처리
    if (req.status !== "granted") {
      throw new Error("알림 권한이 필요합니다.");
    }
  }

  // Android용 알람 채널 설정
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("alarm", {
      name: "Alarm", // 채널 이름
      importance: Notifications.AndroidImportance.MAX, // 최상위 중요도
      vibrationPattern: [0, 500, 500, 500], // 진동 패턴
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC, // 잠금화면 표시
      sound: "default", // 기본 알림 소리
    });
  }
}

/**
 * 특정 시각에 울리는 알람(로컬 알림) 예약 함수
 */
export async function scheduleAlarmAt(
  date: Date,
  opts?: { title?: string; body?: string; data?: any }
) {
  // 이미 지난 시간 방지
  if (date.getTime() <= Date.now()) {
    throw new Error("이미 지난 시간입니다.");
  }

  // 알림 예약
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: opts?.title ?? "알람",        // 알림 제목
      body: opts?.body ?? "시간입니다!",  // 알림 내용
      sound: "default",                   // 소리 재생
      ...(Platform.OS === "android" ? { channelId: "alarm" } : {}), // Android 채널 지정
      data: opts?.data ?? {},            // 알림 클릭 시 구분용 데이터
    },

    // 알림 트리거 (특정 날짜/시간)
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date, // 이 시각에 알람 울림
    },
  });

  return id; // 나중에 취소할 때 쓸 알림 ID 반환
}

// 1분마다 repaet할 알람 예약 함수
// 앱이 백그라운드, 종료 상태에는 알람 예약이 불가함
export async function startVerifyNag() {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "아직 인증을 안 했어요!",
      body: "신발 사진을 찍어주세요.",
      sound: "default",
      ...(Platform.OS === "android" ? { channelId: "alarm" } : {}),
      data: { type: "VERIFY_NAG" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60,
      repeats: true,
    },
  });

  return id;
}

// 출발시간이 정해지면 애초에 여러개를 예약약
export async function scheduleVerifyNagSeries(
  startAt: Date,
  minutes: number,
  opts?: { title?: string; body?: string; data?: any }
) {
  // startAt이 과거면 지금부터 시작
  const base = startAt.getTime() > Date.now() ? startAt : new Date(Date.now() + 1000);

  const ids: string[] = [];

  for (let i = 0; i < minutes; i++) {
    const date = new Date(base.getTime() + i * 60 * 1000);

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: opts?.title ?? "아직 인증을 안 했어요!",
        body: opts?.body ?? "신발 사진을 찍어주세요.",
        sound: "default",
        ...(Platform.OS === "android" ? { channelId: "alarm" } : {}),
        data: { ...(opts?.data ?? {}), type: "VERIFY_NAG" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
      },
    });

    ids.push(id);
  }

  return ids;
}

// 인증미완료 시 알람 배열 취소 처리 함수
export async function cancelAlarms(ids: string[]) {
  await Promise.all(
    ids.map(async (id) => {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch { }
    })
  );
}

/**
 * 예약된 알람 취소 함수
 */
export async function cancelAlarm(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}
