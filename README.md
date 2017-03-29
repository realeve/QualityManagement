# quality manager website

> ES6 + Vue + VueX + Vue-Router + ElementUI

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


// 本次更新注意：article表单增加 receiver字段  varchar(max), 搜索接口条件增加 title+content like'%keyword%',服务端删除及更新接口调整