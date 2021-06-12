const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { STATUS_ACTIVE, STATUS_INACTIVE } = require('../constant/status');
const _ = require('lodash')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },  
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    country: String,
    chatUsers: [{
        userId:  {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true
        },
        name: String
    }],
    last_login: {
        type: Date,
        default: null
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    status: {
        type: Number,
        enum: [STATUS_INACTIVE, STATUS_ACTIVE],
        default: STATUS_INACTIVE
    },
    role: {
        type: Number,
        required: true,
        default: 0
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.methods.updateLastLogin = async function() {
    const user = this
    user.last_login = new Date()

    await user.save();
}

// userSchema.statics.generateSignupToken = async (user) => {
//     return jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY)
// }


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Invalid email or password.')
    }

    if(!user.status) {
        throw new Error(`Please activate your account. An activation mail is sent on ${user.email}`)
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Invalid email or password.')
    }

    return user
}

userSchema.statics.getUsers = async (user, { name, email, order="createdAt:desc" }) => {
    // let condition = { status: STATUS_ACTIVE };
    let condition = { role: 0 };
    if(name) {
        condition.name = {$regex: name, $options: 'i'}
    }
    if(email) {
        condition.email = email;
    }

    const sort = {}
    const parts = order.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;

    try {
        const result = await User.find(condition)
            .select({
                "_id": true,
                "name": true,
                "email": true,
                "country": true,
                "status": true
            })
            .sort(sort)
            .exec();
        return result;
    } catch (error) {
        console.log(error)
    }
}

userSchema.statics.udpateChatUsers = async (from , to) => {
    try {
        const user = await User.findById(from)
        const toUser = await User.findById(to)

        let users = user.chatUsers
        _.remove(users, (user) => user.userId == to);
        users = [{userId: to, name: toUser.name}, ...users]

        user.chatUsers = users
        await user.save()
    } catch (error) {
        console.log(error)
    }
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Reset password
userSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordExpires = Date.now() + 3600000      //expires in an hour
}

// Delete user tasks when user is removed
// userSchema.pre('remove', async function (next) {
//     const user = this
//     await Task.deleteMany({ owner: user._id })
//     next()
// })

const User = mongoose.model('User', userSchema)

module.exports = User