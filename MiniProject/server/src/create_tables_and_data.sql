DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS article;
DROP TABLE IF EXISTS category;



CREATE TABLE category
(
	id   INT(3)      NOT NULL AUTO_INCREMENT ,
	name VARCHAR(32) NOT NULL ,

	PRIMARY KEY ( id )
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;



CREATE TABLE article
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
	FOREIGN KEY ( category_id ) REFERENCES category ( id )
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;



CREATE TABLE comment
(
	id         INT(5)      NOT NULL AUTO_INCREMENT ,
	article_id INT(5)      NOT NULL ,
	nickname   VARCHAR(64) NOT NULL ,
	comment    TEXT        NOT NULL ,
	likes      INT(3)      NOT NULL DEFAULT 0 ,
	createdAt  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ,

	PRIMARY KEY ( id ) ,
	FOREIGN KEY ( article_id ) REFERENCES article ( id )
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;



INSERT INTO category (name)
	VALUES ('Annet'),
	       ('Fritid'),
	       ('Sport'),
	       ('Forelesninger'),
	       ('Koking'),
	       ('Life-Hacks'),
	       ('Mat');



INSERT INTO article (title , category_id , content , image_link , likes)
	VALUES ('Har noen funnet laderen min?' ,
	        1 , -- annet
	        'Mistet laderen min i går, nå finner jeg den ikke, please hjelp' ,
	        'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MC461?wid=2000&hei=1460&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=0' ,
	        4)

		 , ('Øving 13 i algdat' , 5 , -- koking
		    'masse kode med A* og sånn' , 'https://upload.wikimedia.org/wikipedia/commons/9/98/AstarExampleEn.gif' , 35)

		 , ('Topptur neste uke' ,
		    2 , -- fritid
		    'Vi skal på topptur neste uke, så det er bare å henge seg med' ,
		    'http://www.dronestagr.am/wp-content/uploads/2018/08/Mtn-Final-1200x800.jpg' ,
		    15)

		 , ('Ekstra billett til kino på Lørdag' ,
		    2 , -- fritid
		    'Hei jeg kjøpte ved et uhell en ekstra bilett til filmen på lørdag, så om noen tilfeldigvis ønsker å være med en ensom student på kino kan du bare ta kontakt så skal jeg fikse alt og til og med kjøpe brus til deg' ,
		    'https://static.homemcr.org/app/uploads/2017/06/HOME-Cinema-2-photo-by-Paul-Karalius-1-940x460-1533456165.jpg' ,
		    8)

		 , ('Noen som vil spille fotball?' ,
		    3 , -- sport
		    'Jeg og noen venner vil spille fotball, men vi mangler bane og ball og flere venner. Hadde vært kjempe koselig dersom noen kunne hjulpet oss :)' ,
		    'https://idrettsskolen.com/blogg/wp-content/uploads/2017/09/fotball-mot-skrim02-600x345.jpg' ,
		    16)

		 , ('Har noen svar på dette?' ,
		    5 , -- koking
		    'jeg skjønner bare ikke hvordan dette er mulig :(' ,
		    'https://www.cdn.tv2.no/images?imageId=8393296&x=0&y=0&cropw=100&croph=100&width=912&height=560&compression=80' ,
		    3)

		 , ('Forelesningsnotater TDAT2003' ,
		    4 , -- forelesinger
		    'tok notater fra forelesningen dersom noen ikke kunne møte opp, var en ganske så nyttig forelesning!' ,
		    'http://www.nisorchestra.org/media/season-and-events/18-19/DSC_0012.JPG' ,
		    17)

		 , ('Effektiv mat i eksamensperioden' ,
		    6 , -- life-hacks
		    'Dette har reddet livet mitt såååå mange ganger, bare legg pizzaen på en strykejern og blås på den med sånn vifte ting, så får du varm pizza kjempefort' ,
		    'https://i2-prod.mirror.co.uk/incoming/article6423182.ece/ALTERNATES/s615/wyofirereddit.jpg' ,
		    32)

		 , ('Pasta med scampi' ,
		    7 , -- mat
		    'Slik gjør du:

			-  Finhakk chili, hvitløk og sjalottløk. Skjær rødløken i skiver, gulrøttene i tynne staver, paprika
			   og squash i grove biter.
			- Kok pastaen etter anvisning på pakken, og kok gulrøttene i samme vann. Stek squashen.
			- Fres chili, hvitløk, sjalottløk og paprika i en stekepanne. Tilsett scampi og fløte. Kok opp.
			- Tilsett ferdigkokt pasta, gulrøtter, squash og rødløk. Smak til med lime, salt og pepper.' ,
		    'https://cdn.apartmenttherapy.info/image/upload/v1567541461/k/Photo/Recipes/2019-09-how-to-shrimp-alfredo/HT-Shrimp-Alfredo_103.jpg' ,
		    43)

		 , ('Rask og enkel kake' ,
		    7 , -- mat
		    'This chocolate cake recipe is similar to my Yellow Cake with Chocolate Frosting in that it’s a basic recipe that everyone needs in their collection.  If you are looking for something a little more “fancy,” check out my popular German Chocolate Cake or Coconut Cake with Pineapple Filling. A slice of Hershey''s perfectly chocolate chocolate cake, with chocolate frosting, on a white plate with a chocolate cake in the background.

		                CHOCOLATE CAKE
			This quick and easy chocolate cake recipe has become my all-time favorite over the years, and it’s the base recipe for many of my other favorite chocolate cake recipes. It’s also one of the very FIRST recipes I ever shared here, way back in 2010! I think I’ve made hundreds of cakes since then, and this is still my favorite recipe. Thank you Hershey’s!

			I can confidently say that it’s everything you’d hope for from a homemade chocolate cake, including incredibly moist and tender, with a fantastic homemade chocolate frosting. And, did I mention how easy it is to make? Let’s me show you:


					    HOW TO MAKE CHOCOLATE CAKE:

			- Start by mixing the dry and wet ingredients in separate bowls.
			- Process photos for making a chocolate cake including mixing the dry ingredients and wet ingredients in separate mixing bowls.
			- Add the wet/buttermilk mixture to the dry flour mixture and mix the batter until well combined.
			- Pour boiling water into the batter and stir until smooth. The batter will be very thin!
			- Pour the batter into your cake pans and bake the cakes on the middle rack of the oven.
			- boiling water added to chocolate cake batter, next to another photo of two round cake pans filled with the batter.

					    HOW TO MAKE AHEAD AND STORE THE CAKE AND FROSTING:
			The cakes and the chocolate frosting can both be made ahead of time. Allow the chocolate cakes to cool completely, and then wrap them really well in plastic wrap and stick each layer in a ziplock freezer bag. Freeze for up to one month. I like to frost the chocolate cakes when they are frozen because they’re easier to frost.' ,
		    'https://wallpapersmug.com/download/3840x2400/26150f/cake-dessert.jpg' ,
		    56)

		 , ('Death hack' , 6 , -- life-hacks
		    'bildet sier nok i seg selv.' , 'https://hugelolcdn.com/i/412491.jpg' , 7);



INSERT INTO comment (article_id , nickname , comment , likes)
	VALUES (1 , 'Snill fyr' , 'den ligger på toppen av terningen' , 1),
	       (1 , 'han som mista laderen' , 'Tusen takk!' , 1),
	       (3 , 'Ivrig turfyr' , 'Dette høres kjempe gøy ut, jeg og tre andre møter opp!' , 4),
	       (9 , 'Fattig student' , 'hvis bare jeg hadde hatt mere penger :(' , 1),
	       (9 , 'SnilleRunar' , 'Dette var et nydelig måltid etter en slitsom dag!' , 2),
	       (9 , 'Kari' , 'Anbefaler å doble dosen scampi!' , 0),
	       (6 , 'Geni' , 'Svaret er åpenbart 5' , 13),
	       (7 , 'Taknemmelig stud' , 'tusen takk! det var ekstremt snilt å legge ut' , 3),
	       (10 , 'Kakemoms' , 'NAMNAMNOMNOM' , 2),
	       (11 , 'Stresset student' , 'uff, det hørtes godt ut' , 1),
	       (5 , 'Fotballgærning' , 'Jeg og 15 venner blir med!' , 4),
	       (2 , 'Prokrastinator' , 'Takk, akkuratt det jeg trengte!' , 5);


