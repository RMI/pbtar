SET search_path TO pbtar;

-- Update the name of an organization
UPDATE organizations
SET name = 'Updated Test Organization'
WHERE name = 'Test Organization';

-- Verify the "updated_on" column
SELECT * FROM organizations WHERE name = 'Updated Test Organization';

-- Update the description of a scenario
UPDATE scenarios
SET description = 'An updated test scenario description.'
WHERE name = 'Test Scenario';

-- Verify the "updated_on" column
SELECT * FROM scenarios WHERE name = 'Test Scenario';
