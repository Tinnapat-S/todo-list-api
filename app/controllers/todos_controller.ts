import type { HttpContext } from '@adonisjs/core/http'
import Todo from '#models/todo'
import { createError } from '@adonisjs/core/exceptions'

export default class TodosController {
  /**
   * Display a list of resource
   */
  async index({ auth }: HttpContext) {
    return Todo.query().where('user_id', auth.user!.id)
  }

  /**
   * Display form to create a new record
   */
  async create({ request, auth }: HttpContext) {
    const { title } = request.only(['title'])
    if (!title) {
      throw createError('Title is required', '1190', 400)
    }
    const todo = await Todo.create({
      userId: auth.user!.id,
      title,
    })
    return todo
  }

  /**
   * Handle form submission for the create action
   */

  /**
   * Show individual record
   */

  /**
   * Edit individual record
   */
  // async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {
    const { title, status }: { title?: string; status?: boolean } = request.only([
      'title',
      'status',
    ])
    if (!title && !status) {
      throw createError('title or status is provided', '1190', 400)
    }

    const todo = await Todo.findOrFail(params.id)
    todo.merge({ title })
    if (status !== undefined) {
      todo.merge({ status })
    }
    await todo.save()

    return todo
  }

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)
    await todo.delete()
    return { message: 'Todo deleted successfully' }
  }
}
