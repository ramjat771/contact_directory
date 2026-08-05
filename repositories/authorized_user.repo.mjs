import pool from "../config/db.mjs";

// ============================================================
// COMMON SELECT FIELDS
// Password intentionally response me nahi bhej rahe
// ============================================================

const selectFields = `
    au.id,
    au.user_id,
    au.name,
    au.post,
    au.battalion_id,
    au.is_active,
    au.is_show_contact,
    au.is_show_female,
    au.is_add_branch,
    au.is_add_person,
    au.created_at,
    au.updated_at,
    b.name AS battalion_name,
    b.battalion_number
`;

// ============================================================
// CREATE
// ============================================================

export const createAuthorizedUserRepo = async ({
    userId,
    name,
    password,
    post,
    battalionId,
    isActive,
    isShowContact,
    isShowFemale,
    isAddBranch,
    isAddPerson,
}) => {
    const query = `
        INSERT INTO rac_authorized_users (
            user_id,
            name,
            password,
            post,
            battalion_id,
            is_active,
            is_show_contact,
            is_show_female,
            is_add_branch,
            is_add_person
        )
        VALUES (
            $1::varchar,
            $2::varchar,
            $3::varchar,
            $4::varchar,
            $5::bigint,
            $6::boolean,
            $7::boolean,
            $8::boolean,
            $9::boolean,
            $10::boolean
        )
        RETURNING id
    `;

    const values = [
        userId,
        name,
        password,
        post ?? null,
        battalionId,
        isActive ?? true,
        isShowContact ?? false,
        isShowFemale ?? false,
        isAddBranch ?? false,
        isAddPerson ?? false,
    ];

    const result = await pool.query(
        query,
        values
    );

    return getAuthorizedUserByIdRepo(
        result.rows[0].id
    );
};

// ============================================================
// GET ALL
// ============================================================

export const getAuthorizedUsersRepo =
    async () => {

        const query = `
            SELECT ${selectFields}

            FROM rac_authorized_users au

            LEFT JOIN rac_battalions b
                ON b.id = au.battalion_id

            ORDER BY au.id DESC
        `;

        const result =
            await pool.query(query);

        return result.rows;
    };

// ============================================================
// GET BY ID
// ============================================================

export const getAuthorizedUserByIdRepo =
    async (id) => {

        const query = `
            SELECT ${selectFields}

            FROM rac_authorized_users au

            LEFT JOIN rac_battalions b
                ON b.id = au.battalion_id

            WHERE au.id = $1::bigint

            LIMIT 1
        `;

        const result =
            await pool.query(
                query,
                [id]
            );

        return result.rows[0] ?? null;
    };

// ============================================================
// GET BY USER ID
// Useful for duplicate check / login
// ============================================================

export const getAuthorizedUserByUserIdRepo =
    async (userId) => {

        const query = `
            SELECT
                au.*

            FROM rac_authorized_users au

            WHERE au.user_id = $1::varchar

            LIMIT 1
        `;

        const result =
            await pool.query(
                query,
                [userId]
            );

        return result.rows[0] ?? null;
    };

// ============================================================
// CHECK BATTALION
// ============================================================

export const battalionExistsRepo =
    async (battalionId) => {

        const result =
            await pool.query(
                `
                SELECT id
                FROM rac_battalions
                WHERE id = $1::bigint
                LIMIT 1
                `,
                [battalionId]
            );

        return result.rows.length > 0;
    };

// ============================================================
// UPDATE
// ============================================================

export const updateAuthorizedUserRepo =
    async (
        id,
        data
    ) => {

        const hasUserId =
            data.userId !== undefined;

        const hasName =
            data.name !== undefined;

        const hasPost =
            data.post !== undefined;

        const hasBattalion =
            data.battalionId !== undefined;

        const hasStatus =
            data.isActive !== undefined;

        const hasShowContact =
            data.isShowContact !== undefined;

        const hasShowFemale =
            data.isShowFemale !== undefined;

        const hasAddBranch =
            data.isAddBranch !== undefined;

        const hasAddPerson =
            data.isAddPerson !== undefined;

        const query = `
            UPDATE rac_authorized_users

            SET
                user_id = CASE
                    WHEN $2::boolean
                    THEN $3::varchar
                    ELSE user_id
                END,

                name = CASE
                    WHEN $4::boolean
                    THEN $5::varchar
                    ELSE name
                END,

                post = CASE
                    WHEN $6::boolean
                    THEN $7::varchar
                    ELSE post
                END,

                battalion_id = CASE
                    WHEN $8::boolean
                    THEN $9::bigint
                    ELSE battalion_id
                END,

                is_active = CASE
                    WHEN $10::boolean
                    THEN $11::boolean
                    ELSE is_active
                END,

                is_show_contact = CASE
                    WHEN $12::boolean
                    THEN $13::boolean
                    ELSE is_show_contact
                END,

                is_show_female = CASE
                    WHEN $14::boolean
                    THEN $15::boolean
                    ELSE is_show_female
                END,

                is_add_branch = CASE
                    WHEN $16::boolean
                    THEN $17::boolean
                    ELSE is_add_branch
                END,

                is_add_person = CASE
                    WHEN $18::boolean
                    THEN $19::boolean
                    ELSE is_add_person
                END,

                updated_at = NOW()

            WHERE id = $1::bigint

            RETURNING id
        `;

        const values = [
            id,

            hasUserId,
            data.userId ?? null,

            hasName,
            data.name ?? null,

            hasPost,
            data.post ?? null,

            hasBattalion,
            data.battalionId ?? null,

            hasStatus,
            data.isActive ?? null,

            hasShowContact,
            data.isShowContact ?? null,

            hasShowFemale,
            data.isShowFemale ?? null,

            hasAddBranch,
            data.isAddBranch ?? null,

            hasAddPerson,
            data.isAddPerson ?? null,
        ];

        const result =
            await pool.query(
                query,
                values
            );

        if (!result.rows[0]) {
            return null;
        }

        return getAuthorizedUserByIdRepo(
            result.rows[0].id
        );
    };

// ============================================================
// CHANGE PASSWORD
// ============================================================

export const updatePasswordRepo = async (
    id,
    password
) => {

    const result =
        await pool.query(
            `
            UPDATE rac_authorized_users

            SET
                password = $2::varchar,
                updated_at = NOW()

            WHERE id = $1::bigint

            RETURNING id
            `,
            [
                id,
                password,
            ]
        );

    return result.rows[0] ?? null;
};

// ============================================================
// DELETE
// ============================================================

export const deleteAuthorizedUserRepo =
    async (id) => {

        const result =
            await pool.query(
                `
                DELETE FROM rac_authorized_users

                WHERE id = $1::bigint

                RETURNING
                    id,
                    user_id,
                    name
                `,
                [id]
            );

        return result.rows[0] ?? null;
    };


export const loginAuthorizedUserRepo = async (
    userId
) => {
    const query = `
        SELECT
            au.id,
            au.user_id,
            au.name,
            au.password,
            au.post,
            au.battalion_id,
            au.is_active,

            au.is_show_contact,
            au.is_show_female,
            au.is_add_branch,
            au.is_add_person,

            b.name AS battalion_name,
            b.battalion_number

        FROM rac_authorized_users au

        LEFT JOIN rac_battalions b
            ON b.id = au.battalion_id

        WHERE au.user_id = $1::varchar

        LIMIT 1
    `;

    const result = await pool.query(
        query,
        [userId]
    );

    return result.rows[0] ?? null;
};