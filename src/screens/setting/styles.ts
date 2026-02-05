import { StyleSheet } from "react-native";
import { THEME } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    paddingHorizontal: 14,
  },

  header: {
    paddingTop: 54,
    paddingBottom: 10,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: {
    padding: 6,
    borderRadius: 12,
  },

  rightSpacer: {
    width: 36, // backBtn 영역과 대충 맞추기
  },

  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "900",
    color: THEME.text,
    letterSpacing: -0.2,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: THEME.muted,
  },

  sectionTitle: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "700",
    color: THEME.muted,
  },

  card: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: THEME.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  pressed: { opacity: 0.85 },

  left: {
    flexDirection: "row",
    alignItems: "center",
    // gap 대신 margin으로 안정적으로
    flexShrink: 1,
  },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME.orangeSoft,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
    marginRight: 12,
  },

  texts: { flexShrink: 1 },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.text,
    marginRight: 8,
  },

  cardDesc: {
    marginTop: 4,
    fontSize: 13,
    color: THEME.muted,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: THEME.orangeSoft,
    borderWidth: 1,
    borderColor: THEME.orangeBorder,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: THEME.orangeDark,
  },
});