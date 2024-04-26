# Use the official Cypress image as the base
FROM cypress/factory

# Set the working directory
WORKDIR /app

# Copy package.json to the working directory
COPY package.json /app
COPY package-lock.json /app

# Install dependencies
# RUN npm install


# Install Cypress binary
RUN npm install -g cypress

RUN npm ci

# Copy the rest of your application files
COPY . .

# Set the entry point script (assuming you have an Entrypoint.sh file)
RUN chmod +x /app/Entrypoint.sh

# Set the entry point
CMD ["/app/Entrypoint.sh"]
