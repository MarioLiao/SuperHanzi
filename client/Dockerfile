<<<<<<< HEAD
FROM node as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=build /app/dist/client/browser /usr/share/nginx/html
=======
FROM node:20 as builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=builder /app/dist/client/browser /usr/share/nginx/html
>>>>>>> main
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
