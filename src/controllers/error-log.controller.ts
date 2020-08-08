import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {ErrorLog} from '../models';
import {ErrorLogRepository} from '../repositories';

export class ErrorLogController {
  constructor(
    @repository(ErrorLogRepository)
    public errorLogRepository: ErrorLogRepository,
  ) {}



  @get('/error-logs/count', {
    responses: {
      '200': {
        description: 'ErrorLog model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(ErrorLog) where?: Where<ErrorLog>,
  ): Promise<Count> {
    return this.errorLogRepository.count(where);
  }

  @get('/error-logs', {
    responses: {
      '200': {
        description: 'Array of ErrorLog model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(ErrorLog, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(ErrorLog) filter?: Filter<ErrorLog>,
  ): Promise<ErrorLog[]> {
    return this.errorLogRepository.find(filter);
  }



  @get('/error-logs/{id}', {
    responses: {
      '200': {
        description: 'ErrorLog model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ErrorLog, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ErrorLog, {exclude: 'where'}) filter?: FilterExcludingWhere<ErrorLog>
  ): Promise<ErrorLog> {
    return this.errorLogRepository.findById(id, filter);
  }

}
