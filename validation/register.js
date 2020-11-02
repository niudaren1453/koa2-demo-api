const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
    let errors = {}
    if (!Validator.isLength(data.name, { min:2, max:30})) {
        errors.name = '名字不能小于2并且不能超过30'
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}