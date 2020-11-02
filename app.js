const Koa = require('koa')
const json = require('koa-json')
const KoaRouter = require('koa-router')
const path = require('path')
const render = require('koa-ejs')
const views = require('koa-views')
const serve = require('koa-static')
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport')
const mongoose = require('mongoose')

const app = new Koa()
const router = new KoaRouter()

const db = require('./config/keys').mongoURL
// 链接mongoose
mongoose
    .connect(
        db,
        { useNewUrlParser: true },
    )
    .then(() => console.log('Mongodb connected'))
    .catch((err) => console.log('mongodb错误' + err))

// bodyparser
app.use(bodyParser())
//  views
app.use(views(path.join(__dirname, './view'), {
    extension: 'ejs'
}))

// serve
app.use(serve(__dirname + "/public"))
// json
app.use(json())

// passport
app.use(passport.initialize())
app.use(passport.session())

// 回调到config 文件中 passport.js
require('./config/passport')(passport)

//  -----------luyou
// yinru
const users = require('./routes/api/users')
const profiles = require('./routes/api/profiles')
router.get('/', async ctx => {
    ctx.body = { msg: 'bet' }
})
// 
// 配置路由router
router.use('/api/users', users)
router.use('/api/profiles', profiles)

app.use(router.routes()).use(router.allowedMethods())
const port = process.env.PORT || 4883

app.listen(port, () => {
    // console.log('run 4883') 
    console.log(`run      serve: ${port}`)
})