import { View, Text, Pressable, StyleSheet, Platform, Alert } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { usePlacesStore } from "../store/usePlacesStore";

// "YYYY-MM-DD" + (tempTime의 시/분) => 실제 약속 Date 만들기
function buildMeetingAt(meetingDate: string, time: Date) {
  const [y, m, d] = meetingDate.split("-").map(Number);
  return new Date(y, m - 1, d, time.getHours(), time.getMinutes(), 0, 0);
}

function toHHmm(time: Date) {
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function parseInitialTime(meetingTime: string | null) {
  if (!meetingTime) return new Date();
  const d = new Date(meetingTime);
  if (Number.isNaN(d.getTime())) return new Date();
  return d;
}

export default function SetTimeScreen() {
  const router = useRouter();

  const { meetingTime, setMeetingTime, meetingDate } = usePlacesStore();

  const [tempTime, setTempTime] = useState<Date>(() => parseInitialTime(meetingTime));
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);

  const formattedTime = useMemo(() => {
    return tempTime.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, [tempTime]);

  const onChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowAndroidPicker(false);
    if (selectedDate) setTempTime(selectedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>약속 시간 설정</Text>

      {Platform.OS === "ios" ? (
        <View style={styles.iosTimeWrapper}>
          <DateTimePicker
            value={tempTime}
            mode="time"
            display="spinner"
            onChange={onChange}
            style={styles.iosPicker}
            textColor="#000"
          />
        </View>
      ) : (
        <>
          <Pressable style={styles.timeRow} onPress={() => setShowAndroidPicker(true)}>
            <Text style={styles.timeLabel}>선택된 시간</Text>
            <Text style={styles.timeValue}>{formattedTime}</Text>
            <Text style={styles.timeHint}>눌러서 변경</Text>
          </Pressable>

          {showAndroidPicker && (
            <DateTimePicker
              value={tempTime}
              mode="time"
              display="default"
              onChange={onChange}
            />
          )}
        </>
      )}

      <Pressable
        style={styles.confirmBtn}
        onPress={() => {
          if (!meetingDate) {
            Alert.alert("날짜가 필요해요", "먼저 약속 날짜를 선택해주세요.", [
              { text: "확인", onPress: () => router.replace("/(tabs)/create-meeting") },
            ]);
            return;
          }

          const meetingAt = buildMeetingAt(meetingDate, tempTime);

          if (meetingAt.getTime() < Date.now()) {
            Alert.alert("이미 지난 시간입니다", "약속 시간을 다시 설정해주세요", [
              { text: "확인" },
            ]);
            return;
          }

          const hour = meetingAt.getHours();

          const isNight = hour >= 23 || hour <= 6;

          if (isNight) {
            Alert.alert("심야 시간에는 대중교통 운행이 제한될 수 있어요.", "다른 이동 수단을 고려해 보세요", [
              { text: "확인" },
            ])
            return;
          }

          setMeetingTime(toHHmm(tempTime));

          router.replace("/(tabs)/create-meeting");
        }}
      >
        <Text style={styles.confirmText}>확인</Text>
      </Pressable>
    </View>
  );
}

const THEME = {
  bg: "#FAFAF9",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",

  orange: "#F97316",
  orangeDark: "#EA580C",
  orangeSoft: "#FFF7ED",
  orangeBorder: "#FED7AA",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: THEME.text,
    marginBottom: 30,
  },

  // iOS 전용
  iosTimeWrapper: {
    width: "100%",
    backgroundColor: THEME.orangeSoft,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  iosPicker: {
    transform: [{ scale: 1.1 }],
  },

  // Android용 시간 표시 카드
  timeRow: {
    width: "100%",
    backgroundColor: THEME.orange,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 10,

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  timeLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },

  timeValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
  },

  timeHint: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },

  confirmBtn: {
    marginTop: 40,
    width: "100%",
    height: 52,
    backgroundColor: THEME.orange,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: THEME.orangeBorder,

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  confirmText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.3,
  },
});
