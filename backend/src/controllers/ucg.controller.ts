import { Controller, Post, Get, Delete, Body, Param, Request } from '@nestjs/common';
import { UcgService } from '../services/ucg.service';

@Controller('ucg')
export class UcgController {
  constructor(private readonly ucgService: UcgService) {}

  @Post('generate')
  generateUcg(@Body() body: { product: string; type: string; modelId?: string }, @Request() req) {
    return this.ucgService.generateUcg(body.product, body.type, req.user.tenantId, body.modelId);
  }

  @Get()
  getUcgContents(@Request() req) {
    return this.ucgService.getUcgContents(req.user.tenantId);
  }

  @Get(':id')
  getUcgById(@Param('id') id: string, @Request() req) {
    return this.ucgService.getUcgById(+id, req.user.tenantId);
  }

  @Delete(':id')
  deleteUcg(@Param('id') id: string, @Request() req) {
    return this.ucgService.deleteUcg(+id, req.user.tenantId);
  }
}