#!/usr/bin/env sh

# npm run build &&

cd dist

git init
git add .
git commit -m 'deploy'

git push -f git@github.com:yujinpan/chatgpt-web.git main:gh-pages
