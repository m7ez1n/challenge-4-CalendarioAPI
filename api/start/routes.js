'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')
Route.post('sessions', 'SessionController.store').validator('Session')

Route.group(() => {
  Route.resource('events', 'EventController')
    .apiOnly()
    .validator(
      new Map([
        [['events.store'], ['EventStore'], ['events.update'], ['EventUpdate']]
      ])
    )

  Route.post('events/:events_id/share', 'ShareEventController.share').validator(
    'EventShare'
  )

  Route.put('users/:id', 'UserController.update').validator('UpdatePassword')
}).middleware(['auth'])
