EBM-FrontendBackend
===================

## Installation 

1. Créer une base de données MySQL
2. Importer les données depuis [`seed.sql`](seed.sql)
3. Ajuster les paramètres de connexion à la BDD dans le fichier [`config.php`](back/config.php)
4. Lancer le serveur
    - Sur un environnement Apache, le fichier `.htaccess` sert à router les requêtes vers le fichier `index.php`,
    qui dispatche ensuite aux différents contrôleurs 
    - Sur un environnement de développement avec le serveur PHP intégré, lancer avec la commande
    `php -S 127.0.0.1:8080 back/index.php`, qui forcera le serveur PHP à ne charger que le fichier index.php
    (mimant ainsi le comportement d'Apache)

## API

On manipule 2 ressources : `Articles` et `Paragraphs`.

`GET /articles` Renvoie la liste des articles
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

`GET /articles/1` Renvoie les informations de l'article 1
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

## Sources

Système de routeur pour l'API REST : https://stackoverflow.com/questions/36675596/converting-a-very-simple-htaccess-into-a-php-router

## Auteurs

Thomas Gaudin & William Joncquel 
