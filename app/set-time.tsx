import { View, Text, Pressable, StyleSheet, Platform, Alert } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { usePlacesStore } from "../store/usePlacesStore";

export default function SetTimeScreen() {
  const router = useRouter();
  const { meetingTime, setMeetingTime, meetingDayOffset } = usePlacesStore();

  const [tempTime, setTempTime] = useState<Date>(meetingTime ?? new Date());
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
            textColor="#FFFFFF"
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
          const base = new Date();
          base.setDate(base.getDate() + meetingDayOffset);

          base.setHours(
            tempTime.getHours(),
            tempTime.getMinutes(),
            0,
            0
          );

          const meetingMs = base.getTime();

          if (meetingMs < Date.now()) {
            Alert.alert("이미 지난 시간입니다", "약속 시간을 다시 설정해주세요", [{ text: "확인" }]);
            return;
          }
          setMeetingTime(tempTime);
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
    backgroundColor: THEME.orange,
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
    backgroundColor: THEME.orangeSoft,
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
    color: THEME.orangeDark,
    letterSpacing: 0.3,
  },
});
