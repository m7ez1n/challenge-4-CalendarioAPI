'use strict'

const Antl = use('Antl')

class EventStore {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      title: 'required',
      location: 'required',
      date: 'required|date'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = EventStore
