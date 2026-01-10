import { NextResponse } from 'next/server'

// API 响应类型
interface HitokotoResponse {
  hitokoto: string
}

interface JinrishiciResponse {
  content: string
}

type ApiResponse = HitokotoResponse | JinrishiciResponse

interface ApiConfig {
  name: string
  url: string
  parse: (data: ApiResponse) => string
}

// 多个免费 API 源
const APIs: ApiConfig[] = [
  // 一言 - 动漫
  {
    name: '一言·动漫',
    url: 'https://v1.hitokoto.cn/?c=a&encode=json',
    parse: (data) => (data as HitokotoResponse).hitokoto,
  },
  // 一言 - 漫画
  {
    name: '一言·漫画',
    url: 'https://v1.hitokoto.cn/?c=b&encode=json',
    parse: (data) => (data as HitokotoResponse).hitokoto,
  },
  // 一言 - 游戏
  {
    name: '一言·游戏',
    url: 'https://v1.hitokoto.cn/?c=c&encode=json',
    parse: (data) => (data as HitokotoResponse).hitokoto,
  },
  // 一言 - 文学
  {
    name: '一言·文学',
    url: 'https://v1.hitokoto.cn/?c=d&encode=json',
    parse: (data) => (data as HitokotoResponse).hitokoto,
  },
  // 一言 - 原创
  {
    name: '一言·原创',
    url: 'https://v1.hitokoto.cn/?c=e&encode=json',
    parse: (data) => (data as HitokotoResponse).hitokoto,
  },
  // 一言 - 网络
  {
    name: '一言·网络',
    url: 'https://v1.hitokoto.cn/?c=f&encode=json',
    parse: (data) => (data as HitokotoResponse).hitokoto,
  },
  // 一言 - 影视
  {
    name: '一言·影视',
    url: 'https://v1.hitokoto.cn/?c=h&encode=json',
    parse: (data) => (data as HitokotoResponse).hitokoto,
  },
  // 一言 - 诗词
  {
    name: '一言·诗词',
    url: 'https://v1.hitokoto.cn/?c=i&encode=json',
    parse: (data) => (data as HitokotoResponse).hitokoto,
  },
  // 一言 - 哲学
  {
    name: '一言·哲学',
    url: 'https://v1.hitokoto.cn/?c=k&encode=json',
    parse: (data) => (data as HitokotoResponse).hitokoto,
  },
  // 今日诗词
  {
    name: '今日诗词',
    url: 'https://v1.jinrishici.com/all.json',
    parse: (data) => (data as JinrishiciResponse).content,
  },
  // 随机古诗
  {
    name: '古诗文',
    url: 'https://v1.jinrishici.com/rensheng.json',
    parse: (data) => (data as JinrishiciResponse).content,
  },
  // 情诗
  {
    name: '情诗',
    url: 'https://v1.jinrishici.com/qingshi.json',
    parse: (data) => (data as JinrishiciResponse).content,
  },
]

// 备用文本
const fallbackTexts = [
  '天行健君子以自强不息地势坤君子以厚德载物',
  '不积跬步无以至千里不积小流无以成江海',
  '业精于勤荒于嬉行成于思毁于随',
  '千里之行始于足下',
  '学而不思则罔思而不学则殆',
  '三人行必有我师焉择其善者而从之其不善者而改之',
  '知之为知之不知为不知是知也',
  '温故而知新可以为师矣',
  '学而时习之不亦说乎有朋自远方来不亦乐乎',
  '己所不欲勿施于人',
  '工欲善其事必先利其器',
  '人无远虑必有近忧',
  '知者乐水仁者乐山知者动仁者静',
  '逝者如斯夫不舍昼夜',
  '岁寒然后知松柏之后凋也',
]

export async function GET() {
  // 尝试多个 API，直到成功
  const shuffled = [...APIs].sort(() => Math.random() - 0.5)
  
  for (const api of shuffled.slice(0, 3)) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)

      const response = await fetch(api.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json',
        },
        signal: controller.signal,
        cache: 'no-store',
      })

      clearTimeout(timeout)

      if (!response.ok) continue

      const data = await response.json()
      let text = api.parse(data)

      // 清理文本
      if (text) {
        text = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9，。！？、；：""''（）—]/g, '')
        text = text.trim()
      }

      if (text && text.length >= 5 && text.length <= 100) {
        return NextResponse.json({
          text,
          source: api.name,
          success: true,
        })
      }
    } catch {
      continue
    }
  }

  // 全部失败，返回备用文本
  const text = fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)]
  return NextResponse.json({
    text,
    source: '本地备用',
    success: true,
  })
}
