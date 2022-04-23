const Dao = require("./dao.js");

module.exports = class PersonDao extends Dao
{
	getAll(svar_fra_sql)
	{
		super.query("select navn, alder, adresse from person_test", [], svar_fra_sql);
	}



	getOne(id, svar_fra_sql)
	{
		super.query("select navn, alder, adresse from person_test where id = ?", [id], svar_fra_sql);
	}



	createOne(json, svar_fra_sql)
	{
		let info = [json.navn, json.adresse, json.alder];
		super.query("insert into person_test (navn , adresse , alder) values (?,?,?)", info, svar_fra_sql);
	}



	updateOne(id, json, svar_fra_sql)
	{
		let info = [json.navn, json.adresse, json.alder, id];
		super.query("update person_test set navn = ? , adresse = ? , alder = ? where id = ?", info, svar_fra_sql);
	}



	deleteOne(alder, svar_fra_sql)
	{
		super.query("delete from person_test where alder = ?", [alder], svar_fra_sql);
	}
};
