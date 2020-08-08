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
  }
}
