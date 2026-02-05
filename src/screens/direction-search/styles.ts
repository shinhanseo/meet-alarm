import { StyleSheet } from "react-native";
import { THEME } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F3",
  },
  headerTitle: { fontSize: 14, color: "#111827", marginBottom: 6 },
  headerRow: { flexDirection: "row", alignItems: "baseline" },
  bigTime: { fontSize: 26, fontWeight: "800", color: "#111827" },
  meta: { fontSize: 13, color: "#6B7280", marginLeft: 8 },

  badgeRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  badge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { fontSize: 12, color: "#374151", fontWeight: "600" },

  listContent: { padding: 16, gap: 12, paddingBottom: 110 },

  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#fff",
  },
  cardActive: { borderColor: THEME.orangeBorder, backgroundColor: THEME.orangeSoft },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 15, fontWeight: "800", color: "#111827" },
  cardTitleActive: { color: THEME.orange },
  cardTime: { fontSize: 15, fontWeight: "800", color: "#111827" },
  cardTimeActive: { color: THEME.orange },

  cardMeta: { marginTop: 6, fontSize: 13, color: "#6B7280" },

  chipsWrap: { flexDirection: "column", gap: 8, marginTop: 12 },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#EEF0F3",
    backgroundColor: "#fff",
  },
  primaryBtn: {
    backgroundColor: THEME.orange,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: THEME.text, fontSize: 15, fontWeight: "800" },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  centerTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
});