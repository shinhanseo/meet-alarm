import { StyleSheet } from "react-native";
import { THEME } from "../../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: THEME.text,
    marginBottom: 30,
  },

  iosTimeWrapper: {
    width: "100%",
    backgroundColor: THEME.orangeSoft,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  iosPicker: {
    transform: [{ scale: 1.1 }],
  },

  timeRow: {
    width: "100%",
    backgroundColor: THEME.orange,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 10,

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  timeLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },

  timeValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
  },

  timeHint: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },

  confirmBtn: {
    marginTop: 40,
    width: "100%",
    height: 52,
    backgroundColor: THEME.orange,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: THEME.orangeBorder,

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  confirmText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.3,
  },
});
