const express = require('express');
const router = express.Router();
const professoresController = require('../controllers/professores');

router.post('/', professoresController.create);
router.put('/:id', professoresController.update);
router.delete('/:id', professoresController.deactivate);
router.get('/', professoresController.findAll);
router.put('/reativar/:id', professoresController.reactivate);

module.exports = router;
