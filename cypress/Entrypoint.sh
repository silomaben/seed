#!/bin/sh

echo "** Starting container..."
# Run Cypress tests
npm run cy:run


echo "** Copying test reports..."
# Copy files after tests run
cp -r /app/cypress/reports/html /shared/cypress/reports

cp -r /app/cypress/videos /shared/cypress/reports

ls -la /shared/cypress

echo "** Copying complete."

# Keep the container running for 30 minutes to allow fetching of the report
echo "** Keeping the container running to allow report fetching..."
sleep 1800  # Sleep for 30 minutes

echo "** Container execution finished."