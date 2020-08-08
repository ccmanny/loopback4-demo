import {DefaultCrudRepository} from '@loopback/repository';
import {ErrorLog, ErrorLogRelations} from '../models';
import {MongoDbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ErrorLogRepository extends DefaultCrudRepository<
  ErrorLog,
  typeof ErrorLog.prototype.id,
  ErrorLogRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(ErrorLog, dataSource);
  }
}
