import type { HttpContext } from '@adonisjs/core/http'
import Movie from '#models/movie'
import { createError } from '@adonisjs/core/exceptions'

export default class MoviesController {
  async index() {
    return Movie.all()
  }

  async show({ request }: HttpContext) {
    const id = request.param('id')
    const movie = await Movie.find(id)
    if (!movie) {
      throw createError('Movie not found', '1190', 404)
    }
    return movie
  }

  async create({ request, auth }: HttpContext) {
    const { title, movieName, movieImg } = request.only(['title', 'movieName', 'movieImg'])
    if (!title || !movieName || !movieImg) {
      throw createError('All key are required', '1190', 400)
    }
    const movie = await Movie.create({
      userId: auth.user!.id,
      title,
      movieName,
      movieImg,
    })
    return movie
  }

  async update({ request }: HttpContext) {
    const id = request.param('id')
    const { title, status } = request.only(['title', 'status'])

    const movie = await Movie.find(id)
    if (!movie) {
      throw createError('Movie not found', '1190', 404)
    }
    movie.merge({
      title,
      status,
    })

    await movie.save()

    return movie
  }

  async destroy({ request }: HttpContext) {
    const id = request.param('id')
    const movie = await Movie.find(id)
    if (!movie) {
      throw createError('Movie not found', '1190', 404)
    }
    await movie.delete()
    return { message: 'Movie deleted successfully' }
  }
}
