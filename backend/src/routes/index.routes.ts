import { Router } from 'express';
import authR from './auth.routes';
import userR from './user.routes';
import portonR from './porton.routes';

const router = Router();

router.use('/auth', authR);
router.use('/user', userR);
router.use('/porton', portonR);


export default router;
