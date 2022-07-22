const Product = require("./../models/prodModel");
const APIFeatures = require("./../utils/apiQuery");
const catchAsyncErrors = require("../utils/catchAsync");

// create products => api/v1/products
const postProducts = catchAsyncErrors(async (req, res, next) => {
  await Product.createIndexes();
  const { title, price, description, category, ratings, stocks } = req.body;
  const products = await Product.create({
    title,
    price,
    description,
    category,
    ratings,
    stocks,
  });

  res.status(200).json({
    success: true,
    products,
  });
});

// get all products => api/v1/products?keyword=bags
const getProducts = catchAsyncErrors(async (req, res, next) => {
    let page = req.query.page || 1;
    let resultsPerPage = 6;
  let query = req.query.search ? { $text: { $search: req.query.search } } : {};
  let sortBy = req.query.title
    ? "req.query.title"
    : req.query.price
    ? "req.query.price"
    : req.query.ratings
    ? "req.query.ratings"
    : null;

  var elem = sortBy ? sortBy.split(".")[2] : null;
  let x;
  elem === "title"
    ? (x = { title: req.query.title })
    : elem === "price"
    ? (x = { price: req.query.price })
    : elem === "ratings"
    ? (x = { ratings: req.query.ratings })
    : (x = {});


  let products = await Product.find(query)
    .sort(x)
    .skip(resultsPerPage * (page - 1))
    .limit(resultsPerPage);

  res.status(200).json({
    success: true,
    resultsPerPage,
    products,
  });
});

// patch/update => api.v1/products/:id
const updateProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    products,
  });
});

module.exports = { postProducts, getProducts, updateProducts };
