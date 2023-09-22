import { Const } from '@utils/const.util';
import { CommonAttributes, CreateUpdateAttributes, Sort } from './common.model';

/**
 * 経由ルート追加更新Form
 */
export type TrafficAddUpdateForm = {
  /** 出発駅 */
  startStation: string;
  /** 終点駅 */
  endStation: string;
  /** 経由駅 */
  tractStation?: string[];
  /** 往復実費 */
  roundTrip: number;
  /** 定期券 */
  monthTrainPass?: number;
  /** 備考 */
  comment?: string;
};

export type TrafficSortForm = Array<{ routeId: string; index: number }>;

export type TrafficEntity = CommonAttributes & TrafficAddUpdateForm & CreateUpdateAttributes & Sort;

export type TrafficViewModel = {
  routeId: string;
} & TrafficAddUpdateForm &
  Sort;

export const trafficEntityToViewModel = (entity: TrafficEntity): TrafficViewModel => {
  return {
    routeId: entity.sk.split(Const.SP)[1],
    sort: entity.sort,
    startStation: entity.startStation,
    endStation: entity.endStation,
    tractStation: entity.tractStation,
    roundTrip: entity.roundTrip,
    monthTrainPass: entity.monthTrainPass,
    comment: entity.comment
  };
};
