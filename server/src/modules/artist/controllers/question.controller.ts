import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorators';
import { BaseController } from '@/common/crud';
import { QuestionService } from '../services/question.service';

/**
 * 艺术家问题库控制器
 * 路由前缀 api/questions，公开接口无需鉴权。
 */
@ApiTags('艺术家问题库')
@Controller('api/questions')
export class QuestionController extends BaseController {
  constructor(private readonly questionService: QuestionService) {
    super();
  }

  @Public()
  @Get()
  @ApiOperation({ summary: '获取启用的问题列表' })
  async list() {
    const data = await this.questionService.listQuestions();
    return { code: 0, data, message: 'success' };
  }
}
