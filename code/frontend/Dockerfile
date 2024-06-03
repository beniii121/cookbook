# FROM php:8.1-apache

# #Intall packages needed
# RUN apt-get update  \
# && apt-get install -y \
# libcurl4-openssl-dev \
# libc-client-dev \
# libonig-dev \
# libxml2-dev \
# libbz2-dev \
# libzip-dev \
# libkrb5-dev \
# locales \
# openssl \
# vim \
# mc \
# nodejs \
# npm \
# && rm -r /var/lib/apt/lists/*

# #Install and enable PHP modules
# RUN docker-php-ext-configure imap --with-kerberos --with-imap-ssl
# RUN docker-php-ext-install imap mysqli curl bcmath mbstring	dom	bz2	soap zip intl gettext
# RUN docker-php-ext-enable imap mysqli curl bcmath mbstring	dom	bz2	soap zip intl gettext

# #Set Apache servername
# RUN  echo "ServerName localhost" >> /etc/apache2/apache2.conf

# #Restart apache service
# RUN service apache2 restart

# #Set proper rights on /var/www
# RUN chown -R www-data /var/www

FROM node:latest

EXPOSE 80

WORKDIR /var/www/ui

COPY . .

CMD ["npm", "run", "dev"]