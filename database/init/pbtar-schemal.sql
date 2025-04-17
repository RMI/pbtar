-- Create schema
CREATE SCHEMA IF NOT EXISTS pbtar;

-- Set search path
SET search_path TO pbtar;

-- Create table for organizations
CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for scenarios
CREATE TABLE IF NOT EXISTS scenarios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    usage VARCHAR(50),
    time_horizon VARCHAR(50),
    source VARCHAR(255),
    nature VARCHAR(50),
    target_temperature VARCHAR(50),
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for geographic coverage
CREATE TABLE IF NOT EXISTS geographic_coverage (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Create table for sector coverage
CREATE TABLE IF NOT EXISTS sector_coverage (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Create junction table for scenarios and geographic coverage
CREATE TABLE IF NOT EXISTS scenario_geographic_coverage (
    scenario_id INTEGER REFERENCES scenarios(id) ON DELETE CASCADE,
    geographic_coverage_id INTEGER REFERENCES geographic_coverage(id) ON DELETE CASCADE,
    PRIMARY KEY (scenario_id, geographic_coverage_id)
);

-- Create junction table for scenarios and sector coverage
CREATE TABLE IF NOT EXISTS scenario_sector_coverage (
    scenario_id INTEGER REFERENCES scenarios(id) ON DELETE CASCADE,
    sector_coverage_id INTEGER REFERENCES sector_coverage(id) ON DELETE CASCADE,
    PRIMARY KEY (scenario_id, sector_coverage_id)
);

-- Create a trigger function to update the "updated_on" column
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to the "organizations" table
CREATE TRIGGER set_updated_on_organizations
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Add trigger to the "scenarios" table
CREATE TRIGGER set_updated_on_scenarios
BEFORE UPDATE ON scenarios
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Insert data into organizations
INSERT INTO organizations (name, logo_url) VALUES
('ASEAN Centre for Energy', 'https://www.aseanenergy.org/wp-content/themes/ace/assets/img/logo.png'),
('International Energy Agency', 'https://www.iea.org/assets/images/iea-logo.svg'),
('Asian Development Bank', 'https://www.adb.org/sites/default/files/styles/content_media/public/adb-logo-large.png'),
('Rocky Mountain Institute', 'https://rmi.org/wp-content/uploads/2018/09/rmi-logo-primary.svg'),
('ASEAN Energy Regulatory Network', 'https://asean.org/wp-content/uploads/2021/01/asean-logo.png'),
('World Bank Group', 'https://www.worldbank.org/content/dam/wbr/logo/logo-wb-header-en.svg'),
('National Renewable Energy Laboratory', 'https://www.nrel.gov/images/logo-nrel.svg');

-- Insert data into scenarios
INSERT INTO scenarios (name, description, usage, time_horizon, source, nature, target_temperature, organization_id) VALUES
('ASEAN Power Grid Integration', 'A scenario focused on regional power grid integration across ASEAN countries to enhance energy security, accessibility, and affordability while transitioning to cleaner energy sources.', 'Planning', '2035', 'ASEAN Centre for Energy', 'Normative', '2.0°C target', (SELECT id FROM organizations WHERE name = 'ASEAN Centre for Energy')),
('South-East Asia Energy Transition', 'A comprehensive pathway for South-East Asian utilities to transition from fossil fuels to renewable energy while maintaining grid reliability and economic growth.', 'Policy', '2050', 'International Energy Agency', 'Normative', '1.5°C - 2.0°C', (SELECT id FROM organizations WHERE name = 'International Energy Agency')),
('Utility Resilience in Rising Seas', 'A scenario addressing climate adaptation for coastal utility infrastructure in South-East Asia, focusing on resilience against sea level rise and extreme weather events.', 'Planning', '2050', 'Asian Development Bank', 'Descriptive', '2.5°C assumed', (SELECT id FROM organizations WHERE name = 'Asian Development Bank')),
('Electrification & Decarbonization Pathway', 'A detailed roadmap for utilities in South-East Asia to support economy-wide electrification while decarbonizing the power sector through renewable integration.', 'Planning', '2050', 'Rocky Mountain Institute', 'Normative', '1.5°C target', (SELECT id FROM organizations WHERE name = 'Rocky Mountain Institute')),
('ASEAN Interconnection Masterplan', 'A strategic plan for developing cross-border power interconnections to create an integrated ASEAN power grid, enabling renewable energy sharing across the region.', 'Policy', '2040', 'ASEAN Energy Regulatory Network', 'Normative', '2.0°C target', (SELECT id FROM organizations WHERE name = 'ASEAN Energy Regulatory Network')),
('Climate-Resilient Utility Infrastructure', 'A scenario focused on climate-proofing critical utility infrastructure in South-East Asia against increasing extreme weather events and changing climate patterns.', 'Planning', '2040', 'World Bank Group', 'Descriptive', '3.0°C projected', (SELECT id FROM organizations WHERE name = 'World Bank Group')),
('Distributed Energy Resources Integration', 'A scenario exploring the integration of distributed energy resources into South-East Asian utility grids, including rooftop solar, battery storage, and microgrids.', 'Research', '2035', 'National Renewable Energy Laboratory', 'Descriptive', '2.0°C - 2.5°C', (SELECT id FROM organizations WHERE name = 'National Renewable Energy Laboratory')),
('South-East Asia Net-Zero Utilities', 'A comprehensive pathway for utility companies in South-East Asia to achieve net-zero emissions while supporting economic development and energy access.', 'Policy', '2050', 'Rocky Mountain Institute', 'Normative', '1.5°C target', (SELECT id FROM organizations WHERE name = 'Rocky Mountain Institute'));

-- Insert data into geographic_coverage
INSERT INTO geographic_coverage (name) VALUES
('South-East Asia'),
('Thailand'),
('Malaysia'),
('Indonesia'),
('Vietnam'),
('Philippines'),
('Singapore'),
('Laos'),
('Cambodia'),
('Myanmar');

-- Insert data into sector_coverage
INSERT INTO sector_coverage (name) VALUES
('Utilities'),
('Energy'),
('Renewable Energy'),
('Grid Infrastructure'),
('Policy'),
('Coastal Infrastructure'),
('Water Management'),
('Disaster Response'),
('Transportation'),
('Energy Storage'),
('Smart Grid'),
('Carbon Capture'),
('Energy Efficiency'),
('Urban Infrastructure');

-- Insert data into scenario_geographic_coverage
INSERT INTO scenario_geographic_coverage (scenario_id, geographic_coverage_id)
SELECT s.id, g.id FROM scenarios s, geographic_coverage g
WHERE s.name = 'ASEAN Power Grid Integration' AND g.name IN ('South-East Asia', 'Thailand', 'Malaysia', 'Indonesia', 'Vietnam', 'Philippines');

INSERT INTO scenario_geographic_coverage (scenario_id, geographic_coverage_id)
SELECT s.id, g.id FROM scenarios s, geographic_coverage g
WHERE s.name = 'South-East Asia Energy Transition' AND g.name IN ('South-East Asia', 'Singapore', 'Malaysia', 'Indonesia', 'Vietnam');

-- Insert data into scenario_sector_coverage
INSERT INTO scenario_sector_coverage (scenario_id, sector_coverage_id)
SELECT s.id, sc.id FROM scenarios s, sector_coverage sc
WHERE s.name = 'ASEAN Power Grid Integration' AND sc.name IN ('Utilities', 'Energy', 'Renewable Energy', 'Grid Infrastructure');

INSERT INTO scenario_sector_coverage (scenario_id, sector_coverage_id)
SELECT s.id, sc.id FROM scenarios s, sector_coverage sc
WHERE s.name = 'South-East Asia Energy Transition' AND sc.name IN ('Utilities', 'Energy', 'Policy', 'Infrastructure');
