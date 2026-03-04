//Import the requrired AWS Cognito SDK CLASSES
//Cognito Identity Profiler Client used to communicate to cognito
//SignUpCommand : Used to send sign-up request

const {CognitoIdentityProviderClient,SignUpCommand} = require('@aws-sdk/client-cognito-identity-provider');
const UserModel = require('../models/userModel');
const client = new CognitoIdentityProviderClient({ region:process.env.REGION });

//specify the cognito app client id
//the app client id tells cognito which app making the request

const CLIENT_ID = process.env.CLIENT_ID;

//DEFINE A LAMBDA FUNCTION TO SEND SIGNUP REQUEST

exports.signUp = async (event) => {
    const {email,fullName,password} = JSON.parse(event.body);

    //Prepare parameters required by Cognito signUpcommand
    const params = {
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes:[
            {Name:'email',Value:email},
            {Name:'name',Value:fullName},
        ]
    };

    try{
        //CREATE SIGN UP COMMAND OBJECT WITH THE PREPARED PARAMETERS
        const command = new SignUpCommand(params);
        await client.send(command);
        //CREATE A NEW USER INSTANCE AND SAVE TO DYNAMODB
        const newUser = new UserModel(email, fullName);
        await newUser.save();

        return {
            statusCode: 200,
            body: JSON.stringify({msg:'USER SUCCESSFULLY SIGN UP'}),
        };
    }catch(error){
        return {
            statusCode:500,
            body: JSON.stringify({error:'UNEXPECTED ERROR',error:error.message}),
        };
    }
};