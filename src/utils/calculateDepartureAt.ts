// utils/calculateDepartureAt.ts

export function calculateDepartureAt(
  meetingDate: string | null,
  meetingTime: string | null,
  selectedRoute: any,
  bufferMin: number = 10
): Date | null {
  if (!meetingDate || !meetingTime || !selectedRoute) return null;

  const [y, m, d] = meetingDate.split("-").map(Number);
  const [hh, mm] = meetingTime.split(":").map(Number);

  if ([y, m, d, hh, mm].some((n) => Number.isNaN(n))) return null;

  const meetingAt = new Date(y, m - 1, d, hh, mm, 0, 0);
  const travelMs = (selectedRoute.summary?.totalTimeMin ?? 0) * 60 * 1000;
  const bufferMs = bufferMin * 60 * 1000;
  const departMs = meetingAt.getTime() - travelMs - bufferMs;

  if (!Number.isFinite(departMs)) return null;

  const departureAt = new Date(departMs);
  departureAt.setSeconds(0, 0);

  return departureAt;
}