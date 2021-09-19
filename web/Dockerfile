FROM node:14-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --quiet
COPY . .
COPY entry-point.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entry-point.sh
EXPOSE 9000
ENTRYPOINT [ "entry-point.sh" ]