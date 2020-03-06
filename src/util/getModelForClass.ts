import {
  CreateTableOptions, DataMapper, GetOptions, getSchema, PutOptions,
} from '@aws/dynamodb-data-mapper'
import { unmarshallItem } from '@aws/dynamodb-data-marshaller'
import { DynamoDB } from 'aws-sdk'

import { DynamoDBClass } from '../module/dynamodb.interfaces'
import { getKeys } from './getKeys'
import { getTable } from './getTable'

type instanceOfDynamoDBClass = InstanceType<DynamoDBClass>

export class GetModelForClass<T extends instanceOfDynamoDBClass> {
  constructor(
    dynamoDBClass: DynamoDBClass,
    tableOptions: CreateTableOptions,
    dynamoDBClient: DynamoDB,
    mapper: DataMapper,
  ) {
    this.dynamoDBClass = dynamoDBClass
    this.table = getTable(dynamoDBClass)
    this.dynamoDBClient = dynamoDBClient
    this.mapper = mapper
    this.schema = getSchema(new dynamoDBClass())
    const { hash, range } = getKeys(this.schema)
    this.hashKey = hash
    this.rangeKey = range
    mapper.ensureTableExists(dynamoDBClass, tableOptions)
  }
  private dynamoDBClass: DynamoDBClass
  private table: string
  private dynamoDBClient: DynamoDB
  private mapper: DataMapper
  private schema: any
  private hashKey: string
  private rangeKey: string

  getDynamoDBClient(): DynamoDB {
    return this.dynamoDBClient
  }

  getSchema(): any {
    return this.schema
  }

  getTable(): string {
    return this.table
  }

  async create(input: Partial<T>, options?: PutOptions): Promise<T> {
    const toSave = Object.assign(new this.dynamoDBClass(), input)
    return this.mapper.put(toSave, options)
  }

  async find(input?: Partial<DynamoDBClass>): Promise<T[]> {
    let results: T[] = []
    const keys = Object.keys(input)
    if (!input || JSON.stringify(input) === JSON.stringify({})) {
      for await (const item of this.mapper.scan(this.dynamoDBClass)) {
        results.push(item)
      }
    } else if (
      keys.includes(this.hashKey) ||
      (keys.includes(this.hashKey) && keys.includes(this.rangeKey))
    ) {
      for await (const item of this.mapper.query(this.dynamoDBClass, input)) {
        results.push(item)
      }
    } else {
      const key = Object.keys(input)[0]

      const items: DynamoDB.ItemList = await new Promise((resolve, reject) =>
        this.dynamoDBClient.scan(
          this.getFindItemInput(key, input[key]),
          (err, data) => {
            if (err) reject(err)
            resolve(data.Items)
          },
        ),
      )

      return items.map(item => unmarshallItem(this.schema, item))
    }

    return results
  }

  async findById(id: string): Promise<T> {
    return this.mapper.get(Object.assign(new this.dynamoDBClass(), { id }))
  }

  async findByIdAndDelete(id: string): Promise<DynamoDB.DeleteItemOutput> {
    return new Promise((resolve, reject) =>
      this.dynamoDBClient.deleteItem(
        this.getDeleteItemInput(id),
        (err, data) => {
          if (err) reject(err)
          resolve(data)
        },
      ),
    )
  }

  async findAndUpdate(update: Partial<DynamoDBClass>): Promise<T> {
    const item = await this.mapper.get(
      Object.assign(new this.dynamoDBClass(), {
        [this.hashKey]: update[this.hashKey],
        [this.rangeKey]: update[this.rangeKey],
      }),
    )

    return this.mapper.update(Object.assign(item, update))
  }
  private getDeleteItemInput(id: string): DynamoDB.DeleteItemInput {
    return {
      Key: {
        id: {
          S: id,
        },
      },
      TableName: this.table,
    }
  }
  private getFindItemInput(key: string, value: string): DynamoDB.ScanInput {
    return {
      ExpressionAttributeValues: {
        ':catval': {
          S: value,
        },
      },
      FilterExpression: `${key} = :catval`,
      TableName: this.table,
    }
  }
}

export const getModelForClass = <T extends instanceOfDynamoDBClass>(
  dynamoDBClass: DynamoDBClass,
  tableOptions: CreateTableOptions,
  dynamoDBClient: DynamoDB,
  mapper: DataMapper,
) =>
  new GetModelForClass<T>(dynamoDBClass, tableOptions, dynamoDBClient, mapper)
