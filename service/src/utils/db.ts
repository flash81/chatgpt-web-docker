// 导入mysql
import mysql from 'mysql2'
import log4js from "log4js"
import log4js_config from '../config/log4js.json'

log4js.configure(log4js_config)
const logger = log4js.getLogger("index");
// 创建连接对象
let connection = null;
function handleDisconnection() {
	connection = mysql.createConnection({
		host: process.env.DB_HOST,
		port: 3306,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
	})
	connection.connect(function(err) {
		if(err){
			throw err;
			setTimeout('handleDisconnection()', 1000);
		}
	});
	connection.on('error', function(err) {
		logger.error(err);
		if(err.code === 'PROTOCOL_CONNECTION_LOST') {
			handleDisconnection();
		}
	});
}

handleDisconnection();

export function query(sql, params) {
	logger.info("sql:", sql, params)
	return new Promise((resolve, reject) =>{
		connection.query(sql, params, (err, data) => {
			if(err)
				resolve(err)
			resolve(data)
		})
		// connect.end()
	})
}
