const router = require('express').Router(); 
const {postProducts, getProducts, updateProducts} = require('./../controllers/productsController');

router.get('/products',getProducts );
router.post('/products',postProducts);
router.patch('/products',updateProducts);

module.exports = router;