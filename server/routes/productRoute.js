const router = require('express').Router(); 
const {postProducts, getProducts, updateProducts, deleteProducts} = require('./../controllers/productsController');

router.get('/products',getProducts );
router.post('/products',postProducts);
router.patch('/products',updateProducts);
router.delete('/products',deleteProducts);

module.exports = router;