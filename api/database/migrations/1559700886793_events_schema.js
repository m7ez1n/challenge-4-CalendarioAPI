'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventsSchema extends Schema {
  up () {
    this.create('events', table => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .string('title', 25)
        .notNullable()
        .unique()
      table.text('description').notNullable()
      table
        .string('location', 80)
        .notNullable()
        .unique()
      table.timestamp('date')
      table.timestamps()
    })
  }

  down () {
    this.drop('events')
  }
}

module.exports = EventsSchema
