Rapport
=======

## Bilan du travail

Le livrable se compose de deux parties :
* une API RESTful développée en PHP, accessible à l'URL `/api`, qui permet de manipuler des articles et des paragraphes ;
* une application Web développée en Javascript (à l'aide de jQuery), offrant une interface utilisateur pour visualiser et éditer les données renvoyées par l'API.

Une documentation d'installation est également disponible, dans le fichier [`README.md`](README.md).

L'historique du code est géré par [git](https://git-scm.com/), et hébergé sur un [dépôt Github](https://github.com/nymous-experiments/EBM-FrontendBackend) pour permettre une collaboration facile entre les développeurs. L'ensemble du code écrit est placé sous [licence MIT](https://opensource.org/licenses/MIT).

Une instance de test de l'API ainsi que de l'interface est hébergée chez Heroku, à l'adresse https://warm-mesa-18064.herokuapp.com/. (Une description d'Heroku est disponible dans le [glossaire](#glossaire))

## Backend

### Introduction

Le backend consiste en une API RESTful développée en PHP. Le schéma décrivant cette API est disponible dans le fichier [`swagger_api.yaml`](swagger_api.yaml), et peut être chargé sur [l'éditeur Swagger](https://editor.swagger.io/) pour une lecture plus aisée. Il est même possible de tester directement sur Swagger l'API.

### Technologies utilisées

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

### Routeur

Le backend utilise un mécanisme de routeur : toutes les requêtes, peu importe l'URL d'appel, seront dirigées vers le fichier [`index.php`](index.php), qui pourra les traiter spécifiquement. On découple ainsi l'emplacement des fichiers sources sur le disque et les URL utilisées.

Comme indiqué dans le README, il y a deux possibilités pour router les URL vers l'index :
* sur un serveur Apache, le fichier [`.htaccess`](.htaccess) fourni réécrit les URL commençant par `/api` vers le fichier [`index.php`](index.php), et les autres URL sont résolues comme des fichiers classiques dans le dossier `public/` (c'est dans ce dossier que se trouve le fichier `index.html` compilé, ainsi que les CSS et JS nécessaires) ;
* avec le serveur de développement PHP (`php -S 127.0.0.1:8080 -t public $(pwd)/index.php`), on indique à PHP d'utiliser le fichier [`index.php`](index.php) pour toutes les requêtes, et c'est lui qui dans son code décide s'il faut charger l'API (ligne [12](index.php#L12)) ou s'il faut essayer de résoudre l'URL comme un fichier normal (ligne [14](index.php#L14)) en cherchant dans le dossier `public/` grâce au paramètre `-t`.

Le cœur du routeur est dans le fichier [`api.php`](src/api.php). On y charge d'abord la configuration, permettant de se connecter à la base de données, puis on découpe l'URL appelée selon les `/`. S'ensuit alors une cascade de `switch/case` permettant de charger la bonne action en fonction de la route appelée (`/api/articles/1` par exemple), ainsi que de la méthode utilisée (`GET`, `POST`, `PATCH` ou `DELETE`). Chacune des méthodes des classes [`Article.php`](src/Routes/Article.php) et [`Error.php`](src/Routes/Error.php) définissent le code de statut HTTP correspondant au résultat. Les dernières lignes du fichier (lignes [138 à 147](src/api.php#L138)) servent à autoriser les requêtes Ajax provenant d'autres domaines que celui hébergeant l'API (ici uniquement `https://editor.swagger.io`). C'est nécessaire pour tester l'API depuis Swagger, à cause d'une sécurité implémentée par les navigateurs.

Le code des classes [`Article.php`](src/Routes/Article.php) et [`Error.php`](src/Routes/Error.php) est assez simple, consistant en grande partie de requêtes SQL préparées grâce à la librairie PDO. Ces *requêtes préparées* permettent d'interroger la BDD en utilisant des paramètres fournis par l'utilisateur (donc dangereux car non validés) sans risque, car ils sont automatiquement échappés.


### Dépendances

Nous avons utilisé le gestionnaire de dépendances [Composer](https://getcomposer.org/) pour quelques librairies :
* [`Dotenv`][Dotenv] pour charger les paramètres depuis un fichier `.env` dans les variables d'environnement (ce qui permet pendant le développement en local de créer ce fichier `.env` contenant les informations nécessaires à la connexion à la BDD, et lors du déploiement sur Heroku (qui n'autorise pas à créer de fichier manuellement) de passer ces informations via les variables d'environnement directement)
* [`PHP_CodeSniffer`][phpcs] pour vérifier la conformité du code aux standards PSR-1 et PSR-2 (à lancer avec la commande `./vendor/bin/phpcs --standard=PSR1,PSR2 --extensions=php src/`)

Ce gestionnaire de dépendances est le plus utilisé dans l'environnement PHP, et utilisé *de facto* par toutes les librairies et frameworks (comme Symfony, Zend, Laravel ou CakePHP).

### Autoloading

Nous avons également utilisé le mécanisme *d'autoloading* de PHP : un code spécifique chargé en début de projet, et qui saura exécuter le bon fichier en fonction des imports effectués. On charge cet autoloader dans le fichier [`index.php`, ligne 8](index.php#L8), soit le plus tôt possible dans le projet. Ensuite, il suffit de faire
```php
use EBM\Routes\Article;
```
(par exemple dans [`api.php`](src/api.php#L5)) pour importer directement le fichier [`src/Routes/Article.php`](src/Routes/Article.php). Ce mécanisme d'autoloader est configuré par défaut pour les librairies installées grâce à Composer ; pour les fichiers de notre projet, il suffit de définir une clé dans le fichier [`composer.json`](composer.json), ligne [26](composer.json#L26), indiquant que le namespace `EBM\` correspond au dossier `src/`. Attention, à chaque modification de cette configuration, ou après l'installation d'une nouvelle dépendance, il faut regénérer l'autoloader avec la commande `composer dump-autoloader`.

### Accès à la base de données

Pour simplifier les interactions avec la BDD, une classe [`Database`](src/Database.php) a été créée, pour encapsuler la connexion PDO. On y retrouve les méthodes pour effectuer une requête normale (non préparée, donc sans variable utilisateur), une requête préparée, et une fonction utilitaire `lastInsertId()` qui renvoie le dernier ID inséré, pour savoir quelle ligne vient d'être créée dans la BDD. Cette classe est inspirée de la [formation PHP POO de Grafikart][Grafikart POO].

## Frontend

Le frontend consiste en une Single-Page Application, développée en Javascript. Cette page permet à un utilisateur d'interagir avec l'API.

### Technologies utilisées

Ce projet a été l'occasion de mettre en place une chaîne de compilation Javascript moderne, et de l'appliquer à un projet utilisant jQuery (ou du moins essayer, jQuery ne se prêtant pas vraiment à cette nouvelle manière de travailler).

**Javascript**

Le frontend a été développé principalement avec ECMAScript 6, nouvelle version du standard définissant le langage Javascript et sortie en 2015. Les principales nouveautés utilisées dans ce projet sont :
* les nouveaux mots-clé `let` et `const`, pour définir les variables  de manière plus intuitive (un hoisting au niveau bloc et non au niveau fonction), et pour définir des constantes (plus performantes, et permettant de détecter certains bugs plus tôt lors de la modification de variables supposées constantes) ;
* les promesses, permettant de faire de l'asynchrone sans se perdre dans une pyramide de callbacks ;
* les valeurs par défaut pour les paramètres de fonction, ce qui permet de définir une fonction ainsi
```js
function newParagraph (content = '') {
}
```
* les fonctions fléchées, qui définissent le `this` interne en fonction du contexte d'appel de la fonction, et qui permettent une syntaxe raccourcie
* les modules et les exports, qui permettent de découper son code en plusieurs fichiers de façon modulaire, et de n'importer que les fonctions nécessaires

**SCSS**

Les feuilles de style du projet sont générées grâce à SCSS, un préprocesseur CSS qui ajoute plusieurs fonctionnalités au CSS :
* des variables CSS réutilisables (permettant de définir par exemple une couleur, ou une dimension, et de l'appliquer à plusieurs endroits dans la feuille de styles) ; cette fonctionnalité est désormais standardisée dans CSS3, mais son support dans les navigateurs n'est pas encore complet ;
* un découpage en styles modulables, pour importer uniquement ce qui est utilisé : dans le fichier [`article.scss`](src/Frontend/components/article/article.scss), nous n'importons que les styles nécessaires depuis le framework Bulma ;
* des sélecteurs imbriqués : comme on peut le voir à la ligne [43](src/Frontend/components/article/article.scss#L43) du `article.scss`, une syntaxe SCSS permet de définir des sélecteurs plus spécifiques à partir du sélecteur précédent, plus simplement que s'il fallait répéter les sélecteurs

**Handlebars**

Pour découper aussi le code HTML, nous avons utilisé le langage de templating [*Handlebars*](http://handlebarsjs.com/). Ainsi, le fichier [`index.hbs`](src/Frontend/index.hbs) inclut les templates des deux composants de notre application, la [navbar](src/Frontend/components/navbar/navbar.hbs) et le conteneur [article](src/Frontend/components/article/article.hbs).

### Toolchain

Aujourd'hui, l'écosystème Javascript s'est énormément complexifié, et nécessite désormais une chaîne d'outils pour compiler et transpiler le code. Nous nous sommes appuyés sur la [formation de Grafikart][Grafikart Webpack] pour configurer les outils.

**Webpack**

[Webpack](https://webpack.js.org/) est la colonne vertébrale du système de build. Il sert à compiler toutes les ressources nécessaires pour un projet frontend, que ce soit des fichiers Javascript, des feuilles de styles CSS, des images, polices... Il fonctionne grâce à des *loaders*, qui s'appliquent à certains types de fichiers, et peuvent en comprendre la syntaxe et appliquer certaines transformations.

La configuration de Webpack s'effectue dans le fichier [`webpack.config.js`](webpack.config.js). Il a été commenté pour expliquer l'utilité de chaque loader et chaque option, mais nous décrirons les principaux outils ci-dessous.

**Babel**

[Babel](http://babeljs.io/) est un transpilateur : il prend en entrée un fichier Javascript, et va le transformer en un autre fichier Javascript. Il permet ainsi d'utiliser la syntaxe ECMAScript 6 et plus récente, tout en assurant la compatibilité avec les navigateurs plus anciens, en remplaçant par exemple les `let` et `const` par des `var` qui respectent le scope des variables. Il utilise des tables de compatibilité indiquant quelle fonctionnalité est supportée par quelle version de navigateur, et transforme uniquement la syntaxe non comprise par ceux-ci.

Babel est configuré grâce au fichier [`.babelrc`](.babelrc).

**ESLint**

Pour s'assurer que les développeurs formattent leur code de la même manière, et pour éviter certaines erreurs détectables statiquement (une variable non déclarée ou non utilisée par exemple), nous vérifions tous les fichiers Javascript grâce à [ESLint](https://eslint.org/), en utilisant les règles de [StandardJS](https://standardjs.com/). Elles ont l'avantage d'être strictes et sans aucune configuration nécessaire.

ESLint est configuré dans le fichier [`.eslintrc`](.eslintrc).

**package.json**

Le fichier [`package.json`](package.json) contient toutes les dépendances nécessaires au développement et à la production. On y retrouve également les scripts permettant de lancer le projet en mode de développement (avec hot-reload et sans compression des ressources) ou en mode production.

## Glossaire

**Heroku** : Hébergeur proposant des @@TODO@@
Service gratuit ici, hébergement PHP + Node, installation automatique des dépendances, environnement Apache, intégré à git (`git push heroku master` permet de déployer une nouvelle version, et tout est automatisé à partir de là)

## Pistes d'amélioration

* Utiliser des regex pour les routes, probablement plus maintenable que d'exploser la route dans un tableau et de vérifier à chaque étape si l'ID est un nombre
* Créer des méthodes pour rendre le routeur plus propre. Par exemple, ne pas avoir une cascade de `switch/case` qui vérifient les méthodes, mais créer une classe `Router` qui a des méthodes `get()`, `post()`, `put()` et `delete()`, et qui vérifie quelle route match.
* Utiliser un micro-framework comme Zend Expressive (vidéo de présentation en français [ici](https://www.grafikart.fr/tutoriels/php/zend-expressive-905)), pour éviter de recoder ces éléments très classiques
* Utiliser un framework pour le frontend. jQuery peut être utile pour des besoins simples (et encore, avec les avancées des navigateurs, et le travail de standardisation du W3C et de l'ECMAScript, beaucoup des choses qui nécessitaient autrefois jQuery peuvent être faites nativement (cf http://youmightnotneedjquery.com/), évitant ainsi de charger 90ko de JS tout en ayant de meilleurs performances => Ajax avec `fetch()`, sélection avec `document.getElementById()/document.querySelector()`), mais dès qu'une application devient un peu complexe le code ressemble à un plat de spaghetti, avec des événements bindés depuis un peu partout, et une impossibilité de séparer les fichiers proprement.
* Mettre plus de PHPdoc et de JSdoc, pour aider le développeur à comprendre l'utilité des fonctions, et aider les IDE à proposer les bons types et les bonnes complétions

[Dotenv]: https://packagist.org/packages/vlucas/phpdotenv
[phpcs]: https://packagist.org/packages/squizlabs/php_codesniffer
[Grafikart POO]: https://www.grafikart.fr/formations/programmation-objet-php
[Grafikart Webpack]: https://www.grafikart.fr/formations/webpack
