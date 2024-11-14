import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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

  async findAll(date?: string): Promise<Product[]> {
    try {
      if (date) {
        const searchDate = new Date(date);
        if (isNaN(searchDate.getTime())) {
          throw new BadRequestException('Invalid date format');
        }

        const formattedDate = searchDate.toISOString().split('T')[0];
        
        return await this.tProductsRepository
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
      } else {
        return await this.tProductsRepository
          .createQueryBuilder('product')
          .select([
            'product.id as id',
            'product.name as name',
            'product.original_price as originalPrice',
            'product.discount_price as discountPrice',
            'product.image_url as imageUrl',
            'product.valid_date as validDate'
          ])
          .orderBy('product.created_at', 'DESC')
          .getRawMany();
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.tProductsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`商品ID ${id} 不存在`);
    }
    return product;
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.tProductsRepository.remove(product);
  }

  async update(id: number, updateProductDto: CreateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    const updatedProduct = this.tProductsRepository.merge(product, {
      ...updateProductDto,
      validDate: new Date(updateProductDto.validDate)
    });
    
    return await this.tProductsRepository.save(updatedProduct);
  }
} 