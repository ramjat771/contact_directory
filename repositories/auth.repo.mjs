import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(
    fileURLToPath(import.meta.url)
);

const USERS_FILE = join(
    __dirname,
    "../data/users.json"
);

const readUsers = async () => {
    const file = await fs.readFile(
        USERS_FILE,
        "utf-8"
    );

    return JSON.parse(file);
};

export const findUserByUserIdRepo = async (
    userId
) => {
    const users = await readUsers();

    return (
        users.find(
            (user) =>
                user.userId
                    .toLowerCase() ===
                String(userId)
                    .toLowerCase()
        ) || null
    );
};