const {CognitoIdentityProviderClient,InitiateAuthCommand} = require('@aws-sdk/client-cognito-identity-provider');

const client = new CognitoIdentityProviderClient({ region:'ap-southeast-2' });

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
        const response = await client.send(command);
        return {
            statusCode: 200,
            body: JSON.stringify({msg:'USER SUCCESSFULLY SIGNED IN', tokens: response.AuthenticationResult}),
        };
    }catch(error){
        return {
            statusCode:500,
            body: JSON.stringify({error:'FAILED TO SIGN IN',details:error.message}),
        };
    }
};