import { Router } from 'express';
import api from '../controllers/api.controllers.js';
import register from '../controllers/register.controllers.js';
import monitor from '../controllers/monitor.controllers.js';
import enable from '../controllers/enable.controllers.js';
import unregister from '../controllers/unregister.controllers.js';

const router = Router();

router.get('/monitor', monitor);
router.post('/register', register);
router.delete('/unregister/:id', unregister);
router.put('/enable/:id', enable);
router.use('/v1', api);

export default router;
