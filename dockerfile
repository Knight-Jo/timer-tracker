FROM node:24.11

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 54499
EXPOSE 4173
EXPOSE 4172

ENV VITE_BACKEND_BASE_API_URL=http://10.108.24.68:3001


# CMD ["node", "server/server.js", "&&", \
# "npm", "run", "preview", "--", "--host", "0.0.0.0"]
CMD sh -c "node server/server.js & npm run preview -- --host 0.0.0.0"