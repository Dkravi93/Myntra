const Order = require('./../models/orderModel');
const catchAsyncErrors = require("../utils/catchAsync");


const postOrder = catchAsyncErrors(async (req, res, next) => {
        let orders = await Order.create(req.body);
        
        res.status(200).send(orders);
});

const getOrder = catchAsyncErrors(async (req, res, next) => {
        let order = await Order.find().lean().exec();
        res.status(200).json(order);
});

const updateOrder = catchAsyncErrors(async (req, res, next) => {
        let order = await Order.findByIdAndUpdate(req.params.id).lean().exec();
        res.status(200).json(order);
});

const deleteOrder = catchAsyncErrors(async (req, res, next) => {
        let order = await Order.findByIdAndDelete(req.params.id).lean().exec();
        res.status(200).json(order);
})

module.exports = { postOrder, getOrder, updateOrder, deleteOrder}