import { isNotEmptyString } from '../utils/is'
import {check_token, check_token1} from '../utils/mysql'
import moment from "moment";

// import {sent_sms} from '../utils/sms'

const auth = async (req, res, next) => {
  const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
  if (isNotEmptyString(AUTH_SECRET_KEY)) {
    try {
      const Authorization = req.header('Authorization')
			const result = await check_token(Authorization)
			global.userId = result['id']
			let isBefore= moment().isBefore(result['expired_time'])
			if(isBefore == false)
			{
				res.send({ status: 'Fail', message: '会员使用到期，请联系客服微信号：beargpt', data: null })
				return
			}
			const array = ['/upload', '/upload_mask', '/image_generations', '/image_edits', '/image_variation'];

			if (result['can_image'] != 1 && array.indexOf(req.url) !== -1) {
				res.send({ status: 'Fail', message: '没有图像处理权限，请联系客服：beargpt', data: null })
				return
			}
			next()
    }
    catch (error) {
    	console.log(error)
      res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
    }
  }
  else {
    next()
  }
}

export { auth }
