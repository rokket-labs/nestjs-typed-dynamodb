import * as DynamoDB from 'aws-sdk/clients/dynamodb'
import * as dynamoose from 'dynamoose'
import { DataMapper } from '@aws/dynamodb-data-mapper'
import { DynamoDBModuleOptions } from './dynamodb.interfaces'

export const createDynamodbClient = (
  options: DynamoDBModuleOptions,
): DynamoDB => {
  dynamoose.AWS.config.update(options.AWSConfig)
  const dynamoDBClient = new DynamoDB(options.dynamoDBOptions)
  dynamoose.setDDB(dynamoDBClient)
  options.local && dynamoose.local()
  return dynamoDBClient
}

export const createMapper = (dynamoDBClient: DynamoDB): DataMapper =>
  new DataMapper({
    client: dynamoDBClient, // the SDK client used to execute operations
  })
