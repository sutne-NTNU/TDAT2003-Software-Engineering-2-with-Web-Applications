DROP TABLE IF EXISTS person_test;

CREATE TABLE person_test
(
	id      INT(11)      NOT NULL AUTO_INCREMENT ,
	navn    VARCHAR(256) NOT NULL ,
	alder   INT(3) DEFAULT NULL ,
	adresse VARCHAR(256) NOT NULL ,
	PRIMARY KEY ( id )
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;
