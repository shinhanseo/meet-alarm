import { Alert, Pressable, Text, View } from "react-native";

import { RouteBar } from "@/src/components/RouteBar";
import { SegmentChip } from "@/src/components/SegmentChip";

import { API_BASE_URL } from "@/src/config/env";
import axios from "axios";

import { styles } from "../styles";
import { formatDateLabel, formatTimeHHmm, getDday } from "../utils";

export type AppointmentListItem = {
  key: string;
  id: string | null;
  dbId: number | null;
  meetingDate: string;
  meetingTime: string;
  originName: string;
  destName: string;
  meetingTitle: string;
  segments: any[];
};

type Props = {
  item: AppointmentListItem;
  isOpen: boolean;
  onToggleOpen: () => void;
  onEdit: (id: string) => void;
  onDeleteLocal: (id: string) => void;
  onCloseIfOpen: () => void;
};

export default function AppointmentCard({
  item,
  isOpen,
  onToggleOpen,
  onEdit,
  onDeleteLocal,
  onCloseIfOpen,
}: Props) {
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

          <View style={styles.metaRow}>
            <Text style={styles.dateText}>
              {formatDateLabel(item.meetingDate)} · {formatTimeHHmm(item.meetingTime)}
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
          style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.75 }]}
          onPress={() => {
            if (!item.id) return;
            onEdit(item.id);
          }}
        >
          <Text style={styles.editText}>수정</Text>
        </Pressable>
        <Pressable
          disabled={!canDelete}
          hitSlop={10}
          style={({ pressed }) => [
            styles.deleteBtn,
            !canDelete && { opacity: 0.4 },
            pressed && { opacity: 0.75 },
          ]}
          onPress={async () => {
            if (!item.id) return;

            Alert.alert("약속 삭제", "이 약속을 삭제할까요?", [
              { text: "취소", style: "cancel" },
              {
                text: "삭제",
                style: "destructive",
                onPress: async () => {
                  onDeleteLocal(item.id!);
                  onCloseIfOpen();

                  try {
                    await axios.delete(`${API_BASE_URL}/api/save/meeting/${item.dbId}`);
                  } catch (err) {
                    console.error("db 삭제 실패", err);
                  }
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
          style={({ pressed }) => [styles.routeBarTap, pressed && { opacity: 0.75 }]}
          onPress={onToggleOpen}
        >
          <RouteBar segments={segments} />
          <Text style={styles.toggleHint}>{isOpen ? "접기" : "자세히"}</Text>
        </Pressable>
      )}

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
}
