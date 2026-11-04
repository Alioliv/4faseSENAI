const router = require('express').Router();
const ordemServicoController = require('../controllers/ordemServicoController');

router.get('/', ordemServicoController.listar);
router.post('/', ordemServicoController.criar);
router.patch('/:id/data', ordemServicoController.atualizarData);

module.exports = router;