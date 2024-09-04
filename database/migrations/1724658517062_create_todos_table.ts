import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'todos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('title').notNullable()
      table.boolean('status').notNullable().defaultTo(false)
      table.boolean('authenticated').notNullable().defaultTo(false)
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
