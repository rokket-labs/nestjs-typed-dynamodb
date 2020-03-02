# Model

So far there are only a few methods implemented. Here "Schema" is used as a generic value

### Main methods

| Method            | Description                      | Paramaters                                | Return                               |
| ----------------- | -------------------------------- | ----------------------------------------- | ------------------------------------ |
| create            | Creates a document in DynamoDB   | Object with required attributes of Schema | Promise of Schema                    |
| find              | Find every document that matches | Object with some attributes of Schema     | Promise of a array of Schemas        |
| findById          | Find one document by its ID      | ID                                        | Promise of Schema>                   |
| findByIdAndDelete | Delete one document by its ID    | ID                                        | Promise of DynamoDB.DeleteItemOutput |
| findByIdAndUpdate | Update one document by its ID    | ID                                        | Promise of Schema                    |

Note: Dynamo uses PUT method, so create is **both** create and update

### Helper methods

If something is not yet implemented, you can easily create your own methods with these helpers

| Method            | Description                                 | Return                                                                            |
| ----------------- | ------------------------------------------- | --------------------------------------------------------------------------------- |
| getTable          | Returns table name                          | string                                                                            |
| getSchema         | Returns corresponding **_DynamoDB Schema_** | string                                                                            |
| getDynamoDBClient | Returns DynamoDBClient                      | [DynamoDB](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html) |
