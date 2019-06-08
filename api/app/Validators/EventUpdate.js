'use strict'

const Antl = use('Antl')

class EventUpdate {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      date: 'required|date'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = EventUpdate
