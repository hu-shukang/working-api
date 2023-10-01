import { Const, DynamoDBUtil, middyfy, ValidatedEventAPIGatewayProxyEvent } from '@utils';
import { AttendanceReportEntity, AttendanceReportViewModel, DynamoDBQueryOptions, Key } from '@models';

const { WORKING_TBL, SP, PK, GSI, GSI_IDX, ATTENDANCE_REPORT } = Const;

const toAttendanceReportViewModel = (record: AttendanceReportEntity): AttendanceReportViewModel => {
  return {
    date: record.gsi.split(SP)[1],
    reportDate: record.reportDate,
    approvalStatus: record.approvalStatus,
    approvalEmployeeId: record.approvalEmployeeId,
    approvalEmployeeName: record.approvalEmployeeName,
    approvalDate: record.approvalDate,
    comment: record.comment
  };
};

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const { id } = event.requestContext.authorizer;
  const dynamodbUtil = new DynamoDBUtil();
  const key: Key = { pkName: PK, pkValue: id, skName: GSI, skValue: ATTENDANCE_REPORT };
  const queryOptions: DynamoDBQueryOptions = {
    beginsWithSK: true,
    indexName: GSI_IDX
  };
  const records = await dynamodbUtil.getRecords<AttendanceReportEntity>(WORKING_TBL, key, queryOptions);
  return records.map(toAttendanceReportViewModel);
};

export const main = middyfy(handler);
