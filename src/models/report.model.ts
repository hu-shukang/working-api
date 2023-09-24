import { CommonAttributes } from './common.model';

export type ReportAddUpdateForm = {
  /** 提出日時 */
  reportDate: number;
  /** 承認者ID */
  approvalEmployeeId: string;
  /** 承認者名 */
  approvalEmployeeName: string;
  /** 承認日時 */
  approvalDate: number;
  /** 備考 */
  comment?: string;
};

export type ReportEntity = {
  /** 承認ステータス */
  approvalStatus: string;
} & CommonAttributes &
  ReportAddUpdateForm;
