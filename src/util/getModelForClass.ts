import { DynamoDB } from 'aws-sdk'
import { DataMapper, getSchema } from '@aws/dynamodb-data-mapper'
import { DynamoDBClass } from '../module/dynamodb.interfaces'
import { model, Schema, ModelOption } from 'dynamoose'

import { getTable } from './getTable'

type instanceOfDynamoDBClass = InstanceType<DynamoDBClass>

export const getModelForClass = <T extends instanceOfDynamoDBClass>(
  dynamoDBClass: DynamoDBClass,
  modelOptions: ModelOption,
  dynamoDBClient: DynamoDB,
  mapper: DataMapper,
) => {
  const table = getTable(dynamoDBClass)
  const schema = new Schema(getSchema(new dynamoDBClass()), {
    useDocumentTypes: true,
    useNativeBooleans: true,
  })
  return model<T, {}>(table, schema, modelOptions)
}
