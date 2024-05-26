"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const admin = __importStar(require("firebase-admin"));
const bcrypt = __importStar(require("bcrypt"));
const db_1 = require("../db");
const express_session_1 = __importDefault(require("express-session"));
const router = express.Router();
const serviceAccountFilePath = 'D:/JavaScript/Projects/Dry/server/src/key.json';
router.use((0, express_session_1.default)({
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
    }
    catch (error) {
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
        const foundServiceProvider = serviceProviderData.find((provider) => provider.name === name);
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
    }
    catch (error) {
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
        const newOrderRef = await db_1.usersRef.push();
        await newOrderRef.set(order);
        res.status(201).json({ message: 'Order saved successfully', orderId: newOrderRef.key });
    }
    catch (error) {
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
        }
        else if (userType === 'Customer') {
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
        const newUserRef = await db_1.usersRef.push(newUser);
        res.status(201).json({ message: 'User created successfully', userId: newUserRef.key });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }
});
async function checkExistingEmail(email) {
    const snapshot = await db_1.usersRef.orderByChild('user/email').equalTo(email).once('value');
    return snapshot.exists();
}
async function checkExistingPhone(phone) {
    const snapshot = await db_1.usersRef.orderByChild('user/phone').equalTo(phone).once('value');
    return snapshot.exists();
}
router.post('/signin', async (req, res) => {
    var _a, _b, _c, _d;
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
            query = db_1.usersRef.orderByChild('user/phone').equalTo(phone);
        }
        else {
            query = db_1.usersRef.orderByChild('user/email').equalTo(email);
        }
        const snapshot = await query.once('value');
        const user = snapshot.val();
        if (!user) {
            return res.status(404).send('User not found');
        }
        const userData = Object.values(user)[0];
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
                name: (_a = userData.serviceProvider) === null || _a === void 0 ? void 0 : _a.name,
                shopAddress: (_b = userData.serviceProvider) === null || _b === void 0 ? void 0 : _b.shopAddress,
                pincode: (_c = userData.serviceProvider) === null || _c === void 0 ? void 0 : _c.pincode,
            };
            return res.status(200).json(userDetails);
        }
        else if (userData.user.userType === 'Customer') {
            const userDetails = {
                firstName: userData.user.firstName,
                lastName: userData.user.lastName,
                phone: userData.user.phone,
                email: userData.user.email,
                userType: userData.user.userType,
                location: (_d = userData.customer) === null || _d === void 0 ? void 0 : _d.location,
            };
            return res.status(200).json(userDetails);
        }
        else {
            return res.status(200).send({ userType: 'Other' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error signing in user');
    }
});
router.get('/userdata', async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { userId } = req.session.user;
        const snapshot = await db_1.usersRef.child(userId).once('value');
        const userData = snapshot.val();
        const userDetails = {
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
        }
        else if (userData.user.userType === 'Customer' && userData.customer) {
            userDetails.location = userData.customer.location;
        }
        res.status(200).json(userDetails);
    }
    catch (error) {
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
            }
            else {
                res.clearCookie('token');
                res.status(200).send('User signed out');
            }
        });
    }
    catch (error) {
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
exports.default = router;
function generateUniqueId() {
    throw new Error('Function not implemented.');
}
// function checkExistingEmail(email: any) {
//   throw new Error('Function not implemented.');
// }
// function checkExistingPhone(phone: any) {
//   throw new Error('Function not implemented.');
// }
