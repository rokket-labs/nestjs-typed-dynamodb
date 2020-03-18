import { isClass } from 'is-class'
import {
  DynamoDBClass,
  DynamoDBClassWithOptions,
  DynamoDBInput,
} from '../module/dynamodb.interfaces'

const isDynamoDBClass = (item): item is DynamoDBClass => isClass(item)
const isDynamoDBClassWithOptions = (item): item is DynamoDBClassWithOptions =>
  isDynamoDBClass(item.dynamoDBClass)

export const convertToClassWithOptions = (
  item: DynamoDBInput,
): DynamoDBClassWithOptions => {
  if (isDynamoDBClass(item)) {
    return {
      dynamoDBClass: item,
      modelOptions: {},
    }
  } else if (isDynamoDBClassWithOptions(item)) {
    return item
  }
  return invalidObject('model')
}

function invalidObject(type: string): never {
  throw new Error(`Invalid ${type} object`)
}
