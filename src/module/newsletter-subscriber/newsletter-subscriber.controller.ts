import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { NewsletterService } from '../newsletter-subscriber/newsletter-subscriber.service';
import { CreateNewsletterSubscriberDto } from '../newsletter-subscriber/dto/create-newsletter-subscriber.dto';
import { FilterNewsletterSubscribersDto } from '../newsletter-subscriber/dto/filter-newsletter-subscribers.dto';


@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(
    private readonly newsletterService: NewsletterService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new newsletter subscriber' })
  @ApiResponse({
    status: 201,
    description: 'Subscriber successfully created',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNewsletterSubscriberDto: CreateNewsletterSubscriberDto) {
    const data = await this.newsletterService.create(createNewsletterSubscriberDto);
    return { message: 'Inscrição na newsletter realizada com sucesso!', data };
  }

  @Get()
  @ApiOperation({ summary: 'List newsletter subscribers with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of newsletter subscribers',
  })
  async findAll(@Query() query: FilterNewsletterSubscribersDto) {
    return this.newsletterService.findAll(query);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a newsletter subscriber by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Subscriber removed successfully',
  })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.newsletterService.remove(id);
    return { message: 'Assinante removido com sucesso.' };
  }
}