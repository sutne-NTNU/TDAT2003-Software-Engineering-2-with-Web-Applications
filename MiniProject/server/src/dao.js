module.exports = class Dao
{
	constructor(pool)
	{
		this.pool = pool;
	}



	query(sql, params, callback)
	{
		this.pool.getConnection((err, connection) =>
		{
			if (err)
			{
				callback(500, {error: "error Connecting to Database"});
			}
			else
			{
				connection.query(sql, params, (err, rows) =>
				{
					connection.release();
					if (err)
					{
						console.log(err);
						callback(500, {error: "error querying"});
					}
					else
					{
						if(rows.length === 0){
							callback(404, {error: "not found exception"});
							return;
						}
						callback(200, rows);
					}
				});
			}
		});
	}
};
