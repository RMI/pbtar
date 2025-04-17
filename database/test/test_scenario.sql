-- Use pbtar as seach path
-- This is still needed for queries in PG ADMIN, despite being set on init
SET search_path TO pbtar;

-- Insert a new organization
INSERT INTO organizations (name, logo_url)
VALUES ('Test Organization', 'https://example.com/logo.png');

-- Insert a new scenario
INSERT INTO scenarios (name, description, usage, time_horizon, source, nature, target_temperature, organization_id)
VALUES (
    'Test Scenario',
    'A test scenario for validation.',
    'Planning',
    '2030',
    'Test Source',
    'Normative',
    '1.5°C target',
    (SELECT id FROM organizations WHERE name = 'Test Organization')
);

-- Insert a new geographic coverage
INSERT INTO geographic_coverage (name)
VALUES ('Test Region');

-- Insert a new sector coverage
INSERT INTO sector_coverage (name)
VALUES ('Test Sector');

-- Link the scenario to geographic coverage
INSERT INTO scenario_geographic_coverage (scenario_id, geographic_coverage_id)
VALUES (
    (SELECT id FROM scenarios WHERE name = 'Test Scenario'),
    (SELECT id FROM geographic_coverage WHERE name = 'Test Region')
);

-- Link the scenario to sector coverage
INSERT INTO scenario_sector_coverage (scenario_id, sector_coverage_id)
VALUES (
    (SELECT id FROM scenarios WHERE name = 'Test Scenario'),
    (SELECT id FROM sector_coverage WHERE name = 'Test Sector')
);
