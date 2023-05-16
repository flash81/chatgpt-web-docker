import fs from 'fs'
import path from 'path'
import express from 'express'
import multer from 'multer'
import { Configuration, OpenAIApi } from 'openai'
import type { RequestProps, RequestVariation } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'
import {RequestEdits, RequestGenerations} from "./types";
import sizeOf from 'image-size'
const app = express()
const router = express.Router()
const date = new Date();
import {find_user, register_user, update_token, user_chat,renewUserToken,admin_config} from './utils/mysql'
import moment from 'moment'
import bcrypt from 'bcryptjs';
import log4js from 'log4js'
import log4js_config from './config/log4js.json'
log4js.configure(log4js_config)
function mkdirsSync(dirname) {
	if (fs.existsSync(dirname)) {
		return true;
	} else {
		if (mkdirsSync(path.dirname(dirname))) {
			fs.mkdirSync(dirname);
			return true;
		}
	}
}
const storage = multer.diskStorage({
  // 配置文件上传后存储的路径
  destination(req, file, cb) {
    // NodeJS的两个全局变量
    // console.log(__dirname);  //获取当前文件在服务器上的完整目录
    // console.log(__filename); //获取当前文件在服务器上的完整路径

		const date_str = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()

		const dir = path.join(__dirname, '../uploads/') + date_str
		mkdirsSync(dir)
    cb(null, dir)
  },
  // 配置文件上传后存储的路径和文件名
  filename(req, file, cb) {

    cb(null, Date.now() + path.extname(file.originalname))
  },
})
const upload = multer({ storage })
app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  try {
    const { prompt, options = {}, systemMessage, temperature, top_p } = req.body as RequestProps
		console.log(prompt,options,systemMessage,temperature,top_p)
    let firstChunk = true
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
      temperature,
      top_p,
    })
		user_chat(global.userId, '/chat-process', prompt);
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})
//注册
router.post('/register', async (req, res) => {
	try {
		const { username, password } = req.body as { username: string, password: string }
		if (!username)
			throw new Error('username is empty')
		if (!password)
			throw new Error('password is empty')
		const results = await find_user(username)

		if(results.length > 0)
			throw new Error('用户已存在')
		const hashpassword = bcrypt.hashSync(password, 10)
		const config = await admin_config('free_day');
		console.log(config)
		if(config.length == 0)
			throw new Error('服务器错误')
		await register_user(username, hashpassword, config[0]['value'])
		const user = await find_user(username)

		res.send({ status: 'Success', message: '注册成功，您将有' + config[0]['value'] + '试用', data: user[0]['remember_token'] })
	}
	catch (error) {
		res.send({ status: 'Fail', message: error.message, data: null })
	}
})
//登录
router.post('/verify', async (req, res) => {
  try {
    const { username, password } = req.body as { username: string, password: string }
    if (!username)
      throw new Error('username is empty')
		if (!password)
			throw new Error('password is empty')

		const results = await find_user(username)

		if(results.length === 0)
			throw new Error('用户不存在')

		await bcrypt.compare(password, results[0]['password'], function(err, result) {
			if (result === true) {
				let isBefore= moment().isBefore(results[0]['expired_time'])
				if(results[0]['status'] != 1)
				{
					res.send({ status: 'Fail', message: '用户禁止登录，请联系客服', data: null })
					return
				// }
				// else if(isBefore == false)
				// {
				// 	res.send({ status: 'Fail', message: '会员使用到期，请联系客服微信号：beargpt增加使用时间', data: null })
				// 	return
				}else{
					const token = renewUserToken(results[0]['id']);
					update_token(results[0]['id'], token)
					res.send({ status: 'Success', message: '登录成功', data: token })
				}
			} else {
				res.send({ status: 'Fail', message: '用户名或密码不配匹', data: null })
				return
			}
		});

  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // 接收上传文件数据 -->
    const imgUrl = req.file.path
		const dimensions = await sizeOf(imgUrl)
		if(dimensions.width != dimensions.height)
				throw new Error('请上传正方式图片,当前为:' + dimensions.width + '*' + dimensions.height)
    res.send({ status: 'Success', message: '上传成功', data: imgUrl })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})
router.post('/upload_mask', upload.single('mask'), async (req, res) => {
	try {
		// 接收上传文件数据 -->
		const imgUrl = req.file.path
		const dimensions = await sizeOf(imgUrl)
		if(dimensions.width != dimensions.height)
			throw new Error('请上传正方式图片,当前为:' + dimensions.width + '*' + dimensions.height)
		res.send({ status: 'Success', message: '上传成功', data: imgUrl })
	}
	catch (error) {
		res.send({ status: 'Fail', message: error.message, data: null })
	}
})

//生成图像
router.post('/image_generations', auth,async (req, res) => {
	const { prompt, n, size } = req.body as RequestGenerations
	try {
		const configuration = new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
		})
		const openai = new OpenAIApi(configuration)
		const response = await openai.createImage({
			prompt: prompt,
			n: n,
			size: size,
		})
		user_chat(global.userId, '/image_generations', prompt);
		return res.send({ status: 'Success', message: '处理成功', data: response.data.data })
	}
	catch (error: any) {
		global.console.log(error)

		return res.send({ status: 'Fail', message: error.message, data: null })
	}
})
//编缉图像
router.post('/image_edits', auth,async (req, res) => {
	const { prompt, image_path, mask_path, n, size } = req.body as RequestEdits
	try {
		const configuration = new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
		})
		const openai = new OpenAIApi(configuration)
		const response = await openai.createImageEdit(
			fs.createReadStream(image_path),
			prompt,
			mask_path?fs.createReadStream(mask_path):'',
			n,
			size
		)
		user_chat(global.userId, '/image_edits', prompt);
		return res.send({ status: 'Success', message: '处理成功', data: response.data.data })
	}
	catch (error: any) {
		global.console.log(error)
		return res.send({ status: 'Fail', message: error.message, data: null })
	}
})
//以图生图
router.post('/image_variation', auth,async (req, res) => {
  const { image_path, n, size } = req.body as RequestVariation
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
    const openai = new OpenAIApi(configuration)
    const response = await openai.createImageVariation(
      fs.createReadStream(image_path),
      n,
      size,
    )
		user_chat(global.userId, '/image_variation', image_path);
    return res.send({ status: 'Success', message: '处理成功', data: response.data.data })
  }
  catch (error: any) {
    global.console.log(error)
    return res.send({ status: 'Fail', message: error.message, data: null })
  }
})

app.use('', router)
app.use('/api', router)
app.set('trust proxy', 1)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
