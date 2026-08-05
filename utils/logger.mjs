import fs from "fs";
import path from "path";

const logDir = path.resolve("logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const errorLogFile = path.join(logDir, "errors.log");
const msg91LogFile = path.join(logDir, "msg91.log");

const getTime = () =>
    new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: true,
    });

// MSG91 Logs

export const logEvent = (api, status) => {
    try {
        fs.appendFileSync(
            msg91LogFile,
            `[${getTime()}] ${api} : ${status}\n`,
            "utf8"
        );
    } catch (err) {
        console.error("Logger Error:", err);
    }
};

// Error Logs

export const logError = (err) => {
    try {
        fs.appendFileSync(
            errorLogFile,
            `[${getTime()}] ${err.message}\n`,
            "utf8"
        );
    } catch (e) {
        console.error(e);
    }
};