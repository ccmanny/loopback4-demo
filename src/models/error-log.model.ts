import {Entity, model, property} from '@loopback/repository';

@model()
export class ErrorLog extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  createTime: string;

  @property({
    type: 'any',
    required: true,
  })
  errorMessage?: any;


  constructor(data?: Partial<ErrorLog>) {
    super(data);
  }
}

export interface ErrorLogRelations {
  // describe navigational properties here
}

export type ErrorLogWithRelations = ErrorLog & ErrorLogRelations;
