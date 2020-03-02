# Configurations

## Root module configuration

This will define the connection to DynamoDB globally.

| Property name   | Property type                                                                                                              | Default value |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------- |
| AWSConfig       | [AWS.Config](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html)                                          | undefined     |
| dynamoDBOptions | [DynamoDB.ClientConfiguration](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#constructor-property) | undefined     |

### Example

**app.module.ts**

```typescript
import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typed-dynamodb'
import { CatsModule } from './cat.module.ts'

@Module({
  imports: [
    DynamoDBModule.forRoot({
      AWSConfig: {
        region: 'local',
        accessKeyId: 'null',
        secretAccessKey: 'null',
      },
      dynamoDBOptions: {
        endpoint: 'localhost:8000',
        sslEnabled: false,
        region: 'local-env',
      },
    }),
    CatsModule,
  ],
})
export class ApplicationModule {}
```

## Feature configuration

You can configure each table individually or just pass the Schema to use the default configuration

| Method     | Argument Type                         |
| ---------- | ------------------------------------- |
| forFeature | Array of (Schema or ConfiguredSchema) |

#### ConfiguredSchema

| Property name | Property type                                                                                                                            | Default value |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| dynamoDBClass | Schema                                                                                                                                   | undefined     |
| tableOptions  | [CreateTableOptions](https://awslabs.github.io/dynamodb-data-mapper-js/packages/dynamodb-data-mapper/interfaces/createtableoptions.html) | undefined     |

Note: if you use the Schema without configs it will get as default values of readCapacityUnits: 5 and writeCapacityUnits: 10

### Example without extra config

**cat.module.ts**

```typescript
import { Module } from '@nestjs/common'
import { DynamoDBModule } from 'nestjs-typegoose'
import { Cat } from './cat.model'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'

@Module({
  imports: [DynamoDBModule.forFeature([Cat])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

### Example with extra config

**cat.module.ts**

```typescript
import { Module } from '@nestjs/common'
import { DynamoDBModule } from 'nestjs-typegoose'
import { Cat } from './cat.model'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'

@Module({
  imports: [
    DynamoDBModule.forFeature([
      {
        dynamoDBClass: Cat,
        tableOptions: {
          readCapacityUnits: 10,
          writeCapacityUnits: 10,
        },
      },
    ]),
  ],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```
