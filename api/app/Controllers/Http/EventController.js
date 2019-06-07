'use strict'

const Event = use('App/Models/Event')

class EventController {
  /**
   * Show a list of all events
   * GET events
   */
  async index ({ request, response, view }) {
    const events = await Event.query()
      .with('user')
      .fetch()

    return events
  }

  /**
   * Create/save a new event.
   * POST events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const data = request.only(['title', 'location', 'date'])

    try {
      await Event.findByOrFail('date', data.date)

      return response.status(401).send({
        error: {
          message:
            'Não foi possível criar o evento, já existe um evento no mesmo horário'
        }
      })
    } catch (err) {
      const event = await Event.create({ ...data, user_id: auth.user.id })

      return event
    }
  }

  /**
   * Display a single event.
   * GET events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response, auth }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      return response.status(401).send({
        error: {
          message: 'Só o criador pode ter acesso a esse evento'
        }
      })
    }

    await event.load('user')

    return event
  }

  /**
   * Update event details.
   * PUT or PATCH events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {}

  /**
   * Delete a event with id.
   * DELETE events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response, auth }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      return response.status(401).send({
        error: {
          message: 'Só o criador pode ter acesso a esse evento'
        }
      })
    }

    await event.delete()
  }
}

module.exports = EventController
