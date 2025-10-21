FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps || npm install --legacy-peer-deps
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]
