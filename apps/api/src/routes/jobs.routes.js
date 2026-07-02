import {Router} from 'express';
import {createJob, getJobById} from '../controllers/jobs.controller.js';

const router = Router();

router.post('/', createJob);
router.get('/:id', getJobById);

export default router;