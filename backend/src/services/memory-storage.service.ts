import { Injectable } from '@nestjs/common';

/**
 * 内存数据存储服务 - 用于开发环境，无需数据库
 */
@Injectable()
export class MemoryStorageService {
  private users: any[] = [];
  private products: any[] = [];
  private ucgContents: any[] = [];
  private marketingContents: any[] = [];
  private counters = {
    users: 0,
    products: 0,
    ucgContents: 0,
    marketingContents: 0,
  };

  // 用户相关
  findUserByUsername(username: string) {
    return this.users.find(u => u.username === username);
  }

  findUserById(id: number) {
    return this.users.find(u => u.id === id);
  }

  createUser(userData: any) {
    const id = ++this.counters.users;
    const now = new Date();
    const user = {
      id,
      ...userData,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(user);
    return user;
  }

  // 商品相关
  findProductsByTenantId(tenantId: string) {
    return this.products
      .filter(p => p.tenantId === tenantId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  findProductByIdAndTenantId(id: number, tenantId: string) {
    return this.products.find(p => p.id === id && p.tenantId === tenantId);
  }

  createProduct(productData: any) {
    const id = ++this.counters.products;
    const now = new Date();
    const product = {
      id,
      ...productData,
      createdAt: now,
      updatedAt: now,
    };
    this.products.push(product);
    return product;
  }

  updateProduct(id: number, tenantId: string, data: any) {
    const index = this.products.findIndex(p => p.id === id && p.tenantId === tenantId);
    if (index === -1) return null;
    this.products[index] = {
      ...this.products[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.products[index];
  }

  deleteProduct(id: number, tenantId: string) {
    const index = this.products.findIndex(p => p.id === id && p.tenantId === tenantId);
    if (index === -1) return null;
    const deleted = this.products.splice(index, 1);
    return deleted[0];
  }

  // UCG内容相关
  findUcgByTenantId(tenantId: string) {
    return this.ucgContents
      .filter(u => u.tenantId === tenantId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  findUcgByIdAndTenantId(id: number, tenantId: string) {
    return this.ucgContents.find(u => u.id === id && u.tenantId === tenantId);
  }

  createUcg(ucgData: any) {
    const id = ++this.counters.ucgContents;
    const now = new Date();
    const ucg = {
      id,
      ...ucgData,
      createdAt: now,
    };
    this.ucgContents.push(ucg);
    return ucg;
  }

  deleteUcg(id: number, tenantId: string) {
    const index = this.ucgContents.findIndex(u => u.id === id && u.tenantId === tenantId);
    if (index === -1) return null;
    const deleted = this.ucgContents.splice(index, 1);
    return deleted[0];
  }

  // 营销内容相关
  findMarketingByTenantId(tenantId: string) {
    return this.marketingContents
      .filter(m => m.tenantId === tenantId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  findMarketingByIdAndTenantId(id: number, tenantId: string) {
    return this.marketingContents.find(m => m.id === id && m.tenantId === tenantId);
  }

  createMarketing(marketingData: any) {
    const id = ++this.counters.marketingContents;
    const now = new Date();
    const marketing = {
      id,
      ...marketingData,
      createdAt: now,
    };
    this.marketingContents.push(marketing);
    return marketing;
  }

  deleteMarketing(id: number, tenantId: string) {
    const index = this.marketingContents.findIndex(m => m.id === id && m.tenantId === tenantId);
    if (index === -1) return null;
    const deleted = this.marketingContents.splice(index, 1);
    return deleted[0];
  }
}
