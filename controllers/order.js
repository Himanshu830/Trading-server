const _ = require('lodash');
const Order = require('../models/order');

const orderById = (req, res, next, id) => {
    Order.findById(id)
    .populate('categoryId')
    .exec((err, order) => {
        if (err || !order) {
            return res.status(400).json({
                error: 'Order not found'
            });
        }
        req.order = order;
        next();
    });
};

const createOrder = async (req, res) => {
    try {
        const order = new Order({
            ...req.body,
        });
        await order.save();
        res.status(201).send(order);
    } catch (error) {
        res.status(400).send(error);
    }
}

const updateOrder = async (req, res) => {
    const {orderId} = req.params;
    const { title, details, categoryId, subCategoryId, deliveryCountry, budget, validTillDate, userId } = req.body;

    Order.findOne({_id: orderId}).then(order => {
        if(title) {
            order.title = title;
        }
        if(details) {
            order.details = details;
        }
        if(categoryId) {
            order.categoryId = categoryId;
        }
        if(subCategoryId) {
            order.subCategoryId = subCategoryId;
        }
        if(deliveryCountry) {
            order.deliveryCountry = deliveryCountry;
        }
        if(budget) {
            order.budget = budget;
        }
        if(validTillDate) {
            order.validTillDate = validTillDate;
        }

        order.save().then((result) => {
            res.send(result);
        }).catch(error => {
            console.log('ORDER UPDATE ERROR', error);
            return res.status(400).json({
                error: 'Order update failed'
            });
        })
    }).catch(error => {
        console.log('ORDER ERROR', error)
        return res.status(400).json({
            error: 'Order not found'
        });
    })
}

const listOrder = async (req, res) => {
    try {
        order = await Order.getOrderByUser(req.user, req.query);
        // res.set('Content-Type', 'image/jpg')
        res.send({ "status": "success", "result": order });
    } catch (error) {
        res.status(500).send(error);
    }
};

const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        order = await Order.getOrderById(orderId, req.user);
        res.send({ "status": "success", "result": order });
    } catch (error) {
        res.status(500).send(error);
    }
};

const deleteOrderById = async (req, res) => {
    try {
        if(!canDelete(req)) {
            return res.status(401).send({error: 'You can not delete this order.'})
        }
        // res.send({status: 'success'});
        // res.status(500).send({error: 'Order not deleted. Something went wrong.'})

        Order.findOneAndDelete({_id: req.params.orderId})
        .then(result => {
            res.send(result);
        }).catch(error => {
            res.status(500).send({error: 'Order not found.'})
        });
    } catch(error) {
        console.log(error)
        res.status(500).send({error: 'Order not deleted. Something went wrong.'})
    }
}

const canDelete = (req) => {
    if(req.user._id.toString() === req.order.userId.toString()) {
        return true
    } else {
        return false
    }
}

module.exports = {
    orderById,
    listOrder,
    createOrder,
    getOrderById,
    updateOrder,
    deleteOrderById
}