
import pool from "../config/db.mjs";

// ============================================================
// COMMON SELECT FIELDS
// ============================================================

const selectFields = `
id,
    name,
    battalion_number,
    address,
    ST_Y(location:: geometry) AS latitude,
        ST_X(location:: geometry) AS longitude,
            is_active,
            created_at,
            updated_at
                `;

// ============================================================
// CREATE BATTALION
// ============================================================

export const createBattalionRepo = async ({
    name,
    battalionNumber,
    address,
    latitude,
    longitude,
    isActive,
}) => {
    const query = `
        INSERT INTO rac_battalions(
                    name,
                    battalion_number,
                    address,
                    location,
                    is_active
                )
VALUES(
    $1:: varchar,
    $2:: varchar,
    $3:: text,

    CASE
                WHEN $4:: double precision IS NOT NULL
                 AND $5:: double precision IS NOT NULL
                THEN
                    ST_SetSRID(
        ST_MakePoint(
            $5:: double precision,
            $4:: double precision
        ),
        4326
    ):: geography
                ELSE NULL
            END,

    $6:: boolean
)

        RETURNING ${ selectFields }
`;

    const values = [
        name,
        battalionNumber ?? null,
        address ?? null,
        latitude ?? null,
        longitude ?? null,
        isActive ?? true,
    ];

    const result = await pool.query(
        query,
        values
    );

    return result.rows[0];
};

// ============================================================
// GET ALL BATTALIONS
// ============================================================

export const getBattalionsRepo = async () => {
    const query = `
        SELECT ${ selectFields }
        FROM rac_battalions
        ORDER BY id DESC
    `;

    const result = await pool.query(query);

    return result.rows;
};

// ============================================================
// GET BATTALION BY ID
// ============================================================

export const getBattalionByIdRepo = async (
    id
) => {
    const query = `
        SELECT ${ selectFields }
        FROM rac_battalions
        WHERE id = $1:: bigint
        LIMIT 1
    `;

    const result = await pool.query(
        query,
        [id]
    );

    return result.rows[0] ?? null;
};

// ============================================================
// UPDATE BATTALION
// ============================================================

export const updateBattalionRepo = async (
    id,
    data
) => {
    const hasName =
        data.name !== undefined;

    const hasNumber =
        data.battalionNumber !== undefined;

    const hasAddress =
        data.address !== undefined;

    const hasLocation =
        data.latitude !== undefined ||
        data.longitude !== undefined;

    const hasStatus =
        data.isActive !== undefined;

    const query = `
        UPDATE rac_battalions

SET
name = CASE
                WHEN $2:: boolean
                THEN $3:: varchar
                ELSE name
END,

    battalion_number = CASE
                WHEN $4:: boolean
                THEN $5:: varchar
                ELSE battalion_number
END,

    address = CASE
                WHEN $6:: boolean
                THEN $7:: text
                ELSE address
END,

    location = CASE

--Location update nahi bheja
                WHEN NOT $8:: boolean
                THEN location

--Dono null hain to location clear
WHEN
$9::double precision IS NULL
AND
$10::double precision IS NULL
                THEN NULL

--New location
ELSE
ST_SetSRID(
    ST_MakePoint(
        $10:: double precision,
        $9:: double precision
    ),
    4326
):: geography

END,

    is_active = CASE
                WHEN $11:: boolean
                THEN $12:: boolean
                ELSE is_active
END,

    updated_at = NOW()

        WHERE id = $1:: bigint

        RETURNING ${ selectFields }
`;

    const values = [
        // $1
        id,

        // $2 - $3
        hasName,
        data.name ?? null,

        // $4 - $5
        hasNumber,
        data.battalionNumber ?? null,

        // $6 - $7
        hasAddress,
        data.address ?? null,

        // $8 - $10
        hasLocation,
        data.latitude ?? null,
        data.longitude ?? null,

        // $11 - $12
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
// DELETE BATTALION
// ============================================================

export const deleteBattalionRepo = async (
    id
) => {
    const query = `
        DELETE FROM rac_battalions
        WHERE id = $1:: bigint

RETURNING
id,
    name,
    battalion_number,
    address,
    is_active
        `;

    const result = await pool.query(
        query,
        [id]
    );

    return result.rows[0] ?? null;
};

