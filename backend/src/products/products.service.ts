import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Product, ProductStatus } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Check if SKU already exists
    const existingProduct = await this.productRepository.findOne({
      where: { sku: createProductDto.sku },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this SKU already exists');
    }

    // Check if slug already exists
    const existingSlug = await this.productRepository.findOne({
      where: { slug: createProductDto.slug },
    });

    if (existingSlug) {
      throw new ConflictException('Product with this slug already exists');
    }

    // Verify category exists
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(queryDto: QueryProductsDto) {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      status,
      isFeatured,
      minPrice,
      maxPrice,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      inStock,
    } = queryDto;

    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.reviews', 'reviews');

    // Search filter
    if (search) {
      query.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search OR product.tags ::text ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Category filter
    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    // Status filter
    if (status) {
      query.andWhere('product.status = :status', { status });
    }

    // Featured filter
    if (isFeatured !== undefined) {
      query.andWhere('product.isFeatured = :isFeatured', { isFeatured });
    }

    // Price range filter
    if (minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // Tags filter
    if (tags && tags.length > 0) {
      query.andWhere('product.tags && :tags', { tags });
    }

    // Stock filter
    if (inStock !== undefined) {
      if (inStock) {
        query.andWhere(
          '(product.trackInventory = false OR product.inventory > 0)',
        );
      } else {
        query.andWhere(
          'product.trackInventory = true AND product.inventory = 0',
        );
      }
    }

    // Sorting
    const validSortFields = [
      'createdAt',
      'updatedAt',
      'name',
      'price',
      'salesCount',
      'averageRating',
      'viewCount',
    ];

    if (validSortFields.includes(sortBy)) {
      query.orderBy(`product.${sortBy}`, sortOrder);
    } else {
      query.orderBy('product.createdAt', 'DESC');
    }

    // Pagination
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [products, total] = await query.getManyAndCount();

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'reviews', 'reviews.user'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Increment view count
    await this.productRepository.increment({ id }, 'viewCount', 1);

    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['category', 'reviews', 'reviews.user'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Increment view count
    await this.productRepository.increment({ id: product.id }, 'viewCount', 1);

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // Check for SKU conflicts if SKU is being updated
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingProduct = await this.productRepository.findOne({
        where: { sku: updateProductDto.sku },
      });

      if (existingProduct && existingProduct.id !== id) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    // Check for slug conflicts if slug is being updated
    if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
      const existingSlug = await this.productRepository.findOne({
        where: { slug: updateProductDto.slug },
      });

      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException('Product with this slug already exists');
      }
    }

    // Verify category exists if categoryId is being updated
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async updateInventory(id: number, quantity: number): Promise<Product> {
    const product = await this.findOne(id);

    if (product.trackInventory) {
      if (product.inventory + quantity < 0) {
        throw new BadRequestException('Insufficient inventory');
      }
      product.inventory += quantity;
    }

    return this.productRepository.save(product);
  }

  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    return this.productRepository.find({
      where: { isFeatured: true, status: ProductStatus.ACTIVE },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getRelatedProducts(
    productId: number,
    limit: number = 5,
  ): Promise<Product[]> {
    const product = await this.findOne(productId);

    return this.productRepository.find({
      where: {
        categoryId: product.categoryId,
        id: Not(productId),
        status: ProductStatus.ACTIVE,
      },
      relations: ['category'],
      order: { salesCount: 'DESC' },
      take: limit,
    });
  }
}
