'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store')
Route.post('sessions', 'SessionController.store')
Route.put('updatePassword', 'UserController.update')

Route.group(() => {
  Route.resource('events', 'EventController').apiOnly()
}).middleware(['auth'])
