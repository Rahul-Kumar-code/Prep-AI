# ---------- Stage 1: Build React frontend ----------
FROM node:20-alpine AS build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ---------- Stage 2: Backend ----------
FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --production

COPY backend/ ./

# Copy React build into backend/public
COPY --from=build /app/frontend/dist ./public

EXPOSE 8000

CMD ["npm", "start"]