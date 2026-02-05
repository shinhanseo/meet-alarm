import { View, Text, Pressable, Platform, Alert } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePlacesStore } from "../../../store/usePlacesStore";
import { styles } from "./styles";

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
  const { type, editId } = useLocalSearchParams<{ scope: "draft" | "house"; type: "create" | "update"; editId?: string; }>();

  const { draft, setDraftMeetingTime } = usePlacesStore();
  const meetingDate = draft?.meetingDate ?? null;
  const meetingTime = draft?.meetingTime ?? null;

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
            <DateTimePicker value={tempTime} mode="time" display="default" onChange={onChange} />
          )}
        </>
      )}

      <Pressable
        style={styles.confirmBtn}
        onPress={() => {
          if (!meetingDate) {
            Alert.alert("날짜가 필요해요", "먼저 약속 날짜를 선택해주세요.", [
              { text: "확인", onPress: () => router.replace("/create-meeting") },
            ]);
            return;
          }

          const meetingAt = buildMeetingAt(meetingDate, tempTime);

          if (meetingAt.getTime() < Date.now()) {
            Alert.alert("이미 지난 시간입니다", "약속 시간을 다시 설정해주세요", [{ text: "확인" }]);
            return;
          }

          const hour = meetingAt.getHours();
          const isNight = hour >= 23 || hour <= 6;

          // if (isNight) {
          //   Alert.alert(
          //     "심야 시간에는 대중교통 운행이 제한될 수 있어요.",
          //     "다른 이동 수단을 고려해 보세요",
          //     [{ text: "확인" }]
          //   );
          //   return;
          // }

          setDraftMeetingTime(toHHmm(tempTime));
          if (type === "update") {
            router.back();
            return;
          }
          router.replace("/create-meeting");
        }}
      >
        <Text style={styles.confirmText}>확인</Text>
      </Pressable>
    </View>
  );
}
