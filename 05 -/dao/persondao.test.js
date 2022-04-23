const mysql = require("mysql");

const PersonDao = require("./persondao.js");
const runsqlfile = require("./runsqlfile.js");

const pool = mysql.createPool({
	connectionLimit: 1,
	host: "mysql.stud.iie.ntnu.no",
	user: "sivertut",
	password: "0nDGMHSd",
	database: "sivertut",
	debug: false,
	multipleStatements: true
});

let personDao = new PersonDao(pool);



beforeAll(done =>
{
	runsqlfile("dao/create_tables.sql", pool, () =>
	{
		runsqlfile("dao/create_testdata.sql", pool, done);
	});
});

afterAll(() =>
{
	pool.end();
});



test("get one person from db", done =>
{
	function callback(status, data)
	{
		console.log("Callback, get one person: status=" + status + ", person=" + JSON.stringify(data));
		expect(status).not.toBe(500);
		expect(data.length).toBe(1);
		expect(data[0].navn).toBe("Sivert Utne");
		done();
	}
	personDao.getOne(1, callback);
});



test("update one person in db", done =>
{
	function callback(status, data)
	{
		console.log("Callback update one person: status=" + status + ", changedRows=" + data.changedRows);
		expect(status).not.toBe(500);
		expect(data.changedRows).toBe(1);
		done();
	}
	personDao.updateOne(1, {navn: "Sivert Utne", alder: 75, adresse: "India"}, callback);
});



test("get unknown person from db", done =>
{
	function callback(status, data)
	{
		console.log("Callback get unknown person: status=" + status + ", person=" + JSON.stringify(data));
		expect(status).not.toBe(500);
		expect(data.length).toBe(0);
		done();
	}
	personDao.getOne(0, callback);
});



test("add person to db", done =>
{
	function callback(status, data)
	{
		console.log("Callback add person to db: status=" + status + ", insertID=" + data.insertId + ", affectedRows=" + data.affectedRows);
		expect(status).not.toBe(500);
		expect(data.affectedRows).toBeGreaterThanOrEqual(1);
		done();
	}
	personDao.createOne({navn: "Nils Nilsen", alder: 34, adresse: "Gata 3"}, callback);
});



test("get all persons from db", done =>
{
	function callback(status, data)
	{
		console.log("Callback get all persons from db: status=" + status + ", data.length=" + data.length);
		expect(status).not.toBe(500);
		expect(data.length).toBeGreaterThanOrEqual(5);
		done();
	}
	personDao.getAll(callback);
});



test("delete one person from db", done =>
{
	function callback(status, data)
	{
		console.log("Callback sletter to personer: Status=" + status + ", affectedRows=" + data.affectedRows);
		expect(status).not.toBe(500);
		expect(data.affectedRows).toBe(2);
		done();
	}
	personDao.deleteOne(23, callback);
});
