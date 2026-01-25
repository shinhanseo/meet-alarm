import { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, Alert } from "react-native";
import { Region } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

import { usePlacesStore } from "../../../store/usePlacesStore";
import { styles } from "./styles";

import { HeaderBar } from "./components/HeaderBar";
import { InputCard } from "./components/InputCard";
import { CreateMeetingRouteSection } from "./components/CreateMeetingRouteSection";
import { ProgressSection } from "./components/ProgressSection";
import { BottomBar } from "./components/BottomBar";
import { DatePickerModal } from "./components/DatePickerModal";

function getLocalYYYYMMDD(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function ymdToDate(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDateLabel(yyyyMMdd: string) {
  const [y, m, d] = yyyyMMdd.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.toLocaleDateString("ko-KR", { weekday: "short" as const });
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}.${mm}.${dd} (${day})`;
}

export default function CreateMeetingScreen() {
  const router = useRouter();

  const {
    draft,
    startDraft,

    setDraftPlaceSilent,
    setDraftMeetingDate,
    setDraftSelectedRoute,
    setDraftMeetingTitle,
    saveDraft,

    scheduleDepartureAlarm,
  } = usePlacesStore();

  const originPlace = draft?.originPlace ?? null;
  const destPlace = draft?.destPlace ?? null;
  const meetingDate = draft?.meetingDate ?? null;
  const meetingTimeStr = draft?.meetingTime ?? null;
  const selectedRoute = draft?.selectedRoute ?? null;
  const meetingTime = meetingTimeStr ?? "";
  const meetingTitle = draft?.meetingTitle ?? "";

  const [region, setRegion] = useState<Region | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);

  const today = getLocalYYYYMMDD(new Date());
  const tomorrowDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return getLocalYYYYMMDD(d);
  }, []);

  useEffect(() => {
    if (!draft) startDraft();
  }, [draft, startDraft]);

  useEffect(() => {
    if (!draft) return;
    if (!draft.meetingDate) setDraftMeetingDate(getLocalYYYYMMDD());
  }, [draft, setDraftMeetingDate]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("위치 권한 거부됨");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const r = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(r);

      if (!originPlace) {
        setDraftPlaceSilent("origin", {
          name: "현재 위치",
          address: "내 위치",
          lat: r.latitude,
          lng: r.longitude,
        });
      }
    })();
  }, [originPlace, setDraftPlaceSilent]);

  const openSearch = (mode: "origin" | "dest") => {
    router.push({ pathname: "/place-search", params: { mode, scope: "draft" } });
  };

  const openTimer = () => {
    router.push({ pathname: "/set-time", params: { scope: "draft" } });
  };

  const directionSearch = () => {
    if (!originPlace || !destPlace || !meetingDate || !meetingTimeStr) {
      Alert.alert(
        "입력이 필요해요",
        `${!originPlace ? "출발지" : !destPlace ? "도착지" : !meetingDate ? "약속 날짜" : "약속 시간"}를 먼저 설정해주세요.`,
        [{ text: "확인" }]
      );
      return;
    }
    router.push({ pathname: "/direction-search", params: { scope: "draft" } });
  };

  const readyInput = !!(originPlace && destPlace && meetingDate && meetingTimeStr);
  const readyToSave = !!(readyInput && selectedRoute);

  const doneCount = [
    !!originPlace,
    !!destPlace,
    !!meetingDate,
    !!meetingTimeStr,
    !!selectedRoute,
    !!meetingTitle,
  ].filter(Boolean).length;

  const progressText = useMemo(() => {
    if (doneCount === 0) return "아직 아무것도 설정되지 않았어요.";
    if (doneCount === 1) return "좋아요. 하나만 더 설정해봐요.";
    if (doneCount === 2) return "좋아요. 네 가지만 더 하면 돼요.";
    if (doneCount === 3) return "절반 왔어요. 두개만 설정하면 경로를 선택할 수 있어요!";
    if (doneCount === 4) return "정말 다 왔어요. 마지막 하나만 설정하면 경로를 선택할 수 있어요.";
    if (doneCount === 5) return "다 왔어요. 이제 경로를 선택하세요!"
    return "준비 완료! 이제 저장만 하면 약속을 늦지 않게 알려드릴게요";
  }, [doneCount]);

  const dateText = useMemo(() => {
    if (!meetingDate) return "";
    return formatDateLabel(meetingDate);
  }, [meetingDate]);

  const meetingDateLabel = useMemo(() => {
    if (!meetingDate) return "";
    if (meetingDate === today) return "오늘";
    if (meetingDate === tomorrowDate) return "내일";
    return dateText;
  }, [meetingDate, today, tomorrowDate, dateText]);

  const routeSummaryText = useMemo(() => {
    if (!selectedRoute) return "";
    const s = selectedRoute.summary;
    return `총 ${s.totalTimeText} · 도보 ${s.totalWalkTimeText} · 환승 ${s.transferCount}회 · ${s.totalFare.toLocaleString()}원`;
  }, [selectedRoute]);

  const onPressSave = async () => {
    if (!readyToSave) return;

    const id = saveDraft();
    if (!id) {
      Alert.alert("오류", "약속 저장에 실패했습니다.");
      return;
    }

    try {
      await scheduleDepartureAlarm(id);
    } catch (err) {
      console.error("알림 예약 실패:", err);
    }

    router.replace("/appointments-list");
  };

  if (!region) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>내 위치 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderBar title="약속 설정" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <InputCard
          originName={originPlace ? originPlace.name : ""}
          destName={destPlace ? destPlace.name : ""}
          onPressOrigin={() => openSearch("origin")}
          onPressDest={() => openSearch("dest")}
          meetingDateLabel={meetingDateLabel}
          isTodayActive={meetingDate === today}
          isTomorrowActive={meetingDate === tomorrowDate}
          onPressToday={() => setDraftMeetingDate(today)}
          onPressTomorrow={() => setDraftMeetingDate(tomorrowDate)}
          onPressCalendar={() => setShowDateModal(true)}
          meetingTime={meetingTime}
          meetingTitle={meetingTitle}
          onChangeMeetingTitle={setDraftMeetingTitle}
          onPressTime={openTimer}
        />

        <CreateMeetingRouteSection
          selectedRoute={selectedRoute}
          readyInput={readyInput}
          routeSummaryText={routeSummaryText}
          onPressSearch={directionSearch}
          onPressClear={() => {
            setDraftSelectedRoute(null);
          }}
        />

        <ProgressSection
          originDone={!!originPlace}
          destDone={!!destPlace}
          dateDone={!!meetingDate}
          timeDone={!!meetingTimeStr}
          titleDone={!!meetingTitle}
          routeDone={!!selectedRoute}
          doneCount={doneCount}
          progressText={progressText}
          showTips={!readyInput}
        />

        <View style={{ height: 110 }} />
      </ScrollView>

      <BottomBar
        readyToSave={readyToSave}
        selectedRouteExists={!!selectedRoute}
        onPressSave={onPressSave}
      />

      <DatePickerModal
        visible={showDateModal}
        date={meetingDate ? ymdToDate(meetingDate) : new Date()}
        onConfirm={(picked) => {
          setDraftMeetingDate(getLocalYYYYMMDD(picked));
          setShowDateModal(false);
        }}
        onCancel={() => setShowDateModal(false)}
      />
    </View>
  );
}
