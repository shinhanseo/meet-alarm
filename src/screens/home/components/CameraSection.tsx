import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles";

type Props = {
  enabled: boolean;          // seconds <= 600 같은 조건
  seconds: number;           // 남은 시간(초)
  onPressCamera: () => void; // 카메라 화면 이동
};

function formatMmSs(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function CameraSection({ enabled, seconds, onPressCamera }: Props) {
  if (!enabled) return null;

  return (
    <View style={styles.cameraCard}>
      <View style={styles.cameraCardTop}>
        <View style={styles.cameraTitleRow}>
          <Ionicons name="camera" size={18} color="#F97316" />
          <Text style={styles.cameraTitle}>출발 인증 가능!</Text>
        </View>
      </View>

      <Text style={styles.cameraSubText}>
        ⏰ 출발 10분 전부터 신발 사진을 찍으면 인증돼요.
      </Text>

      <Pressable style={styles.cameraCtaBtn} onPress={onPressCamera}>
        <Text style={styles.cameraCtaText}>신발 사진 찍고 인증하기 👟</Text>
      </Pressable>

      <Text style={styles.cameraHint}>
        * 사진은 저장하지 않고 판정 후 바로 삭제돼요.
      </Text>
    </View>
  );
}
