#!/bin/sh

echo "** Starting container..."
# Run Cypress tests
npm run cy:run


echo "** Copying test reports..."
# Copy files after tests run
cp -r /app/cypress/reports/html /shared/test-cypress



echo "** Copying complete."

echo "** Container execution finished."