-- Enable PostGIS for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Companies Table (Main Organization)
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    inn VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Departments Table (Xo'jaliklar)
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    risk_level VARCHAR(50) CHECK (risk_level IN ('critical', 'high', 'medium', 'low')),
    icon VARCHAR(50), -- e.g., 'locomotive', 'factory' consistent with frontend
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. KPI Monthly Data (Values from Data Entry)
-- Stores the actual calculated or input value for each KPI
CREATE TABLE IF NOT EXISTS kpi_monthly_data (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    month INTEGER CHECK (month BETWEEN 1 AND 12),
    year INTEGER CHECK (year > 2000),
    kpi_id VARCHAR(50) NOT NULL, -- matches 'ltifr', 'hseStaffing', etc.
    value NUMERIC(15, 2) NOT NULL,
    comment TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(department_id, month, year, kpi_id)
);

-- 5. Accidents Table (Specific Incident Reports)
CREATE TABLE IF NOT EXISTS accidents (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    incident_date DATE NOT NULL,
    type VARCHAR(50) CHECK (type IN ('fatal', 'severe', 'group', 'light')),
    description TEXT,
    severity_score INTEGER DEFAULT 0, -- Calculated based on type
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Geographic Data (For Leaflet Map)
CREATE TABLE IF NOT EXISTS geo_data (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE UNIQUE,
    location GEOMETRY(POINT, 4326), -- Exact location of the facility
    boundary GEOMETRY(POLYGON, 4326), -- Area boundary if needed
    properties JSONB -- Store extra map properties like color, popup content etc.
);

-- Indexes for performance
CREATE INDEX idx_kpi_data_date ON kpi_monthly_data(year, month);
CREATE INDEX idx_kpi_data_dept ON kpi_monthly_data(department_id);
CREATE INDEX idx_geo_location ON geo_data USING GIST(location);
