# 第一阶段：构建环境
FROM node:20-alpine AS build

WORKDIR /app

# 复制依赖定义文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有源代码
COPY . .

# 执行生产构建
RUN npm run build

# 第二阶段：运行环境 (Nginx)
FROM nginx:stable-alpine

# 从构建阶段复制编译后的静态文件到 Nginx 目录
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]