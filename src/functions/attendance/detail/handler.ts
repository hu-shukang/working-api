import { Const, dateUtil, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { schema } from './schema';
import { AttendanceTrafficViewModel, AttendanceViewModel, DBRecord, Key } from '@models';

const { WORKING_TBL, ATTENDANCE, PK, SK, SP, ATTENDANCE_INFO, ATTENDANCE_TRAFFIC } = Const;

const toAttendanceTrafficViewModel = (record: DBRecord): AttendanceTrafficViewModel => {
  return {
    index: Number.parseInt(record.sk.split(SP)[3]),
    startStation: record.startStation,
    endStation: record.endStation,
    tractStation: record.tractStation,
    roundTrip: record.roundTrip,
    comment: record.comment
  };
};

const toAttendanceViewModel = (record: DBRecord): AttendanceViewModel => {
  return {
    date: record.sk.split(SP)[1],
    start: record.start,
    end: record.end,
    break: record.break,
    nightBreak: record.nightBreak,
    timeOff: record.timeOff,
    remotely: record.remotely,
    comment: record.comment,
    trafficList: []
  };
};

const getAttendanceList = (records: DBRecord[]): AttendanceViewModel[] => {
  const result: AttendanceViewModel[] = [];
  let i = 0;
  while (i < records.length) {
    if (records[i].type === ATTENDANCE_INFO) {
      const vm = toAttendanceViewModel(records[i]);
      result.push(vm);
      i++;
    } else if (records[i].type === ATTENDANCE_TRAFFIC) {
      while (i < records.length && records[i].type === ATTENDANCE_TRAFFIC) {
        result[result.length - 1].trafficList.push(toAttendanceTrafficViewModel(records[i]));
        i++;
      }
    } else {
      i++;
    }
  }
  return result;
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const date = event.pathParameters.date;
  const { id } = event.requestContext.authorizer;
  const dynamodbUtil = new DynamoDBUtil();
  const key: Key = { pkName: PK, pkValue: id, skName: SK, skValue: `${ATTENDANCE}${SP}${date}` };
  const records = await dynamodbUtil.getRecords<DBRecord>(WORKING_TBL, key, { beginsWithSK: true });
  console.log(records);
  return getAttendanceList(records);
};

export const main = middyfy(handler, schema);
