import type { HttpContext } from '@adonisjs/core/http'
import { createError } from '@adonisjs/core/exceptions'
import Todo from '#models/todo'

export default class TodosNoAuthsController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    if (!request.qs().userId) {
      throw createError('?userId={your-id} is required', '1190', 400)
    }
    return Todo.query().where('authenticated', false).where('user_id', request.qs().userId)
  }

  /**
   * Display form to create a new record
   */
  async create({ request }: HttpContext) {
    if (!request.qs().userId) {
      throw createError('User ID is required', '1190', 400)
    }
    const { title, status } = request.only(['title', 'status'])
    if (!title) {
      throw createError('Title is required', '1190', 400)
    }

    const todo = await Todo.create({
      userId: request.qs().userId,
      title,
      status,
    })

    return {
      id: todo.id,
      title: todo.title,
      status: todo.status || false,
    }
  }

  /**
   * Handle form submission for the create action
   */

  /**
   * Show individual record
   */
  async show({ request }: HttpContext) {
    const todoId = request.param('id')
    if (!todoId) {
      throw createError('Todo ID is required', '1190', 400)
    }
    const [todo] = await Todo.query().where('id', todoId).where('authenticated', false)
    return todo
  }

  /**
   * Edit individual record
   */
  async edit({ request }: HttpContext) {
    if (!request.param('id')) {
      throw createError('title ID is required', '1190', 400)
    }
    const { title, status } = request.only(['title', 'status'])
    if (!title) {
      throw createError('Title is required', '1190', 400)
    }
    const todo = await Todo.findOrFail(request.param('id'))
    todo.merge({ title, status })
    await todo.save()

    const returnTodo = await Todo.query().where('id', todo.id).where('authenticated', false).first()

    return returnTodo
  }

  /**
   * Handle form submission for the edit action
   */
  //   async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const todo = await Todo.findOrFail(params.id)
    await todo.delete()

    return { message: 'Todo deleted successfully' }
  }
}
