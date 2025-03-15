import { CommentRepository } from '@/repositories/comment.repository';
import { PostRepository } from '@/repositories/post.repository';
import { MAX_ITEMS_PER_PAGE } from '@/utils/consts';
import { NotFoundError } from 'elysia';

export abstract class CommentService {

  static async findAll(postId: number, limit: number = MAX_ITEMS_PER_PAGE, offset: number = 0) {
    const post = await PostRepository.getById(postId)

    if (!post) {
      throw new NotFoundError(`Post ${postId} not found. Please provide a correct id.`)
    }

    const data = CommentRepository.getAll(postId, limit, offset)

    return data
  }

  static async create(body: string, postId: number, authorId: string) {
    const post = await PostRepository.getById(postId)

    if (!post) {
      throw new NotFoundError(`Post ${postId} not found. Please provide a correct id.`)
    }

    const data = await CommentRepository.save(body, postId, authorId)

    return data
  }

  static async updateLikes(commentId: number, userId: string) {
    const comment = await CommentRepository.getById(commentId)

    if (!comment) {
      throw new NotFoundError(`Comment ${commentId} not found. Please provide a correct id.`)
    }

    const existingLike = await CommentRepository.getLike(commentId, userId)

    if (!existingLike) {
      await CommentRepository.increaseLikes(commentId, userId)
    }
    if (existingLike) {
      await CommentRepository.decreaseLikes(commentId, userId)
    }
  }

}