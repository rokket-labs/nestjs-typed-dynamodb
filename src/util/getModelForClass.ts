import { getSchema } from '@aws/dynamodb-data-mapper'
import {
  DynamoDBClass,
  DynamoDBClassWithOptions,
} from '../module/dynamodb.interfaces'
import { model, Schema } from 'dynamoose'

import { getKeys } from './getKeys'
import { getTable } from './getTable'

type instanceOfDynamoDBClass = InstanceType<DynamoDBClass>

export const getModelForClass = <T extends instanceOfDynamoDBClass>({
  dynamoDBClass,
  modelOptions,
  schemaOptions,
}: DynamoDBClassWithOptions) => {
  const table = getTable(dynamoDBClass)
  const awsSchema = getSchema(new dynamoDBClass())

  const { hash, range } = getKeys(awsSchema)
  let hashObject = awsSchema[hash]
  let rangeObject = awsSchema[range]
  delete (hashObject as any).keyType
  delete (rangeObject as any).keyType

  const schema = new Schema(
    {
      ...awsSchema,
      [hash]: { ...hashObject, hashKey: true },
      [range]: { ...rangeObject, rangeKey: true },
    },
    schemaOptions,
  )
  return model<T, {}>(table, schema, modelOptions)
}
