'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)

    return user
  }

  async update ({ request, response, auth: { user } }) {
    const data = request.only(['password', 'oldPassword', 'username'])

    if (data.oldPassword) {
      const isSame = await Hash.verify(data.oldPassword, user.password)

      if (!isSame) {
        return response.status(401).send({
          error: {
            message:
              'Essa é sua senha antiga, ela não é válida. Digite a nova senha!'
          }
        })
      }

      if (!data.password) {
        return response.status(401).send({
          error: {
            message:
              'Você não informou uma nova senha, favor informar uma senha!'
          }
        })
      }

      delete data.oldPassword
    }

    if (!data.password) {
      delete data.password
    }

    user.merge(data)

    await user.save()

    return user
  }
}

module.exports = UserController
