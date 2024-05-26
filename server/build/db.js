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
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRef = exports.fetchServiceProviders = exports.fetchOrders = void 0;
const admin = __importStar(require("firebase-admin"));
const serviceAccountFilePath = 'D:/JavaScript/Projects/Dry/server/src/key.json';
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountFilePath),
    databaseURL: 'https://dry1-975a5-default-rtdb.firebaseio.com/',
});
const db = admin.database();
const ordersRef = db.ref('orders');
async function fetchOrders() {
    try {
        const snapshot = await ordersRef.once('value');
        const ordersData = [];
        snapshot.forEach(childSnapshot => {
            const order = childSnapshot.val();
            ordersData.push(order);
        });
        return ordersData;
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}
exports.fetchOrders = fetchOrders;
const usersRef = db.ref('users');
exports.usersRef = usersRef;
usersRef.orderByChild('userType').equalTo('Customer').once('value')
    .then(snapshot => {
    const customers = [];
    snapshot.forEach(childSnapshot => {
        const customer = childSnapshot.val();
        if (customer.customer && customer.customer.orders && customer.customer.orders.length > 0) {
            customers.push(customer);
        }
    });
    console.log(customers);
})
    .catch(error => {
    console.error('Error retrieving customers:', error);
});
async function fetchServiceProviders() {
    const snapshot = await usersRef.orderByChild('userType').equalTo('ServiceProvider').once('value');
    const serviceProviderData = [];
    snapshot.forEach(childSnapshot => {
        const serviceProvider = childSnapshot.val();
        if (serviceProvider.serviceProvider) {
            serviceProviderData.push(serviceProvider);
        }
    });
    return serviceProviderData;
}
exports.fetchServiceProviders = fetchServiceProviders;
