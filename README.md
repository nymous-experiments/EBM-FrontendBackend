EBM-FrontendBackend
===================

Le projet est déployé sur Heroku à cette adresse : https://warm-mesa-18064.herokuapp.com/

## Installation 

1. Créer une base de données MySQL
2. Importer les données depuis [`seed.sql`](seed.sql)
3. Copier le fichier [`.env.example`](.env.example) en `.env` et ajuster les paramètres de connexion à la BDD
(il est aussi possible de passer les paramètres grâce à des variables d'environnement, pour des hébergements comme Heroku)
4. Installer [Composer](https://getcomposer.org/download/), et installer les dépendances (`php composer.phar install`)
5. Dumper l'autoloader permettant de charger les fichiers automatiquement (`php composer.phar dump-autoload`)
6. Installer les dépendances frontend (`yarn` ou `npm install`)
7. Compiler le projet front : `npm run prod`
8. Lancer le serveur
    - Sur un environnement Apache, le fichier `.htaccess` sert à router les requêtes vers le fichier `index.php`,
    qui dispatche ensuite aux différents contrôleurs 
    - Sur un environnement de développement avec le serveur PHP intégré, lancer avec la commande
    `php -S 127.0.0.1:8080 -t public $(pwd)/index.php`, qui forcera le serveur PHP à ne charger que le fichier index.php
    (mimant ainsi le comportement d'Apache) (si vous êtes sous Windows, il vous faut trouver le chemin absolu vers `index.php`
    vous même)

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
