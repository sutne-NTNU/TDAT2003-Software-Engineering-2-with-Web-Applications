DROP TABLE IF EXISTS test_comment;
DROP TABLE IF EXISTS test_article;
DROP TABLE IF EXISTS test_category;



CREATE TABLE test_category
(
	id   INT(3)      NOT NULL AUTO_INCREMENT ,
	name VARCHAR(32) NOT NULL ,

	PRIMARY KEY ( id )
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;



CREATE TABLE test_article
(
	id          INT(5)       NOT NULL AUTO_INCREMENT ,
	category_id INT(3)       NOT NULL ,
	title       VARCHAR(128) NOT NULL ,
	content     TEXT         NOT NULL ,
	image_link  LONGTEXT     NULL ,
	likes       INT(3)       NOT NULL DEFAULT 0 ,
	createdAt   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	changedAt   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ,

	PRIMARY KEY ( id ) ,
	FOREIGN KEY ( category_id ) REFERENCES test_category ( id )
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;



CREATE TABLE test_comment
(
	id         INT(5)      NOT NULL AUTO_INCREMENT ,
	article_id INT(5)      NOT NULL ,
	nickname   VARCHAR(64) NOT NULL ,
	comment    TEXT        NOT NULL ,
	likes      INT(3)      NOT NULL DEFAULT 0 ,
	createdAt  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ,

	PRIMARY KEY ( id ) ,
	FOREIGN KEY ( article_id ) REFERENCES test_article ( id )
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;



INSERT INTO test_category (name)
	VALUES ('Kat1'),
	       ('Kat2'),
	       ('Kat3');



INSERT INTO test_article (title , category_id , content , image_link , likes)
	VALUES ('Artikkel1' , 1 , 'Testartikkel1 - tekst - sok' , 'artikkel_1_bilde.jpg' , 2)
		 , ('Artikkel2' , 2 , 'Testartikkel2 - tekst' , 'artikkel_2_bilde.jpg' , 3)
		 , ('Artikkel3-sok' , 3 , 'Testartikkel3 - tekst' , 'artikkel_3_bilde.jpg' , 1);



INSERT INTO test_comment (article_id , nickname , comment)
	VALUES (1 , 'pers1' , 'kommentar1'),
	       (2 , 'pers2' , 'kommentar2'),
	       (3 , 'pers3' , 'kommentar3'),
	       (3 , 'pers3-2' , 'kommentar3-2');
