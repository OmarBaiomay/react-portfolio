import express from 'express';
import {
  contracts,
  createContractFromQuote,
  createInvoiceFromContract,
  createInvoiceFromQuote,
  getSalesStats,
  invoices,
  quotes,
} from '../controllers/sales.controller.js';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protectRoute, requireAdmin);

router.get('/stats', getSalesStats);

router.get('/quotes', quotes.list);
router.get('/quotes/:id', quotes.getOne);
router.post('/quotes', quotes.create);
router.patch('/quotes/:id', quotes.update);
router.delete('/quotes/:id', quotes.remove);
router.post('/quotes/:id/to-contract', createContractFromQuote);
router.post('/quotes/:id/to-invoice', createInvoiceFromQuote);

router.get('/contracts', contracts.list);
router.get('/contracts/:id', contracts.getOne);
router.post('/contracts', contracts.create);
router.patch('/contracts/:id', contracts.update);
router.delete('/contracts/:id', contracts.remove);
router.post('/contracts/:id/to-invoice', createInvoiceFromContract);

router.get('/invoices', invoices.list);
router.get('/invoices/:id', invoices.getOne);
router.post('/invoices', invoices.create);
router.patch('/invoices/:id', invoices.update);
router.delete('/invoices/:id', invoices.remove);

export default router;
