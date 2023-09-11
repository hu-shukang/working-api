import { CommonAttributes, CreateUpdateAttributes } from './common.model';

export type LoginForm = {
  provider: 'google';
  code: string;
};

/**
 * DynamoDB type: EMPLOYEE_INFO
 */
export type EmployeeInfoEntity = {
  /** OAuth2 sub */
  sub: string;
  /** 入社日 */
  hireDate: number;
  /** 権限 */
  role: string;
  /** 部門ID */
  department: string;
  /** 部門名 */
  departmentName: string;
  /** メール */
  email: string;
  /** 苗字 */
  familyName: string;
  /** 名前 */
  givenName: string;
  /** アバター */
  picture: string;
  /** 登録ステータス */
  signupStatus: string;
  /** 削除フラグ */
  deleted: boolean;
} & CommonAttributes &
  CreateUpdateAttributes;

export type EmployeeInfoViewModel = {
  /** 社員ID */
  id: string;
  /** 入社日 */
  hireDate: number;
  /** 権限 */
  role: string;
  /** 苗字 */
  familyName: string;
  /** 名前 */
  givenName: string;
  /** アバター */
  picture: string;
  /** 部門ID */
  department: string;
  /** 部門名 */
  departmentName: string;
  /** 登録ステータス */
  signupStatus: string;
};

export const employeeInfoEntityToViewModel = (
  entity: EmployeeInfoEntity | undefined
): EmployeeInfoViewModel | undefined => {
  if (!entity) {
    return undefined;
  }
  return {
    id: entity.pk,
    hireDate: entity.hireDate,
    role: entity.role,
    familyName: entity.familyName,
    givenName: entity.givenName,
    picture: entity.picture,
    department: entity.department,
    departmentName: entity.departmentName,
    signupStatus: entity.signupStatus
  };
};
