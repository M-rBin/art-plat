import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma.service';
import type { CreateQuestionDto, UpdateQuestionDto, QueryQuestionDto } from '../dto/admin-question.dto';

/** 问题库业务错误 */
export class AdminQuestionError extends Error {
  constructor(
    readonly message: string,
    readonly code = 400,
  ) {
    super(message);
  }
}

/** 问题库管理服务（admin 端） */
@Injectable()
export class AdminQuestionService {
  constructor(private readonly prisma: PrismaService) {}

  /** 分页查询问题列表，支持关键词和状态过滤，按 sortOrder 升序 */
  async page(dto: QueryQuestionDto) {
    const { keyword, status, page = 1, pageSize = 10 } = dto;

    const where: Record<string, unknown> = {};

    if (status !== undefined) {
      where.status = status;
    }

    if (keyword?.trim()) {
      where.OR = [
        { contentFr: { contains: keyword.trim() } },
        { contentZh: { contains: keyword.trim() } },
      ];
    }

    const [total, list] = await Promise.all([
      this.prisma.artistQuestion.count({ where }),
      this.prisma.artistQuestion.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return { list, pagination: { page, pageSize, total } };
  }

  /** 新增问题 */
  async create(dto: CreateQuestionDto) {
    return this.prisma.artistQuestion.create({
      data: {
        contentFr: dto.contentFr,
        contentZh: dto.contentZh,
        sortOrder: dto.sortOrder ?? 0,
        status: dto.status ?? 1,
      },
    });
  }

  /** 编辑问题 */
  async update(id: number, dto: UpdateQuestionDto) {
    await this.assertExists(id);
    return this.prisma.artistQuestion.update({
      where: { id },
      data: {
        ...(dto.contentFr !== undefined && { contentFr: dto.contentFr }),
        ...(dto.contentZh !== undefined && { contentZh: dto.contentZh }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });
  }

  /** 切换状态 */
  async updateStatus(id: number, status: number) {
    await this.assertExists(id);
    return this.prisma.artistQuestion.update({
      where: { id },
      data: { status },
    });
  }

  /** 删除问题 */
  async remove(id: number) {
    await this.assertExists(id);
    await this.prisma.artistQuestion.delete({ where: { id } });
  }

  private async assertExists(id: number) {
    const item = await this.prisma.artistQuestion.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!item) throw new AdminQuestionError('问题不存在', 404);
  }
}
