import { Const } from '@utils/const.util';
import { CommonAttributes, CreateUpdateAttributes } from './common.model';

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

export type TrafficEntity = {
  routeId: string;
} & CommonAttributes &
  TrafficAddUpdateForm &
  CreateUpdateAttributes;

export type TrafficViewModel = {
  index: number;
  routeId: string;
} & TrafficAddUpdateForm;

export const trafficEntityToViewModel = (entity: TrafficEntity): TrafficViewModel => {
  return {
    index: Number.parseInt(entity.sk.split(Const.SP)[1]),
    routeId: entity.routeId,
    startStation: entity.startStation,
    endStation: entity.endStation,
    tractStation: entity.tractStation,
    roundTrip: entity.roundTrip,
    monthTrainPass: entity.monthTrainPass,
    comment: entity.comment
  };
};
