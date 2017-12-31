Rapport
=======

## Bilan du travail

Le livrable se compose de deux parties :
* une API RESTful développée en PHP, accessible à l'URL `/api`, qui permet de manipuler des articles et des paragraphes ;
* une application Web développée en Javascript (à l'aide de jQuery), offrant une interface utilisateur pour visualiser et éditer les données renvoyées par l'API.

Une documentation d'installation est également disponible, dans le fichier [`README.md`](README.md).

L'historique du code est géré par [git](@@TODO lien@@), et hébergé sur un dépôt Github pour permettre une collaboration facile entre les développeurs. L'ensemble du code écrit est placé sous [licence MIT](https://opensource.org/licenses/MIT).

Une instance de test de l'API ainsi que de l'interface est hébergée chez Heroku, à l'adresse https://warm-mesa-18064.herokuapp.com/. (Une description d'Heroku est disponible dans le [glossaire](#glossaire))

## Description du backend



## Glossaire

**Heroku** : Hébergeur proposant des @@TODO@@
Service gratuit ici, hébergement PHP + Node, installation automatique des dépendances, environnement Apache, intégré à git (`git push heroku master` permet de déployer une nouvelle version, et tout est automatisé à partir de là)

## Pistes d'amélioration

* Utiliser des regex pour les routes, probablement plus maintenable que d'exploser la route dans un tableau et de vérifier à chaque étape si l'ID est un nombre
* Créer des méthodes pour rendre le routeur plus propre. Par exemple, ne pas avoir une cascade de `switch/case` qui vérifient les méthodes, mais créer une classe `Router` qui a des méthodes `get()`, `post()`, `put()` et `delete()`, et qui vérifie quelle route match.
* Utiliser un micro-framework comme Zend Expressive (vidéo de présentation en français @@TODO ici@@), pour éviter de recoder ces éléments très classiques
* Utiliser un framework pour le frontend. jQuery peut être utile pour des besoins simples (et encore, avec les avancées des navigateurs, et le travail de standardisation du W3C et de l'ECMAScript, beaucoup des choses qui nécessitaient autrefois jQuery peuvent être faites nativement (cf @@TOO youdontneedjquery.com@@), évitant ainsi de charger 90ko de JS tout en ayant de meilleurs performances => Ajax avec `fetch()`, sélection avec `document.getElementById()/document.querySelector()`), mais dès qu'une application devient un peu complexe le code ressemble à un plat de spaghetti, avec des événements bindés depuis un peu partout, et une impossibilité de séparer les fichiers proprement.

-------

Article.php

    Ce fichier contient toutes les fonctions back end du projet. Ce sont ces fonctions qui seront utilisées par l’utilisateur pour agir sur les articles et les paragraphes.

getArticles
Cette fonction renvoie la liste des articles, afin de pouvoir l’afficher.

getArticleById
Cette fonction renvoie un article donné, ainsi que les paragraphes qui lui sont associés.

getParagraphById
Cette fonction renvoie un paragraphe donné.

createArticle
Cette fonction permet de créer un article et de lui donner un titre.

createParagraph
Cette fonction permet de créer un paragraphe associé à un article, et de lui donner un contenu. Le paragraphe est automatiquement placé dernier dans la liste des paragraphes liés à l’article en question.

updateArticleTitle
Cette fonction permet de mettre à jour le titre d’un article.

updateParagraphContent
Cette fonction permet de mettre à jour le contenu d’un paragraphe.

updateParagraphOrder
Cette fonction permet de mettre à jour l’ordre d’un paragraphe.

deleteParagraph
Cette fonction permet de supprimer un paragraphe.

deleteArticle
Cette fonction permet de supprimer un article.
