#!/bin/bash
set -e

# Renderが割り当てるPORT環境変数に合わせてApacheの設定を書き換える
sed -i "s/Listen 80/Listen ${PORT:-80}/g" /etc/apache2/ports.conf
sed -i "s/:80>/:${PORT:-80}>/g" /etc/apache2/sites-available/000-default.conf

php artisan config:clear
php artisan optimize:clear

exec "$@"