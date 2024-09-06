import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Movie extends BaseModel {
  @column({ isPrimary: true })
  declare movieId: number

  @column()
  declare status: boolean

  @column()
  declare title: string

  @column()
  declare movieName: string

  @column()
  declare movieImg: string

  @column({ serializeAs: null })
  declare userId: number

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>
}
