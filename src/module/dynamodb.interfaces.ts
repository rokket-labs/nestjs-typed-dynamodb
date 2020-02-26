import { Type } from '@nestjs/common'
import { ModuleMetadata } from '@nestjs/common/interfaces'
import { DynamoDB } from 'aws-sdk'
import { ConfigurationOptions, APIVersions } from 'aws-sdk/lib/config'
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders'

export interface DynamoDBClass {
  new (...args: any[])
}

// export type DynamoDBModuleOptions = Record<string, any>

export interface DynamoDBModuleOptions {
  dynamoDBOptions: DynamoDB.ClientConfiguration
  AWSConfig: Partial<ConfigurationOptions & ConfigurationServicePlaceholders & APIVersions>
}

export interface DynamoDBOptionsFactory {
  createTypegooseOptions(): Promise<DynamoDBModuleOptions> | DynamoDBModuleOptions
}

export interface DynamoDBModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  connectionName?: string
  useExisting?: Type<DynamoDBOptionsFactory>
  useClass?: Type<DynamoDBOptionsFactory>
  useFactory?: (...args: any[]) => Promise<DynamoDBModuleOptions> | DynamoDBModuleOptions
  inject?: any[]
}
