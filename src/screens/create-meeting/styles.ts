import { StyleSheet } from "react-native";
import { THEME } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.bg,
  },
  loadingText: { marginTop: 8, color: THEME.muted, fontWeight: "800" },

  header: {
    paddingTop: 54,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },

  headerTitle: { fontSize: 22, fontWeight: "900", color: THEME.text },

  content: {
    paddingHorizontal: 14,
    paddingBottom: 140,
    gap: 12,
  },

  card: {
    flexDirection: "row",
    backgroundColor: THEME.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  accent: {
    width: 7,
    borderRadius: 10,
    backgroundColor: THEME.orange,
    marginRight: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  label: { fontSize: 16, fontWeight: "800", color: THEME.text },

  input: {
    flex: 1,
    height: 46,
    backgroundColor: THEME.inputBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: THEME.text,
    borderWidth: 1,
    borderColor: THEME.border,
  },

  fakeInput: {
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    justifyContent: "center",
    backgroundColor: THEME.inputBg,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  fakeInputText: {
    fontSize: 15,
    fontWeight: "600",
    color: THEME.text,
  },

  calendarBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME.orangeSoft,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },
  calendarText: { fontSize: 18 },

  timePressable: { flex: 1 },

  timeinput: {
    height: 46,
    backgroundColor: THEME.inputBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: THEME.text,
    minWidth: 90,
    borderWidth: 1,
    borderColor: THEME.border,
  },

  // route card
  routeCard: {
    backgroundColor: THEME.card,
    borderRadius: 20,
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
  routeTitle: { fontSize: 14, fontWeight: "900", color: THEME.text },
  routeBtn: {
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: THEME.orangeSoft,
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },
  routeBtnText: { fontSize: 14, fontWeight: "900", color: THEME.orangeDark },
  routeSummaryText: { fontSize: 13, fontWeight: "900", color: THEME.text },
  routeActions: { flexDirection: "row" },
  smallBtn: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: THEME.orangeSoft,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },
  smallBtnText: { fontSize: 13, fontWeight: "900", color: THEME.text },
  smallBtnDanger: { borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" },
  smallBtnDangerText: { color: "#B91C1C" },

  // info card
  infoCard: {
    backgroundColor: THEME.card,
    borderRadius: 20,
    padding: 9,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
    gap: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  infoTitle: { fontSize: 14, fontWeight: "900", color: THEME.text },
  infoDesc: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.muted,
    lineHeight: 18,
  },
  progressRowCompact: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "nowrap",
  },
  progressItemCompact: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  progressDotContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dotCompact: {
    width: 14,
    height: 14,
    borderRadius: 9,
    backgroundColor: "#E5E7EB",
    borderWidth: 1.5,
    borderColor: THEME.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  dotCompactOn: {
    backgroundColor: THEME.orange,
    borderColor: THEME.orangeDark,
  },
  progressTextCompact: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.muted,
  },
  progressTextCompactDone: {
    color: THEME.text,
    fontWeight: "900",
  },
  progressConnectorCompact: {
    flex: 1,
    height: 2,
    backgroundColor: THEME.border,
    marginHorizontal: 4,
    maxWidth: 20,
  },
  progressConnectorCompactDone: {
    backgroundColor: THEME.orange,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    borderWidth: 1,
    borderColor: THEME.border,
  },
  dotOn: { backgroundColor: THEME.orange, borderColor: THEME.orangeBorder },
  progressText: {
    fontSize: 12,
    fontWeight: "900",
    color: THEME.text,
    marginRight: 10,
  },

  tipBox: {
    backgroundColor: THEME.orangeSoft,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
    gap: 6,
  },
  tipTitle: { fontSize: 12, fontWeight: "900", color: THEME.orangeDark },
  tipText: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.muted,
    lineHeight: 18,
  },

  // bottom bar
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 22,
    backgroundColor: THEME.bg,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: THEME.orange,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  saveBtnText: { fontSize: 15, fontWeight: "900", color: "#fff" },
  bottomHint: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "800",
    color: THEME.muted,
    textAlign: "center",
  },

  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // 아이콘이랑 텍스트 사이 간격
  },

  segmentBtn: {
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  segmenttodayBtnActive: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: THEME.orange,
  },
  segmenttomorrowBtnActive: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: THEME.orange,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "900",
    color: THEME.orangeDark,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: THEME.orangeSoft,
    borderRadius: 12,
  },
  segmentTextActive: {
    color: "#FFFFFF"
  },
  segmentDivider: {
    width: 1,
    backgroundColor: THEME.orangeBorder,
  },

  houseBtn: {
    marginLeft: 8,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    flexShrink: 0,
  },
  houseBtnOn: {
    backgroundColor: THEME.orangeSoft,
    borderColor: THEME.orangeBorder,
  },
  houseBtnOff: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
  },
  houseBtnText: {
    fontSize: 13,
    fontWeight: "900",
  },
  houseBtnTextOn: {
    color: THEME.orangeDark,
  },
  houseBtnTextOff: {
    color: THEME.muted,
  },

  bearGuideWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  bearGuideImg: {
    width: 64,
    height: 64,
    marginRight: 10,
    flexShrink: 0,
  },

  bearBubble: {
    minWidth: 0,
    borderWidth: 1,
    borderColor: "#F1D3B5",
    backgroundColor: "#FFF7EF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
  },

  bearBubbleText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
  },

  bottomSpacer: {
    height: 110,
  },
});