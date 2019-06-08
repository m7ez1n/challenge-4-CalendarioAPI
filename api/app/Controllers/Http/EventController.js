'use strict'

const moment = require('moment')
const Event = use('App/Models/Event')

class EventController {
  /**
   * Show a list of all events
   * GET events
   */
  async index ({ request, response, view }) {
    const { page, date } = request.get()

    let query = Event.query().with('user')

    if (date) {
      query = query.whereRaw(`"date"::date = ?`, date)
    }

    const events = await query.paginate(page)

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
  async update ({ params, request, response, auth }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      return response.status(401).send({
        error: {
          message: 'Só o criador pode ter acesso a esse evento'
        }
      })
    }

    const passed = moment().isAfter(event.date)

    if (passed) {
      return response.status(401).send({
        error: {
          message: 'Esse evento já passou, impossível editar!'
        }
      })
    }

    const data = request.only(['title', 'location', 'date'])

    try {
      const event = await Event.findByOrFail('date', data.date)

      if (event.id !== Number(params.id)) {
        return response.status(401).send({
          error: {
            message: 'Impossível definir dois eventos no mesmo horário!'
          }
        })
      }
    } catch (err) {}

    event.merge(data)

    await event.save()

    return event
  }

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

    const passed = moment().isAfter(event.date)

    if (passed) {
      return response.status(401).send({
        error: {
          message: 'Esse evento já passou, impossível excluir!'
        }
      })
    }

    await event.delete()
  }
}

module.exports = EventController
