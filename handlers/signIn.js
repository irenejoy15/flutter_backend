const {CognitoIdentityProviderClient,InitiateAuthCommand} = require('@aws-sdk/client-cognito-identity-provider');
// STEP 3 NG ORDERS FRONT END
const {DynamoDBClient,QueryCommand} = require('@aws-sdk/client-dynamodb');
// END STEP 3
const client = new CognitoIdentityProviderClient({ region:process.env.REGION });

const dynamoDbClient = new DynamoDBClient({ region: process.env.REGION });
const CLIENT_ID =  process.env.CLIENT_ID;

exports.signIn = async (event) => {
    const {email,password} = JSON.parse(event.body);
    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: CLIENT_ID,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password
        }
    };

    try{
        const command = new InitiateAuthCommand(params);
        const authResponse = await client.send(command);
        // Fetch user details from DynamoDB using email
        // STEP 3 NG ORDERS FRONT END
        const queryParams = {
            TableName: "Users",
            IndexName: 'EmailIndex', // Use the GSI for email
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': { S: email }
            },
            Limit: 1 // Assuming email is unique, we only need one item
        };
        const queryCommand = new QueryCommand(queryParams);
        const result = await dynamoDbClient.send(queryCommand);
        if (result.Items.length === 0 || !result.Items) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'User not found' }),
            };
        }

        const user = result.Items[0];
        return {
            statusCode: 200,
            body: JSON.stringify({
                msg: 'USER SUCCESSFULLY SIGNED IN',
                tokens: authResponse.AuthenticationResult,
                fullName: user.fullName.S,
                email: user.email.S,
                userId: user.userId.S,
                state: user.state.S,
                city: user.city.S,
                locality: user.locality.S,
            })
        };
        // END STEP 3
    }catch(error){
        return {
            statusCode:500,
            body: JSON.stringify({error:'FAILED TO SIGN IN',details:error.message}),
        };
    }
};