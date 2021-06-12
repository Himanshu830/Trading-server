const mongoose = require('mongoose')
const validator = require('validator')
const User = require('./user')

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User  
    },
    companyType: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    facebook: {
        type: String,
        trim: true
    },
    linkedIn: {
        type: String,
        trim: true
    },
    twitter: {
        type: String,
        trim: true
    },
    instagram: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        // required: true,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    
    //social media url
    image: {
        data: Buffer, 
        contentType: String
    },
    video: String,
    status: {
        type: Number,
        enum: [0, 1],
        default: 1
    }
}, {
    timestamps: true
})

const Company = mongoose.model('Company', companySchema)

module.exports = Company