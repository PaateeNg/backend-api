import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/repository.dto';

@Injectable()
export class RepositoryService {
  constructor() {}
  async pagination(model: any, query?: PaginationDto, options?: any) {
    const { page = 1, size = 10 } = query;
    const skip = (page - 1) * size;

    const [data, total] = await Promise.all([
      model
        .find({
          ...options,
        })
        .skip(skip)
        .limit(size > 100 ? 100 : size),
      model.countDocuments({ ...options }),
    ]);

    return {
      data,
      metadata: { total, page, size, lastPage: Math.ceil(total / size) },
    };
  }
}
