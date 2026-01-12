import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { usePlacesStore } from "../store/usePlacesStore";

export default function SetTimeScreen() {
  const router = useRouter();
  const { meetingTime, setMeetingTime } = usePlacesStore();

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
              is24Hour={true}
            />
          )}
        </>
      )}

      <Pressable
        style={styles.confirmBtn}
        onPress={() => {
          setMeetingTime(tempTime);
          router.back();
        }}
      >
        <Text style={styles.confirmText}>확인</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F7",
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 30,
  },

  //  iOS 전용
  iosTimeWrapper: {
    width: "100%",
    backgroundColor: "#75B06F",
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
    backgroundColor: "#75B06F",
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
    backgroundColor: "#F0F8A4",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  confirmText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 0.3,
  },
});
