#!/bin/bash

echo "** Starting container..."
# Run Cypress tests
npm run cy:run


echo "** Copying test reports..."
# Copy files after tests run
cp -r /app/cypress /shared

echo "** Copying complete."

echo "** Container execution finished."