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
  /** 備考 */
  comment?: string;
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

/**
 * 定期交通ルート
 */
export type AttendanceMonthTraffic = {
  /** 出発駅 */
  startStation: string;
  /** 終点駅 */
  endStation: string;
  /** 経由駅 */
  tractStation?: string[];
  /** 定期券 */
  monthTrainPass: number;
  /** 備考 */
  comment?: string;
};

export type AttendanceTrafficEntity = CommonAttributes & AttendanceTraffic;
export type AttendanceEntity = CommonAttributes & AttendanceAddUpdateForm;

export type AttendanceViewModel = {
  trafficList: AttendanceTraffic[];
} & AttendanceAddUpdateForm;

export type AttendanceTrafficViewModel = {
  index: number;
} & AttendanceTraffic;

export type AttendanceReportEntity = {
  gsi: string;
  /** 提出日時 */
  reportDate: number;
  /** 承認ステータス */
  approvalStatus: string;
  /** 承認者ID */
  approvalEmployeeId: string;
  /** 承認者名 */
  approvalEmployeeName: string;
  /** 承認日時 */
  approvalDate: number;
  /** 備考 */
  comment?: string;
} & CommonAttributes;

export type AttendanceReportViewModel = {
  /** 年月 */
  date: string;
  /** 提出日時 */
  reportDate: number;
  /** 承認ステータス */
  approvalStatus: string;
  /** 承認者ID */
  approvalEmployeeId: string;
  /** 承認者名 */
  approvalEmployeeName: string;
  /** 承認日時 */
  approvalDate: number;
  /** 備考 */
  comment?: string;
};
