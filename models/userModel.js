const {DynamoDBClient,PutItemCommand} = require('@aws-sdk/client-dynamodb');
const {v4: uuidv4} = require('uuid');

const TABLE_NAME = "Users";

const dynamoClient = new DynamoDBClient({ region: process.env.REGION });

//User Model class to represent the user data and handle database operations
class UserModel{
    constructor(email,fullName){
        this.userId = uuidv4();
        this.email = email;
        this.fullName = fullName;
        this.state = ""; //DEFAULT EMPTY
        this.city = ""; //DEFAULT EMPTY
        this.locality = ""; //DEFAULT EMPTY
        this.createdAt = new Date().toISOString();
    }   

    //save user data to DynamoDB
    async save(){
        const params = {
            TableName: TABLE_NAME,
            Item: {
                userId: { S: this.userId },
                email: { S: this.email },
                fullName: { S: this.fullName },
                state: { S: this.state },
                city: { S: this.city },
                locality: { S: this.locality },
                createdAt: { S: this.createdAt }
            }
        };

        try {
            await dynamoClient.send(new PutItemCommand(params));
        } catch (error) {
            console.error("Error saving user:", error);
            throw error;
        }
    }
}
