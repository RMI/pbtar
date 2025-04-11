-- Create schema
CREATE SCHEMA IF NOT EXISTS pbtar;

-- Set search path
SET search_path TO pbtar, public;

-- Create items table (customize based on what your app needs)
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create publishers table
CREATE TABLE IF NOT EXISTS publishers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'normative', 'exploratory', etc.
    temperature_target VARCHAR(50), -- e.g., '1.5°C', '2°C', etc.
    description TEXT,
    publisher_id INTEGER REFERENCES publishers(id),
    published_date DATE,
    target_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create regions table
CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    parent_id INTEGER REFERENCES regions(id) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stakeholders table
CREATE TABLE IF NOT EXISTS stakeholders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'Government Agency', 'NGO', 'Corporation', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sectors table
CREATE TABLE IF NOT EXISTS sectors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction tables for many-to-many relationships

-- Scenarios to Regions
CREATE TABLE IF NOT EXISTS scenario_regions (
    scenario_id INTEGER REFERENCES scenarios(id) ON DELETE CASCADE,
    region_id INTEGER REFERENCES regions(id) ON DELETE CASCADE,
    PRIMARY KEY (scenario_id, region_id)
);

-- Scenarios to Stakeholders
CREATE TABLE IF NOT EXISTS scenario_stakeholders (
    scenario_id INTEGER REFERENCES scenarios(id) ON DELETE CASCADE,
    stakeholder_id INTEGER REFERENCES stakeholders(id) ON DELETE CASCADE,
    PRIMARY KEY (scenario_id, stakeholder_id)
);

-- Scenarios to Sectors
CREATE TABLE IF NOT EXISTS scenario_sectors (
    scenario_id INTEGER REFERENCES scenarios(id) ON DELETE CASCADE,
    sector_id INTEGER REFERENCES sectors(id) ON DELETE CASCADE,
    PRIMARY KEY (scenario_id, sector_id)
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_scenarios_publisher_id ON scenarios(publisher_id);
CREATE INDEX IF NOT EXISTS idx_regions_parent_id ON regions(parent_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers for timestamp updates
CREATE TRIGGER update_items_modtime
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_scenarios_modtime
    BEFORE UPDATE ON scenarios
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Insert sample data for publishers
INSERT INTO publishers (name) VALUES 
('IEA'),
('IRENA'),
('IPCC'),
('IEA-ETSAP')
ON CONFLICT (name) DO NOTHING;

-- Insert sample data for regions
INSERT INTO regions (name) VALUES 
('Global'),
('Southeast Asia'),
('Indonesia'),
('Malaysia'),
('Philippines'),
('Thailand'),
('Vietnam'),
('Europe'),
('North America'),
('Africa')
ON CONFLICT (name) DO NOTHING;

-- Update parent relationships
UPDATE regions SET parent_id = (SELECT id FROM regions WHERE name = 'Southeast Asia')
WHERE name IN ('Indonesia', 'Malaysia', 'Philippines', 'Thailand', 'Vietnam');

-- Insert sample data for stakeholders
INSERT INTO stakeholders (name, type) VALUES 
('Government Agencies', 'Government'),
('Financial Institutions', 'Finance'),
('Corporations', 'Private'),
('NGOs', 'Non-profit'),
('Research Institutions', 'Academic'),
('International Organizations', 'International')
ON CONFLICT (name) DO NOTHING;

-- Insert sample data for sectors
INSERT INTO sectors (name) VALUES 
('Power'),
('Shipping'),
('Aviation'),
('Cement'),
('Steel'),
('Oil & Gas'),
('Buildings'),
('Manufacturing'),
('Transport')
ON CONFLICT (name) DO NOTHING;

-- Insert sample scenarios
INSERT INTO scenarios (title, type, temperature_target, description, publisher_id, published_date, target_year)
VALUES 
(
    'Net Zero by 2050', 
    'normative', 
    '1.5°C', 
    'A comprehensive pathway for the global energy sector to achieve net zero emissions by 2050',
    (SELECT id FROM publishers WHERE name = 'IEA'),
    '2023-06-15',
    2050
),
(
    'Southeast Asia Energy Outlook 2024', 
    'exploratory', 
    NULL, 
    'Analysis of energy transition pathways in Southeast Asia',
    (SELECT id FROM publishers WHERE name = 'IEA'),
    '2024-01-20',
    2050
),
(
    'World Energy Transitions Outlook', 
    'normative', 
    '1.5-2°C', 
    'A pathway to achieve the 1.5°C Paris Agreement goal with focus on renewable energy',
    (SELECT id FROM publishers WHERE name = 'IRENA'),
    '2023-09-10',
    2050
);

-- Connect scenarios to regions
INSERT INTO scenario_regions (scenario_id, region_id)
SELECT s.id, r.id 
FROM scenarios s, regions r
WHERE s.title = 'Net Zero by 2050' AND r.name = 'Southeast Asia';

INSERT INTO scenario_regions (scenario_id, region_id)
SELECT s.id, r.id 
FROM scenarios s, regions r
WHERE s.title = 'Southeast Asia Energy Outlook 2024' AND r.name IN ('Southeast Asia', 'Indonesia', 'Malaysia', 'Philippines', 'Thailand', 'Vietnam');

INSERT INTO scenario_regions (scenario_id, region_id)
SELECT s.id, r.id 
FROM scenarios s, regions r
WHERE s.title = 'World Energy Transitions Outlook' AND r.name = 'Southeast Asia';

-- Connect scenarios to stakeholders
INSERT INTO scenario_stakeholders (scenario_id, stakeholder_id)
SELECT s.id, st.id 
FROM scenarios s, stakeholders st
WHERE s.title = 'Net Zero by 2050' AND st.name IN ('Government Agencies', 'Financial Institutions', 'Corporations', 'NGOs');

INSERT INTO scenario_stakeholders (scenario_id, stakeholder_id)
SELECT s.id, st.id 
FROM scenarios s, stakeholders st
WHERE s.title = 'Southeast Asia Energy Outlook 2024' AND st.name IN ('Government Agencies', 'Research Institutions', 'International Organizations');

INSERT INTO scenario_stakeholders (scenario_id, stakeholder_id)
SELECT s.id, st.id 
FROM scenarios s, stakeholders st
WHERE s.title = 'World Energy Transitions Outlook' AND st.name IN ('Government Agencies', 'NGOs', 'International Organizations');

-- Connect scenarios to sectors
INSERT INTO scenario_sectors (scenario_id, sector_id)
SELECT s.id, sec.id 
FROM scenarios s, sectors sec
WHERE s.title = 'Net Zero by 2050' AND sec.name IN ('Shipping', 'Aviation', 'Cement', 'Power', 'Steel', 'Oil & Gas');

INSERT INTO scenario_sectors (scenario_id, sector_id)
SELECT s.id, sec.id 
FROM scenarios s, sectors sec
WHERE s.title = 'Southeast Asia Energy Outlook 2024' AND sec.name IN ('Power', 'Manufacturing', 'Oil & Gas');

INSERT INTO scenario_sectors (scenario_id, sector_id)
SELECT s.id, sec.id 
FROM scenarios s, sectors sec
WHERE s.title = 'World Energy Transitions Outlook' AND sec.name IN ('Power', 'Buildings', 'Manufacturing');