# Étape 1 : Image de base PHP avec les extensions nécessaires
FROM php:8.1-cli

# Installer dépendances système & extensions PHP nécessaires à Laravel
RUN apt-get update && apt-get install -y \
    unzip zip git curl libzip-dev libonig-dev libxml2-dev libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-configure zip \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl

# Installer Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Définir le dossier de travail
WORKDIR /app

# Copier tout le projet dans le conteneur
COPY . .

# Aller dans le dossier Laravel et installer les dépendances
RUN cd Innova-api && composer install --no-interaction --prefer-dist --optimize-autoloader

# Exposer le port (utilisé par Laravel)
ENV PORT=8000

# Commande de démarrage du serveur Laravel
CMD ["sh", "-c", "cd Innova-api && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT"]
