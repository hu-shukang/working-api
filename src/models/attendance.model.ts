import { CommonAttributes } from './common.model';

export type AttendanceAddUpdateForm = {
  /** IOS日付 */
  date: string;
  /** 出勤時刻 HH:mm */
  start: string;
  /** 退勤時刻 HH:mm */
  end: string;
  /** 通常休憩(単位:分) */
  break?: number;
  /** 深夜休憩(単位:分) */
  nightBreak?: number;
  /** 休暇 */
  timeOff?: string;
  /** 在宅 */
  remotely?: boolean;
};

/**
 * 日常交通ルート
 */
export type AttendanceTraffic = {
  /** 出発駅 */
  startStation: string;
  /** 終点駅 */
  endStation: string;
  /** 経由駅 */
  tractStation?: string[];
  /** 往復実費 */
  roundTrip: number;
  /** 備考 */
  comment?: string;
};

export type AttendanceTrafficEntity = CommonAttributes & AttendanceTraffic;

export type AttendanceViewModel = {
  trafficList: AttendanceTraffic[];
} & AttendanceAddUpdateForm;
