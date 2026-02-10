import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },

  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  centerText: { color: "white", marginBottom: 12 },

  primaryBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
    minWidth: 180,
  },
  secondaryBtn: { marginTop: 10, opacity: 0.7 },

  btnText: { color: "white", fontWeight: "700" },

  overlayWrap: {
    position: "absolute",
    top: "20%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  shoeFrame: {
    width: 260,
    height: 260,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
  },
  overlayText: { marginTop: 12, color: "white", opacity: 0.9 },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 28,
    paddingHorizontal: 18,
  },
  actionsRow: { flexDirection: "row", gap: 10, alignItems: "center" },

  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  actionBtnDim: { opacity: 0.8 },
});