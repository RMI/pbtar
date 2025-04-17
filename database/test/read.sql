-- Retrieve all organizations
SELECT * FROM pbtar.organizations;

-- Retrieve all scenarios
SELECT * FROM pbtar.scenarios;

-- Retrieve a specific scenario by name
SELECT * FROM pbtar.scenarios WHERE name = 'Test Scenario';

-- Retrieve all geographic coverage for a specific scenario
SELECT g.name
FROM pbtar.scenario_geographic_coverage sgc
JOIN pbtar.geographic_coverage g ON sgc.geographic_coverage_id = g.id
WHERE sgc.scenario_id = (SELECT id FROM pbtar.scenarios WHERE name = 'Test Scenario');

-- Retrieve all sector coverage for a specific scenario
SELECT sc.name
FROM pbtar.scenario_sector_coverage ssc
JOIN pbtar.sector_coverage sc ON ssc.sector_coverage_id = sc.id
WHERE ssc.scenario_id = (SELECT id FROM pbtar.scenarios WHERE name = 'Test Scenario');
