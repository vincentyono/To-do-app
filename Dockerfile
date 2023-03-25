FROM node:18.15-alpine as dist
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN ["npm", "run", "build"]

FROM nginx:alpine
COPY --from=dist /app/dist /usr/share/nginx/html
