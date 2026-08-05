import express from "express";
import cors from "cors";

import routes from "./routes/index.mjs";
import { errorHandler } from "./middlewares/error_handler.mjs";

const app = express();

// ===========================================
// MIDDLEWARE
// ===========================================

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ]
}));

app.use(
    express.json({
        limit: "10mb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
    })
);

// ===========================================
// HEALTH CHECK
// ===========================================

app.get(
    "/",
    (req, res) => {
        return res.status(200).json({
            success: true,
            message:
                "RAC Contact Directory API is running",
        });
    }
);

// ===========================================
// API ROUTES
// ===========================================

app.use(
    "/api",
    routes
);

// ===========================================
// 404
// ===========================================

app.use(
    (req, res) => {
        return res.status(404).json({
            success: false,
            message: "Route not found",
        });
    }
);

// ===========================================
// EXISTING ERROR HANDLER
// MUST BE LAST
// ===========================================

app.use(errorHandler);

export default app;