const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports = async (req, res, next) => {
    try {
        const email = req.params.email;
        const token = req.params.token;

        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        if (!decoded) {  
            throw new Error()
        }

        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if(user.email !== email) {
            user.email = email
            req.user = user
        } else {
            return res.status(401).send({ error: 'Email has already verified.' })
        }

        next()
    } catch (e) {
        res.status(401).send({ error: 'Invalide token.' })
    }
}