import pool from "../config/db.mjs";

// ============================================================
// COMMON SELECT
// ============================================================

const selectFields = `
    b.id,
    b.battalion_id,
    b.name,
    b.description,
    b.is_active,
    b.created_at,
    b.updated_at,
    rb.name AS battalion_name,
    rb.battalion_number
`;

// ============================================================
// CREATE
// ============================================================

export const createBranchRepo = async ({
    battalionId,
    name,
    description,
    isActive,
}) => {
    const query = `
        INSERT INTO rac_branches (
            battalion_id,
            name,
            description,
            is_active
        )
        VALUES (
            $1::bigint,
            $2::varchar,
            $3::text,
            $4::boolean
        )
        RETURNING
            id,
            battalion_id,
            name,
            description,
            is_active,
            created_at,
            updated_at
    `;

    const values = [
        battalionId,
        name,
        description ?? null,
        isActive ?? true,
    ];

    const result = await pool.query(
        query,
        values
    );

    return result.rows[0];
};

// ============================================================
// GET ALL
// ============================================================

export const getBranchesRepo = async () => {
    const query = `
        SELECT ${selectFields}
        FROM rac_branches b

        INNER JOIN rac_battalions rb
            ON rb.id = b.battalion_id

        ORDER BY b.id DESC
    `;

    const result =
        await pool.query(query);

    return result.rows;
};

// ============================================================
// GET BY ID
// ============================================================

export const getBranchByIdRepo = async (
    id
) => {
    const query = `
        SELECT ${selectFields}
        FROM rac_branches b

        INNER JOIN rac_battalions rb
            ON rb.id = b.battalion_id

        WHERE b.id = $1::bigint

        LIMIT 1
    `;

    const result = await pool.query(
        query,
        [id]
    );

    return result.rows[0] ?? null;
};

// ============================================================
// GET BY BATTALION
// ============================================================

export const getBranchesByBattalionRepo = async (
    battalionId
) => {
    const query = `
        SELECT ${selectFields}
        FROM rac_branches b

        INNER JOIN rac_battalions rb
            ON rb.id = b.battalion_id

        WHERE b.battalion_id = $1::bigint

        ORDER BY b.name ASC
    `;

    const result = await pool.query(
        query,
        [battalionId]
    );

    return result.rows;
};

// ============================================================
// CHECK BATTALION
// ============================================================

export const getBattalionExistsRepo = async (
    battalionId
) => {
    const query = `
        SELECT id
        FROM rac_battalions
        WHERE id = $1::bigint
        LIMIT 1
    `;

    const result = await pool.query(
        query,
        [battalionId]
    );

    return result.rows[0] ?? null;
};

// ============================================================
// UPDATE
// ============================================================

export const updateBranchRepo = async (
    id,
    data
) => {
    const hasBattalionId =
        data.battalionId !== undefined;

    const hasName =
        data.name !== undefined;

    const hasDescription =
        data.description !== undefined;

    const hasStatus =
        data.isActive !== undefined;

    const query = `
        UPDATE rac_branches

        SET

        battalion_id = CASE
            WHEN $2::boolean
            THEN $3::bigint
            ELSE battalion_id
        END,

        name = CASE
            WHEN $4::boolean
            THEN $5::varchar
            ELSE name
        END,

        description = CASE
            WHEN $6::boolean
            THEN $7::text
            ELSE description
        END,

        is_active = CASE
            WHEN $8::boolean
            THEN $9::boolean
            ELSE is_active
        END,

        updated_at = NOW()

        WHERE id = $1::bigint

        RETURNING
            id,
            battalion_id,
            name,
            description,
            is_active,
            created_at,
            updated_at
    `;

    const values = [
        id,

        hasBattalionId,
        data.battalionId ?? null,

        hasName,
        data.name ?? null,

        hasDescription,
        data.description ?? null,

        hasStatus,
        data.isActive ?? null,
    ];

    const result = await pool.query(
        query,
        values
    );

    return result.rows[0] ?? null;
};

// ============================================================
// DELETE
// ============================================================

export const deleteBranchRepo = async (
    id
) => {
    const query = `
        DELETE FROM rac_branches

        WHERE id = $1::bigint

        RETURNING
            id,
            battalion_id,
            name,
            description,
            is_active
    `;

    const result = await pool.query(
        query,
        [id]
    );

    return result.rows[0] ?? null;
};