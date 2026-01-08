import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { useRouter } from "expo-router";
import { usePlacesStore } from "../store/usePlacesStore";

export default function SetTimeScreen() {
  const router = useRouter();
  const { meetingTime, setMeetingTime } = usePlacesStore();

  const [tempTime, setTempTime] = useState<Date>(
    meetingTime ?? new Date()
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>약속 시간 설정</Text>

      <DateTimePicker
        value={tempTime}
        style={styles.time}
        mode="time"
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={(_, selectedDate) => {
          if (selectedDate) setTempTime(selectedDate);
        }}
      />

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

  pickerWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: Platform.OS === "ios" ? 0 : 10,
    paddingHorizontal: 10,
    width: "100%",
    alignItems: "center",

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
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

  time: {
    backgroundColor: "#75B06F",
    borderRadius: 16,
    paddingVertical: 10,
    transform: [{ scale: 1.1 }],
  }
});
