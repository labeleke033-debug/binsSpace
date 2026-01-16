# 第一阶段：构建环境
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 第二阶段：运行环境 (Nginx)
FROM nginx:stable-alpine

# 接收构建时传入的版本号（commit）
ARG GIT_SHA=unknown

COPY --from=build /app/dist /usr/share/nginx/html

# 生成一个版本探针文件，部署后用它验证新旧
RUN echo "$GIT_SHA" > /usr/share/nginx/html/__version.txt \
  && date -u +"%Y-%m-%dT%H:%M:%SZ" > /usr/share/nginx/html/__build_time_utc.txt

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
