// @flow

const mysql = require("mysql");

const test_queries = require("./test_queries.js");
const runsqlfile = require("./run_sql_file.js");

const pool = mysql.createPool({
	connectionLimit: 1,
	host: "mysql.stud.iie.ntnu.no",
	user: "sivertut",
	password: "0nDGMHSd",
	database: "sivertut",
	debug: false,
	multipleStatements: true
});

let testQueries = new test_queries(pool);

beforeAll(done =>
{
	runsqlfile('tests/create_testtables_and_data.sql', pool, done);
});

test("get all categories", done =>
{
	function callback(status, data)
	{
		console.log("Callback get all categories: status=" + status + ", data.length=" + data.length);
		expect(data.length).toBe(3);
		done();
	}
	testQueries.getCategories(callback);
});

test("get most recent articles", done =>
{
	function callback(status, data)
	{
		console.log("Callback get most recent: status=" + status + ", data.length=" + data.length);
		expect(data.length).toBe(2);
		expect(data[0].title).toBe('Artikkel3-sok');
		done();
	}
	testQueries.getMostRecent(callback);
});

test("get search articles", done =>
{
	function callback(status, data)
	{
		console.log("Callback get search articles: status=" + status + ", data.length=" + data.length);
		expect(data.length).toBe(2);
		expect(data[0].title).toBe('Artikkel3-sok');
		expect(data[1].title).toBe('Artikkel1');
		done();
	}
	testQueries.getSearchArticles('sok', callback);
});

test("get Frontpage Articles", done =>
{
	function callback(status, data)
	{
		console.log("Callback get Frontpage: status=" + status + ", data.length=" + data.length);
		expect(data.length).toBeGreaterThanOrEqual(3);
		expect(data[0].title).toBe('Artikkel2');
		expect(data[1].title).toBe('Artikkel1');
		expect(data[2].title).toBe('Artikkel3-sok');
		done();
	}
	testQueries.getFrontpage(callback);
});


test("get all articles", done =>
{
	function callback(status, data)
	{
		console.log("Callback get all articles: status=" + status + ", data.length=" + data.length);
		expect(data.length).toBeGreaterThanOrEqual(3);
		done();
	}
	testQueries.getAll(callback);
});


test("get all articles from category", done =>
{
	function callback(status, data)
	{
		console.log("Callback get all articles from category: status=" + status + ", data.length=" + data.length);
		expect(data.length).toBe(1);
		expect(data[0].content).toBe('Testartikkel2 - tekst');
		done();
	}
	testQueries.getArticlesFromCategory(2, callback);
});


test("get specific article", done =>
{
	function callback(status, data)
	{
		console.log("Callback, get specific article: status=" + status + ", artikkel=" + JSON.stringify(data));
		expect(data.length).toBe(1);
		expect(data[0].title).toBe("Artikkel3-sok");
		expect(data[0].content).toBe("Testartikkel3 - tekst");
		done();
	}
	testQueries.getArticle(3, callback);
});


test("add article", done =>
{
	function callback(status, data)
	{
		console.log("Callback add article: status=" + status + ", insertID=" + data.insertId + ", affectedRows=" + data.affectedRows);
		expect(data.affectedRows).toBeGreaterThanOrEqual(1);
		expect(data.insertId).toBe(4);
		done();
	}
	testQueries.addArticle({
		category_id: 2,
		title: "inserted_Artikkel4",
		content: "Testartikkel_4",
		image_link: "artikkel_4_bilde.jpg"
	}, callback);
});


test("update article", done =>
{
	function callback(status, data)
	{
		console.log("Callback update article: status=" + status + ", changedRows=" + data.changedRows);
		expect(data.changedRows).toBe(1);
		done();
	}
	testQueries.updateArticle({
		id: 1,
		category_id: 1,
		title: "updated_Artikkel1",
		content: "Testartikkel1 - tekst - sok",
		image_link: "artikkel_1_bilde.jpg",
		likes: 1
	}, callback);
});

test("delete article", done =>
{
	function callback(status, data)
	{
		console.log("Callback delete article: Status=" + status + ", affectedRows=" + data.affectedRows);
		expect(data.affectedRows).toBe(1);
		done();
	}
	testQueries.deleteArticle(2, callback);
});

/*

Kommentarer

 */

test("get article comments", done =>
{
	function callback(status, data)
	{
		console.log("Callback, get comments to article: status=" + status + ", comments=" + data.length);
		expect(data.length).toBe(2);
		expect(data[0].nickname).toBe("pers3");
		expect(data[1].nickname).toBe("pers3-2");
		done();
	}
	testQueries.getComments(3, callback);
});


test("add comment", done =>
{
	function callback(status, data)
	{
		console.log("Callback add comment: status=" + status + ", insertID=" + data.insertId + ", affectedRows=" + data.affectedRows);
		expect(data.affectedRows).toBe(1);
		expect(data.insertId).toBe(5);
		done();
	}
	testQueries.addComment({
		article_id: 1,
		nickname: "pers1-inserted",
		comment: "kommentar1-inserted"
	}, callback);
});


test("like comment", done =>
{
	function callback(status, data)
	{
		console.log("Callback like comment: status=" + status + ", changedRows=" + data.changedRows);
		expect(data.changedRows).toBe(1);
		done();
	}
	testQueries.updateComment({
		id: 1,
		likes: 10
	}, callback);
});

test("delete comment", done =>
{
	function callback(status, data)
	{
		console.log("Callback delete comment: Status=" + status + ", affectedRows=" + data.affectedRows);
		expect(data.affectedRows).toBe(1);
		done();
	}
	testQueries.deleteComment(3, callback);
});



/*
 Tester av at ting ikke fungerer når det ikke skal fungere
 */



test("get unknown article", done =>
{
	function callback(status, data)
	{
		console.log("Callback get unknown article: status=" + status + ", article=" + JSON.stringify(data));
		expect(status).toBe(404);
		done();
	}
	testQueries.getArticle(0, callback);
});


test("no results from search", done =>
{
	function callback(status, data)
	{
		console.log("Callback gno results from search: status=" + status + ", data.length=" + data.length);
		expect(status).toBe(404);
		done();
	}
	testQueries.getSearchArticles('fins ikke', callback);
});




afterAll(() =>
{
	pool.end();
});
