'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')
Route.post('sessions', 'SessionController.store').validator('Session')
Route.put('updatePassword', 'UserController.update').validator('UpdatePassword')

Route.group(() => {
  Route.resource('events', 'EventController')
    .apiOnly()
    .validator(
      new Map([
        [['events.store'], ['EventStore'], ['events.update'], ['EventUpdate']]
      ])
    )
}).middleware(['auth'])
