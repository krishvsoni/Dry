import express from 'express';
import authRoute from './routes/authRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';
import { UserSchema, usersRef } from './db';
import router from './routes/authRoutes';
import { Request, Response } from 'express'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());
app.use('/api/auth', authRoute);



app.get('/api/service-providers', async (req, res) => {
  try {
    const snapshot = await usersRef.once('value');
    const data = snapshot.val();
    const providers = Object.values(data).filter((user: unknown) => {
      if (typeof user === 'object' && user !== null && 'user' in user) {
        return (user as UserSchema).user.userType === 'ServiceProvider';
      }
      return false;
    }) as UserSchema[];
    const serviceProviders = providers.map((provider) => {
      return provider.serviceProvider;
    });
    res.json(serviceProviders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/service-providers/:id', async (req, res) => {
  try {
    const shopId = req.params.id;
    const shopData = await fetchShopData(shopId);
    
    if (shopData === undefined) {
      return res.status(404).send('Shop not found');
    }

    res.status(200).json(shopData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching shop data');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


function fetchShopData(shopId: string) {
  throw new Error('Function not implemented.');
}


function verifyToken(token: string) {
  throw new Error('Function not implemented.');

}










/* 
src/
|-- controllers/
|   |-- authController.ts
|-- models/
|   |-- userModel.ts
|-- routes/
|   |-- authRoutes.ts
|-- middleware/
|   |-- authMiddleware.ts
|-- db.ts
|-- server.ts
*/