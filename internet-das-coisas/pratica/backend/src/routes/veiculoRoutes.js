const router = require('express').Router();
const veiculoController = require('../controllers/veiculoController');

router.get('/', veiculoController.listar);
router.post('/', veiculoController.criar);

module.exports = router;