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
  opts?: { title?: string; body?: string }
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
      data: { type: "ALARM" },            // 알림 클릭 시 구분용 데이터
    },

    // 알림 트리거 (특정 날짜/시간)
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date, // 이 시각에 알람 울림
    },
  });

  return id; // 나중에 취소할 때 쓸 알림 ID 반환
}

/**
 * 예약된 알람 취소 함수
 */
export async function cancelAlarm(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}
