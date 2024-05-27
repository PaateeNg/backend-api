import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class PaginationService {
  constructor() {}
  async pagination(model: any, query?: PaginationDto, options?: any) {
    const { offSet = 1, limit = 10 } = query;
    const skip = (offSet - 1) * limit;

    const [data, total] = await Promise.all([
      model
        .find({
          ...options,
        })
        .skip(skip)
        .limit(limit > 100 ? 100 : limit),
      model.countDocuments({ ...options }),
    ]);

    return {
      data,
      metadata: { total, offSet, limit, lastPage: Math.ceil(total / limit) },
    };
  }
}
