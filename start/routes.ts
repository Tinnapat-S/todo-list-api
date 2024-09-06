/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import Router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const MoviesController = () => import('#controllers/movies_controller')
const TodosNoAuthController = () => import('#controllers/todos_no_auths_controller')
const TodosController = () => import('#controllers/todos_controller')
const AuthController = () => import('#controllers/auth_controller')

Router.get('/health', ({ response }) => response.ok('OK'))

Router.group(() => {
  Router.get('/', [TodosController, 'index'])
  Router.post('/', [TodosController, 'create'])
  Router.patch('/:id', [TodosController, 'update'])
  Router.delete('/:id', [TodosController, 'destroy'])
})
  .prefix('api/v2/todo-protect')
  .middleware(middleware.auth())

Router.group(() => {
  Router.post('/login', [AuthController, 'login'])
  Router.post('/register', [AuthController, 'register'])
  Router.get('/me', [AuthController, 'getMe']).middleware(middleware.auth())
}).prefix('api/auth')

Router.group(() => {
  Router.get('/', [TodosNoAuthController, 'index'])
  Router.get('/:id', [TodosNoAuthController, 'show'])
  Router.post('/', [TodosNoAuthController, 'create'])
  Router.patch('/:id', [TodosNoAuthController, 'edit'])
  Router.delete('/:id', [TodosNoAuthController, 'destroy'])
}).prefix('api/v1/todo')

Router.group(() => {
  Router.get('/', [MoviesController, 'index'])
  Router.get('/:id', [MoviesController, 'show'])
  Router.post('/', [MoviesController, 'create'])
  Router.patch('/:id', [MoviesController, 'update'])
  Router.delete('/:id', [MoviesController, 'destroy'])
})
  .prefix('api/v3/movies')
  .middleware(middleware.auth())
