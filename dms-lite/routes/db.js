const mariadb = require('mariadb');

const pool = mariadb.createPool({
	host: 'localhost',
	user: 'notmorrisjohn',
	password: 'admin1234',
	database: 'dms-lite',
	connectionLimit: 5
});

// Test DB connection
 testDbConnection();

// This will be updated
// CREATE TABLE clusterData(timestamp datetime, duck_id TEXT, message_id TEXT, payload TEXT, path TEXT);

async function testDbConnection() {
	let conn;
	try {
		conn = await pool.getConnection();
		const createTable = await conn.query("CREATE TABLE IF NOT EXISTS clusterData (timestamp DATETIME, duck_id TEXT, topic TEXT, message_id TEXT, payload TEXT, path TEXT, hops INT, duck_type INT)");
		const createCommandsTable = await conn.query("CREATE TABLE IF NOT EXISTS clusterCommands (timestamp TEXT, topic TEXT, payload TEXT)");
		console.log("Checked if table exists");
		const query = await conn.query("INSERT INTO clusterData(timestamp, duck_Id, topic, message_id, payload, path, hops, duck_type) values ('2021-11-14 00:00:00', 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', 1, 1);");
	} catch (err) {
		throw err;
	} finally {
		if (conn) return conn.end();
	}
}

function getAllData() {
	const sql = "SELECT timestamp, duck_id, topic, message_id, payload, path, hops, duck_type  FROM clusterData ORDER BY timestamp DESC LIMIT 100;";

	return pool.query(sql).catch((error) => console.log(error));
}

function getDataByDuckId(duckId) {
	const sql = "SELECT timestamp, duck_id, topic, message_id, payload, path, hops, duck_type FROM clusterData WHERE duck_Id = ?;";

	return pool.query(sql, [[1, `${duckId}`]]).catch(error => console.log(error));
}

function getUniqueDucks() {
	const sql = "SELECT DISTINCT duck_id FROM clusterData;"

	return pool.query(sql).catch(error => console.log(error));
}

function getLastCount(count) {
	let sql = "SELECT timestamp, duck_id, topic, message_id, payload, path, hops, duck_type FROM clusterData ORDER BY timestamp DESC LIMIT ?;";

	return pool.query(sql, [[1, count]]).catch(error => console.log(error));
}

function getDuckPlusData() {
	const sql = `SELECT p.timestamp, p.duck_id, p.topic, p.message_id, p.payload, p.path, p.hops, p.duck_type
		FROM
		(
			SELECT ROW_NUMBER() OVER ( PARTITION BY duck_id ORDER BY timestamp DESC )
				RowNum, timestamp, duck_id, topic, message_id, payload, path, hops, duck_type
			FROM clusterData
		) p
		WHERE p.RowNum = 1;`;

	return pool.query(sql).catch(error => console.log(error));
}

function postCommand(topic, payload) {
	console.log(payload);
	const sql = "INSERT INTO clusterCommands VALUES (?,?,?);";
	pool.query(sql, [new Date().toISOString(),topic,payload]);
	return true;
}

// Functions for the map
function getAllRescueesLocation() {
	const sql = "SELECT t1.*\
	FROM clusterData t1\
	JOIN (\
		SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(payload, '*', 1), '*', -1) AS id, MAX(timestamp) AS max_timestamp\
		FROM clusterData\
		WHERE topic = 'gps'\
		GROUP BY id\
	) t2 ON t1.timestamp = t2.max_timestamp AND SUBSTRING_INDEX(SUBSTRING_INDEX(t1.payload, '*', 1), '*', -1) = t2.id AND t1.topic = 'gps'\
	WHERE t1.topic = 'gps';"

	return pool.query(sql).catch(error => console.log(error));
}



function getRescueeDetail(clientId) {
	const sql = `SELECT *\
	FROM clusterData\
	WHERE topic = 'portal' AND SUBSTRING_INDEX(SUBSTRING_INDEX(payload, '*', 1), '*', -1) = '${clientId}'\
	ORDER BY timestamp DESC\
	LIMIT 1;`

	return pool.query(sql).catch(error => console.log(error));
}

// Functions for adding mock data
function insertToClusterData(duck_id, topic, message_id, payload, path, hops, duck_type) {	
	
	console.log("pumasok bai");
	const sql = "INSERT INTO clusterData(timestamp, duck_Id, topic, message_id, payload, path, hops, duck_type) values (?, ?, ?, ?, ?, ?, ?, ?);";

	pool.query("INSERT INTO clusterData (timestamp, duck_Id, topic, message_id, payload, path, hops, duck_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",  [new Date(), duck_id, topic, message_id, payload, path, hops, duck_type])
		.then(result => {
			console.log(`Rows inserted: ${result.affectedRows}`);
			return `Rows inserted: ${result.affectedRows}`;
		})
		.catch(err => {
			console.error(err);
			return err;
		});
	

}

function socketTestDB() {

}

module.exports = { getAllData, getDataByDuckId, getUniqueDucks, getLastCount, getDuckPlusData, postCommand, insertToClusterData, getAllRescueesLocation, socketTestDB, getRescueeDetail };
