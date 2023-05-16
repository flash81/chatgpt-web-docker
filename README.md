### 基于ChatGPT Web docker-compose 部署教程
- 在原来基础上增加会员注册，登录功能,需要后台管理自行用dcat-admin写一个
- ```shell
  # 在docker-compose目录下env.dev配置好OPENAI_API_KEY
  # 初始化
  sh ./script/init.sh
  ```
- ```shell
  # 启动
  sh ./script/start.sh
  ```
浏览器打开 http://localhost

布署到线上https证书

1、把证书下载到docker-compose/etc/nginx/ca目录

2、请修改docker-compose/etc/nginx/conf.d/nginx.conf1为nginx.conf 并修改证书路径，删除dev.conf

有任何不明白加V

![cover](./src/assets/customer.png)

在线体验 https://ai.beargpt.online

更多学习资源 https://beargpt.online
## 赞助

如果你觉得这个项目对你有帮助，并且情况允许的话，可以给我一点点支持，非常感谢支持～

![cover](./wxpay.png)

WeChat Pay

