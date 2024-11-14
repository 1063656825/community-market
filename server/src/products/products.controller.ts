import { Controller, Get, Post, Put, Delete, Body, Query, Param, HttpCode } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('t_products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: CreateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Get()
  async findAll(@Query('date') date: string) {
    return this.productsService.findAll(date);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
} 