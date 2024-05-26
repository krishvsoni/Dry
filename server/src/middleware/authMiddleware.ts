import * as express from 'express';
import session from 'express-session';

const authMiddleware = express.Router();

authMiddleware.use(session({
    secret: 'teamDarkLooters',
    resave: false,
    saveUninitialized: true,
}));

authMiddleware.use((req, res, next) => {
    
    if (req.session && (req.session as any).user) {
        next(); 
    } else {
        res.status(401).json({ error: "Unauthorized" }); 
    }
});

export default authMiddleware;
