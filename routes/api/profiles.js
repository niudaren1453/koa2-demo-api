const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')


// 引入模板
const Profiles = require('../../modeles/Profiles')

// 引入验证
const validateProfileInput = require('../../validation/profile')
const validateExperienceInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')

/**
 * @route GET api/profiles/test
 * @desc  测试使用
 * @access 接口公开
*/

router.get('/test', async ctx => {
    ctx.state = 200
    ctx.body = { msg: '成功' }
})

/**
 * @route GET api/profiles/find
 * @desc  测试使用
 * @access 接口公开
*/
router.get('/find', async ctx => {
    const findResult = await Profiles.find({}).populate('user', ['name', 'avatar'])
    ctx.status = 200
    ctx.body = { findResult }
})

/**
 * @route GET api/profiles/de
 * @desc  测试使用 删除所有
 * @access 接口公开
*/
router.get('/de', async ctx => {
    const findResult = await Profiles.remove({})
    ctx.status = 200
    ctx.body = { msg: 'deleteAll' }
})


/**
 * @route GET api/profiles
 * @desc  查询用户信息
 * @access 接口私有
*/
router.get(
    '/',
    passport.authenticate('jwt', { session: false }), async ctx => {
        // console.log(ctx.state.user)
        const profile = await Profiles.find({ user: ctx.state.user.id })
            .populate('user', ['name', 'avatar']) // 跨表联查  1 
        console.log(1)
        console.log(profile)
        if (profile.length > 0) {
            ctx.status = 200
            ctx.body = profile
        } else {
            ctx.status = 404
            console.log('该用户无信息')
            ctx.body = { noprofile: '该用户没有任何的信息' }
            return
        }
    })

/**
 * @route GET api/profiles
 * @desc  查询用户信息
 * @access 接口私有
*/

router.post(
    '/',
    passport.authenticate('jwt', { session: false }), async ctx => {
        const { errors, isValid } = validateProfileInput(ctx.request.body)
        if (!isValid) {
            ctx.state = 400
            ctx.body = errors
            return
        }
        const profileFields = {}
        profileFields.user = ctx.state.user.id
        if (ctx.request.body.handle) {
            profileFields.handle = ctx.request.body.handle
        }

        // validation后期
        if (ctx.request.body.sex === 1 || ctx.request.body.sex === 0 ||
            ctx.request.body.sex === '0' || ctx.request.body.sex === '1') {
            profileFields.sex = ctx.request.body.sex
        } else {
            ctx.status = 400
            ctx.body = { msg: '性别非法' }
            return
        }

        if (ctx.request.body.company) {
            profileFields.company = ctx.request.body.company
        }

        if (ctx.request.body.website) {
            profileFields.website = ctx.request.body.website
        }

        if (ctx.request.body.location) {
            profileFields.location = ctx.request.body.location
        }

        if (ctx.request.body.status) {
            profileFields.status = ctx.request.body.status
        }

        if (typeof ctx.request.body.skills !== 'undefined') { // 接收前端传的字符串 类似 run,eat,play
            profileFields.skills = ctx.request.body.skills.split(',')
        }

        if (ctx.request.body.bio) {
            profileFields.bio = ctx.request.body.bio
        }

        if (ctx.request.body.githubusername) {
            profileFields.githubusername = ctx.request.body.githubusername
        }

        if (ctx.request.body.githubusername) {
            profileFields.githubusername = ctx.request.body.githubusername
        }

        profileFields.social = {}
        if (ctx.request.body.wechat) {
            profileFields.social.wechat = ctx.request.body.wechat
        }
        if (ctx.request.body.qq) {
            profileFields.social.qq = ctx.request.body.qq
        }
        if (ctx.request.body.weibo) {
            profileFields.social.weibo = ctx.request.body.weibo
        }
        if (ctx.request.body.csdn) {
            profileFields.social.csdn = ctx.request.body.csdn
        }
        // find
        // console.log('find')
        const profile = await Profiles.find({ user: ctx.state.user.id })
        if (profile.length > 0) {
            // console.log('准备进入更新')
            const profileUpdate = await Profiles.findOneAndUpdate(
                { user: ctx.state.user.id }, // 更新谁
                { $set: profileFields }, // 更新内容
                { new: true } // 新的
            )
            // console.log('更新')
            ctx.status = 200
            ctx.body = profileUpdate
        } else { // 如果没查到的情况下,就是添加
            // console.log('准备进入保存')
            await new Profiles(profileFields)
                .save()
                .then(profile => {
                    ctx.status = 200
                    // console.log('保存中')
                    ctx.body = profile
                    // console.log('保存')
                })
            // console.log('保存结束')
        }
    })


