-- Delete a scenario and ensure cascading deletes
DELETE FROM pbtar.scenarios
WHERE name = 'Test Scenario';

-- Verify cascading deletes (should return no rows)
SELECT * FROM pbtar.scenario_geographic_coverage
WHERE scenario_id = (SELECT id FROM pbtar.scenarios WHERE name = 'Test Scenario');

SELECT * FROM pbtar.scenario_sector_coverage
WHERE scenario_id = (SELECT id FROM pbtar.scenarios WHERE name = 'Test Scenario');

-- Delete an organization (should fail if referenced by a scenario)
DELETE FROM pbtar.organizations
WHERE name = 'Updated Test Organization';
