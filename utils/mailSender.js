const SibApiV3Sdk = require('@sendinblue/client');

const client = new SibApiV3Sdk.TransactionalEmailsApi();

client.setApiKey(

    SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,

    process.env.BREVO_API_KEY
);

async function mailSender(to,subject,htmlContent){

    try{

        const response = await client.sendTransacEmail({

            sender:{

                email:process.env.EMAIL_USER,

                name:"EduLoop"
            },

            to:[{ email:to }],

            subject,

            htmlContent,
        });

        console.log("Email sent successfully");

        console.log(response);

    } catch(error){

        console.log("FULL EMAIL ERROR:");
        console.error("Email error:",error.message)
    }
}

module.exports = mailSender;