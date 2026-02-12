import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles";

type Props = {
  enabled: boolean;          // seconds <= 600 같은 조건
  seconds: number;           // 남은 시간(초)
  isCameraVerified: boolean;
  onPressCamera: () => void; // 카메라 화면 이동
};

export default function CameraSection({ enabled, seconds, isCameraVerified, onPressCamera }: Props) {
  if (!enabled) return null;
  if (isCameraVerified) return;

  return (
    <View style={styles.cameraCard}>
      <View style={styles.cameraCardTop}>
        <View style={styles.cameraTitleRow}>
          <Ionicons name="camera" size={18} color="#F97316" />
          <Text style={styles.cameraTitle}>지금 바로 출발을 알려주세요!</Text>
        </View>
      </View>

      <Text style={styles.cameraSubText}>
        ⏰ 출발 10분 전부터 신발을 신고 사진을 찍으면 인증돼요.
      </Text>

      <Pressable style={styles.cameraCtaBtn} onPress={onPressCamera}>
        <Text style={styles.cameraCtaText}>인증하고 약속 장소로 가기</Text>
      </Pressable>

      <Text style={styles.cameraHint}>
        * 사진은 판정 즉시 파기되니 안심하세요.
      </Text>
    </View>
  );
}
