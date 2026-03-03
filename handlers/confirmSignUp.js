const {CognitoIdentityProviderClient,ConfirmSignUpCommand} = require('@aws-sdk/client-cognito-identity-provider');

const client = new CognitoIdentityProviderClient({ region:'ap-southeast-2' });

//specify the cognito app client id
//the app client id tells cognito which app making the request

const CLIENT_ID = 'bbbvsdudg6e9n0h6ujv4sqlbi';

exports.confirmSignUp = async (event) => {
    const {email,confirmationCode} = JSON.parse(event.body);

    //Prepare parameters required by Cognito confirmSignUpCommand
    const params = {
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: confirmationCode
    };

    try{
        //CREATE CONFIRM SIGN UP COMMAND OBJECT WITH THE PREPARED PARAMETERS
        const command = new ConfirmSignUpCommand(params);
        await client.send(command);
        return {
            statusCode: 200,
            body: JSON.stringify({msg:'USER SUCCESSFULLY CONFIRMED'}),
        };
    }catch(error){
        return {
            statusCode:500,
            body: JSON.stringify({error:'FAILED TO VERIFY USER',details:error.message}),
        };
    }
};