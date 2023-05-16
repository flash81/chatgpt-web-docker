#!/bin/bash

#docker build -t chatgpt:v2 .

cd docker-compose
src=env.dev
des=.env
cat $src > $des
echo "\n解析环境变量！\n"
arr=(`cat $src | awk '{split($1,a,"="); print a[2]}' | grep -o '${.*}' | uniq | awk '{a=index($0,"{");b=index($0,"}");print substr($0,a+1,b-a-1)}'`)
for key in ${arr[@]}
do
	k=${key}
	v=(`cat $src | awk -v key=$k '{split($1,a,"="); if(a[1]==key) print a[2]}'`)
	echo "\n替换k:" $k, "\tv:" $v "\n"
	awk -v val=$v '{gsub(/\${'"$k"'}/, val)}{print $1}' $des > tmp
	cat tmp > $des
	rm tmp
done;
if [ ! -d data/mysql ]
then
echo "\n初始化基础数据库!\n"
docker-compose -f docker-initdb.yml up
docker-compose -f docker-initdb.yml down
fi

echo "\n${PREFIX}初始化完成！\n"
