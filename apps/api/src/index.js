require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");

// connect DB
connectDB();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

// cors config
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

// routes
app.use("/api/auth", authRoutes);

// routes (placeholder)
app.get("/", (req, res) => {
    res.json({
        message: "API web now running",
        status: "running"
    });
});

// errol handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, ()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});