import type {Model} from 'sequelize';
import Sequelize from 'sequelize';

// Connect to mysql-database
let sequelize = new Sequelize('sivertut', 'sivertut', '0nDGMHSd', {
	host: process.env.CI ? 'mysql' : 'mysql.stud.idi.ntnu.no', // The host is 'mysql' when running in gitlab CI
	dialect: 'mysql'
});

// Types for database table Articles
export type Article = {
	id?: number,
	category_id: number,
	title: string,
	content: string,
	image_link: string,
	likes?: number,
	dislikes?: number,
	createdAt?: string,
	updatedAt?: string,
};

// Types for database table Categories
export type Category = {
	id?: number;
	name: string
};

// Types for database table Comments
export type Comment = {
	id?: number,
	article_id: number,
	nickname: string,
	comment: string,
	likes: number,
	dislikes: number
};



// Create database table Students
export let CategoryModel: Class<Model<Category>> = sequelize.define('Category', {
	id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
	name: Sequelize.STRING
});



// Create database table Article
export let ArticleModel: Class<Model<Article>> = sequelize.define('Article', {
	id: {
		type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true
	},
	category_id: {
		type: Sequelize.INTEGER,
		references: {
			model: CategoryModel,
			key: 'id'
		}
	},
	title: Sequelize.STRING,
	content: Sequelize.TEXT,
	image_link: Sequelize.TEXT,
	likes: {type: Sequelize.INTEGER, defaultValue: 0},
	dislikes: {type: Sequelize.INTEGER, defaultValue: 0},
});



// Create database table Students
export let CommentModel: Class<Model<Student>> = sequelize.define('Comment', {
	id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
	article_id: {
		type: Sequelize.INTEGER,
		references: {
			model: ArticleModel,
			key: 'id'
		}
	},
	nickname: Sequelize.STRING,
	comment: Sequelize.STRING,
	likes: {type: Sequelize.INTEGER, defaultValue: 0},
	dislikes: {type: Sequelize.INTEGER, defaultValue: 0},
});

// Drop tables and create test data when not in production environment
let production = process.env.NODE_ENV === 'production';
let test = process.env.NODE_ENV === 'test';

