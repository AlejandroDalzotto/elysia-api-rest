import { CommentRepository } from '@/repositories/comment.repository';
import { PostRepository } from '@/repositories/post.repository';
import { MAX_ITEMS_PER_PAGE } from '@/utils/consts';
import { NotFoundError } from 'elysia';

export abstract class CommentService {

  static async findAll(postId: number, limit: number = MAX_ITEMS_PER_PAGE, offset: number = 0) {
    const post = await PostRepository.getById(postId)

    if(!post.id) {
      throw new NotFoundError(`Post ${postId} not found. Please provide a correct id.`)
    }

    const data = CommentRepository.getAll(postId, limit, offset)

    return data
  }

}