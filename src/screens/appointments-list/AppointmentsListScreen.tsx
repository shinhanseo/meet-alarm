import { useMemo, useState } from "react";
import { FlatList, Text, View, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { usePlacesStore } from "@/src/store/usePlacesStore";

import AppointmentCard, {
  type AppointmentListItem,
} from "./components/AppointmentCard";
import { styles } from "./styles";
import { buildMeetingAt } from "./utils";

type RawAppointmentItem = AppointmentListItem & {
  meetingDate: string | null;
  meetingTime: string | null;
  ms: number | null;
};

export default function AppointmentsListScreen() {
  const { appointments, deleteAppointment } = usePlacesStore();
  const router = useRouter();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const bearSource = require("../../../assets/bears/bear_boring.png");
  const items = useMemo<AppointmentListItem[]>(() => {
    const now = Date.now();

    return (appointments ?? [])
      .map((a: any, idx: number): RawAppointmentItem => {
        const meetingAt =
          a?.meetingDate && a?.meetingTime
            ? buildMeetingAt(a.meetingDate, a.meetingTime)
            : null;

        const ms = meetingAt ? meetingAt.getTime() : null;

        const selectedRoute = a?.selectedRoute ?? null;
        const segments = selectedRoute?.segments ?? [];

        const title = (a?.meetingTitle ?? "").trim();

        return {
          key: a?.id ?? String(idx),
          id: a?.id ?? null,
          dbId: a?.dbId ?? null,
          meetingDate: a?.meetingDate ?? null,
          meetingTime: a?.meetingTime ?? null,
          originName: a?.originPlace?.name ?? "출발지",
          destName: a?.destPlace?.name ?? "목적지",
          meetingTitle: title,
          segments,
          ms,
        };
      })
      .filter((x): x is RawAppointmentItem & { meetingDate: string; meetingTime: string; ms: number } =>
        Boolean(x.meetingDate && x.meetingTime && x.ms != null),
      )
      .filter((x) => x.ms > now)
      .sort((a, b) => a.ms - b.ms)
      .map(({ ms, ...item }) => item);
  }, [appointments]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>약속 목록</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Image source={bearSource} style={styles.bear} resizeMode="contain" />
            <Text style={styles.emptyText}>
              예정된 약속이 없어요.{"\n"}
              새로운 약속을 만들어볼까요?
            </Text>

            <Pressable onPress={() => { router.replace("/create-meeting") }} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>약속 설정하러 가기</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <AppointmentCard
            item={item}
            isOpen={openKey === item.key}
            onToggleOpen={() => setOpenKey(openKey === item.key ? null : item.key)}
            onEdit={(id) => {
              router.push({ pathname: "/update-meeting", params: { id } });
            }}
            onDeleteLocal={(id) => deleteAppointment(id)}
            onCloseIfOpen={() => setOpenKey((prev) => (prev === item.key ? null : prev))}
          />
        )}
      />
    </SafeAreaView>
  );
}
