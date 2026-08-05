import pool from "../config/db.mjs";

const selectFields = `
    p.id,
    p.battalion_id,
    p.branch_id,
    p.name,
    p.belt_number,
    p.post,
    p.phone_number,
    p.email,
    p.photo_url,
    p.remarks,
    p.gender,
    p.is_active,
    p.created_at,
    p.updated_at
`;

// CREATE

export const createPersonnelRepo = async (data) => {
    const query = `
        INSERT INTO rac_personnel (
            battalion_id,
            branch_id,
            name,
            belt_number,
            post,
            phone_number,
            email,
            photo_url,
            remarks,
            gender,
            is_active
        )
        VALUES (
            $1::bigint,
            $2::bigint,
            $3::varchar,
            $4::varchar,
            $5::varchar,
            $6::varchar,
            $7::varchar,
            $8::text,
            $9::text,
            $10::varchar,
            $11::boolean
        )
        RETURNING *
    `;

    const values = [
        data.battalionId,
        data.branchId,
        data.name,
        data.beltNumber ?? null,
        data.post ?? null,
        data.phoneNumber ?? null,
        data.email ?? null,
        data.photoUrl ?? null,
        data.remarks ?? null,
        data.gender ?? null,
        data.isActive ?? true,
    ];

    const result =
        await pool.query(query, values);

    return result.rows[0];
};

// GET ALL

export const getPersonnelRepo = async () => {
    const query = `
        SELECT ${selectFields}
        FROM rac_personnel p
        ORDER BY p.id DESC
    `;

    const result =
        await pool.query(query);

    return result.rows;
};

// GET BY ID

export const getPersonnelByIdRepo = async (
    id
) => {
    const query = `
        SELECT ${selectFields}
        FROM rac_personnel p
        WHERE p.id = $1::bigint
        LIMIT 1
    `;

    const result =
        await pool.query(query, [id]);

    return result.rows[0] ?? null;
};

// CHECK BATTALION

export const getBattalionExistsRepo = async (
    id
) => {
    const result = await pool.query(
        `
        SELECT id
        FROM rac_battalions
        WHERE id = $1::bigint
        LIMIT 1
        `,
        [id]
    );

    return result.rows[0] ?? null;
};

// CHECK BRANCH + BATTALION

export const getBranchExistsRepo = async (
    branchId,
    battalionId
) => {
    const result = await pool.query(
        `
        SELECT id
        FROM rac_branches
        WHERE id = $1::bigint
        AND battalion_id = $2::bigint
        LIMIT 1
        `,
        [
            branchId,
            battalionId,
        ]
    );

    return result.rows[0] ?? null;
};

// UPDATE

export const updatePersonnelRepo = async (
    id,
    data
) => {
    const has = (field) =>
        data[field] !== undefined;

    const query = `
        UPDATE rac_personnel

        SET
            battalion_id = CASE
                WHEN $2::boolean
                THEN $3::bigint
                ELSE battalion_id
            END,

            branch_id = CASE
                WHEN $4::boolean
                THEN $5::bigint
                ELSE branch_id
            END,

            name = CASE
                WHEN $6::boolean
                THEN $7::varchar
                ELSE name
            END,

            belt_number = CASE
                WHEN $8::boolean
                THEN $9::varchar
                ELSE belt_number
            END,

            post = CASE
                WHEN $10::boolean
                THEN $11::varchar
                ELSE post
            END,

            phone_number = CASE
                WHEN $12::boolean
                THEN $13::varchar
                ELSE phone_number
            END,

            email = CASE
                WHEN $14::boolean
                THEN $15::varchar
                ELSE email
            END,

            photo_url = CASE
                WHEN $16::boolean
                THEN $17::text
                ELSE photo_url
            END,

            remarks = CASE
                WHEN $18::boolean
                THEN $19::text
                ELSE remarks
            END,

            gender = CASE
                WHEN $20::boolean
                THEN $21::varchar
                ELSE gender
            END,

            is_active = CASE
                WHEN $22::boolean
                THEN $23::boolean
                ELSE is_active
            END,

            updated_at = NOW()

        WHERE id = $1::bigint

        RETURNING *
    `;

    const values = [
        id,

        has("battalionId"),
        data.battalionId ?? null,

        has("branchId"),
        data.branchId ?? null,

        has("name"),
        data.name ?? null,

        has("beltNumber"),
        data.beltNumber ?? null,

        has("post"),
        data.post ?? null,

        has("phoneNumber"),
        data.phoneNumber ?? null,

        has("email"),
        data.email ?? null,

        has("photoUrl"),
        data.photoUrl ?? null,

        has("remarks"),
        data.remarks ?? null,

        has("gender"),
        data.gender ?? null,

        has("isActive"),
        data.isActive ?? null,
    ];

    const result =
        await pool.query(query, values);

    return result.rows[0] ?? null;
};

// DELETE

export const deletePersonnelRepo = async (
    id
) => {
    const result = await pool.query(
        `
        DELETE FROM rac_personnel
        WHERE id = $1::bigint
        RETURNING *
        `,
        [id]
    );

    return result.rows[0] ?? null;
};


export const getPersonnelByBattalionAndBranchRepo = async (
    battalionId,
    branchId
) => {
    const query = `
        SELECT ${selectFields}
        FROM rac_personnel p
        WHERE p.battalion_id = $1::bigint
        AND p.branch_id = $2::bigint
        ORDER BY p.name ASC
    `;

    const result = await pool.query(
        query,
        [
            battalionId,
            branchId,
        ]
    );

    return result.rows;
};