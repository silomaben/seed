FROM cypress/factory

WORKDIR /app

COPY package.json /app

RUN npm install 

COPY . .

# Set the entry point script
COPY startingpoint.sh /app/startingpoint.sh
RUN chmod +x /app/startingpoint.sh

# Set the entry point
ENTRYPOINT ["/app/startingpoint.sh"]