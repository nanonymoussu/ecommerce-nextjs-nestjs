import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from '../entities/category.entity';

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: number;
  isActive?: boolean;
  sortOrder?: number;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Check if slug already exists
    const existingSlug = await this.categoryRepository.findOne({
      where: { slug: createCategoryDto.slug },
    });

    if (existingSlug) {
      throw new ConflictException('Category with this slug already exists');
    }

    // Verify parent category exists if parentId is provided
    if (createCategoryDto.parentId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: createCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['parent', 'children', 'products'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findActive(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isActive: true },
      relations: ['children'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'products'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['parent', 'children', 'products'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    // Check for slug conflicts if slug is being updated
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existingSlug = await this.categoryRepository.findOne({
        where: { slug: updateCategoryDto.slug },
      });

      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    // Verify parent category exists if parentId is being updated
    if (updateCategoryDto.parentId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: updateCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }

      // Prevent circular reference
      if (updateCategoryDto.parentId === id) {
        throw new ConflictException('Category cannot be its own parent');
      }
    }

    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);

    // Check if category has products
    if (category.products && category.products.length > 0) {
      throw new ConflictException(
        'Cannot delete category with existing products',
      );
    }

    // Check if category has children
    if (category.children && category.children.length > 0) {
      throw new ConflictException('Cannot delete category with subcategories');
    }

    await this.categoryRepository.remove(category);
  }

  async getHierarchy(): Promise<Category[]> {
    const rootCategories = await this.categoryRepository.find({
      where: { parent: IsNull(), isActive: true },
      relations: ['children'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });

    return this.buildHierarchy(rootCategories);
  }

  private async buildHierarchy(categories: Category[]): Promise<Category[]> {
    for (const category of categories) {
      if (category.children && category.children.length > 0) {
        category.children = await this.buildHierarchy(category.children);
      }
    }
    return categories;
  }
}
