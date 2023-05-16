import SMSClient from '@alicloud/sms-sdk'

const sent_sms = async (phoneNum: string, res) => {
	let accessKeyId = "";// AccessKey ID
	let secretAccessKey = "";// AccessKey Secret
	let signName = ""; // 签名名称
	let templateCode = "";// 短信模板code
	// 初始化sms_client
	const smsClient = new SMSClient({accessKeyId, secretAccessKey})

	// 生成六位随机验证码
	let smsCode = Math.random().toString().slice(-6);
	console.log("smsCode:", smsCode);

	// 开始发送短信
	const result = await smsClient.sendSMS({
		PhoneNumbers: phoneNum,
		SignName: signName, //签名名称 前面提到要准备的
		TemplateCode: templateCode, //模版CODE  前面提到要准备的
		// TemplateParam: `{"code":'${str}'}`, // 短信模板变量对应的实际值，JSON格式
		TemplateParam: `{"code":'${smsCode}'}`, // 短信模板变量对应的实际值，JSON格式
	}).then(result => {
		console.log("result：", result)
		let {Code} = result;
		if (Code == 'OK') {
			res({
				code: 0,
				msg: 'success',
				sms: smsCode
			})
			console.log("result:", result);
		}
	}).catch(err => {
		console.log("报错：", err);
		res({
			code: 1,
			msg: 'fail: ' + err.data.Message
		})
	})
}
export {sent_sms}
