import app from "./app.mjs";
import pool from "./config/db.mjs";
import { config } from "./config/config.mjs";

const startServer = async () => {
    try {
        // ===================================
        // TEST POSTGRES CONNECTION
        // ===================================

        const result = await pool.query(`
            SELECT
                current_database() AS database,
                current_user AS username,
                NOW() AS time
        `);

        console.log(
            "Database:",
            result.rows[0]
        );

        // ===================================
        // START SERVER
        // ===================================

        app.listen(
            config.PORT,
            () => {
                console.log(
                    `🚀 RAC server running on port ${config.PORT}`
                );
            }
        );

    } catch (err) {
        console.error(
            "❌ Server startup failed:",
            err
        );

        process.exit(1);
    }
};

startServer();