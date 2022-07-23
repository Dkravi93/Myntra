const router = require('express').Router(); 
const {postOrder, getOrder, updateOrder, deleteOrder} = require('./../controllers/ordercontroller');

router.get('/Order',getOrder );
router.post('/Order',postOrder);
router.patch('/Order',updateOrder);
router.delete('/Order',deleteOrder);

module.exports = router;