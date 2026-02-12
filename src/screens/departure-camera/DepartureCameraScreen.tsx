import React, { useMemo, useRef, useState } from "react";
import { View, Text, Alert, Pressable, ActivityIndicator, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import * as Location from "expo-location";
import { styles } from "./styles";

import { usePlacesStore } from "../../../store/usePlacesStore";
import { evaluateShoeProof, deleteCapturedPhotoSafely } from "@/src/lib/camera";
import { calculateDepartureAt } from "@/src/utils/calculateDepartureAt";
import { sendPhotoForVerdict } from "@/src/lib/photoApi";
import { predictShoe } from "@/src/lib/tfModel";
import { cropToFrame } from "@/src/lib/crop";

export default function DepartureCameraScreen() {
  const router = useRouter();
  const { appId } = useLocalSearchParams<{ appId: string }>();

  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView>(null);

  const [isTaking, setIsTaking] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");

  const { setCameraVerified, cancelVerifyNag } = usePlacesStore();
  const appt = usePlacesStore((s) =>
    s.appointments?.find((a: any) => a.id === appId)
  );

  if (!appId || !appt) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>약속 정보를 찾을 수 없어요.</Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
          <Text style={styles.btnText}>뒤로가기</Text>
        </Pressable>
      </View>
    );
  }

  const origin = appt.originPlace ?? null;

  if (!origin || origin.lat == null || origin.lng == null) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>출발지(originPlace)가 없어서 인증을 할 수 없어요.</Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
          <Text style={styles.btnText}>뒤로가기</Text>
        </Pressable>
      </View>
    );
  }


  const departureAt = useMemo(() => {
    if (!appt?.meetingDate || !appt?.meetingTime || !appt?.selectedRoute) return null;
    return calculateDepartureAt(appt.meetingDate, appt.meetingTime, appt.selectedRoute, 10);
  }, [appt?.meetingDate, appt?.meetingTime, appt?.selectedRoute]);

  if (!departureAt) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>출발 시간을 계산할 수 없어요. (경로/시간 설정 필요)</Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
          <Text style={styles.btnText}>뒤로가기</Text>
        </Pressable>
      </View>
    );
  }

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={[styles.centerText, { textAlign: "center" }]}>
          신발 사진 인증을 위해 카메라 권한이 필요해요.
        </Text>

        <Pressable
          style={styles.primaryBtn}
          onPress={() => {
            if (permission.canAskAgain === false) {
              Alert.alert(
                "권한 필요",
                "설정에서 카메라 권한을 허용해 주세요.",
                [
                  { text: "취소", style: "cancel" },
                  { text: "설정 열기", onPress: () => Linking.openSettings() },
                ]
              );
              return;
            }
            requestPermission();
          }}
        >
          <Text style={styles.btnText}>권한 허용</Text>
        </Pressable>
        <Pressable style={[styles.primaryBtn, styles.secondaryBtn]} onPress={() => router.back()}>
          <Text style={styles.btnText}>다음에 할래요</Text>
        </Pressable>
      </View>
    )
  }

  const onPressTake = async () => {
    if (isTaking) return;
    setIsTaking(true);

    let capturedUri: string | null = null;

    try {
      const photo = await (cameraRef.current as any)?.takePictureAsync?.({
        quality: 0.7,
        skipProcessing: false,
      });

      if (!photo?.uri) {
        Alert.alert("촬영 실패", "사진을 찍지 못했어요. 다시 시도해주세요");
        return;
      }

      capturedUri = photo.uri;
      if (!capturedUri) return;

      // const croppedUri = await cropToFrame(capturedUri);
      // const p = await predictShoe(croppedUri);

      // console.log(p.shoe);

      // if (p.shoe < 0.7) {
      //   Alert.alert("신발이 잘 안 보여요", "프레임 안에 신발이 크게 보이게 다시 찍어주세요.");
      //   return;
      // }

      const p = await sendPhotoForVerdict(capturedUri);

      if (!p.isShoe || p.confidence < 0.55) {
        Alert.alert(
          "신발이 잘 안 보여요",
          p.confidence < 0.55
            ? "판정이 애매해요. 신발이 프레임 중앙에 오게 다시 찍어주세요."
            : "신발이 보이도록 다시 찍어주세요!"
        );
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        await deleteCapturedPhotoSafely(photo.uri);
        Alert.alert("위치 권한 필요", "집 근처 인증을 위해 위치 권한이 필요해요.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const verdict = evaluateShoeProof({
        departureAtMs: departureAt.getTime(),
        homeLat: origin.lat,
        homeLng: origin.lng,
        currentLat: loc.coords.latitude,
        currentLng: loc.coords.longitude,
        allowedRadiusM: 200,
        allowEarlyMs: 10 * 60 * 1000,
        allowLateMs: 5 * 60 * 1000,
      });

      if (verdict.ok) {
        setCameraVerified(appId, true);
        await cancelVerifyNag(appId);

        Alert.alert(
          "인증 완료!",
          `나갈준비가 다 되셨군요!`,
          [{ text: "확인", onPress: () => router.back() }]
        );

      } else {
        const msg =
          verdict.reason === "too_far"
            ? `출발지 근처에서 찍어주세요!\n(현재 약 ${Math.round(verdict.distanceMFromHome ?? 0)}m)`
            : verdict.reason === "too_early"
              ? "아직 너무 일러요! 출발 시간에 가까워지면 다시 찍어주세요."
              : verdict.reason === "too_late"
                ? "조금 늦었어요.. 그래도 다음엔 더 빨리 출발해보세요!"
                : "인증에 실패했어요. 다시 시도해주세요.";

        Alert.alert("인증 실패", msg);
      }

    } catch (e) {
      console.error(e);
      Alert.alert("오류", "처리 중 문제가 생겼어요");
    } finally {
      setIsTaking(false);
      if (capturedUri) await deleteCapturedPhotoSafely(capturedUri);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} animateShutter />

      {/* 오버레이 */}
      <View pointerEvents="none" style={styles.overlayWrap}>
        <View style={styles.shoeFrame} />
        <Text style={styles.overlayText}>프레임 안에 신발을 들어오게 해주세요!</Text>
      </View>

      {/* 하단 버튼 */}
      <View style={styles.bottomBar}>
        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.actionBtn, styles.actionBtnDim]}
            onPress={() => setFacing((c) => (c === "back" ? "front" : "back"))}
          >
            <Text style={styles.btnText}>카메라 전환</Text>
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={onPressTake}>
            {isTaking ? <ActivityIndicator /> : <Text style={styles.btnText}>촬영</Text>}
          </Pressable>

          <Pressable style={[styles.actionBtn, styles.actionBtnDim]} onPress={() => router.back()}>
            <Text style={styles.btnText}>취소</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

