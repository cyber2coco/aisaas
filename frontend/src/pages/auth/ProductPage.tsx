import { useState } from 'react';
import { analyzeCategory, generateProductInfo, createProduct } from '../../services/product.service';

const ProductPage = () => {
  const [category, setCategory] = useState('服饰鞋包');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const result = await analyzeCategory(category);
      setAiResult(result);
    } catch (err) {
      setAiResult('AI分析失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!productName) return;
    setIsLoading(true);
    try {
      const result = await generateProductInfo(productName);
      // 解析AI返回结果，自动填充表单
      const lines = result.split('\n');
      lines.forEach(line => {
        if (line.includes('标题：')) setProductName(line.replace('标题：', '').trim());
        if (line.includes('售价：')) setProductPrice(line.replace('售价：', '').replace('元', '').trim());
        if (line.includes('描述：')) setProductDesc(line.replace('描述：', '').trim());
      });
      setAiResult(result);
    } catch (err) {
      setAiResult('生成失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!productName || !productPrice || !productDesc) return;
    setIsLoading(true);
    try {
      await createProduct({
        name: productName,
        price: parseFloat(productPrice),
        description: productDesc,
      });
      alert('商品上架成功！');
      // 清空表单
      setProductName('');
      setProductPrice('');
      setProductDesc('');
    } catch (err) {
      alert('上架失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">AI智能选品上架</h2>
        <p className="text-gray-600 dark:text-gray-400">AI大数据分析，一键选品+智能上架</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 选品分析 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-primary">🔍</span> AI市场选品分析
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">选择品类</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
              >
                <option>服饰鞋包</option>
                <option>3C数码</option>
                <option>家居用品</option>
                <option>美妆护肤</option>
              </select>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? '分析中...' : '✨ AI智能分析选品'}
            </button>
          </div>
          {aiResult && (
            <div className="mt-5 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm font-medium">AI推荐结果：</p>
              <pre className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">
                {aiResult}
              </pre>
            </div>
          )}
        </div>

        {/* 商品信息生成 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow lg:col-span-2">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-primary">✏️</span> 智能商品信息生成
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">商品名称</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
                placeholder="AI自动生成商品标题"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">商品价格</label>
              <input
                type="text"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
                placeholder="AI建议售价"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">商品详情描述</label>
            <textarea
              rows={4}
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
              placeholder="AI自动生成高质量商品详情文案"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !productName}
              className="btn-secondary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              ✨ AI生成全部信息
            </button>
            <button
              onClick={handleCreate}
              disabled={isLoading || !productName || !productPrice || !productDesc}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              🚀 一键上架商品
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;