import { PostRepository } from '@/repositories/post.repository';
import { MAX_ITEMS_PER_PAGE } from '@/utils/consts';
import type { InsertPost } from '@/db/schema/posts.sql';
import { NotFoundError } from 'elysia';

export abstract class PostService {

  static async findAll(limit: number = MAX_ITEMS_PER_PAGE, offset: number = 0) {
    const data = await PostRepository.getAll(limit, offset)

    return data
  }

  static async findAllByTerm(term: string, limit: number = MAX_ITEMS_PER_PAGE, offset: number = 0) {
    const data = await PostRepository.getAllByFilter({ term }, limit, offset)

    return data
  }

  static async findById(id: number) {
    const post = await PostRepository.getById(id)

    if (!post) {
      throw new NotFoundError(`Post ${id} not found, please provide a valid id.`)
    }

    return post
  }

  static async create(body: InsertPost) {
    const data = await PostRepository.save(body)

    return data
  }

  static async update(body: Partial<InsertPost>, id: number) {
    const data = await PostRepository.update(body, id)

    return data
  }

  static async remove(id: number) {
    const data = await PostRepository.remove(id)

    return data
  }

}