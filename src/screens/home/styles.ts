import { StyleSheet } from "react-native";
import { THEME } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  content: { paddingHorizontal: 14, paddingTop: 36, paddingBottom: 24, gap: 12 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingVertical: 6,
    marginTop: 21,
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
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
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
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
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
    borderColor: THEME.orangeBorder,
    gap: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  departRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  departTime: { fontSize: 22, fontWeight: "900", color: THEME.text, flexShrink: 1, minWidth: 0, },

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
    position: "relative",
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
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  hintText: { fontSize: 13, fontWeight: "800", color: THEME.muted, lineHeight: 18 },

  routeCard: {
    backgroundColor: THEME.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  routeTitle: { fontSize: 14, fontWeight: "900", color: THEME.text },
  routeLinkBtn: { paddingVertical: 6, paddingHorizontal: 8 },
  routeLinkText: { fontSize: 12, fontWeight: "900", color: THEME.orangeDark },
  routeMeta: { fontSize: 12, color: THEME.muted, fontWeight: "700" },

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

  resetBtnTop: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },
  resetTextTop: {
    fontSize: 13,
    fontWeight: "900",
    color: THEME.orangeDark,
  },

  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  titlePill: {
    maxWidth: "80%",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FED7AA",
    backgroundColor: "#FFF7ED",
  },

  titlePillText: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: -0.2,
    color: THEME.text,
  },

  timerBear: {
    position: "absolute",
    right: 8,
    bottom: -6,
    marginBottom: 8,
    width: 78,
    height: 78,
  },

  cameraCard: {
    marginTop: 4,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },

  cameraCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cameraTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  cameraTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#333",
  },

  cameraTimerPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#F1D3B5",
    backgroundColor: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    color: "#F97316",
  },

  cameraSubText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "700",
    color: "#F97316",
  },

  cameraCtaBtn: {
    marginTop: 12,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F97316",
  },

  cameraCtaText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
  },

  cameraHint: {
    marginTop: 8,
    fontSize: 11,
    color: THEME.orange,
  },

  verifyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    marginLeft: "auto",
  },

  verifyBadgeOk: {
    backgroundColor: "#ECFDF3",
    borderColor: "#A7F3D0",
  },

  verifyBadgeNeed: {
    backgroundColor: THEME.dangerSoft,
    borderColor: THEME.danger,
  },

  verifyDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    marginRight: 6,
  },

  verifyDotOk: {
    backgroundColor: "#22C55E",
  },

  verifyDotNeed: {
    backgroundColor: "#FF0000",
  },

  verifyText: {
    fontSize: 12,
    fontWeight: "700",
  },

  verifyTextOk: {
    color: "#166534",
  },

  verifyTextNeed: {
    color: "#D2042D",
  },

  bottomSpacer: {
    height: 12,
  },
});
