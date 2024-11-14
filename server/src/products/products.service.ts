import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly tProductsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const validDate = new Date(createProductDto.validDate);
      if (isNaN(validDate.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      const product = this.tProductsRepository.create({
        ...createProductDto,
        validDate,
      });
      return await this.tProductsRepository.save(product);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(date: string): Promise<Product[]> {
    try {
      const searchDate = date ? new Date(date) : new Date();
      if (isNaN(searchDate.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      const formattedDate = searchDate.toISOString().split('T')[0];
      
      const products = await this.tProductsRepository
        .createQueryBuilder('product')
        .select([
          'product.id as id',
          'product.name as name',
          'product.original_price as originalPrice',
          'product.discount_price as discountPrice',
          'product.image_url as imageUrl',
          'product.valid_date as validDate'
        ])
        .where('DATE(product.valid_date) = :date', { date: formattedDate })
        .orderBy('product.created_at', 'DESC')
        .getRawMany();

      return products;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
} 