const _ = require('lodash');
let formidable = require("formidable");
const fs = require('fs');

exports.emailValidator = (req, res, next) => {
    req.check('email', 'Email is required').notEmpty();
    req.check('email', 'Email must be between 4 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({  
            min: 4,
            max: 32
        });
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
}

exports.contactUsValidator = (req, res, next) => {
    req.check('company', 'Company is required').notEmpty();
    req.check('subject', 'Subject is required').notEmpty();
    req.check('message', 'Message is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
}

exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty();
    req.check('email', 'Email is required').notEmpty();
    req.check('email', 'Email must be between 4 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        });
    req.check('password', 'Password is required').notEmpty();
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number');
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.companyValidator = (req, res, next) => {
    req.check('name', 'Company is required').notEmpty();
    req.check('userId', 'user is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};

exports.orderValidator = (req, res, next) => {
    req.check('title', 'Title is required').notEmpty();
    req.check('details', 'Details is required').notEmpty();
    req.check('categoryId', 'Category is required').notEmpty();
    req.check('subCategoryId', 'Sub category is required').notEmpty();
    req.check('deliveryCountry', 'Delivery country is required').notEmpty();
    req.check('budget', 'Budget is required').notEmpty();
    req.check('validTillDate', 'Valid date is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
}

exports.productValidator = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        // 1kb = 1000
        // 1mb = 1000000
        let image = {};
        if (files.image) {
            console.log('here....')
            if (files.image.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            image.data = fs.readFileSync(files.image.path);
            image.contentType = files.image.type;
        }

        if(req.params.productId) {
            req.data = validateExistingProduct(res, fields)
        } else {
            req.data = validateNewProduct(res, fields)
        }

        if(!_.isEmpty(image, true)) {
            req.data.image = image;
        }

        next();
    });
}

validateNewProduct = (res, fields) => {
    const {
        name,
        description,
        unitPrice,
        categoryId,
        subCategoryId,
        minQuantity,
        deliveryTime,
        packagingDetail,
        userId
    } = fields;

    if (!name) {
        return res.status(422).send({ error: 'Name is required.' });
    } else if(!description) {
        return res.status(422).send({ error: 'Description is required.' });
    } else if(!unitPrice || isNaN(unitPrice)) {
        return res.status(422).send({ error: 'Unit price is required.' });
    } else if(!categoryId) {
        return res.status(422).send({ error: 'Category is required.' });
    } else if(!subCategoryId) {
        return res.status(422).send({ error: 'Subcategory is required.' });
    } else if(!minQuantity || isNaN(minQuantity)) {
        return res.status(422).send({ error: 'Min quantity is required.' });
    } else if(!deliveryTime || isNaN(deliveryTime)) {
        return res.status(422).send({ error: 'Delivery time is required.' });
    } else if(!packagingDetail) {
        return res.status(422).send({ error: 'Packaging detail is required.' });
    }

    let data = {
        name,
        description,
        unitPrice,
        categoryId,
        subCategoryId,
        minQuantity,
        deliveryTime,
        packagingDetail,
        userId
    };
    
    return data;
}

validateExistingProduct = (res, fields) => {
    let numberValidation = ['unitPrice', 'minQuantity', 'deliveryTime'];
    let propObj = {
        name: 'Name',
        description: 'Description',
        unitPrice: 'Unit price',
        categoryId: 'Category',
        subCategoryId: 'Subcategory',
        minQuantity: 'Min quantity',
        deliveryTime: 'Delivery time',
        packagingDetail: 'Packaging detail'
    }
    let data = {};
    for (var prop in fields) {
        if(numberValidation.includes(prop) && (!fields[prop] || isNaN(fields[prop])) ) {
            return res.status(422).send({ error: `${propObj[prop]} is required.` });
        } else if(!fields[prop]) {
            return res.status(422).send({ error: `${propObj[prop]} is required.` });
        }
        

        data[prop] = fields[prop];
    }

    return data;
}