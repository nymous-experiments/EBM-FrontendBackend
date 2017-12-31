EBM-FrontendBackend
===================

[![license](https://img.shields.io/github/license/nymous-experiments/EBM-FrontendBackend.svg)](https://opensource.org/licenses/MIT)
[![Uses Webpack](https://img.shields.io/badge/uses-webpack-blue.svg)](https://webpack.js.org)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[<img src="https://bulma.io/images/made-with-bulma.png" alt="Made with Bulma" width="106" height="20">](https://bulma.io)

Le projet est déployé sur Heroku à cette adresse : https://warm-mesa-18064.herokuapp.com/. Comme Heroku met en sommeil les instances inutilisées, le premier chargement du site sera un peu plus long. Soyez patient !

## Installation

1. Cloner le dossier (dans le dossier d'Apache, de nginx, de Wamp, ou n'importe où si vous utilisez le serveur interne PHP pour le développement)
2. Créer une base de données MySQL
3. Importer les données d'exemple (qui créent 2 articles et ajoutent 4 paragraphes au premier article) depuis [`seed.sql`](seed.sql)
4. Copier le fichier [`.env.example`](.env.example) en `.env` et ajuster les paramètres de connexion à la BDD (il est aussi possible de passer les paramètres grâce à des variables d'environnement, pour des hébergements comme Heroku)
5. Installer [Composer](https://getcomposer.org/download/), et installer les dépendances (`php composer.phar install` dans le cas d'une installation locale de composer, `composer install` pour une installation globale ou si installé avec le `setup.exe` sur Windows)
6. Dumper l'autoloader permettant de charger les fichiers automatiquement (`php composer.phar dump-autoload` ou `composer dump-autoload`)
7. Installer NodeJS et les dépendances frontend (`yarn` si vous utilisez Yarn, ou `npm install`)
8. Compiler les fichiers frontend : `npm run prod`
9. Lancer le serveur
    - Sur un environnement Apache, le fichier `.htaccess` sert à router les requêtes vers le fichier `index.php`, qui dispatche ensuite aux différents contrôleurs
    - Sur un environnement de développement avec le serveur PHP intégré, lancer avec la commande `php -S 127.0.0.1:8080 -t public $(pwd)/index.php`, qui forcera le serveur PHP à ne charger que le fichier index.php (mimant ainsi le comportement d'Apache) (si vous êtes sous Windows, il vous faut indiquer le chemin absolu vers `index.php`
    à la main, plutôt que d'utiliser `$(pwd)/index.php`)

**Déploiement sur Heroku**

Le projet doit être compilé avant d'être lancé, ce qui nécessite des dépendances NPM de développement. Il faut donc
passer la variable `NPM_CONFIG_PRODUCTION` à `false`, avec la commande `heroku config:set NPM_CONFIG_PRODUCTION=false`

## API

L'API est accessible à partir de `/api/`

On manipule 2 ressources : `Articles` et `Paragraphs`.

`GET /api/articles` Renvoie la liste des articles
```json
[
  {
    "id": 1,
    "title": "First article"
  },
  {
    "id": 2,
    "title": "Second article"
  },
  {
    "id": 3,
    "title": "Third article"
  }
]
```

`GET /api/articles/1` Renvoie les informations de l'article 1
```json
{
  "id": 1,
  "title": "First article",
  "paragraphs": [
    {
      "id": 1,
      "content": "Lorem Ipsum"
    },
    {
      "id": 2,
      "content": "Veni vidi vici"
    }
  ]
}
```

## Dépendances

Le projet utilise le système de typage de PHP 7, ainsi que les namespaces pour charger les classes automatiquement.

Composer est également utilisé pour gérer les dépendances backend :
- [`Dotenv`][Dotenv] poour charger les paramètres depuis un fichier `.env`
- [`PHP_CodeSniffer`][phpcs] pour vérifier la conformité du code aux standards PSR-1 et PSR-2

Les dépendances frontend sont gérées par NPM/yarn.

## Sources

- Système de routeur pour l'API REST : https://stackoverflow.com/questions/36675596/converting-a-very-simple-htaccess-into-a-php-router
- Quelques inspirations de la [formation PHP Orienté Objet][Grafikart POO] de Grafikart (classe `Config`)
- La configuration Webpack est grandement basée sur la [formation Webpack][Grafikart Webpack] de Grafikart

## Auteurs

Thomas Gaudin & William Joncquel

[Dotenv]: https://packagist.org/packages/vlucas/phpdotenv
[phpcs]: https://packagist.org/packages/squizlabs/php_codesniffer
[Grafikart POO]: https://www.grafikart.fr/formations/programmation-objet-php
[Grafikart Webpack]: https://www.grafikart.fr/formations/webpack
