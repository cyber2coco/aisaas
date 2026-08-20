import { Injectable } from '@nestjs/common';
import { AiService } from './ai.service';
import { MemoryStorageService } from './memory-storage.service';


@Injectable()
export class ProductService {
  constructor(
    private memoryStorage: MemoryStorageService,
    private aiService: AiService,
  ) {}

  async analyzeCategory(category: string, modelId?: string) {
    return this.aiService.analyzeCategory(category, modelId);
  }

  async generateProductInfo(name: string, modelId?: string) {
    return this.aiService.generateProductInfo(name, modelId);
  }

  async createProduct(data: any, tenantId: string) {
    return this.memoryStorage.createProduct({
      ...data,
      tenantId,
    });
  }

  async getProducts(tenantId: string) {
    return this.memoryStorage.findProductsByTenantId(tenantId);
  }

  async getProductById(id: number, tenantId: string) {
    return this.memoryStorage.findProductByIdAndTenantId(id, tenantId);
  }

  async updateProduct(id: number, data: any, tenantId: string) {
    return this.memoryStorage.updateProduct(id, tenantId, data);
  }

  async deleteProduct(id: number, tenantId: string) {
    return this.memoryStorage.deleteProduct(id, tenantId);
  }
}