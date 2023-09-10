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
    role: entity.role
  };
};
