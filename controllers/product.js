var formidable = require("formidable");
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');

const productById = (req, res, next, id) => {
    Product.findById(id)
    .populate('categoryId')
    .exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: 'Product not found'
            });
        }
        req.product = product;
        next();
    });
};

const listProduct = async (req, res) => {
    try {
        product = await Product.getProductByUser(req.user, req.query);
        // res.set('Content-Type', 'image/jpg')
        res.send({ "status": "success", "result": product });
    } catch (error) {
        res.status(500).send(error);
    }
};

const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        // product = await Product.getProductById(productId, req.user);
        product = await Product.getProductById(productId);
        res.send({ "status": "success", "result": product });
    } catch (error) {
        res.status(500).send(error);
    }
};

const createProduct = async (req, res) => {
    try {
        let product = new Product(req.data);
        await product.save();
        res.status(201).send(product);
    } catch(error) {
        res.status(500).send({error: 'Something went wrong.'});
    }
}

const updateProduct = (req, res) => {
    try {
        const {data} = req;
        if(_.isEmpty(data, true)) {
            return res.send({success: true})
        }

        Product.findOneAndUpdate({_id: req.params.productId}, {$set: data}, {new: true}, (err, doc) => {
            if (err) {
                res.status(400).send({ error: 'Error occurred in updating product.'});
            }
            res.send(doc)
        });
    } catch(error) {
        console.log(error)
        res.status(500).send({error: 'Something went wrong.'});
    }

};

const deleteProductById = (req, res) => {
    try {
        if(!canDelete(req)) {
            return res.status(401).send({error: 'You can not delete this product.'})
        }
        // res.send({status: 'success'});
        // res.status(500).send({error: 'Product not deleted. Something went wrong.'})

        Product.findOneAndDelete({_id: req.params.productId})
        .then(result => {
            res.send(result);
        }).catch(error => {
            res.status(500).send({error: 'Product not found.'})
        });
    } catch(error) {
        console.log(error)
        res.status(500).send({error: 'Product not deleted. Something went wrong.'})
    }
}

const canDelete = (req) => {
    if(req.user._id.toString() === req.product.userId.toString()) {
        return true
    } else {
        return false
    }
}



module.exports = {
    productById,
    listProduct,
    createProduct,
    getProductById,
    updateProduct,
    deleteProductById
}