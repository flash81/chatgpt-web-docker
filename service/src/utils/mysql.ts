import mysql from 'mysql2/promise'
import crypto from 'crypto'
import {query} from './db'
import log4js from "log4js"
import log4js_config from '../config/log4js.json'
import moment from "moment";

log4js.configure(log4js_config)
const logger = log4js.getLogger("index");


async function check_token(token:string) {
	const sql = 'SELECT * FROM `user` WHERE `remember_token` = ? and deleted_at = 0  limit 1'
	const params = [token.replace('Bearer ', '').trim()]
	const res = await query(sql, params)
	console.log(res)
	if(res.length === 0)
		throw new Error('token过期，请重新登录')
	if(res[0]['status'] != 1)
		throw new Error('用户禁止登录，请联系客服')
	// let isBefore= moment().isBefore(res[0]['expired_time'])
	// if(isBefore == false)
	// 	throw new Error('会员到期，请联系客服')
	return res[0]
}

async function find_user(nickname:string) {
	const sql = 'SELECT * FROM `user` WHERE `nickname` = ? and deleted_at = ? limit 1'
	const params = [nickname.trim(), 0]
	return query(sql, params)
}

async function update_token(id: number, token: string) {

	const sql = 'UPDATE `user` SET `remember_token` = ? where id = ?'
	const params = [token, id]
	const res = query(sql, params)
	return token
}
async function admin_config(name: string) {
	const sql = 'select value from `admin_config` where `name` = ? limit 1'
	const params = [name]
	return query(sql, params)
}

async function register_user(nickname: string, password: string, free_day: number) {
	const token = renewUserToken(1)
	const timestamp = Date.now() + '';
	const expired_time = moment().add(free_day, 'd').format('YYYY-MM-DD')
	console.log(expired_time)
	const sql = 'insert into `user` (`nickname`, `password`,`remember_token`,`expired_time`,`created_at`,`updated_at`)values(?, ?, ?, ?, ?, ?)'
	const params = [nickname.trim(), password.trim(), token, expired_time, timestamp.slice(0, 10), timestamp.slice(0, 10)]
	return query(sql, params)
}

async function user_chat(user_id: number, api: string, content: string) {
	const timestamp = Date.now() + '';
	const sql = 'insert into `user_chat` (`user_id`, `api`,`content`,`created_at`,`updated_at`)values(?, ?, ?, ?, ?)'
	const params = [user_id, api, content, timestamp.slice(0, 10), timestamp.slice(0, 10)]
	return query(sql, params)
}

function renewUserToken(id:number)
{
	const randomString = crypto.randomBytes(10).toString('hex').slice(0, 10)
	const hash = crypto.createHash('md5');
	hash.update(id + '-' + randomString);
	const token1 = hash.digest('hex');
	const timestamp = Date.now()+'';
	const t1 = timestamp.slice(0, 5)
	const t2 = timestamp.slice(5, 10)
	const token = t1 + token1 + t2;
	return token;
}
export {
	check_token,
	find_user,
	register_user,
	update_token,
	renewUserToken,
	user_chat,
	admin_config
}
