import { PostRepository } from "@/repositories/post.repository";
import { MAX_ITEMS_PER_PAGE } from "@/utils/consts";

export abstract class PostService {

  static async findAll(limit: number = MAX_ITEMS_PER_PAGE, offset: number = 0) {
    const data = await PostRepository.getAll(limit, offset)

    return data
  }

}