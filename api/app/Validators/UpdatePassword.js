'use strict'

const Antl = use('Antl')

class UpdatePassword {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      oldPassword: 'required',
      newPassword: 'required|confirmed'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = UpdatePassword
