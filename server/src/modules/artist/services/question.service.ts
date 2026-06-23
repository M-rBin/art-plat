import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma.service';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async listQuestions() {
    return this.prisma.artistQuestion.findMany({
      where: { status: 1 },
      select: { id: true, contentFr: true, contentZh: true },
      orderBy: { sortOrder: 'asc' },
      take: 100,
    });
  }
}
