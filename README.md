EBM-FrontendBackend
===================

## Prérequis 

  - base de données mysql
  - importer les données depuis [`seed.sql`](seed.sql)

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
