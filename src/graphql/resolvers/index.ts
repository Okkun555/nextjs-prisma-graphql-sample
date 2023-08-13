import type { Todo, User } from '@prisma/client'

import type {
  MutationAddTodoArgs,
  MutationUpdateTodoArgs,
  RequireFields,
  Resolvers,
} from '@/generated/resolvers-types'

import type { Context } from '../context'

const TITLE_MAX_LENGTH = 100

export const resolvers: Resolvers = {
  Query: {
    todos: async (_: {}, __: {}, { prisma, currentUser }: Context) => {
      if (!currentUser) {
        throw new Error('Not authenticated')
      }

      const todos = await prisma.todo.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true },
        where: { userId: currentUser.id },
      })

      return todos
    },
  },
  Mutation: {
    addTodo: async (
      _: {},
      { title }: RequireFields<MutationAddTodoArgs, 'title'>,
      { prisma, currentUser }: Context
    ) => {
      if (!currentUser) {
        throw new Error('Not authenticated')
      }

      if (title.length > TITLE_MAX_LENGTH) {
        throw new Error(
          `Title must be less than ${TITLE_MAX_LENGTH} characters`
        )
      }

      const todo: Todo & { user: User } = await prisma.todo.create({
        data: { userId: currentUser.id, title },
        include: { user: true },
      })

      return todo
    },
    updateTodo: async (
      _: {},
      { todoId, title, completed },
      { prisma, currentUser }: Context
    ) => {
      if (!currentUser) {
        throw new Error('Not authenticated')
      }

      const targetTodo: Todo | null = await prisma.todo.findUnique({
        where: { id: todoId },
      })
      if (targetTodo?.userId !== currentUser.id) {
        throw new Error('This todo is not yours')
      }

      if (title && title.length > TITLE_MAX_LENGTH) {
        throw new Error(
          `Title must be less than ${TITLE_MAX_LENGTH} characters`
        )
      }

      const todo = await prisma.todo.update({
        where: { id: todoId },
        data: {
          ...(title && { title }),
          ...(completed !== undefined && completed !== null
            ? { completed }
            : {}),
          userId: currentUser.id,
        },
        include: { user: true },
      })

      return todo
    },
    deleteTodo: async (_: {}, { todoId }, { prisma, currentUser }: Context) => {
      if (!currentUser) {
        throw new Error('Not authenticated')
      }

      const targetTodo: Todo | null = await prisma.todo.findUnique({
        where: { id: todoId },
      })
      if (targetTodo?.userId !== currentUser.id) {
        throw new Error('This todo is not yours')
      }

      const todo = await prisma.todo.delete({
        where: { id: todoId },
        include: { user: true },
      })

      return todo
    },
  },
}
