const mongoose = require('mongoose');
const validator = require('validator');
// const moment = require('moment');
const _ = require('lodash');
const Category = require('./category')
const User = require('./user')
const { STATUS_ACTIVE, STATUS_INACTIVE } = require('../constant/status');

const productSchema = mongoose.Schema({
    // id: Number,
    name: {
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
    description: String,
    minQuantity: Number,
    unitPrice: Number,
    packagingDetail: String,
    deliveryTime: Number,
    image: {
        data: Buffer,
        contentType: String
    },
    video: String,
    status: {
        type: Number,
        enum: [STATUS_INACTIVE, STATUS_ACTIVE],
        default: STATUS_ACTIVE
    }
}, {
    timestamps: true
});

//Static methods
productSchema.statics.getProductByUser = async (user=null, { categoryId, name, order="createdAt:desc", limit = 10 }) => {
    let condition = { status: STATUS_ACTIVE };
    if (categoryId) {
        condition.categoryId = mongoose.Types.ObjectId.isValid(categoryId) ? categoryId : null;
    }
    if(user) {
        condition.userId = user._id;
    }
    if(name) {
        condition.name = {$regex: name, $options: 'i'}
    }

    const sort = {}
    const parts = order.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;

    limit = parseInt(limit);
    limit = limit > 30 ? 10 : limit;

    try {
        const result = await Product.find(condition)
            .select({
                "_id": true,
                "name": true,
                "description": true,
                "userId": true,
                "minQuantity": true,
                "unitPrice": true,
                "packagingDetail": true,
                "deliveryTime": true,
                "image": true,
                "video": true,
                "status": true
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

productSchema.statics.getProductById = async (productId, user=null ) => {
    let condition = { status: STATUS_ACTIVE };
    if(user) {
        condition.userId = user._id;
    }
    if(productId) {
        condition._id = productId;
    }

    try {
        const result = await Product.findOne(condition)
            .select({
                "_id": true,
                "name": true,
                "description": true,
                "userId": true,
                "minQuantity": true,
                "unitPrice": true,
                "packagingDetail": true,
                "deliveryTime": true,
                "image": true,
                "video": true,
                "status": true
            })
            .populate('categoryId')
            .populate('subCategoryId')
            .exec();

        return result;
    } catch (error) {
        console.log(error)
    }
}


const Product = mongoose.model('Product', productSchema);
module.exports = Product;