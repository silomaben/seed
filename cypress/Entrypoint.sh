#!/bin/sh

echo "** Starting container..."
# Run Cypress tests
npm run cy:run


echo "** Copying test reports..."
# Copy files after tests run
cp -r /app/cypress/reports/html /shared/cypress/reports

ls -la /shared/cypress/reports/html



echo "** Copying complete."

echo "** Container execution finished."