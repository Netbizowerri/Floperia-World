import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';

// Initialize Firebase Admin with service account
import serviceAccount from '../service-account.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import userRoutes from './routes/users';
import paymentRoutes from './routes/payments';

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);

// Export the Express app as a single Cloud Function
export const api = functions.https.onRequest(app);
