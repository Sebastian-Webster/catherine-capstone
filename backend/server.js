import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import session from 'express-session';
import cors from 'cors';
import dbConnect from "./config/dbConnect.js";
import Routers from './routes/index.js';

const app = express();
dbConnect.connectMysql();

const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173']

const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    origin: (origin, callback) => {
        console.log('Origin:', origin)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};

// Session setting
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: {
      // Set the domain option to make the session cookie valid across different ports
      domain: 'localhost',
      secure: false, // Set to 'true' if using HTTPS, otherwise 'false'
      maxAge: 60000000,
      path: '/',
      httpOnly: true
    },
}))

app.use(cors(corsOptions));
app.use(express.json());

// middleware to test if authenticated
const requireAuth = (req, res, next) => {
    const {user} = req.session;
    console.log(req.session)
    console.log('Session ID:', req.sessionID)
    if(!user){
        return res.status(401).json({message: 'Unauthorized'})
    }
    next();
}
const requireAdmin = (req, res, next) => {
    const {user} = req.session;
    if(user.usertype !== 'admin'){
        return res.status(401).json({message: 'Insufficient role'})
    }
    next();
}

app.get("/", (req, res)=>{console.log(req.session.user); res.send("hello");});
//Router
app.use("/upload", express.static("upload"));
app.use("/api/auth", Routers.authRouter);
app.use("/api/user", requireAuth, Routers.userRouter);
app.use("/api/category", Routers.categoryRouter);
app.use("/api/product", Routers.productRouter);
app.use("/api/review", Routers.reviewRouter);
app.use("/api/cart", Routers.cartRouter);
app.use("/api/order", Routers.orderRouter);
app.use("/admin", requireAdmin, Routers.adminRouter);

const PORT = 8080;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});