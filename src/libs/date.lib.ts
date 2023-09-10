import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import ja from 'dayjs/locale/ja';

type DayjsDate = string | number | dayjs.Dayjs | Date | null | undefined;

class DateLib {
  constructor() {
    dayjs.extend(timezone);
    dayjs.extend(utc);
    dayjs.tz.setDefault('Asia/Tokyo');
    dayjs.locale(ja);
  }

  public unix(origin?: DayjsDate) {
    return dayjs(origin).unix();
  }
}

export const dateLib = new DateLib();
