import { Controller, Post, Get, Delete, Body, Param, Request } from '@nestjs/common';
import { MarketingService } from '../services/marketing.service';

@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  @Post('generate')
  generateMarketing(@Body() body: { type: string; prompt: string; modelId?: string }, @Request() req) {
    console.log('generateMarketing 被调用, type:', body.type, 'model:', body.modelId);
    return this.marketingService.generateMarketing(body.type, body.prompt, req.user.tenantId, body.modelId);
  }

  @Get()
  getMarketingContents(@Request() req) {
    return this.marketingService.getMarketingContents(req.user.tenantId);
  }

  @Get(':id')
  getMarketingById(@Param('id') id: string, @Request() req) {
    return this.marketingService.getMarketingById(+id, req.user.tenantId);
  }

  @Delete(':id')
  deleteMarketing(@Param('id') id: string, @Request() req) {
    return this.marketingService.deleteMarketing(+id, req.user.tenantId);
  }
}