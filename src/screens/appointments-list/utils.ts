export function getDday(meetingDate: string, meetingTime: string) {
  const now = new Date();

  const [y, m, d] = meetingDate.split("-").map(Number);
  const [hh, mm] = meetingTime.split(":").map(Number);

  const meetingAt = new Date(y, m - 1, d, hh, mm, 0, 0);
  const diffMs = meetingAt.getTime() - now.getTime();

  if (diffMs <= 0) return "이미 지남";

  const today0 = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );
  const target0 = new Date(y, m - 1, d, 0, 0, 0, 0);
  const diffDays = Math.round((target0.getTime() - today0.getTime()) / 86400000);

  if (diffDays >= 1) return `D-${diffDays}`;

  const totalHours = Math.floor(diffMs / 3600000);
  if (totalHours >= 1) return `${totalHours}시간 후`;
  if (totalHours < 1 && totalHours > 0) return "곧 출발";
  return "D-Day";
}

export function buildMeetingAt(meetingDate: string, meetingTimeHHmm: string) {
  if (!meetingDate || !meetingTimeHHmm) return null;
  const [y, m, d] = meetingDate.split("-").map(Number);
  const [hh, mm] = meetingTimeHHmm.split(":").map(Number);
  if ([y, m, d, hh, mm].some((n) => Number.isNaN(n))) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

export function formatDateLabel(yyyyMMdd: string) {
  const [y, m, d] = yyyyMMdd.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.toLocaleDateString("ko-KR", { weekday: "short" as const });
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}.${mm}.${dd} (${day})`;
}

export function formatTimeHHmm(meetingTimeHHmm: string) {
  if (!meetingTimeHHmm) return "";
  const [hh, mm] = meetingTimeHHmm.split(":");
  return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
}
