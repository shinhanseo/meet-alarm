import { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePlacesStore } from "@/store/usePlacesStore";
import { RouteBar } from "@/src/components/RouteBar";
import { SegmentChip } from "@/src/components/SegmentChip";

export function getDday(meetingDate: string, meetingTime: string) {
  const now = new Date();

  const [y, m, d] = meetingDate.split("-").map(Number);
  const [hh, mm] = meetingTime.split(":").map(Number);

  const meetingAt = new Date(y, m - 1, d, hh, mm, 0, 0);
  const diffMs = meetingAt.getTime() - now.getTime();

  if (diffMs <= 0) return "이미 지남";

  const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const target0 = new Date(y, m - 1, d, 0, 0, 0, 0);
  const diffDays = Math.round((target0.getTime() - today0.getTime()) / 86400000);

  if (diffDays >= 1) return `D-${diffDays}`;

  const totalHours = Math.floor(diffMs / 3600000);
  if (totalHours >= 1) return `${totalHours}시간 후`;

  return "곧 출발";
}


function buildMeetingAt(meetingDate: string, meetingTimeHHmm: string) {
  if (!meetingDate || !meetingTimeHHmm) return null;
  const [y, m, d] = meetingDate.split("-").map(Number);
  const [hh, mm] = meetingTimeHHmm.split(":").map(Number);
  if ([y, m, d, hh, mm].some((n) => Number.isNaN(n))) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function formatDateLabel(yyyyMMdd: string) {
  const [y, m, d] = yyyyMMdd.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.toLocaleDateString("ko-KR", { weekday: "short" as const });
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}.${mm}.${dd} (${day})`;
}

function formatTimeHHmm(meetingTimeHHmm: string) {
  if (!meetingTimeHHmm) return "";
  const [hh, mm] = meetingTimeHHmm.split(":");
  return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
}

export default function AppointmentsListScreen() {
  const { appointments, deleteAppointment } = usePlacesStore();

  // 펼친 카드 key (RouteBar 눌렀을 때만 토글)
  const [openKey, setOpenKey] = useState<string | null>(null);

  const items = useMemo(() => {
    const now = Date.now();

    return (appointments ?? [])
      .map((a: any, idx: number) => {
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
          meetingDate: a?.meetingDate ?? null,
          meetingTime: a?.meetingTime ?? null,
          originName: a?.originPlace?.name ?? "출발지",
          destName: a?.destPlace?.name ?? "목적지",
          meetingTitle: title,
          ms,
          segments,
          now,
        };
      })
      .filter((x) => x.meetingDate && x.meetingTime && x.ms != null)
      .filter((x) => (x.ms as number) > now)
      .sort((a, b) => (a.ms as number) - (b.ms as number));
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
            <Text style={styles.emptyText}>예정된 약속이 없어요.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isOpen = openKey === item.key;
          const segments = item.segments ?? [];
          const canDelete = !!item.id;

          const hasTitle = !!item.meetingTitle;
          const displayTitle = hasTitle
            ? item.meetingTitle
            : `${item.originName} → ${item.destName}`;

          return (
            <View style={styles.cardShell}>
              <View style={styles.rowTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.titleText} numberOfLines={1}>
                    {displayTitle}
                  </Text>

                  {/* 날짜 + D-day */}
                  <View style={styles.metaRow}>
                    <Text style={styles.dateText}>
                      {formatDateLabel(item.meetingDate!)} ·{" "}
                      {formatTimeHHmm(item.meetingTime!)}
                    </Text>

                    <View style={styles.ddayPill}>
                      <Text style={styles.ddayText}>
                        {getDday(item.meetingDate, item.meetingTime)}
                      </Text>
                    </View>
                  </View>

                  {hasTitle && (
                    <Text style={styles.subRouteText} numberOfLines={1}>
                      {item.originName} → {item.destName}
                    </Text>
                  )}
                </View>

                <Pressable
                  disabled={!canDelete}
                  hitSlop={10}
                  style={({ pressed }) => [
                    styles.deleteBtn,
                    !canDelete && { opacity: 0.4 },
                    pressed && { opacity: 0.75 },
                  ]}
                  onPress={() => {
                    if (!item.id) return;

                    Alert.alert("약속 삭제", "이 약속을 삭제할까요?", [
                      { text: "취소", style: "cancel" },
                      {
                        text: "삭제",
                        style: "destructive",
                        onPress: () => {
                          deleteAppointment(item.id);
                          setOpenKey((prev) => (prev === item.key ? null : prev));
                        },
                      },
                    ]);
                  }}
                >
                  <Text style={styles.deleteText}>삭제</Text>
                </Pressable>
              </View>

              {!!segments.length && (
                <Pressable
                  style={({ pressed }) => [
                    styles.routeBarTap,
                    pressed && { opacity: 0.75 },
                  ]}
                  onPress={() => setOpenKey(isOpen ? null : item.key)}
                >
                  <RouteBar segments={segments} />
                  <Text style={styles.toggleHint}>{isOpen ? "접기" : "자세히"}</Text>
                </Pressable>
              )}

              {/* 펼쳤을 때만 상세 chips */}
              {isOpen && !!segments.length && (
                <View style={styles.expandArea}>
                  <View style={{ gap: 10 }}>
                    {segments.map((seg: any, i: number) => (
                      <SegmentChip key={`seg-${item.key}-${i}`} seg={seg} />
                    ))}
                  </View>
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

export const THEME = {
  bg: "#FAFAF9",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  placeholder: "#9AA0A6",
  border: "#E7E5E4",

  orangeSoft: "#FFF7ED",
  orangeBorder: "#FED7AA",
  danger: "#DC2626",
  dangerSoft: "#FEF2F2",
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },

  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: THEME.text,
    letterSpacing: -0.4,
  },

  listContent: { paddingHorizontal: 20, paddingBottom: 30 },

  cardShell: {
    backgroundColor: THEME.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },

  rowTop: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  titleText: {
    fontSize: 18,
    fontWeight: "900",
    color: THEME.text,
    letterSpacing: -0.3,
    marginBottom: 6,
  },

  dateText: { fontSize: 13, fontWeight: "600", color: THEME.muted },

  subRouteText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "800",
    color: THEME.text,
    letterSpacing: -0.2,
  },

  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: THEME.dangerSoft,
    borderWidth: 1,
    marginTop: 2,
    borderColor: "#FECACA",
  },
  deleteText: { color: THEME.danger, fontSize: 12, fontWeight: "900" },

  routeBarTap: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  toggleHint: {
    marginTop: 8,
    color: THEME.placeholder,
    fontSize: 12,
    fontWeight: "700",
  },

  expandArea: {
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
  },

  emptyBox: { marginTop: 80, alignItems: "center" },
  emptyText: {
    color: THEME.muted,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  ddayPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: THEME.border,
    backgroundColor: THEME.orangeSoft,
  },

  ddayText: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.text,
  },
});
