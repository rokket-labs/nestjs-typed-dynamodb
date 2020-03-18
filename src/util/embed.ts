import {
  DocumentType,
  ZeroArgumentsConstructor,
} from '@aws/dynamodb-data-marshaller'
import { DynamoDbSchema } from '@aws/dynamodb-data-mapper'

export interface DocumentTypeOptions<T> {
  defaultProvider?: () => T
  attributeName?: string
}

export function embed<T>(
  documentConstructor: ZeroArgumentsConstructor<T>,
  { attributeName, defaultProvider }: DocumentTypeOptions<T> = {},
): DocumentType {
  return {
    type: 'Document',
    members: documentConstructor.prototype[DynamoDbSchema] || {},
    attributeName,
    defaultProvider,
    valueConstructor: documentConstructor,
  }
}
