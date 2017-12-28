DROP TABLE IF EXISTS np_paragraphs;
DROP TABLE IF EXISTS np_articles;

CREATE TABLE np_articles
(
  id    INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  title VARCHAR(255)    NOT NULL
);

CREATE TABLE np_paragraphs
(
  id         INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  article_id INT             NOT NULL,
  `order`    INT             NOT NULL,
  content    TEXT            NOT NULL,
  CONSTRAINT paragraphs_articles_id_fk FOREIGN KEY (article_id) REFERENCES np_articles (id)
);

INSERT INTO ebm_newspaper.np_articles (title) VALUES ('My first article');
INSERT INTO ebm_newspaper.np_articles (title) VALUES ('Another article');

INSERT INTO ebm_newspaper.np_paragraphs (article_id, `order`, content) VALUES (1, 1, 'Quinoa cardigan portland marfa shabby chic small batch craft beer squid readymade selvage. Heirloom synth next level cronut locavore, bitters yuccie pok pok gentrify tumeric before they sold out authentic. Pok pok chillwave pour-over, chartreuse wolf meggings hammock vape. Street art ramps leggings roof party mlkshk jianbing, deep v selfies 3 wolf moon hella 90''s stumptown bicycle rights.');
INSERT INTO ebm_newspaper.np_paragraphs (article_id, `order`, content) VALUES (1, 2, 'Cronut YOLO knausgaard, forage neutra williamsburg beard adaptogen cred food truck. Kale chips cloud bread affogato williamsburg hot chicken poutine crucifix vape franzen cronut bushwick cardigan shabby chic lo-fi hoodie. Cliche letterpress try-hard yuccie. Migas blog wolf, prism fixie master cleanse squid vape skateboard intelligentsia green juice before they sold out fam readymade craft beer. Mumblecore hashtag iPhone single-origin coffee. Stumptown hammock gochujang pinterest slow-carb leggings.');
INSERT INTO ebm_newspaper.np_paragraphs (article_id, `order`, content) VALUES (1, 3, 'Lumbersexual tacos cronut kickstarter cloud bread, palo santo af green juice man braid ramps +1. Brunch church-key +1 freegan pinterest waistcoat vexillologist edison bulb shabby chic cred glossier marfa readymade pickled. Readymade hella microdosing, fam hell of edison bulb fingerstache tbh raw denim. Williamsburg jianbing food truck vinyl. Tilde bespoke cred lumbersexual, ennui jean shorts tbh wayfarers everyday carry.');
INSERT INTO ebm_newspaper.np_paragraphs (article_id, `order`, content) VALUES (1, 4, 'Bitters wolf squid organic edison bulb roof party pug flexitarian. Hashtag XOXO hell of vaporware. Mlkshk selfies vinyl pabst fashion axe. Fixie single-origin coffee hexagon poke, mumblecore post-ironic iceland lumbersexual synth small batch. Flexitarian messenger bag mumblecore pitchfork palo santo fingerstache.');
