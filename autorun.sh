#!/bin/bash
function run () {
	count=`echo $* | egrep -o "\d+"`
	for (( i = 0; i < $count; i++ ))
	do
		npm start
	done
}
brew install gnu-sed --default-names
read -p "Input the username you want to star :" name
gsed -r -i "s/username.+/username: "\'$name\'\,"/g" config.js
read -p "Input the repo you want to star :" repo
gsed -r -i "s/repo.+/repo: "\'$repo\'\,"/g" config.js
read -p "Input the count you want to star :" count
gsed -r -i "s/num.+/num: "\'$count\'"/g" config.js
run $count
