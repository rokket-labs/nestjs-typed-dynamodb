import { DataMapper, getSchema } from '@aws/dynamodb-data-mapper'
import { DynamoDB } from 'aws-sdk'
import { model, ModelOption, Schema } from 'dynamoose'

import { DynamoDBClass } from '../module/dynamodb.interfaces'
import { getKeys } from './getKeys'
import { getTable } from './getTable'

type instanceOfDynamoDBClass = InstanceType<DynamoDBClass>

export const getModelForClass = <T extends instanceOfDynamoDBClass>(
  dynamoDBClass: DynamoDBClass,
  modelOptions: ModelOption,
  dynamoDBClient: DynamoDB,
  mapper: DataMapper,
) => {
  const table = getTable(dynamoDBClass)
  const awsSchema = getSchema(new dynamoDBClass())
  const schema = new Schema(awsSchema, {
    useDocumentTypes: true,
    useNativeBooleans: true,
  })
  return model<T, {}>(table, schema, modelOptions)
}
