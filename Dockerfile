# 1. PHP 8.3 と Apache がセットになった本番用の環境ベース
FROM php:8.3-apache

# 2. 必要なシステムライブラリ（PostgreSQL用など）と、Node.js 18 (LTS) の安全なインストール
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gnupg \
    curl \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://nodesource.com | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://nodesource.com nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install -y nodejs \
    && docker-php-ext-install pdo pdo_pgsql

# 3. Apacheの設定（Laravelのpublicフォルダを公開するように書き換え）
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf
RUN a2enmod rewrite

# 4. プロジェクトファイルをすべてコピー
COPY . /var/www/html
WORKDIR /var/www/html

# 5. Composer（PHPのパッケージ管理）をインストールして実行
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# 6. フロントエンド（React）のビルドを実行
RUN npm install && npm run build

# 7. 権限の設定
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80
