import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sku } from '../entities/sku.entity';
import { CreateSkuDto } from '../dto/create-sku.dto';
import { UpdateSkuDto } from '../dto/update-sku.dto';

@Injectable()
export class SkuService {
  constructor(
    @InjectRepository(Sku)
    private skuRepository: Repository<Sku>,
  ) {}

  async create(createSkuDto: CreateSkuDto): Promise<Sku> {
    // Check if SKU code already exists
    const existingSku = await this.skuRepository.findOne({
      where: { code: createSkuDto.code },
    });

    if (existingSku) {
      throw new ConflictException(`SKU with code ${createSkuDto.code} already exists`);
    }

    const sku = this.skuRepository.create(createSkuDto);

    return this.skuRepository.save(sku);
  }

  async findAll(): Promise<Sku[]> {
    return this.skuRepository.find({
      where: { isActive: true },
      relations: ['stocks'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProductId(productId: string): Promise<Sku[]> {
    return this.skuRepository.find({
      where: { productId, isActive: true },
      relations: ['stocks'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Sku> {
    const sku = await this.skuRepository.findOne({
      where: { id, isActive: true },
      relations: ['stocks'],
    });

    if (!sku) {
      throw new NotFoundException(`SKU with ID ${id} not found`);
    }

    return sku;
  }

  async findByCode(code: string): Promise<Sku> {
    const sku = await this.skuRepository.findOne({
      where: { code, isActive: true },
      relations: ['stocks'],
    });

    if (!sku) {
      throw new NotFoundException(`SKU with code ${code} not found`);
    }

    return sku;
  }

  async update(id: string, updateSkuDto: UpdateSkuDto): Promise<Sku> {
    const sku = await this.findOne(id);

    // Check if new code conflicts with existing SKU
    if (updateSkuDto.code && updateSkuDto.code !== sku.code) {
      const existingSku = await this.skuRepository.findOne({
        where: { code: updateSkuDto.code },
      });

      if (existingSku) {
        throw new ConflictException(`SKU with code ${updateSkuDto.code} already exists`);
      }
    }

    Object.assign(sku, updateSkuDto);
    return this.skuRepository.save(sku);
  }

  async remove(id: string): Promise<void> {
    const sku = await this.findOne(id);
    sku.isActive = false;
    await this.skuRepository.save(sku);
  }

  async getLowStockSkus(threshold?: number): Promise<Sku[]> {
    const queryBuilder = this.skuRepository
      .createQueryBuilder('sku')
      .leftJoinAndSelect('sku.stocks', 'stock')
      .where('sku.isActive = :isActive', { isActive: true })
      .andWhere('sku.trackQuantity = :trackQuantity', { trackQuantity: true });

    if (threshold) {
      queryBuilder.andWhere('stock.availableQuantity <= :threshold', { threshold });
    } else {
      queryBuilder.andWhere('stock.availableQuantity <= stock.reorderPoint');
    }

    return queryBuilder.getMany();
  }
}