// The sync promise can be used to wait for the database to be ready (for instance in your tests)
export let syncModels = sequelize.sync().then(() =>
{
	// Create default data if content is missing
	if (!production)
	{
		return (
			CategoryModel.bulkCreate([
				{name: 'Annet'},
				{name: 'Fritid'},
				{name: 'Sport'},
				{name: 'Forelesninger'},
				{name: 'Koking'},
				{name: 'Life-hacks'},
				{name: 'Mat'}
			]).then(() =>
				{
					ArticleModel.bulkCreate([
						{
							title: 'Har noen funnet laderen min?',
							category_id: 1, //annet
							content: 'Mistet laderen min i g??r, n?? finner jeg den ikke, please hjelp',
							image_link: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MC461?wid=2000&hei=1460&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=0'
						},
						{
							title: '??ving 13 i algdat',
							category_id: 5, //Koking
							content: 'masse kode med A* og s??nn',
							image_link: 'https://upload.wikimedia.org/wikipedia/commons/9/98/AstarExampleEn.gif'
						},
						{
							title: 'Topptur neste uke',
							category_id: 2,
							content: 'Vi skal p?? topptur neste uke, s?? det er bare ?? henge seg med',
							image_link: 'http://www.dronestagr.am/wp-content/uploads/2018/08/Mtn-Final-1200x800.jpg'
						},
						{
							title: 'Ekstra billett til kino p?? L??rdag',
							category_id: 2, //fritid
							content: 'Hei jeg kj??pte ved et uhell en ekstra bilett til filmen p?? l??rdag, s?? om noen tilfeldigvis ??nsker ?? v??re med en ensom student p?? kino kan du bare ta kontakt s?? skal jeg fikse alt og til og med kj??pe brus til deg',
							image_link: 'https://static.homemcr.org/app/uploads/2017/06/HOME-Cinema-2-photo-by-Paul-Karalius-1-940x460-1533456165.jpg'
						},
						{
							title: 'Noen som vil spille fotball?',
							category_id: 3, //Sport
							content: 'Jeg og noen venner vil spille fotball, men vi mangler bane og ball og flere venner. Hadde v??rt kjempe koselig dersom noen kunne hjulpet oss :)',
							image_link: 'https://idrettsskolen.com/blogg/wp-content/uploads/2017/09/fotball-mot-skrim02-600x345.jpg'
						},
						{
							title: 'Har noen svar p?? dette?',
							category_id: 5, //koking
							content: 'jeg skj??nner bare ikke hvordan dette er mulig :(',
							image_link: 'https://www.cdn.tv2.no/images?imageId=8393296&x=0&y=0&cropw=100&croph=100&width=912&height=560&compression=80'
						},
						{
							title: 'Forelesningsnotater TDAT2003',
							category_id: 4, //forelesninger
							content: 'tok notater fra forelesningen dersom noen ikke kunne m??te opp, var en ganske s?? nyttig forelesning!',
							image_link: 'http://www.nisorchestra.org/media/season-and-events/18-19/DSC_0012.JPG'
						},
						{
							title: 'Effektiv mat i eksamensperioden',
							category_id: 6, //life hacks
							content: 'Dette har reddet livet mitt s???????? mange ganger, bare legg pizzaen p?? en strykejern og bl??s p?? den med s??nn vifte ting, s?? f??r du varm pizza kjempefort',
							image_link: 'https://i2-prod.mirror.co.uk/incoming/article6423182.ece/ALTERNATES/s615/wyofirereddit.jpg'
						},
						{
							title: 'Pasta med scampi',
							category_id: 7, //mat
							content: 'Slik gj??r du\n' +
								'Finhakk chili, hvitl??k og sjalottl??k. Skj??r r??dl??ken i skiver, gulr??ttene i tynne staver, paprika og squash i grove biter.\n' +
								'Kok pastaen etter anvisning p?? pakken, og kok gulr??ttene i samme vann. Stek squashen.\n' +
								'Fres chili, hvitl??k, sjalottl??k og paprika i en stekepanne. Tilsett scampi og fl??te. Kok opp.\n' +
								'Tilsett ferdigkokt pasta, gulr??tter, squash og r??dl??k. Smak til med lime, salt og pepper.',
							image_link: 'https://cdn.apartmenttherapy.info/image/upload/v1567541461/k/Photo/Recipes/2019-09-how-to-shrimp-alfredo/HT-Shrimp-Alfredo_103.jpg'
						},
						{
							title: 'Rask og enkel kake',
							category_id: 7, //mat
							content: 'Home ?? Holiday ?? Birthday ?? Hershey???s ???perfectly chocolate??? Chocolate Cake\n' +
								'HERSHEY???S ???PERFECTLY CHOCOLATE??? CHOCOLATE CAKE\n' +
								'By Lauren Allen on June 17, 2019, Updated August 9, 2019\n' +
								'\n' +
								' Jump to Recipe  Jump to Video  Print Recipe\n' +
								'Hershey???s ???perfectly chocolate??? Chocolate Cake with 5 ingredient chocolate frosting is our favorite homemade chocolate cake recipe! Extra moist, with a perfect rich chocolate flavor and tender, smooth crumb.\n' +
								'\n' +
								'This chocolate cake recipe is similar to my Yellow Cake with Chocolate Frosting in that it???s a basic recipe that everyone needs in their collection.  If you are looking for something a little more ???fancy,??? check out my popular German Chocolate Cake or Coconut Cake with Pineapple Filling.\n' +
								'\n' +
								'A slice of Hershey\'s perfectly chocolate chocolate cake, with chocolate frosting, on a white plate with a chocolate cake in the background.\n' +
								'CHOCOLATE CAKE\n' +
								'This quick and easy chocolate cake recipe has become my all-time favorite over the years, and it???s the base recipe for many of my other favorite chocolate cake recipes.\n' +
								'\n' +
								'It???s also one of the very FIRST recipes I ever shared here, way back in 2010! I think I???ve made hundreds of cakes since then, and this is still my favorite recipe. Thank you Hershey???s!\n' +
								'\n' +
								'\n' +
								'I can confidently say that it???s everything you???d hope for from a homemade chocolate cake, including incredibly moist and tender, with a fantastic homemade chocolate frosting.\n' +
								'\n' +
								'And, did I mention how easy it is to make? Let???s me show you:\n' +
								'\n' +
								'HOW TO MAKE CHOCOLATE CAKE:\n' +
								'Start by mixing the dry and wet ingredients in separate bowls.\n' +
								'Process photos for making a chocolate cake including mixing the dry ingredients and wet ingredients in separate mixing bowls.\n' +
								'Add the wet/buttermilk mixture to the dry flour mixture and mix the batter until well combined.\n' +
								'Pour boiling water into the batter and stir until smooth. The batter will be very thin!\n' +
								'Pour the batter into your cake pans and bake the cakes on the middle rack of the oven.\n' +
								'boiling water added to chocolate cake batter, next to another photo of two round cake pans filled with the batter.\n' +
								'HOW TO MAKE AHEAD AND STORE THE CAKE AND FROSTING:\n' +
								'The cakes and the chocolate frosting can both be made ahead of time. Allow the chocolate cakes to cool completely, and then wrap them really well in plastic wrap and stick each layer in a ziplock freezer bag. Freeze for up to one month. I like to frost the chocolate cakes when they are frozen because they???re easier to frost.',
							image_link: 'https://natashaskitchen.com/wp-content/uploads/2019/05/Chocolate-Cake-Recipe-3.jpg'
						},
						{
							title: 'Death hack',
							category_id: 6, //life hacks
							content: 'bildet sier nok i seg selv.',
							image_link: 'https://hugelolcdn.com/i/412491.jpg'
						}]).then(() =>
						CommentModel.bulkCreate([
							{
								article_id: 1, //mistet lader
								nickname: 'Snill fyr',
								comment: 'den ligger p?? toppen av terningen'
							},
							{
								article_id: 1, //mistet lader
								nickname: 'han som mista laderen',
								comment: 'Tusen takk!'
							},
							{
								article_id: 3, //topptur
								nickname: 'Ivrig turfyr',
								comment: 'Dette h??res kjempe g??y ut, jeg og tre andre m??ter opp!'
							}]
						));
				}
			));
	}
});


export let syncTestModels = sequelize.sync({force: true}).then(() =>
{
	// Create Test data
	if (test)
	{
		return (
			CategoryModel
				.bulkCreate([
					{name: 'Annet'},
					{name: 'Fritid'},
					{name: 'Sport'},
					{name: 'Forelesninger'},
					{name: 'Koking'},
					{name: 'Life-hacks'},
					{name: 'Mat'}])
				.then(() =>
					{
						ArticleModel
							.bulkCreate([
								{
									title: 'Artikkel_1',
									category_id: 1, //annet
									content: 'testArtikkel1',
									image_link: 'imageLink1.jpg'
								},
								{
									title: 'Artikkel_2',
									category_id: 2, //annet
									content: 'testArtikkel2',
									image_link: 'imageLink2.jpg'
								}])
							.then(() => CommentModel
								.bulkCreate([
									{
										article_id: 1, //mistet lader
										nickname: 'pers1',
										comment: 'TestKommentar1'
									},
									{
										article_id: 2, //mistet lader
										nickname: 'pers2',
										comment: 'TestKommentar2'
									}]
								));
					}
				));
	}
});
