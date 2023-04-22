const fs = require('fs');

module.exports = function run(filename, pool, done) {
  let sql = fs.readFileSync(filename, 'utf8');
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('runsqlfile: error connecting: ' + err);
      done();
    } else {
      connection.query(sql, (err) => {
        connection.release();
        if (err) {
          console.log(err);
          done();
        } else {
          done();
        }
      });
    }
  });
};
