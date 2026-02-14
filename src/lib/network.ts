import NetInfo from "@react-native-community/netinfo";

export async function ensureNetwork() {
  const state = await NetInfo.fetch();

  if (!state.isConnected || !state.isInternetReachable) {
    throw new Error("인터넷이 연결되어있지 않습니다.");
  }

  return {
    type: state.type,
    expensive: state.details?.isConnectionExpensive ?? false,
  };
}