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

Le backend consiste en une API RESTful développée en PHP. Le schéma décrivant cette API est disponible dans le fichier [`swagger_api.yaml`](swagger_api.yaml), et peut être chargé sur [l'éditeur Swagger](https://editor.swagger.io/) pour une lecture plus aisée. Il est même possible de tester directement sur Swagger l'API.

Nous avons utilisé PHP 7.1, principalement pour la possibilité de typer les paramètres des fonctions et leur valeur de retour. On peut par exemple écrire
```php
public static function getArticleById(Database $db, int $article_id)
{
    ...
}
```
Ce typage a deux avantages :
* PHP vérifie au runtime que les arguments passés à une fonction ainsi que son retour sont bien du type renseigné, ce qui permet de détecter plus tôt certains bugs ;
* les IDE peuvent utiliser ces informations pour proposer une autocomplétion plus intelligente, avec les méthodes correspondant aux objets passés.

Le backend utilise un mécanisme de routeur : toutes les requêtes, peu importe l'URL d'appel, seront dirigées vers le fichier [`index.php`](index.php), qui pourra les traiter spécifiquement. On découple ainsi l'emplacement des fichiers sources sur le disque et les URL utilisées.

Comme indiqué dans le README, il y a deux possibilités pour router les URL vers l'index :
* sur un serveur Apache, le fichier [`.htaccess`](.htaccess) fourni réécrit les URL commençant par `/api` vers le fichier [`index.php`](index.php), et les autres URL sont résolues comme des fichiers classiques dans le dossier `public/` (c'est dans ce dossier que se trouve le fichier `index.html` compilé, ainsi que les CSS et JS nécessaires) ;
* avec le serveur de développement PHP (`php -S 127.0.0.1:8080 -t public $(pwd)/index.php`), on indique à PHP d'utiliser le fichier [`index.php`](index.php) pour toutes les requêtes, et c'est lui qui dans son code décide s'il faut charger l'API (ligne [12](index.php#L12)) ou s'il faut essayer de résoudre l'URL comme un fichier normal (ligne [14](index.php#L14)) en cherchant dans le dossier `public/` grâce au paramètre `-t`.

Nous avons utilisé le gestionnaire de dépendances [Composer](https://getcomposer.org/) pour quelques librairies :
* [`Dotenv`][Dotenv] pour charger les paramètres depuis un fichier `.env` dans les variables d'environnement (ce qui permet pendant le développement en local de créer ce fichier `.env` contenant les informations nécessaires à la connexion à la BDD, et lors du déploiement sur Heroku (qui n'autorise pas à créer de fichier manuellement) de passer ces informations via les variables d'environnement directement)
* [`PHP_CodeSniffer`][phpcs] pour vérifier la conformité du code aux standards PSR-1 et PSR-2 (à lancer avec la commande `./vendor/bin/phpcs --standard=PSR1,PSR2 --extensions=php src/`)

Ce gestionnaire de dépendances est le plus utilisé dans l'environnement PHP, et utilisé *de facto* par toutes les librairies et frameworks (comme Symfony, Zend, Laravel ou CakePHP).

Nous avons également utilisé le mécanisme *d'autoloading* de PHP : un code spécifique chargé en début de projet, et qui saura exécuter le bon fichier en fonction des imports effectués. On charge cet autoloader dans le fichier [`index.php`, ligne 8](index.php#L8), soit le plus tôt possible dans le projet. Ensuite, il suffit de faire
```php
use EBM\Routes\Article;
```
(par exemple dans [`api.php`](src/api.php#L5)) pour importer directement le fichier [`src/Routes/Article.php`](src/Routes/Article.php). Ce mécanisme d'autoloader est configuré par défaut pour les librairies installées grâce à Composer ; pour les fichiers de notre projet, il suffit de définir une clé dans le fichier [`composer.json`](composer.json), ligne [26](composer.json#L26), indiquant que le namespace `EBM\` correspond au dossier `src/`. Attention, à chaque modification de cette configuration, ou après l'installation d'une nouvelle dépendance, il faut regénérer l'autoloader avec la commande `composer dump-autoloader`.

Le cœur du routeur est dans le fichier [`api.php`](src/api.php). On y charge d'abord la configuration, permettant de se connecter à la base de données, puis on découpe l'URL appelée selon les `/`. S'ensuit alors une cascade de `switch/case` permettant de charger la bonne action en fonction de la route appelée (`/api/articles/1` par exemple), ainsi que de la méthode utilisée (`GET`, `POST`, `PATCH` ou `DELETE`). Chacune des méthodes des classes [`Article.php`](src/Routes/Article.php) et [`Error.php`](src/Routes/Error.php) définissent le code de statut HTTP correspondant au résultat. Les dernières lignes du fichier (lignes [138 à 147](src/api.php#L138)) servent à autoriser les requêtes Ajax provenant d'autres domaines que celui hébergeant l'API (ici uniquement `https://editor.swagger.io`). C'est nécessaire pour tester l'API depuis Swagger, à cause d'une sécurité implémentée par les navigateurs.

Le code des classes [`Article.php`](src/Routes/Article.php) et [`Error.php`](src/Routes/Error.php) est assez simple, consistant en grande partie de requêtes SQL préparées grâce à la librairie PDO. Ces *requêtes préparées* permettent d'interroger la BDD en utilisant des paramètres fournis par l'utilisateur (donc dangereux car non validés) sans risque, car ils sont automatiquement échappés.

Pour simplifier les interactions avec la BDD, une classe [`Database`](src/Database.php) a été créée, pour encapsuler la connexion PDO. On y retrouve les méthodes pour effectuer une requête normale (non préparée, donc sans variable utilisateur), une requête préparée, et une fonction utilitaire `lastInsertId()` qui renvoie le dernier ID inséré, pour savoir quelle ligne vient d'être créée dans la BDD. Cette classe est inspirée de la [formation PHP POO de Grafikart][Grafikart POO].

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


[Dotenv]: https://packagist.org/packages/vlucas/phpdotenv
[phpcs]: https://packagist.org/packages/squizlabs/php_codesniffer
[Grafikart POO]: https://www.grafikart.fr/formations/programmation-objet-php
