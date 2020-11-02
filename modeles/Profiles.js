const mongoose = require('mongoose'),
    Schema = mongoose.Schema


// 实例化模板
const ProfileSchema = new Schema({
    user: {
        type: String,
        ref: 'users',
        required: true
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    sex: {
        type: Number,
        required: true
    },
    company: {
        type: String,
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true
    },
    bio: {
        type: String
    },
    githubusername: {
        type: String
    },
    experience: [
        {
            current: {
                type: Boolean,
            },
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String
            },
            from: {
                type: String,
                required: true
            },
            to: {
                type: String,
            },
            description: {
                type: String,
            }
        }
    ],
    education: [
        {
            current: {
                type: Boolean,
                default: true
            },
            school: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldofstudy: {
                type: String
            },
            from: {
                type: String,
                required: true
            },
            to: {
                type: String,
            },
            description: {
                type: String,
            }
        }
    ],
    social: {
        wechat: {
            type: String,
        },
        qq: {
            type: String,
        },
        weibo: {
            type: String,
        },
        csdn: {
            type: String,
        }
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)