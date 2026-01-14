import { StyleSheet } from "react-native";
import { THEME } from "./theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  content: { paddingHorizontal: 14, paddingTop: 36, paddingBottom: 24, gap: 12 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  headerTitle: { fontSize: 22, fontWeight: "900", color: THEME.text },
  headerBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: THEME.orange,
  },
  headerBtnText: { color: "#fff", fontWeight: "900", fontSize: 13 },

  sectionLabel: { fontSize: 14, fontWeight: "900", color: THEME.muted },

  emptyCard: {
    backgroundColor: THEME.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    gap: 10,
  },
  emptyTitle: { fontSize: 18, fontWeight: "900", color: THEME.text },
  emptySub: { fontSize: 13, color: THEME.muted, fontWeight: "700", lineHeight: 18 },

  meetingCard: {
    backgroundColor: THEME.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
    gap: 10,
  },
  placeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  placeText: { flex: 1, fontSize: 16, fontWeight: "900", color: THEME.text },
  arrow: { fontSize: 16, fontWeight: "900", color: THEME.orange },
  meetingMeta: { fontSize: 12, fontWeight: "800", color: THEME.muted },

  meetingActions: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },

  ghostBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: THEME.orangeSoft,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
    flex: 1,
    alignItems: "center",
  },
  ghostBtnText: { fontSize: 13, fontWeight: "900", color: THEME.orangeDark },

  primaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: THEME.orange,
    alignItems: "center",
  },
  primaryBtnText: { fontSize: 14, fontWeight: "900", color: "#fff" },

  primaryBtnSmall: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: THEME.orange,
    flex: 1,
    alignItems: "center",
  },
  primaryBtnSmallText: { fontSize: 13, fontWeight: "900", color: "#fff" },

  timerCard: {
    backgroundColor: THEME.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    gap: 12,
  },
  departRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  departTime: { fontSize: 22, fontWeight: "900", color: THEME.text },

  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: THEME.orangeSoft,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },
  badgeText: { fontSize: 12, fontWeight: "900", color: THEME.orangeDark },
  badgeDanger: { color: THEME.danger },

  countdownBox: {
    backgroundColor: THEME.orangeSoft,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },
  countdownText: { fontSize: 32, fontWeight: "900", color: "#000" },
  countdownDanger: { color: THEME.danger },
  countdownSub: { fontSize: 12, fontWeight: "800", color: THEME.muted },

  hintBox: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  hintText: { fontSize: 13, fontWeight: "800", color: THEME.muted, lineHeight: 18 },

  routeCard: {
    backgroundColor: THEME.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  routeTitle: { fontSize: 14, fontWeight: "900", color: THEME.text },
  routeLinkBtn: { paddingVertical: 6, paddingHorizontal: 8 },
  routeLinkText: { fontSize: 12, fontWeight: "900", color: THEME.orangeDark },
  routeMeta: { marginTop: 8, fontSize: 12, color: THEME.muted, fontWeight: "700" },

  // -------------------------
  // DateSection (오늘/내일 + 시간)
  // -------------------------
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },

  dateLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.text,
  },

  dateTimePressable: { flex: 1 },

  dateTimeInput: {
    height: 46,
    backgroundColor: THEME.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: THEME.text,
    minWidth: 90,
    borderWidth: 1,
    borderColor: THEME.border,
  },

  dateSegment: {
    flexDirection: "row",
    backgroundColor: THEME.orangeSoft,
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },

  dateSegmentBtn: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  dateSegmentBtnActive: {
    backgroundColor: THEME.orange,
  },

  dateSegmentText: {
    fontSize: 13,
    fontWeight: "900",
    color: THEME.orangeDark,
  },

  dateSegmentTextActive: {
    color: "#FFFFFF",
  },
});
