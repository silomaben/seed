ARG CHROME_VERSION='124.0.6367.78-1'

FROM cypress/factory


WORKDIR /app

COPY package.json /app

RUN npm install 

COPY . .

# Set the entry point script
# COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/Entrypoint.sh

# Set the entry point
CMD ["/app/Entrypoint.sh"]