const express = require("express");
const nettside = express();
const bodyParser = require("body-parser");
nettside.use(bodyParser.json());
const mysql = require("mysql");
const pool = mysql.createPool({
	connectionLimit: 2,
	host: "mysql.stud.iie.ntnu.no",
	user: "sivertut",
	password: "0nDGMHSd",
	database: "sivertut",
	debug: false
});
const server = nettside.listen(1337);

//forside??       //hent alle viktige artikler
nettside.get("/GV", (req, res) =>
{
	pool.getConnection((err, connection) =>
	{
		if (err)
		{
			console.log("Feil ved kobling til databasen");
			res.json({error: "feil ved oppkobling"});
		}
		else
		{
			connection.query("select overskrift, innhold, tidspunkt, bilde, kategori, viktighet from artikkel where viktighet = 1 ",
				(err, rows) =>
				{
					connection.release();
					if (err)
					{
						console.log(err);
						res.json({error: "error querying"});
					}
					else
					{
						res.json(rows);
					}
				}
			);
		}
	});
});

//hent alle artikler
nettside.get("/GV/artikler", (req, res) =>
{
	pool.getConnection((err, connection) =>
	{
		if (err)
		{
			console.log("Feil ved kobling til databasen");
			res.json({error: "feil ved oppkobling"});
		}
		else
		{
			connection.query("select id, overskrift, innhold, tidspunkt, bilde, kategori, viktighet from artikkel ",
				(err, rows) =>
				{
					connection.release();
					if (err)
					{
						console.log(err);
						res.json({error: "error querying"});
					}
					else
					{
						res.json(rows);
					}
				}
			);
		}
	});
});

//legg ut en ny artikkel
nettside.post("/GV/artikler", (req, res) =>
{
	pool.getConnection((err, connection) =>
	{
		if (err)
		{
			console.log("Feil ved oppkobling");
			res.json({error: "feil ved oppkobling"});
		}
		else
		{
			let val = [req.body.overskrift, req.body.innhold, req.body.bilde, req.body.kategori, req.body.viktighet];
			connection.query("insert into artikkel (overskrift, innhold, bilde, kategori, viktighet) values (?, ?, ?, ?, ?)", val,
				err =>
				{
					if (err)
					{
						console.log(err);
						res.status(500);
						res.json({error: "Feil ved insert"});
					}
					else
					{
						console.log("artikkel lagt inn");
						res.send("artikkel lagt inn");
					}
				}
			);
		}
	});
});

//hent alle artikler innen en kategori
nettside.get("/GV/:kategori", (req, res) =>
{
	pool.getConnection((err, connection) =>
	{
		if (err)
		{
			console.log("Feil ved kobling til databasen");
			res.json({error: "feil ved oppkobling"});
		}
		else
		{
			let val = [req.params.kategori];
			connection.query("select overskrift, innhold, tidspunkt, bilde, kategori, viktighet from artikkel where kategori = ? ", val,
				(err, rows) =>
				{
					connection.release();
					if (err)
					{
						console.log(err);
						res.json({error: "error querying"});
					}
					else
					{
						res.json(rows);
					}
				}
			);
		}
	});
});

//hent en spesifikk artikkel
nettside.get("/GV/artikkel/:id", (req, res) =>
{
	pool.getConnection((err, connection) =>
	{
		if (err)
		{
			console.log("Feil ved kobling til databasen");
			res.json({error: "feil ved oppkobling"});
		}
		else
		{
			let val = [req.params.id];
			connection.query("select overskrift, innhold, tidspunkt, bilde, kategori, viktighet from artikkel where id = ?", val,
				(err, row) =>
				{
					connection.release();
					if (err)
					{
						console.log(err);
						res.json({error: "error querying"});
					}
					else
					{
						res.json(row);
					}
				}
			);
		}
	});
});

//oppdatre en artikkel
nettside.put("/GV/artikkel/:id", (req, res) =>
{
	pool.getConnection((err, connection) =>
	{
		if (err)
		{
			console.log("Feil ved oppkobling");
			res.json({error: "feil ved oppkobling"});
		}
		else
		{
			let val = [req.body.overskrift, req.body.innhold, req.body.bilde, req.body.kategori, req.body.viktighet, req.params.id];
			connection.query("update artikkel set overskrift = ?, innhold = ?, bilde = ?, kategori = ?, viktighet = ? where id = ?", val,
				err =>
				{
					if (err)
					{
						console.log(err);
						res.status(500);
						res.json({error: "Feil ved update"});
					}
					else
					{
						console.log("artikkel oppdatert");
						res.send("artikkel oppdatert");
					}
				}
			);
		}
	});
});

//slett en artikkel
nettside.delete("/GV/artikkel/:id", (req, res) =>
{
	pool.getConnection((err, connection) =>
	{
		if (err)
		{
			console.log("Feil ved oppkobling");
			res.json({error: "feil ved oppkobling"});
		}
		else
		{
			let val = [req.params.id];
			connection.query("delete from artikkel where id = ?", val,
				err =>
				{
					if (err)
					{
						console.log(err);
						res.status(500);
						res.json({error: "Feil ved delete"});
					}
					else
					{
						console.log("artikkel slettet");
						res.send("artikkel slettet");
					}
				}
			);
		}
	});
});


