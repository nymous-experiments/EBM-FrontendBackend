DROP TABLE IF EXISTS np_paragraphs;
DROP TABLE IF EXISTS np_articles;

CREATE TABLE np_articles
(
  id    INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  title VARCHAR(255)    NOT NULL
)

CREATE TABLE np_paragraphs
(
  id         INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  article_id INT             NOT NULL,
  `order`    INT             NOT NULL,
  content    TEXT            NOT NULL,
  CONSTRAINT paragraphs_articles_id_fk FOREIGN KEY (article_id) REFERENCES np_articles (id)
)
