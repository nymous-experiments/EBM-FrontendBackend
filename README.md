EBM-FrontendBackend
===================

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


## Auteurs

Thomas Gaudin & William Joncquel 
