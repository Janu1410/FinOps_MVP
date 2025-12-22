import express from 'express';
import * as DataController from './data.controller.js';
import { uploadFile } from '../../middlewares/uploadFile.js';

const router = express.Router();

router.post('/process-csv', uploadFile , DataController.processCSV);

export default router;
