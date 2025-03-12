import { PostRepository } from '@/repositories/post.repository';
import { MAX_ITEMS_PER_PAGE } from '@/utils/consts';
import type { InsertPost } from '@/db/schema/posts.sql';

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
    const data = await PostRepository.getById(id)

    return data
  }

  static async create(body: InsertPost) {
    const data = await PostRepository.save(body)

    return data
  }

}