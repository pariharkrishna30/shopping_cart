# Stage 1: Build React app with Node 20
FROM node:20-bullseye as build

WORKDIR /app

# Copy only package.json and package-lock.json first (cache optimization)
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the app (produces /app/dist)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]