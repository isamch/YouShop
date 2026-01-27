import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '../entities/stock.entity';
import { CreateStockDto, AdjustStockDto } from '../dto/stock.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) { }

  async createStock(createStockDto: CreateStockDto): Promise<Stock> {
    const stock = this.stockRepository.create({
      skuId: createStockDto.skuId,
      availableQuantity: createStockDto.quantity || 0,
      reservedQuantity: 0,
      totalQuantity: createStockDto.quantity || 0,
      isActive: true,
    });

    return await this.stockRepository.save(stock);
  }

  async findBySkuId(skuId: string): Promise<Stock[]> {
    return await this.stockRepository.find({
      where: { skuId, isActive: true },
      relations: ['sku'],
    });
  }

  async adjustStock(adjustStockDto: AdjustStockDto): Promise<Stock> {
    const stock = await this.stockRepository.findOne({
      where: { skuId: adjustStockDto.skuId },
    });

    if (!stock) {
      throw new NotFoundException(`Stock not found for SKU ${adjustStockDto.skuId}`);
    }

    const newQuantity = stock.availableQuantity + adjustStockDto.quantity;
    stock.availableQuantity = newQuantity;
    stock.totalQuantity = newQuantity + stock.reservedQuantity;

    return await this.stockRepository.save(stock);
  }

  async getLowStockItems(threshold: number = 10): Promise<Stock[]> {
    return await this.stockRepository
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.sku', 'sku')
      .where('stock.isActive = :isActive', { isActive: true })
      .andWhere('stock.availableQuantity <= :threshold', { threshold })
      .getMany();
  }

  async reserveStock(reserveStockDto: any): Promise<void> {
    const stock = await this.stockRepository.findOne({
      where: { skuId: reserveStockDto.skuId },
    });

    if (!stock) {
      throw new NotFoundException(`Stock not found for SKU ${reserveStockDto.skuId}`);
    }

    if (stock.availableQuantity < reserveStockDto.quantity) {
      throw new Error('Insufficient stock');
    }

    stock.availableQuantity -= reserveStockDto.quantity;
    stock.reservedQuantity += reserveStockDto.quantity;

    await this.stockRepository.save(stock);
  }

  async releaseStock(releaseStockDto: any): Promise<void> {
    const stock = await this.stockRepository.findOne({
      where: { skuId: releaseStockDto.skuId },
    });

    if (!stock) {
      throw new NotFoundException(`Stock not found for SKU ${releaseStockDto.skuId}`);
    }

    stock.availableQuantity += releaseStockDto.quantity;
    stock.reservedQuantity -= releaseStockDto.quantity;

    await this.stockRepository.save(stock);
  }

  async getStockMovements(stockId: string): Promise<any[]> {
    // Simplified: return empty array for now
    return [];
  }
}