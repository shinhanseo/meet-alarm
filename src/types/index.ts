// 공통 타입 정의

export type Place = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export type RouteSegment = {
  type: "WALK" | "BUS" | "SUBWAY" | string;
  timeMin: number;
  timeText: string;
  from?: string;
  to?: string;
  distanceM: number;
  route?: string;
  line?: string;
  stops?: number;
  color?: string;
};

export type RouteSummary = {
  totalTimeMin: number;
  totalTimeText: string;
  totalWalkTimeMin: number;
  totalWalkTimeText: string;
  totalFare: number;
  transferCount: number;
};

export type Route = {
  summary: RouteSummary;
  segments: RouteSegment[];
};

export type Appointment = {
  id: string;
  dbId: number | null;
  originPlace: Place | null;
  destPlace: Place | null;
  meetingDate: string | null; // YYYY-MM-DD
  meetingTime: string | null; // HH:mm
  selectedRoute: Route | null;
  isConfirmed: boolean;
  scheduledDepartureNotifId: string[];
  meetingTitle: string;
  isCameraVerified: boolean;
  scheduledVerifyNagNotifId: string[];
};

