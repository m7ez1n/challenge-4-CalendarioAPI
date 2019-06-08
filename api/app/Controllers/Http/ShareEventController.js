'use strict'

const Event = use('App/Models/Event')
const Kue = use('Kue')
const Job = use('App/Jobs/ShareEventMail')

class ShareEventController {
  async share ({ request, response, params, auth }) {
    const event = await Event.findOrFail(params.events_id)
    const email = request.input('email')

    if (event.user_id !== auth.user.id) {
      return response.status(401).send({
        error: {
          message: 'Apenas o criador pode compartilhar o evento'
        }
      })
    }

    Kue.dispatch(
      Job.key,
      { email, username: auth.user.username, event },
      { attempts: 3 }
    )

    return email
  }
}

module.exports = ShareEventController
