const mongoose = require('mongoose');
const validator = require('validator');
// const moment = require('moment');
const _ = require('lodash');
const Category = require('./category')
const User = require('./user')
const { STATUS_ACTIVE, STATUS_INACTIVE } = require('../constant/status');

const orderSchema = mongoose.Schema({
    id: Number,
    title: {
        type: String,
        required: true,
        trim: true
    },
    details: {
        type: String,
        required: true,
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        index: true,
        validate: {
            validator: (categoryId) => mongoose.Types.ObjectId.isValid(categoryId),
            message: 'Please provide valid category Id'
        },
        required: [true, 'Category Id is required.']
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        index: true,
        validate: {
            validator: (categoryId) => mongoose.Types.ObjectId.isValid(categoryId),
            message: 'Please provide valid category Id'
        },
        required: [true, 'Category Id is required.']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        validate: {
            validator: (userId) => mongoose.Types.ObjectId.isValid(userId),
            message: 'Please provide valid user Id'
        },
        required: [true, 'Category Id is required.']
    },
    type: {
        type: String,
        enum: ['Sell', 'Buy'],
        default: 'Sell'
    },
    deliveryCountry: {
        type: String,
        required: true,
        trim: true
    },
    budget: {
        type: String,
        required: true,
        trim: true
    },
    validTillDate: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Number,
        enum: [STATUS_INACTIVE, STATUS_ACTIVE],
        default: STATUS_ACTIVE
    }
}, {
    timestamps: true
});

//Static methods
orderSchema.statics.getOrderByUser = async (user=null, { title, categoryId, order="createdAt:desc", limit = 10 }) => {
    let condition = { status: STATUS_ACTIVE };
    if (categoryId) {
        condition.categoryId = mongoose.Types.ObjectId.isValid(categoryId) ? categoryId : null;
    }
    if(user) {
        condition.userId = user._id;
    }
    if(title) {
        condition.title = {$regex: title, $options: 'i'}
    }

    const sort = {}
    const parts = order.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;

    limit = parseInt(limit);
    limit = limit > 30 ? 10 : limit;

    try {
        const result = await Order.find(condition)
            .select({
                "_id": true,
                "type": true,
                "title": true,
                "deliveryCountry": true,
                "userId": true,
                "budget": true,
                "validTillDate": true
            })
            .populate('categoryId')
            .populate('subCategoryId')
            .sort(sort)
            .limit(limit)
            .exec();

        return result;
    } catch (error) {
        console.log(error)
    }
}

orderSchema.statics.getOrderById = async (productId, user=null ) => {
    let condition = { status: STATUS_ACTIVE };
    if(user) {
        condition.userId = user._id;
    }
    if(productId) {
        condition._id = productId;
    }

    try {
        const result = await Order.findOne(condition)
            .select({
                "_id": true,
                "type": true,
                "title": true,
                "details": true,
                "deliveryCountry": true,
                "userId": true,
                "budget": true,
                "validTillDate": true
            })
            .populate('categoryId')
            .populate('subCategoryId')
            .exec();

        return result;
    } catch (error) {
        console.log(error)
    }
}


const Order = mongoose.model('Order', orderSchema);
module.exports = Order;