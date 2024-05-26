import * as express from 'express';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';
import { UserSchema, usersRef } from '../db';
import session, { Session, SessionData } from 'express-session';
import { FieldValue } from '@google-cloud/firestore';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();
const serviceAccountFilePath = 'D:/JavaScript/Projects/Dry/server/src/key.json';



router.use(session({
  secret: 'teamDarkLooters',
  resave: false,
  saveUninitialized: true,
}));


router.get('/api/orders/:serviceProviderId', async (req, res) => {
  try {
    const { serviceProviderId } = req.params;

    const querySnapshot = await admin.firestore().collection('orders').where('serviceProviderId', '==', serviceProviderId).get();
    const orders = querySnapshot.docs.map((doc) => doc.data());

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});



const fetch = require('node-fetch');

router.post('/make-order', async (req, res) => {
  try {
    const { firstName, lastName, phone, pickupLocation, clothesCount, service, urgent, name } = req.body;

    if (!firstName || !lastName || !phone || !pickupLocation || !clothesCount || !service || urgent === undefined || !name) {
      return res.status(400).json({ error: 'All fields are required, including serviceProviderName' });
    }

    const serviceProviderAPI = await fetch('http://localhost:3000/api/service-providers');
    const serviceProviderData = await serviceProviderAPI.json();

    const foundServiceProvider = serviceProviderData.find((provider: { name: any; }) => provider.name === name);

    if (!foundServiceProvider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    const order = {
      firstName,
      lastName,
      phone,
      pickupLocation,
      clothesCount,
      service,
      urgent,
      createdAt: admin.database.ServerValue.TIMESTAMP,
      status: 'Pending',
      name,
    };


    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error making order:', error);
    res.status(500).json({ error: 'Failed to make order' });
  }
});

router.post('/save-order', async (req, res) => {
  try {
    const { firstName, lastName, phone, pickupLocation, clothesCount, service, urgent, name } = req.body;

    if (!firstName || !lastName || !phone || !pickupLocation || !clothesCount || !service || urgent === undefined || !name) {
      return res.status(400).json({ error: 'All fields are required, including serviceProviderName' });
    }

    const order = {
      firstName,
      lastName,
      phone,
      pickupLocation,
      clothesCount,
      service,
      urgent,
      createdAt: admin.database.ServerValue.TIMESTAMP,
      status: 'Pending',
      name,
    };

    const newOrderRef = await usersRef.push(); 
    await newOrderRef.set(order); 

    res.status(201).json({ message: 'Order saved successfully', orderId: newOrderRef.key });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order to the database' });
  }
});



router.post('/signup', async (req, res) => {
  try {
    const { phone, email, password, userType, firstName, lastName, name, shopAddress, pincode, services, location } = req.body;

    const emailExists = await checkExistingEmail(email);
    const phoneExists = await checkExistingPhone(phone);

    if (emailExists) {
      return res.status(400).send('Email already exists');
    }

    if (phoneExists) {
      return res.status(400).send('Phone number already exists');
    }

    if (!phone && !email) {
      return res.status(400).send('Phone or email is required');
    }
    if (!password) {
      return res.status(400).send('Password is required');
    }
    if (!userType) {
      return res.status(400).send('User type is required');
    }
    if (!firstName || !lastName) {
      return res.status(400).send('First name and last name are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;

    if (userType === 'ServiceProvider') {
      newUser = {
        user: {
          firstName,
          lastName,
          phone,
          email,
          password: hashedPassword,
          userType,
        },
        serviceProvider: {
          name,
          shopAddress,
          pincode,
          services,
        },
      };
    } else if (userType === 'Customer') {
      newUser = {
        user: {
          firstName,
          lastName,
          phone,
          email,
          password: hashedPassword,
          userType,
        },
        customer: {
          location,
        },
      };
    }

    const newUserRef = await usersRef.push(newUser);

    res.status(201).json({ message: 'User created successfully', userId: newUserRef.key });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating user');
  }
});

async function checkExistingEmail(email: string) {
  const snapshot = await usersRef.orderByChild('user/email').equalTo(email).once('value');
  return snapshot.exists();
}

async function checkExistingPhone(phone: string) {
  const snapshot = await usersRef.orderByChild('user/phone').equalTo(phone).once('value');
  return snapshot.exists();
}



router.post('/signin', async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    if (!phone && !email) {
      return res.status(400).send('Phone or email is required');
    }
    if (!password) {
      return res.status(400).send('Password is required');
    }

    let query;
    if (phone) {
      query = usersRef.orderByChild('user/phone').equalTo(phone);
    } else {
      query = usersRef.orderByChild('user/email').equalTo(email);
    }

    const snapshot = await query.once('value');
    const user = snapshot.val();

    if (!user) {
      return res.status(404).send('User not found');
    }

    const userData = Object.values(user)[0] as UserSchema;
    const isPasswordValid = await bcrypt.compare(password, userData.user.password);

    if (!isPasswordValid) {
      return res.status(401).send('Invalid password');
    }

    if (userData.user.userType === 'ServiceProvider') {
      const userDetails = {
        firstName: userData.user.firstName,
        lastName: userData.user.lastName,
        phone: userData.user.phone,
        email: userData.user.email,
        userType: userData.user.userType,
        name: userData.serviceProvider?.name,
        shopAddress: userData.serviceProvider?.shopAddress,
        pincode: userData.serviceProvider?.pincode,
      };
      return res.status(200).json(userDetails);
    } else if (userData.user.userType === 'Customer') {
      const userDetails = {
        firstName: userData.user.firstName,
        lastName: userData.user.lastName,
        phone: userData.user.phone,
        email: userData.user.email,
        userType: userData.user.userType,
        location: userData.customer?.location,
      };
      return res.status(200).json(userDetails);
    } else {
      return res.status(200).send({ userType: 'Other' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing in user');
  }
});


router.get('/userdata', async (req, res) => {
  try {
    if (!req.session || !(req.session as any).user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { userId } = (req.session as any).user;

    const snapshot = await usersRef.child(userId).once('value');
    const userData = snapshot.val();

    const userDetails: any = {
      firstName: userData.user.firstName,
      lastName: userData.user.lastName,
      phone: userData.user.phone,
      email: userData.user.email,
      userType: userData.user.userType,
    };

    if (userData.user.userType === 'ServiceProvider' && userData.serviceProvider) {
      userDetails.name = userData.serviceProvider.name;
      userDetails.shopAddress = userData.serviceProvider.shopAddress;
      userDetails.pincode = userData.serviceProvider.pincode;
    } else if (userData.user.userType === 'Customer' && userData.customer) {
      userDetails.location = userData.customer.location;
    }

    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error getting user data:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});



router.post('/signout', async (req, res) => {
  try {
    req.session.destroy((error) => {
      if (error) {
        console.error('Error signing out user:', error);
        res.status(500).send('Error signing out user');
      } else {
        res.clearCookie('token');
        res.status(200).send('User signed out');
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing out user');
  }
});


router.use((req, res, next) => {
  if (req.session) {
    req.session.save((err) => {
      if (err) {
        console.error('Error saving session:', err);
      }
    });
  }
  next();
});

export default router;
function generateUniqueId(): string {
  throw new Error('Function not implemented.');
}

// function checkExistingEmail(email: any) {
//   throw new Error('Function not implemented.');
// }

// function checkExistingPhone(phone: any) {
//   throw new Error('Function not implemented.');
// }

