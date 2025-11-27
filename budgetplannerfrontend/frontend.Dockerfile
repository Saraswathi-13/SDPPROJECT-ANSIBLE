# ---- Stage 1: Build ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Copy production environment file so Vite builds with correct API URL
COPY .env.production .env.production

RUN npm run build

# ---- Stage 2: Serve ----
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
