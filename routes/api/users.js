const Router = require('koa-router')
const router = new Router()
const gravatar = require('gravatar') // 全球公认头像https://www.npmjs.com/package/gravatar
const tools = require('../../config/tools')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('koa-passport')
// 引入 User模板    
const User = require('../../modeles/User')

// 引入input验证
const validateRegisterInput = require('../../validation/register')
/**
 * @route GET api/user/test
 * @desc 测试接口地址   
 * @access 接口是公开的
 */
router.get('/test', async ctx=> {
    ctx.status = 200
    ctx.body = {msg: 'users works...'}
})

/**
 * @route GET api/users/de
 * @desc 测试接口地址  删除所有的数据 
 * @access 接口是公开的
 */
router.get('/de', async ctx=> {
    const findResult = await User.remove({})
    ctx.body = {msg:"deleteAll"}
    ctx.status = 200

})


/**
 * @route GET api/user/find
 * @desc 测试接口 查询所有user信息使用  查询所有user的骨架
 * @access 接口是公开的
 */
router.get('/find', async ctx=> {
    const findResult = await User.find({}, (err, doc) =>{})
    // console.log(findResult)
    ctx.status = 200
    ctx.body = {findResult}
})


/**
 * @route POST api/user/register
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.post('/register', async ctx=> {
    // 验证方法
    const { errors, isValid } = validateRegisterInput(ctx.request.body)

    if (!isValid) {
        ctx.state = 400
        ctx.body = errors
        return
    }

    console.log(ctx.request.body)
    // ctx.body = ctx.requset.body
    const findResult = await User.find({email: ctx.request.body.email})
    // console.log(findResult)
    if (findResult.length > 0) {
        ctx.status = 500
        ctx.body = { email: '邮箱已被占用'}
    } else {
        // 全球公认头像
        const avatar = gravatar
            .url(ctx.request.body.email, {s: '200', r: 'pg', d: 'mm'}) // mm默认头像
        const newUser = new User({
            name:ctx.request.body.name,
            avatar,
            email:ctx.request.body.email,
            password: tools.enbcrypt(ctx.request.body.password)
        })
        // console.log(newUser)
        // 加密password
        await newUser
            .save()
            .then( user => {
                ctx.body = user
            })
            .catch(err => {
                console.log(err)
            })
            // 返回json
        ctx.body = newUser
    }
})


/**
 * @route POST api/user/register
 * @desc 登录接口地址,返回token 
 * @access 接口是公开的
 */
router.post('/login', async ctx => {
    const findResult = await User.find({email: ctx.request.body.email })
    const user = findResult[0]
    const password = ctx.request.body.password
    // 查询
    if (findResult.length === 0) {   
        ctx.status = 404
        ctx.body = { email:'email不存在' }
        return
    } else {
        var result = await bcrypt.compareSync(password, user.password)
    }
    // 验证通过
    if (result) {
        // 返回token
        const payload = {id: user.id, name: user.name, avatar: user.avatar}
        const token = jwt.sign(payload, keys.secretOrKey , { expiresIn: 3600})
        ctx.status = 200
        ctx.body = { success: true , token: 'Bearer ' + token} // Bearer !!!
    } else {
        ctx.status = 400
        ctx.body = { password: '密码错误'}
    }
})

/**
 * @route POST api/user/register
 * @desc 用户信息接口地址,返回用户信息 
 * @access 接口是公开的
 */
router.get(
    '/current',
    passport.authenticate('jwt',{ session: false}), async ctx => {
        ctx.body = {
            id: ctx.state.user.id,
            name: ctx.state.user.name,
            email: ctx.state.user.email,
            avatar: ctx.state.user.avatar
        }
    })
module.exports = router.routes()    