import { StyleSheet } from "react-native";
import { THEME } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },

  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
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

  emptyBox: {
    marginTop: 180,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 12,
  },

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

  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: 2,
    backgroundColor: THEME.editSoft,
    borderWidth: 1,
    borderColor: THEME.editBorder,
  },

  editText: {
    color: THEME.edit,
    fontSize: 12,
    fontWeight: "900",
  },

  bear: {
    width: 150,
    height: 150,
    opacity: 0.95,
    marginBottom: 2,
  },

  primaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: THEME.orange,
    alignItems: "center",
  },
  primaryBtnText: { fontSize: 14, fontWeight: "900", color: "#fff" },
});
