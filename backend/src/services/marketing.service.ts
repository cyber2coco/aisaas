import { Injectable } from '@nestjs/common';
import { AiService } from './ai.service';
import { MemoryStorageService } from './memory-storage.service';


@Injectable()
export class MarketingService {
  constructor(
    private memoryStorage: MemoryStorageService,
    private aiService: AiService,
  ) {}

  /**
   * 生成营销内容
   * @param type 营销类型：ad_copy/social/customer/activity
   * @param prompt 提示词/描述
   * @param tenantId 租户ID
   * @param modelId AI 模型 ID（可选）
   */
  async generateMarketing(type: string, prompt: string, tenantId: string, modelId?: string) {
    // 调用AI生成内容
    const result = await this.aiService.generateMarketing(type, prompt, modelId);
    
    // 保存到内存存储
    return this.memoryStorage.createMarketing({
      scene: type,
      platform: 'ai_generated',
      content: result.content,
      tenantId,
      model: result.model,
    });
  }

  /**
   * 获取当前租户的所有营销内容
   * @param tenantId 租户ID
   */
  async getMarketingContents(tenantId: string) {
    return this.memoryStorage.findMarketingByTenantId(tenantId);
  }

  /**
   * 根据ID获取营销内容
   * @param id 营销内容ID
   * @param tenantId 租户ID
   */
  async getMarketingById(id: number, tenantId: string) {
    return this.memoryStorage.findMarketingByIdAndTenantId(id, tenantId);
  }

  /**
   * 删除营销内容
   * @param id 营销内容ID
   * @param tenantId 租户ID
   */
  async deleteMarketing(id: number, tenantId: string) {
    return this.memoryStorage.deleteMarketing(id, tenantId);
  }
}