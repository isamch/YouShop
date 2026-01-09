import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Stock, StockMovement, StockMovementType } from '../entities/stock.entity';
import { StockReservation, ReservationStatus } from '../entities/stock-reservation.entity';
import { CreateStockDto, UpdateStockDto, ReserveStockDto, ReleaseStockDto, AdjustStockDto } from '../dto/stock.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    @InjectRepository(StockMovement)
    private stockMovementRepository: Repository<StockMovement>,
    @InjectRepository(StockReservation)
    private reservationRepository: Repository<StockReservation>,
    private dataSource: DataSource,
  ) {}

  async createStock(createStockDto: CreateStockDto): Promise<Stock> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const stock = this.stockRepository.create({
        ...createStockDto,
        totalQuantity: createStockDto.availableQuantity,
        reservedQuantity: 0,
        lastMovementDate: new Date(),
      });

      const savedStock = await queryRunner.manager.save(stock);

      // Create initial stock movement
      const movement = this.stockMovementRepository.create({
        stockId: savedStock.id,
        skuId: savedStock.skuId,
        type: StockMovementType.INITIAL,
        quantity: createStockDto.availableQuantity,
        previousQuantity: 0,
        newQuantity: createStockDto.availableQuantity,
        performedBy: 'system',
        reason: 'Initial stock creation',
      });

      await queryRunner.manager.save(movement);
      await queryRunner.commitTransaction();

      return savedStock;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findBySkuId(skuId: string): Promise<Stock[]> {
    return this.stockRepository.find({
      where: { skuId, isActive: true },
      relations: ['sku'],
      order: { createdAt: 'DESC' },
    });
  }

  async reserveStock(reserveStockDto: ReserveStockDto): Promise<StockReservation> {
    const { skuId, orderId, quantity, reservedBy, expirationMinutes = 30 } = reserveStockDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find available stock
      const stock = await queryRunner.manager.findOne(Stock, {
        where: { skuId, isActive: true },
        lock: { mode: 'pessimistic_write' },
      });

      if (!stock) {
        throw new NotFoundException(`No stock found for SKU ${skuId}`);
      }

      if (stock.availableQuantity < quantity) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${stock.availableQuantity}, Requested: ${quantity}`
        );
      }

      // Update stock quantities
      stock.availableQuantity -= quantity;
      stock.reservedQuantity += quantity;
      stock.lastMovementDate = new Date();

      await queryRunner.manager.save(stock);

      // Create reservation
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);

      const reservation = this.reservationRepository.create({
        skuId,
        stockId: stock.id,
        orderId,
        quantity,
        status: ReservationStatus.ACTIVE,
        expiresAt,
        reservedBy,
      });

      const savedReservation = await queryRunner.manager.save(reservation);

      // Create stock movement
      const movement = this.stockMovementRepository.create({
        stockId: stock.id,
        skuId,
        type: StockMovementType.RESERVATION,
        quantity: -quantity,
        previousQuantity: stock.availableQuantity + quantity,
        newQuantity: stock.availableQuantity,
        orderId,
        reservationId: savedReservation.id,
        performedBy: reservedBy,
        reason: 'Stock reserved for order',
      });

      await queryRunner.manager.save(movement);
      await queryRunner.commitTransaction();

      return savedReservation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async releaseStock(releaseStockDto: ReleaseStockDto): Promise<void> {
    const { reservationId, reason } = releaseStockDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const reservation = await queryRunner.manager.findOne(StockReservation, {
        where: { id: reservationId, status: ReservationStatus.ACTIVE },
        lock: { mode: 'pessimistic_write' },
      });

      if (!reservation) {
        throw new NotFoundException(`Active reservation ${reservationId} not found`);
      }

      const stock = await queryRunner.manager.findOne(Stock, {
        where: { id: reservation.stockId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!stock) {
        throw new NotFoundException(`Stock ${reservation.stockId} not found`);
      }

      // Update stock quantities
      stock.availableQuantity += reservation.quantity;
      stock.reservedQuantity -= reservation.quantity;
      stock.lastMovementDate = new Date();

      await queryRunner.manager.save(stock);

      // Update reservation
      reservation.status = ReservationStatus.CANCELLED;
      reservation.cancelledAt = new Date();
      reservation.reason = reason || 'Stock released';

      await queryRunner.manager.save(reservation);

      // Create stock movement
      const movement = this.stockMovementRepository.create({
        stockId: stock.id,
        skuId: reservation.skuId,
        type: StockMovementType.RELEASE,
        quantity: reservation.quantity,
        previousQuantity: stock.availableQuantity - reservation.quantity,
        newQuantity: stock.availableQuantity,
        orderId: reservation.orderId,
        reservationId: reservation.id,
        performedBy: 'system',
        reason: reason || 'Stock released',
      });

      await queryRunner.manager.save(movement);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async adjustStock(adjustStockDto: AdjustStockDto): Promise<Stock> {
    const { skuId, locationId, quantity, type, performedBy, reason, notes } = adjustStockDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const stock = await queryRunner.manager.findOne(Stock, {
        where: { skuId, locationId, isActive: true },
        lock: { mode: 'pessimistic_write' },
      });

      if (!stock) {
        throw new NotFoundException(`Stock not found for SKU ${skuId} at location ${locationId}`);
      }

      const previousQuantity = stock.availableQuantity;
      const newQuantity = Math.max(0, previousQuantity + quantity);

      stock.availableQuantity = newQuantity;
      stock.totalQuantity = newQuantity + stock.reservedQuantity;
      stock.lastMovementDate = new Date();

      const updatedStock = await queryRunner.manager.save(stock);

      // Create stock movement
      const movement = this.stockMovementRepository.create({
        stockId: stock.id,
        skuId,
        type,
        quantity,
        previousQuantity,
        newQuantity,
        performedBy,
        reason,
        notes,
      });

      await queryRunner.manager.save(movement);
      await queryRunner.commitTransaction();

      return updatedStock;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getStockMovements(stockId: string): Promise<StockMovement[]> {
    return this.stockMovementRepository.find({
      where: { stockId },
      order: { createdAt: 'DESC' },
    });
  }

  async getLowStockItems(threshold?: number): Promise<Stock[]> {
    const queryBuilder = this.stockRepository
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.sku', 'sku')
      .where('stock.isActive = :isActive', { isActive: true })
      .andWhere('sku.trackQuantity = :trackQuantity', { trackQuantity: true });

    if (threshold) {
      queryBuilder.andWhere('stock.availableQuantity <= :threshold', { threshold });
    } else {
      queryBuilder.andWhere('stock.availableQuantity <= stock.reorderPoint');
    }

    return queryBuilder.getMany();
  }
}