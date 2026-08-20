import { Injectable } from '@nestjs/common';
import { AiService } from './ai.service';
import { MemoryStorageService } from './memory-storage.service';


@Injectable()
export class UcgService {
  constructor(
    private memoryStorage: MemoryStorageService,
    private aiService: AiService,
  ) {}

  /**
   * 生成UCG内容
   * @param product 商品名称
   * @param type UCG类型：buyer_show/video_script/review/qa
   * @param tenantId 租户ID
   * @param modelId AI 模型 ID（可选）
   */
  async generateUcg(product: string, type: string, tenantId: string, modelId?: string) {
    // 调用AI生成内容
    const result = await this.aiService.generateUcg(product, type, modelId);
    
    // 保存到内存存储
    return this.memoryStorage.createUcg({
      productId: 0, // 可以后续关联具体商品
      type,
      content: result.content,
      tenantId,
      model: result.model,
    });
  }

  /**
   * 获取当前租户的所有UCG内容
   * @param tenantId 租户ID
   */
  async getUcgContents(tenantId: string) {
    return this.memoryStorage.findUcgByTenantId(tenantId);
  }

  /**
   * 根据ID获取UCG内容
   * @param id UCG ID
   * @param tenantId 租户ID
   */
  async getUcgById(id: number, tenantId: string) {
    return this.memoryStorage.findUcgByIdAndTenantId(id, tenantId);
  }

  /**
   * 删除UCG内容
   * @param id UCG ID
   * @param tenantId 租户ID
   */
  async deleteUcg(id: number, tenantId: string) {
    return this.memoryStorage.deleteUcg(id, tenantId);
  }
}