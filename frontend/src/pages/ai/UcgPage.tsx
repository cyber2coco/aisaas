import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { 
  getAigcModels, 
  generateImage, 
  generateMultiViewImages,
  generateVideo,
  generateMarketingVideo
} from '../../services/aigc.service';

interface ImageModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  features: string[];
  speed: 'fast' | 'normal' | 'slow';
  quality: 'basic' | 'good' | 'excellent';
  icon: string;
  supportedSizes: string[];
  maxImages: number;
  supportsMultiView: boolean;
}

interface VideoModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  features: string[];
  speed: 'fast' | 'normal' | 'slow';
  quality: 'basic' | 'good' | 'excellent';
  icon: string;
  maxDuration: number;
  supportedRatios: string[];
  supportsAudio: boolean;
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  size: string;
  model: string;
  view?: string;
  createdAt?: string;
}

interface GeneratedVideo {
  id: string;
  url: string;
  videoUrl: string;
  prompt: string;
  duration: number;
  aspectRatio: string;
  size: string;
  model: string;
  status: string;
  createdAt: string;
  thumbnail: string;
}

const AigcPage = () => {
  // 当前激活的标签页
  const [activeTab, setActiveTab] = useState('image');
  
  // 语言相关状态
  const [selectedLanguage, setSelectedLanguage] = useState('zh-CN');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  // 语言配置
  const languages = [
    { id: 'zh-CN', name: '中文简体', flag: '🇨🇳' },
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'ja', name: '日本語', flag: '🇯🇵' },
    { id: 'ko', name: '한국어', flag: '🇰🇷' },
    { id: 'es', name: 'Español', flag: '🇪🇸' },
    { id: 'th', name: 'ไทย', flag: '🇹🇭' },
    { id: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { id: 'id', name: 'Bahasa', flag: '🇮🇩' },
  ];
  
  // 模型相关状态
  const [imageModels, setImageModels] = useState<ImageModel[]>([]);
  const [videoModels, setVideoModels] = useState<VideoModel[]>([]);
  const [selectedImageModel, setSelectedImageModel] = useState('qwen-vl');
  const [selectedVideoModel, setSelectedVideoModel] = useState('kling-video');
  const [showImageModelDropdown, setShowImageModelDropdown] = useState(false);
  const [showVideoModelDropdown, setShowVideoModelDropdown] = useState(false);
  
  // 电商主图相关状态
  const [productName, setProductName] = useState('');
  const [selectedViews, setSelectedViews] = useState<string[]>(['正面', '侧面', '细节']);
  const [imageSize, setImageSize] = useState('1024x1024');
  const [numImages, setNumImages] = useState(4);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  
  // 带货视频相关状态
  const [videoProductName, setVideoProductName] = useState('');
  const [videoStyle, setVideoStyle] = useState('种草带货');
  const [videoDuration, setVideoDuration] = useState(15);
  const [videoRatio, setVideoRatio] = useState('9:16');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [videoScript, setVideoScript] = useState('');
  
  // 营销海报相关状态
  const [posterProductName, setPosterProductName] = useState('');
  const [posterStyle, setPosterStyle] = useState('节日促销');
  const [posterSize, setPosterSize] = useState('竖版');
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [generatedPosters, setGeneratedPosters] = useState<GeneratedImage[]>([]);
  
  // AI 模特相关状态
  const [modelProductName, setModelProductName] = useState('');
  const [modelType, setModelType] = useState('女模');
  const [modelScene, setModelScene] = useState('工作室');
  const [isGeneratingModel, setIsGeneratingModel] = useState(false);
  const [generatedModelImages, setGeneratedModelImages] = useState<GeneratedImage[]>([]);
  
  // UCG 文案相关状态
  const [ucgProductName, setUcgProductName] = useState('');
  const [ucgType, setUcgType] = useState('buyer_show');
  const [isGeneratingUcg, setIsGeneratingUcg] = useState(false);
  const [ucgContent, setUcgContent] = useState('');
  
  // 标签页列表
  const tabs = [
    { id: 'image', name: '电商主图', icon: '🖼️', desc: '多视角商品图生成' },
    { id: 'video', name: '带货视频', icon: '🎬', desc: 'AI 短视频生成' },
    { id: 'poster', name: '营销海报', icon: '🎨', desc: '海报设计生成' },
    { id: 'model', name: 'AI 模特', icon: '👗', desc: '虚拟模特试穿' },
    { id: 'ucg', name: 'UCG 文案', icon: '📝', desc: '用户内容生成' },
  ];
  
  // 视角选项
  const viewOptions = ['正面', '侧面', '背面', '细节', '场景', '包装', '平铺', '悬挂'];
  
  // 视频风格选项
  const videoStyleOptions = ['种草带货', '产品展示', '开箱测评', '剧情演绎', '知识科普', '对比评测'];
  
  // 海报风格选项
  const posterStyleOptions = ['节日促销', '新品上市', '品牌宣传', '限时秒杀', '会员专享', '双十一大促'];
  
  // 海报尺寸选项
  const posterSizeOptions = [
    { label: '竖版 (9:16)', value: '9:16' },
    { label: '横版 (16:9)', value: '16:9' },
    { label: '方形 (1:1)', value: '1:1' },
    { label: '三比四 (3:4)', value: '3:4' },
  ];
  
  // 模特类型选项
  const modelTypeOptions = ['女模', '男模', '童模', '虚拟人', '情侣', '多人'];
  
  // 模特场景选项
  const modelSceneOptions = ['工作室', '户外街拍', '居家生活', '办公室', '度假风', '运动风'];
  
  // UCG 类型选项
  const ucgTypeOptions = [
    { id: 'buyer_show', name: '买家秀评价', icon: '⭐' },
    { id: 'video_script', name: '短视频脚本', icon: '🎬' },
    { id: 'review', name: '图文测评', icon: '📝' },
    { id: 'qa', name: '问答种草', icon: '❓' },
  ];
  
  // 组件加载时获取模型列表
  useEffect(() => {
    loadModels();
  }, []);
  
  // 加载模型列表
  const loadModels = async () => {
    try {
      const data = await getAigcModels();
      if (data.imageModels) {
        setImageModels(data.imageModels);
      }
      if (data.videoModels) {
        setVideoModels(data.videoModels);
      }
    } catch (err) {
      console.log('加载模型列表失败', err);
      // 使用默认模型列表
      setImageModels([
        { id: 'qwen-vl', name: '通义万相', provider: '阿里云', description: '中文优化，电商场景', features: ['中文优化', '电商场景'], speed: 'fast', quality: 'good', icon: '📸', supportedSizes: ['1024x1024', '1024x768'], maxImages: 4, supportsMultiView: true },
        { id: 'sdxl', name: 'Stable Diffusion XL', provider: 'Stability AI', description: '开源可定制', features: ['开源', '可定制'], speed: 'normal', quality: 'good', icon: '🎨', supportedSizes: ['1024x1024'], maxImages: 4, supportsMultiView: true },
        { id: 'mock-image', name: '模拟模式', provider: '系统内置', description: '演示用', features: ['即时可用'], speed: 'fast', quality: 'basic', icon: '🎭', supportedSizes: ['1024x1024'], maxImages: 6, supportsMultiView: true },
      ]);
      setVideoModels([
        { id: 'kling-video', name: '可灵 AI 视频', provider: '快手', description: '电商带货效果好', features: ['电商优化', '带货视频'], speed: 'normal', quality: 'good', icon: '📹', maxDuration: 10, supportedRatios: ['16:9', '9:16', '1:1'], supportsAudio: true },
        { id: 'mock-video', name: '模拟模式', provider: '系统内置', description: '演示用', features: ['即时可用'], speed: 'fast', quality: 'basic', icon: '🎭', maxDuration: 15, supportedRatios: ['16:9', '9:16', '1:1'], supportsAudio: true },
      ]);
    }
  };
  
  // 切换视角选择
  const toggleView = (view: string) => {
    if (selectedViews.includes(view)) {
      setSelectedViews(selectedViews.filter(v => v !== view));
    } else {
      setSelectedViews([...selectedViews, view]);
    }
  };
  
  // 生成电商主图（多视角）
  const handleGenerateMultiView = async () => {
    if (!productName) {
      alert('请输入商品名称');
      return;
    }
    if (selectedViews.length === 0) {
      alert('请至少选择一个视角');
      return;
    }
    
    setIsGeneratingImage(true);
    setGeneratedImages([]);
    
    try {
      const result = await generateMultiViewImages(
        productName,
        selectedImageModel,
        selectedViews
      );
      
      if (result && result.images) {
        setGeneratedImages(result.images);
      }
    } catch (err) {
      console.log('生成图片失败', err);
      // 使用模拟数据
      const mockImages: GeneratedImage[] = selectedViews.map((view, index) => ({
        id: `img_${Date.now()}_${index}`,
        url: `https://picsum.photos/seed/${encodeURIComponent(productName + view)}/800/800`,
        prompt: `${productName} - ${view}视角`,
        size: '800x800',
        model: '模拟模式',
        view: view
      }));
      setGeneratedImages(mockImages);
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  // 生成带货视频
  const handleGenerateVideo = async () => {
    if (!videoProductName) {
      alert('请输入商品名称');
      return;
    }
    
    setIsGeneratingVideo(true);
    setGeneratedVideo(null);
    setVideoScript('');
    
    try {
      const result = await generateMarketingVideo(
        videoProductName,
        undefined,
        selectedVideoModel,
        videoStyle
      );
      
      if (result) {
        if (result.video) {
          setGeneratedVideo(result.video);
        }
        if (result.script) {
          setVideoScript(result.script);
        }
      }
    } catch (err) {
      console.log('生成视频失败', err);
      // 使用模拟数据
      setGeneratedVideo({
        id: `video_${Date.now()}`,
        url: `https://picsum.photos/seed/${encodeURIComponent(videoProductName)}/720/1280`,
        videoUrl: '',
        prompt: `${videoProductName} - ${videoStyle}风格带货视频`,
        duration: videoDuration,
        aspectRatio: videoRatio,
        size: '720x1280',
        model: '模拟模式',
        status: 'completed',
        createdAt: new Date().toISOString(),
        thumbnail: `https://picsum.photos/seed/${encodeURIComponent(videoProductName)}-thumb/400/400`
      });
      setVideoScript(`【视频标题】${videoProductName}太绝了！用过的人都说好！\n\n【分镜脚本】\n镜头1（0-3s）：产品特写，突出颜值和质感\n镜头2（3-6s）：使用场景展示，真实感拉满\n镜头3（6-9s）：效果对比，前后差异明显\n镜头4（9-12s）：多人推荐，增强信任感\n镜头5（12-15s）：价格福利，引导下单\n\n【口播文案】\n姐妹们！今天给大家推荐一款超好用的${videoProductName}！\n我已经用了快一个月了，真的太香了！\n不管是颜值还是效果都在线，性价比超高！\n现在还有限时优惠，赶紧冲！\n\n【话题标签】\n#${videoProductName} #好物分享 #种草 #性价比之王`);
    } finally {
      setIsGeneratingVideo(false);
    }
  };
  
  // 生成营销海报
  const handleGeneratePoster = async () => {
    if (!posterProductName) {
      alert('请输入商品名称');
      return;
    }
    
    setIsGeneratingPoster(true);
    setGeneratedPosters([]);
    
    try {
      const sizeMap: Record<string, string> = {
        '9:16': '720x1280',
        '16:9': '1280x720',
        '1:1': '800x800',
        '3:4': '600x800',
      };
      
      const result = await generateImage(
        `${posterProductName} - ${posterStyle}风格营销海报`,
        selectedImageModel,
        sizeMap[posterSize] || '1024x1024',
        3
      );
      
      if (result && result.images) {
        setGeneratedPosters(result.images);
      }
    } catch (err) {
      console.log('生成海报失败', err);
      // 使用模拟数据
      const mockPosters: GeneratedImage[] = [1, 2, 3].map((i) => ({
        id: `poster_${Date.now()}_${i}`,
        url: `https://picsum.photos/seed/${encodeURIComponent(posterProductName + posterStyle + i)}/720/1280`,
        prompt: `${posterProductName} - ${posterStyle}海报`,
        size: '720x1280',
        model: '模拟模式'
      }));
      setGeneratedPosters(mockPosters);
    } finally {
      setIsGeneratingPoster(false);
    }
  };
  
  // 生成 AI 模特图
  const handleGenerateModel = async () => {
    if (!modelProductName) {
      alert('请输入商品名称');
      return;
    }
    
    setIsGeneratingModel(true);
    setGeneratedModelImages([]);
    
    try {
      const result = await generateImage(
        `${modelType}穿着${modelProductName}，${modelScene}场景，时尚大片`,
        selectedImageModel,
        '768x1024',
        4
      );
      
      if (result && result.images) {
        setGeneratedModelImages(result.images);
      }
    } catch (err) {
      console.log('生成模特图失败', err);
      // 使用模拟数据
      const mockImages: GeneratedImage[] = [1, 2, 3, 4].map((i) => ({
        id: `model_${Date.now()}_${i}`,
        url: `https://picsum.photos/seed/${encodeURIComponent(modelProductName + modelType + modelScene + i)}/768/1024`,
        prompt: `${modelType} - ${modelProductName} - ${modelScene}`,
        size: '768x1024',
        model: '模拟模式'
      }));
      setGeneratedModelImages(mockImages);
    } finally {
      setIsGeneratingModel(false);
    }
  };
  
  // 生成 UCG 文案
  const handleGenerateUcg = async () => {
    if (!ucgProductName) {
      alert('请输入商品名称');
      return;
    }
    
    setIsGeneratingUcg(true);
    setUcgContent('');
    
    // 模拟生成 UCG 内容
    setTimeout(() => {
      let content = '';
      
      if (ucgType === 'buyer_show') {
        content = `【买家秀评价 1】\n用户名：时尚小达人\n评分：⭐⭐⭐⭐⭐\n\n真的太惊喜了！${ucgProductName}收到货质感超级好，完全超出预期！颜色很正，做工精细，细节处理到位。已经推荐给闺蜜了，她也说要买！性价比超高，会回购的！\n\n【买家秀评价 2】\n用户名：精致猪猪女孩\n评分：⭐⭐⭐⭐⭐\n\n第二次购买了，一如既往的好！${ucgProductName}真的太好用了，用了一个月效果很明显。包装也很精美，送人也很有面子。客服态度也很好，有问必答。强烈推荐！\n\n【买家秀评价 3】\n用户名：理性消费者\n评分：⭐⭐⭐⭐\n\n整体来说还是不错的，${ucgProductName}的质量对得起这个价格。唯一的小缺点是发货稍微慢了一点，不过好饭不怕晚嘛。效果还是可以的，会继续使用看看。`;
      } else if (ucgType === 'video_script') {
        content = `【15秒抖音带货脚本】\n\n⏱️ 0-3秒（黄金3秒）\n画面：产品特写，颜值暴击\n字幕：这个${ucgProductName}绝了！\n音效：惊讶的音效\n\n⏱️ 3-7秒（痛点+产品）\n画面：使用前后对比\n字幕：还在为XXX烦恼吗？试试这个！\n音效：轻快的背景音乐\n拍摄建议：特写+对比镜头，节奏要快\n\n⏱️ 7-11秒（使用场景）\n画面：真实使用场景展示\n字幕：日常用真的太方便了！\n音效：满意的感叹声\n拍摄建议：第一视角拍摄，增加代入感\n\n⏱️ 11-15秒（引导下单）\n画面：价格+福利展示\n字幕：现在下单还有优惠！冲！\n音效：急促的提示音\n拍摄建议：价格大字突出，营造紧迫感\n\n【话题标签】\n#${ucgProductName} #好物推荐 #种草 #抖音好物 #性价比`;
      } else if (ucgType === 'review') {
        content = `【深度测评】${ucgProductName}到底值不值得买？用了30天来说说真实感受\n\n📦 开箱体验\n包装很精美，拆开后产品没有任何损坏。配件齐全，说明书也很详细。第一眼的质感就很好，完全不像这个价位的东西。\n\n✨ 外观设计\n颜值真的没话说！简约大气，很有高级感。颜色很正，没有色差。做工精细，细节处理到位。拿在手里很有分量，质感满满。\n\n💡 使用体验\n用了快一个月了，来说说真实感受。首先是真的很好用，效果很明显。操作也很简单，小白也能轻松上手。日常使用完全够用，性价比超高。\n\n💰 性价比分析\n这个价格能买到这样的品质，真的很值了。对比了很多家，这家的性价比是最高的。而且售后服务也很好，有问题都能及时解决。\n\n👍 优点\n1. 颜值高，质感好\n2. 效果明显，好用\n3. 性价比高\n4. 售后服务好\n\n👎 缺点\n1. 发货稍微有点慢\n2. 包装可以再精致一点\n\n🛒 购买建议\n总体来说还是很推荐的，预算有限的小伙伴可以冲！如果追求极致体验的话，可以再等等看有没有升级款。\n\n⭐ 综合评分：4.8/5分`;
      } else if (ucgType === 'qa') {
        content = `【关于${ucgProductName}的5个常见问题】\n\n❓ 问题1：这个适合什么肤质/人群使用？\n💡 小编回答：大部分人群都适合哦！产品成分很温和，敏感肌也可以放心使用。不过建议第一次使用前先在耳后做一下测试。\n\n❓ 问题2：效果怎么样？多久能看到效果？\n💡 小编回答：效果因人而异哦，一般来说坚持使用2-4周就能看到明显效果了。每个人的情况不同，见效时间也会有差异。\n\n❓ 问题3：这个价格贵吗？性价比怎么样？\n💡 小编回答：个人觉得性价比很高！对比了很多同类产品，这个价格能买到这样的品质真的很值了。而且效果也很好，物超所值。\n\n❓ 问题4：怎么使用效果最好？\n💡 小编回答：按照说明书上的方法使用就可以啦。坚持每天使用，效果会更好。另外搭配同系列产品使用，效果会加倍哦！\n\n❓ 问题5：售后怎么样？有问题能退换吗？\n💡 小编回答：售后很给力的！7天无理由退换，30天质量问题包换。客服小姐姐态度也很好，有问题都能及时解决，购物很放心。\n\n💬 小编总结：\n总体来说，${ucgProductName}还是很值得入手的！颜值高、效果好、性价比高，闭眼入不踩雷。还在犹豫的小伙伴可以趁活动的时候下单，更划算哦！\n\n🏷️ 话题标签：#${ucgProductName} #好物分享 #测评 #种草 #性价比`;
      }
      
      setUcgContent(content);
      setIsGeneratingUcg(false);
    }, 1500);
  };
  
  // 获取当前图像模型信息
  const currentImageModel = imageModels.find(m => m.id === selectedImageModel) || {
    id: 'qwen-vl',
    name: '通义万相',
    description: '中文优化，电商场景',
    features: ['中文优化', '电商场景'],
    icon: '📸'
  };
  
  // 获取当前视频模型信息
  const currentVideoModel = videoModels.find(m => m.id === selectedVideoModel) || {
    id: 'kling-video',
    name: '可灵 AI 视频',
    description: '电商带货效果好',
    features: ['电商优化', '带货视频'],
    icon: '📹'
  };
  
  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="AI 内容生成"
        subtitle="一站式 AIGC 内容创作平台，图片、视频、文案一键生成"
        rightContent={
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-400 transition-all"
            >
              <span className="text-lg">{languages.find(l => l.id === selectedLanguage)?.flag || '🇨🇳'}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {languages.find(l => l.id === selectedLanguage)?.name || '中文简体'}
              </span>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showLanguageDropdown && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 shadow-xl z-[100] overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setSelectedLanguage(lang.id);
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors flex items-center gap-3 ${
                      selectedLanguage === lang.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      />
      
      {/* 标签页导航 */}
      <div className="px-6 border-b border-gray-200 dark:border-dark-700">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-cyan-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="flex-1 p-6 overflow-auto">
        {/* 电商主图标签页 */}
        {activeTab === 'image' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：参数设置 */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🖼️ 电商主图生成</h3>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品名称</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="输入商品名称，如：冰丝防晒衣"
                    className="input-field"
                  />
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    选择视角 ({selectedViews.length}个)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {viewOptions.map((view) => (
                      <button
                        key={view}
                        onClick={() => toggleView(view)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                          selectedViews.includes(view)
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
                        }`}
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">图片尺寸</label>
                  <select
                    value={imageSize}
                    onChange={(e) => setImageSize(e.target.value)}
                    className="input-field"
                  >
                    <option value="1024x1024">1024 x 1024（方形）</option>
                    <option value="1024x768">1024 x 768（横版）</option>
                    <option value="768x1024">768 x 1024（竖版）</option>
                    <option value="512x512">512 x 512（快速）</option>
                  </select>
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">生成模型</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowImageModelDropdown(!showImageModelDropdown)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-400 transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl">
                        {currentImageModel.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{currentImageModel.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{currentImageModel.description}</div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showImageModelDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
                        {imageModels.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedImageModel(model.id);
                              setShowImageModelDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${
                              selectedImageModel === model.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl">
                                {model.icon}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{model.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{model.description}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {model.features?.slice(0, 2).map((feature, idx) => (
                                    <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleGenerateMultiView}
                  disabled={isGeneratingImage || !productName || selectedViews.length === 0}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingImage ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      生成中...
                    </>
                  ) : (
                    <>✨ 生成多视角主图</>
                  )}
                </button>
              </div>
              
              {/* 快捷商品推荐 */}
              <div className="card p-6">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">💡 快速生成（点击试试）</p>
                <div className="flex flex-wrap gap-2">
                  {['防晒衣', '蓝牙耳机', '连衣裙', '防晒霜', '充电宝'].map((name) => (
                    <button
                      key={name}
                      onClick={() => {
                        setProductName(name);
                      }}
                      className="px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 右侧：生成结果 */}
            <div className="lg:col-span-2">
              <div className="card p-6 h-full">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📸 生成结果</h3>
                
                {generatedImages.length === 0 ? (
                  <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                    <div className="text-5xl mb-4">🖼️</div>
                    <p className="text-lg">输入商品名称，选择视角</p>
                    <p className="text-sm mt-1">点击生成按钮，AI 为你生成多视角商品图</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {generatedImages.map((image) => (
                      <div key={image.id} className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-all">
                        <img
                          src={image.url}
                          alt={image.prompt}
                          className="w-full aspect-square object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://picsum.photos/400/400';
                          }}
                        />
                        {image.view && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-lg">
                            {image.view}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-white text-gray-900 text-sm rounded-lg hover:bg-gray-100 transition-colors">
                              下载
                            </button>
                            <button className="px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors">
                              使用
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* 带货视频标签页 */}
        {activeTab === 'video' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：参数设置 */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🎬 带货视频生成</h3>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品名称</label>
                  <input
                    type="text"
                    value={videoProductName}
                    onChange={(e) => setVideoProductName(e.target.value)}
                    placeholder="输入商品名称，如：防晒霜"
                    className="input-field"
                  />
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">视频风格</label>
                  <div className="grid grid-cols-2 gap-2">
                    {videoStyleOptions.map((style) => (
                      <button
                        key={style}
                        onClick={() => setVideoStyle(style)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all ${
                          videoStyle === style
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">视频时长</label>
                  <select
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(Number(e.target.value))}
                    className="input-field"
                  >
                    <option value={5}>5 秒（快速）</option>
                    <option value={10}>10 秒（标准）</option>
                    <option value={15}>15 秒（推荐）</option>
                    <option value={30}>30 秒（详细）</option>
                  </select>
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">视频比例</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['9:16', '16:9', '1:1'].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setVideoRatio(ratio)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all ${
                          videoRatio === ratio
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">视频模型</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowVideoModelDropdown(!showVideoModelDropdown)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-400 transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                        {currentVideoModel.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{currentVideoModel.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{currentVideoModel.description}</div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showVideoModelDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
                        {videoModels.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedVideoModel(model.id);
                              setShowVideoModelDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${
                              selectedVideoModel === model.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                                {model.icon}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{model.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{model.description}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {model.features?.slice(0, 2).map((feature, idx) => (
                                    <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleGenerateVideo}
                  disabled={isGeneratingVideo || !videoProductName}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingVideo ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      生成中...
                    </>
                  ) : (
                    <>🎬 生成带货视频</>
                  )}
                </button>
              </div>
              
              {/* 快捷商品推荐 */}
              <div className="card p-6">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">💡 快速生成（点击试试）</p>
                <div className="flex flex-wrap gap-2">
                  {['防晒衣', '蓝牙耳机', '连衣裙', '防晒霜', '充电宝'].map((name) => (
                    <button
                      key={name}
                      onClick={() => setVideoProductName(name)}
                      className="px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 右侧：生成结果 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 视频预览 */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📹 视频预览</h3>
                
                {!generatedVideo ? (
                  <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                    <div className="text-5xl mb-4">🎬</div>
                    <p className="text-lg">输入商品名称，选择风格</p>
                    <p className="text-sm mt-1">点击生成按钮，AI 为你生成带货短视频</p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] max-w-sm mx-auto">
                    <img
                      src={generatedVideo.thumbnail || generatedVideo.url}
                      alt="视频封面"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://picsum.photos/400/700';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="text-white text-sm font-medium">{generatedVideo.prompt}</div>
                      <div className="text-white/70 text-xs mt-1">
                        {generatedVideo.duration}秒 · {generatedVideo.model}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 视频脚本 */}
              {videoScript && (
                <div className="card p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📝 视频脚本</h3>
                  <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-xl max-h-80 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">
                      {videoScript}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* 营销海报标签页 */}
        {activeTab === 'poster' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：参数设置 */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🎨 营销海报生成</h3>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品名称</label>
                  <input
                    type="text"
                    value={posterProductName}
                    onChange={(e) => setPosterProductName(e.target.value)}
                    placeholder="输入商品名称，如：防晒霜"
                    className="input-field"
                  />
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">海报风格</label>
                  <div className="grid grid-cols-2 gap-2">
                    {posterStyleOptions.map((style) => (
                      <button
                        key={style}
                        onClick={() => setPosterStyle(style)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all ${
                          posterStyle === style
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">海报尺寸</label>
                  <div className="grid grid-cols-2 gap-2">
                    {posterSizeOptions.map((size) => (
                      <button
                        key={size.value}
                        onClick={() => setPosterSize(size.value)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all ${
                          posterSize === size.value
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={handleGeneratePoster}
                  disabled={isGeneratingPoster || !posterProductName}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingPoster ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      生成中...
                    </>
                  ) : (
                    <>🎨 生成营销海报</>
                  )}
                </button>
              </div>
            </div>
            
            {/* 右侧：生成结果 */}
            <div className="lg:col-span-2">
              <div className="card p-6 h-full">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🖼️ 生成结果</h3>
                
                {generatedPosters.length === 0 ? (
                  <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                    <div className="text-5xl mb-4">🎨</div>
                    <p className="text-lg">输入商品名称，选择风格</p>
                    <p className="text-sm mt-1">点击生成按钮，AI 为你生成精美营销海报</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {generatedPosters.map((poster) => (
                      <div key={poster.id} className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-all">
                        <img
                          src={poster.url}
                          alt={poster.prompt}
                          className="w-full aspect-[9/16] object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://picsum.photos/400/700';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-white text-gray-900 text-sm rounded-lg hover:bg-gray-100 transition-colors">
                              下载
                            </button>
                            <button className="px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors">
                              使用
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* AI 模特标签页 */}
        {activeTab === 'model' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：参数设置 */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">👗 AI 模特生成</h3>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品名称</label>
                  <input
                    type="text"
                    value={modelProductName}
                    onChange={(e) => setModelProductName(e.target.value)}
                    placeholder="输入商品名称，如：碎花连衣裙"
                    className="input-field"
                  />
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">模特类型</label>
                  <div className="grid grid-cols-3 gap-2">
                    {modelTypeOptions.map((type) => (
                      <button
                        key={type}
                        onClick={() => setModelType(type)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all ${
                          modelType === type
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">拍摄场景</label>
                  <div className="grid grid-cols-2 gap-2">
                    {modelSceneOptions.map((scene) => (
                      <button
                        key={scene}
                        onClick={() => setModelScene(scene)}
                        className={`px-3 py-2 text-sm rounded-lg transition-all ${
                          modelScene === scene
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
                        }`}
                      >
                        {scene}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={handleGenerateModel}
                  disabled={isGeneratingModel || !modelProductName}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingModel ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      生成中...
                    </>
                  ) : (
                    <>👗 生成模特图</>
                  )}
                </button>
              </div>
            </div>
            
            {/* 右侧：生成结果 */}
            <div className="lg:col-span-2">
              <div className="card p-6 h-full">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📸 生成结果</h3>
                
                {generatedModelImages.length === 0 ? (
                  <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                    <div className="text-5xl mb-4">👗</div>
                    <p className="text-lg">输入商品名称，选择模特类型</p>
                    <p className="text-sm mt-1">点击生成按钮，AI 为你生成虚拟模特试穿图</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {generatedModelImages.map((image) => (
                      <div key={image.id} className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-all">
                        <img
                          src={image.url}
                          alt={image.prompt}
                          className="w-full aspect-[3/4] object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://picsum.photos/400/600';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-white text-gray-900 text-sm rounded-lg hover:bg-gray-100 transition-colors">
                              下载
                            </button>
                            <button className="px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors">
                              使用
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* UCG 文案标签页 */}
        {activeTab === 'ucg' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：类型选择和参数 */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📝 UCG 内容生成</h3>
                
                {/* UCG 类型选择 */}
                <div className="space-y-2 mb-5">
                  {ucgTypeOptions.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setUcgType(type.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        ucgType === type.id
                          ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-500'
                          : 'bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <span className={`font-medium ${
                        ucgType === type.id
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {type.name}
                      </span>
                    </button>
                  ))}
                </div>
                
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品名称</label>
                  <input
                    type="text"
                    value={ucgProductName}
                    onChange={(e) => setUcgProductName(e.target.value)}
                    placeholder="输入商品名称，如：防晒霜"
                    className="input-field"
                  />
                </div>
                
                <button
                  onClick={handleGenerateUcg}
                  disabled={isGeneratingUcg || !ucgProductName}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingUcg ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      生成中...
                    </>
                  ) : (
                    <>✨ 生成 UCG 内容</>
                  )}
                </button>
              </div>
              
              {/* 快捷商品推荐 */}
              <div className="card p-6">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">💡 快速生成（点击试试）</p>
                <div className="flex flex-wrap gap-2">
                  {['防晒衣', '蓝牙耳机', '连衣裙', '防晒霜', '充电宝'].map((name) => (
                    <button
                      key={name}
                      onClick={() => setUcgProductName(name)}
                      className="px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 右侧：生成结果 */}
            <div className="lg:col-span-2">
              <div className="card p-6 h-full">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📄 生成结果</h3>
                
                {!ucgContent ? (
                  <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                    <div className="text-5xl mb-4">📝</div>
                    <p className="text-lg">选择内容类型，输入商品名称</p>
                    <p className="text-sm mt-1">点击生成按钮，AI 为你生成高质量 UCG 内容</p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-xl max-h-[600px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
                      {ucgContent}
                    </pre>
                  </div>
                )}
                
                {ucgContent && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(ucgContent);
                        alert('已复制到剪贴板');
                      }}
                      className="btn-secondary px-4 py-2 text-sm"
                    >
                      📋 复制内容
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AigcPage;