/**
 * @route GET api/profiles/handle?handle=test
 * @desc  通过handle获取个人信息的接口（场景，公开部分?）
 * @access 接口公开
*/
router.get('/handle', async ctx => {
    const handle = ctx.query.handle
    const errors = {}
    const profile = await Profiles.find({ handle: handle })
        .populate('user', ['name', 'avatar'])
    console.log(handle), console.log(profile)
    if (profile.length < 1) {
        errors.noprofile = '未找到该用户'
        ctx.status = 404
        ctx.body = errors
    } else {
        ctx.body = profile[0]
    }
})

/**
 * @route GET api/profiles/user_id?user=48834665
 * @desc  通过user获取个人信息的接口（场景，公开部分?）
 * @access 接口公开
*/
router.get('/user', async ctx => {
    const user_id = ctx.query.user_id
    const errors = {}
    const profile = await Profiles.find({ user: user_id })
        .populate('user', ['name', 'avatar'])
    console.log(user_id), console.log(profile)
    if (profile.length < 1) {
        errors.noprofile = '未找到该用户'
        ctx.status = 404
        ctx.body = errors
    } else {
        ctx.body = profile[0]
    }

})


/**
 * @route POST api/profiles/experience
 * @desc  
 * @access 接口公开
 */
router.post(
    '/experience',
    passport.authenticate('jwt', { session: false }), async ctx => {

        const { errors, isValid } = validateExperienceInput(ctx.request.body)
        if (!isValid) {
            ctx.state = 400
            ctx.body = errors
            return
        }
        const profileFields = {}
        profileFields.experience = []
        const profile = await Profiles.find({ user: ctx.state.user.id })

        if (profile.length > 0) {
            const newExp = {
                current: ctx.request.body.current,
                title: ctx.request.body.title,
                company: ctx.request.body.company,
                location: ctx.request.body.location,
                from: ctx.request.body.from,
                to: ctx.request.body.to,
                description: ctx.request.body.description
            }
            profileFields.experience.unshift(newExp)
            // console.log(profileFields)
            const profileUpdate = await Profiles.update(
                { user: ctx.state.user.id }, // tiaojiang
                { $push: { experience: profileFields.experience } }, // push内容
                { $sort: 1 } // 正序排序
            )
            // ctx.body = profileUpdate
            if (profileUpdate.ok === 1 || profileUpdate.ok === '1') {
                const profile = await Profiles.find({ user: ctx.state.user.id })
                    .populate('user',['name','avatar'])

                if (profile){
                    ctx.status = 200
                    ctx.body = profile
                }
            }
        } else {
            errors.noprofile = '没有用户信息'
            ctx.status = 404
            ctx.body = errors
        }

    })

/**
 * @route POST api/profiles/education
 * @desc  教育地址
 * @access 接口公开
 */
router.post(
    '/education',
    passport.authenticate('jwt', { session: false }), async ctx => {

        const { errors, isValid } = validateEducationInput(ctx.request.body)
        if (!isValid) {
            ctx.state = 400
            ctx.body = errors
            return
        }
        const profileFields = {}
        profileFields.education = []
        const profile = await Profiles.find({ user: ctx.state.user.id })

        if (profile.length > 0) {
            const newEdu = {
                current: ctx.request.body.current,
                school: ctx.request.body.school,
                degree: ctx.request.body.degree,
                fieldofstudy: ctx.request.body.fieldofstudy,
                from: ctx.request.body.from,
                to: ctx.request.body.to,
                description: ctx.request.body.description
            }
            profileFields.education.unshift(newEdu)
            // console.log(profileFields)
            const profileUpdate = await Profiles.findOneAndUpdate(
                { user: ctx.state.user.id }, // 更新谁?tiaojiang
                { $set: profileFields }, // 更新内容
                { new: true } // 新的
            )
            ctx.body = profileUpdate
        } else {
            errors.noprofile = '没有用户信息'
            ctx.status = 404
            ctx.body = errors
        }

    })

/**
 * @route POST api/profiles/education
 * @desc  教育地址
 * @access 接口公开
 */
module.exports = router.routes()