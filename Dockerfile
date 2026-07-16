# 1. PHPとApache（Webサーバー）がセットになった本番用の環境ベース
FROM php:8.3-apache

# 2. PostgreSQL接続と必要な拡張機能、Node.jsのインストール
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gnupg \
    && curl -sL https://nodesource.com | bash - \
    && apt-get install -y nodejs \
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
