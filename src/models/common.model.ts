export type Key = {
  pkName: string;
  pkValue: any;
  skName?: string;
  skValue?: any;
};

export type CommonAttributes = {
  /** パーティションキー */
  pk: string;
  /** ソートキー */
  sk: string;
  /** タイプ */
  type: string;
};

export type CreateUpdateAttributes = {
  /** 作成日時 */
  createDate: number;
  /** 作成者 */
  createUser: string;
  /** 更新日時 */
  updateDate: number;
  /** 更新者 */
  updateUser: string;
};
