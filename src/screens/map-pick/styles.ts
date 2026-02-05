import { StyleSheet } from "react-native";
import { THEME } from "../../styles/theme";

export const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  backBtn: {
    position: "absolute",
    top: 56,
    left: 16,
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backText: { fontWeight: "800" },

  centerPin: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -18,
    marginTop: -36,
  },

  bottomContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
  },

  coordBox: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  confirmBtn: {
    marginTop: 10,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },

  confirmText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
});
