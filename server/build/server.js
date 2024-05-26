"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const authRoutes_2 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({ origin: 'http://localhost:5173' }));
app.use(body_parser_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.get('/api/service-providers', async (req, res) => {
    try {
        const snapshot = await db_1.usersRef.once('value');
        const data = snapshot.val();
        const providers = Object.values(data).filter((user) => {
            if (typeof user === 'object' && user !== null && 'user' in user) {
                return user.user.userType === 'ServiceProvider';
            }
            return false;
        });
        const serviceProviders = providers.map((provider) => {
            return provider.serviceProvider;
        });
        res.json(serviceProviders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
authRoutes_2.default.get('/service-providers/:id', async (req, res) => {
    try {
        const shopId = req.params.id;
        const shopData = await fetchShopData(shopId);
        if (shopData === undefined) {
            return res.status(404).send('Shop not found');
        }
        res.status(200).json(shopData);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error fetching shop data');
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
function fetchShopData(shopId) {
    throw new Error('Function not implemented.');
}
function verifyToken(token) {
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
