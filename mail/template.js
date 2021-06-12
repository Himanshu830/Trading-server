const sendMail = require('../helper/mail');

const singupVerificationMail = (user, token) => {
    let link = process.env.FRONT_END_URL + "/activate/" + token;

    return sendMail(
        user.email,
        `Account activation request`,
        `Hi ${user.name} \n Please click on the following link ${link} to activate your account. \n\n `
    );
}

const singupVerifiedMail = (user) => {
    return sendMail(
        user.email,
        `Account activation confirmation`,
        `Hi ${user.name} \n This is a confirmation that the your account ${user.email} has been activated.\n`
    );
}

const forgotPasswordMail = (user) => {
    let link = process.env.FRONT_END_URL + "/auth/reset/" + user.resetPasswordToken

    return sendMail(
        user.email,
        `Password change request`,
        `Hi ${user.name} \n 
            Please click on the following link ${link} to reset your password. \n\n 
            If you did not request this, please ignore this email and your password will remain unchanged.\n`                    
    );
}

const resetPasswordConfirmationMail = (user) => {
    // send email
    return sendMail(
        user.email,
        `Your password has been changed`,
        `This is a confirmation that the password for your account ${user.email} has just been changed.\n`
    );
}

const sendContactMailToAdmin =(message) => {
    // send email
    return sendMail(
        ADMIN_EMAIL,
        `Contact Us`,
        `${message}\n`
    );  
}

module.exports = {
    singupVerificationMail,
    singupVerifiedMail,
    forgotPasswordMail,
    resetPasswordConfirmationMail,
    sendContactMailToAdmin
};