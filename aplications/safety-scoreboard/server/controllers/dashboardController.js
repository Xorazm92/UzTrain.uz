import pool from '../database/db.js';
import { calculateCompanyRating } from '../services/calculationService.js';

export const getDashboardData = async (req, res) => {
    let parsedYear;
    let parsedMonth;
    let parsedDepartmentId;

    try {
        const { year, month, department_id } = req.query;

        parsedYear = Number(year);
        parsedMonth = Number(month);
        parsedDepartmentId = Number(department_id);

        if (!Number.isFinite(parsedYear) || !Number.isFinite(parsedMonth) || !Number.isFinite(parsedDepartmentId)) {
            return res.status(400).json({
                message: 'Invalid query params. Required: department_id, month, year (numbers).',
                example: '/api/dashboard?department_id=1&month=12&year=2025'
            });
        }

        if (parsedMonth < 1 || parsedMonth > 12) {
            return res.status(400).json({
                message: 'Invalid month. Must be between 1 and 12.'
            });
        }

        if (parsedYear < 2000 || parsedYear > 2100) {
            return res.status(400).json({
                message: 'Invalid year. Must be a reasonable value (e.g. 2025).'
            });
        }

        // 1. Fetch Company/Department Info
        // If department_id is provided, fetch single department.
        // If not, maybe fetch all? For now, assume single department dashboard view.

        let deptQuery = `SELECT * FROM departments`;
        const queryParams = [];

        if (department_id) {
            deptQuery += ` WHERE id = $1`;
            queryParams.push(parsedDepartmentId);
        }

        const deptResult = await pool.query(deptQuery, queryParams);

        if (deptResult.rows.length === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }

        const department = deptResult.rows[0];

        // 2. Fetch KPI Data for this department/month/year
        const kpiQuery = `
            SELECT kpi_id, value 
            FROM kpi_monthly_data 
            WHERE department_id = $1 AND month = $2 AND year = $3
        `;
        const kpiResult = await pool.query(kpiQuery, [department.id, parsedMonth, parsedYear]);

        // 3. Construct FormData
        const formData = {};
        kpiResult.rows.forEach(row => {
            formData[row.kpi_id] = parseFloat(row.value);
        });

        // 4. Calculate Rating
        // We need 'icon' or 'id' map to internal ID (locomotive etc.)
        // Assuming departments.icon stores the internal type key like 'locomotive', 'wagon'
        // Or we map ID to type. For now, let's use department.icon as the key if it matches, 
        // or add a 'type' column to departments. existing schema has 'icon'. 
        // Let's assume 'icon' field holds the key (e.g. 'locomotive').
        // If not, we might need to update schema or seed data logic.
        // Fallback: use 'medium' profile if unknown.

        const profileId = department.icon || 'factory';

        const calculationResult = calculateCompanyRating(formData, profileId);

        res.json({
            department: department,
            period: { month: parsedMonth, year: parsedYear },
            rating: calculationResult.rating,
            details: calculationResult.kpiResults,
            violations: calculationResult.violations
        });

    } catch (error) {
        console.error('Dashboard Error:', error);

        // Common case: Postgres not configured/running locally
        const errMsg = error?.message || 'Unknown error';
        const isConnError =
            errMsg.includes('ECONNREFUSED') ||
            errMsg.includes('password authentication failed') ||
            errMsg.includes('database "') ||
            errMsg.includes('does not exist');

        if (isConnError) {
            const department = {
                id: Number.isFinite(parsedDepartmentId) ? parsedDepartmentId : null,
                name: 'Demo Department',
                icon: 'factory'
            };

            const calculationResult = calculateCompanyRating({}, department.icon);

            return res.status(200).json({
                department,
                period: { month: parsedMonth, year: parsedYear },
                rating: calculationResult.rating,
                details: calculationResult.kpiResults,
                violations: calculationResult.violations,
                meta: {
                    mode: 'demo',
                    warning: 'PostgreSQL not reachable; returning demo dashboard payload.',
                    details: errMsg,
                    requiredEnv: {
                        DB_HOST: process.env.DB_HOST || 'localhost',
                        DB_PORT: process.env.DB_PORT || '5432',
                        DB_NAME: process.env.DB_NAME || 'safety_scoreboard',
                        DB_USER: process.env.DB_USER || 'postgres',
                        DB_PASSWORD: process.env.DB_PASSWORD ? '***' : '(default: postgres)'
                    },
                    nextSteps: [
                        'Start Postgres and create database "safety_scoreboard" + tables from server/database/schema.sql',
                        'Or set DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD in server/.env'
                    ]
                }
            });
        }

        res.status(500).json({ message: 'Server Error', details: errMsg });
    }
};

export const submitData = async (req, res) => {
    const client = await pool.connect();
    try {
        const { department_id, month, year, data } = req.body;
        // data is object { kpi_id: value, ... }

        await client.query('BEGIN');

        // Delete existing for this month (overwrite strategy) or Update
        // Let's doing upsert or delete-insert
        // clear old data
        await client.query(
            `DELETE FROM kpi_monthly_data WHERE department_id = $1 AND month = $2 AND year = $3`,
            [department_id, month, year]
        );

        const insertQuery = `
            INSERT INTO kpi_monthly_data (department_id, month, year, kpi_id, value)
            VALUES ($1, $2, $3, $4, $5)
        `;

        for (const [key, value] of Object.entries(data)) {
            await client.query(insertQuery, [department_id, month, year, key, value]);
        }

        await client.query('COMMIT');
        res.json({ message: 'Data saved successfully' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Submit Data Error:', error);
        res.status(500).json({ message: 'Error saving data' });
    } finally {
        client.release();
    }
};
