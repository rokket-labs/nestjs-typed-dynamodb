import { Inject } from '@nestjs/common'
import { getModelToken } from '../util'
import { DynamoDBClass } from './dynamodb.interfaces'
import { ModelConstructor } from 'dynamoose'

export const InjectDDBModel = (model: DynamoDBClass) =>
  Inject(getModelToken(model.name))

export type ReturnDDBModel<T> = ModelConstructor<T, {}>
