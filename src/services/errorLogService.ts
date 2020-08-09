import {repository} from '@loopback/repository';
import {ErrorLog} from '../models/error-log.model';
import {ErrorLogRepository} from '../repositories/error-log.repository';
export interface ErrorLogItem {
  errorMessage: any,
  createTime: string,
};

export class ErrorLogService {
  @repository(ErrorLogRepository)
  private errorLogRepository: ErrorLogRepository
  constructor() {

  }

  async addLog(errorLogItem: ErrorLogItem): Promise<void> {
    this.errorLogRepository.create(new ErrorLog({
      errorMessage: errorLogItem.errorMessage,
      createTime: errorLogItem.createTime,
    }))
    // const userConnection = (this.errorLogRepository.dataSource.connector as any).collection("User");
    // let result = await userConnection.aggreagte([
    //   {$limit: 2}
    // ]).get();
    // console.log(result);
    // let res: any;
    // if (!this.errorLogRepository.dataSource.connected) await this.errorLogRepository.dataSource.connect();
    // this.errorLogRepository.dataSource.connector!.client.db(this.errorLogRepository.dataSource.settings.database).collection('ErrorLog').aggregate([
    //   {"$project": {"errorMessage": 1, "day": {"$dateToString": {"format": "%Y-%m-%d", "date": "$createTime", "timezone": "Asia/Shanghai"}}}},
    //   {"$group": {"_id": "$day", "value": {"$sum": 1}}},
    //   {"$project": {"value": 1, "day": "$_id"}},
    //   {"$sort": {"day": 1}}
    // ], {}).toArray((error: any, documents: any[]) => {
    //   res = documents;
    //   console.log(documents)
    // });
    // console.log(res);
  }
}
