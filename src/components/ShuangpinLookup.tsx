'use client'

import { useState, useMemo } from 'react'
import { initialMap, finalMap, specialSyllables, pinyinToShuangpin, parsePinyinParts } from '@/lib/xiaohe'
import { useTheme } from '@/hooks/useTheme'

interface ShuangpinLookupProps {
  onClose: () => void
  darkMode: boolean
}

// 所有可能的拼音组合
const allPinyins = [
  // 零声母
  'a', 'o', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'er',
  // 带声母的常见拼音
  'ba', 'bo', 'bi', 'bu', 'bai', 'bei', 'bao', 'ban', 'ben', 'bang', 'beng', 'bian', 'biao', 'bie', 'bin', 'bing',
  'pa', 'po', 'pi', 'pu', 'pai', 'pei', 'pao', 'pou', 'pan', 'pen', 'pang', 'peng', 'pian', 'piao', 'pie', 'pin', 'ping',
  'ma', 'mo', 'me', 'mi', 'mu', 'mai', 'mei', 'mao', 'mou', 'man', 'men', 'mang', 'meng', 'mian', 'miao', 'mie', 'min', 'ming', 'miu',
  'fa', 'fo', 'fu', 'fei', 'fou', 'fan', 'fen', 'fang', 'feng',
  'da', 'de', 'di', 'du', 'dai', 'dei', 'dao', 'dou', 'dan', 'den', 'dang', 'deng', 'dong', 'dian', 'diao', 'die', 'diu', 'ding', 'duan', 'dui', 'dun', 'duo',
  'ta', 'te', 'ti', 'tu', 'tai', 'tao', 'tou', 'tan', 'tang', 'teng', 'tong', 'tian', 'tiao', 'tie', 'ting', 'tuan', 'tui', 'tun', 'tuo',
  'na', 'ne', 'ni', 'nu', 'nv', 'nai', 'nei', 'nao', 'nou', 'nan', 'nen', 'nang', 'neng', 'nong', 'nian', 'niang', 'niao', 'nie', 'nin', 'ning', 'niu', 'nuan', 'nuo', 'nue',
  'la', 'le', 'li', 'lu', 'lv', 'lai', 'lei', 'lao', 'lou', 'lan', 'lang', 'leng', 'long', 'lian', 'liang', 'liao', 'lie', 'lin', 'ling', 'liu', 'luan', 'lun', 'luo', 'lue',
  'ga', 'ge', 'gu', 'gai', 'gei', 'gao', 'gou', 'gan', 'gen', 'gang', 'geng', 'gong', 'gua', 'guai', 'guan', 'guang', 'gui', 'gun', 'guo',
  'ka', 'ke', 'ku', 'kai', 'kei', 'kao', 'kou', 'kan', 'ken', 'kang', 'keng', 'kong', 'kua', 'kuai', 'kuan', 'kuang', 'kui', 'kun', 'kuo',
  'ha', 'he', 'hu', 'hai', 'hei', 'hao', 'hou', 'han', 'hen', 'hang', 'heng', 'hong', 'hua', 'huai', 'huan', 'huang', 'hui', 'hun', 'huo',
  'ji', 'ju', 'jia', 'jian', 'jiang', 'jiao', 'jie', 'jin', 'jing', 'jiong', 'jiu', 'juan', 'jue', 'jun',
  'qi', 'qu', 'qia', 'qian', 'qiang', 'qiao', 'qie', 'qin', 'qing', 'qiong', 'qiu', 'quan', 'que', 'qun',
  'xi', 'xu', 'xia', 'xian', 'xiang', 'xiao', 'xie', 'xin', 'xing', 'xiong', 'xiu', 'xuan', 'xue', 'xun',
  'zha', 'zhe', 'zhi', 'zhu', 'zhai', 'zhei', 'zhao', 'zhou', 'zhan', 'zhen', 'zhang', 'zheng', 'zhong', 'zhua', 'zhuai', 'zhuan', 'zhuang', 'zhui', 'zhun', 'zhuo',
  'cha', 'che', 'chi', 'chu', 'chai', 'chao', 'chou', 'chan', 'chen', 'chang', 'cheng', 'chong', 'chua', 'chuai', 'chuan', 'chuang', 'chui', 'chun', 'chuo',
  'sha', 'she', 'shi', 'shu', 'shai', 'shei', 'shao', 'shou', 'shan', 'shen', 'shang', 'sheng', 'shua', 'shuai', 'shuan', 'shuang', 'shui', 'shun', 'shuo',
  'ri', 'ru', 'rao', 'rou', 'ran', 'ren', 'rang', 'reng', 'rong', 'ruan', 'rui', 'run', 'ruo',
  'za', 'ze', 'zi', 'zu', 'zai', 'zei', 'zao', 'zou', 'zan', 'zen', 'zang', 'zeng', 'zong', 'zuan', 'zui', 'zun', 'zuo',
  'ca', 'ce', 'ci', 'cu', 'cai', 'cao', 'cou', 'can', 'cen', 'cang', 'ceng', 'cong', 'cuan', 'cui', 'cun', 'cuo',
  'sa', 'se', 'si', 'su', 'sai', 'sao', 'sou', 'san', 'sen', 'sang', 'seng', 'song', 'suan', 'sui', 'sun', 'suo',
  'ya', 'ye', 'yi', 'yo', 'yu', 'yai', 'yao', 'you', 'yan', 'yin', 'yang', 'ying', 'yong', 'yuan', 'yue', 'yun',
  'wa', 'wo', 'wu', 'wai', 'wei', 'wan', 'wen', 'wang', 'weng', 'wong',
]

export default function ShuangpinLookup({ onClose, darkMode }: ShuangpinLookupProps) {
  const [query, setQuery] = useState('')
  const theme = useTheme()

  // 搜索结果
  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase().trim()
    return allPinyins
      .filter(py => py.includes(q))
      .slice(0, 50)
      .map(py => {
        const { initial, final } = parsePinyinParts(py)
        const shuangpin = pinyinToShuangpin(py, initial, final)
        return { pinyin: py, initial, final, shuangpin }
      })
  }, [query])

  return (
    <div className={`fixed inset-0 ${theme.modalOverlay} flex items-center justify-center z-50 p-4`}>
      <div className={`${theme.modalCard} max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
        {/* 头部 */}
        <div className={`p-4 sm:p-6 border-b ${theme.border} flex justify-between items-center`}>
          <h2 className={`text-xl sm:text-2xl font-bold ${theme.text}`}>🔍 双拼查询</h2>
          <button onClick={onClose} className={`${theme.textMuted} hover:text-white text-2xl leading-none`}>×</button>
        </div>

        {/* 搜索框 */}
        <div className="p-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入拼音查询双拼编码，如：shuang、zh、ang..."
            className={`w-full p-3 rounded-lg ${theme.input} focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            autoFocus
          />
        </div>

        {/* 结果列表 */}
        <div className="flex-1 overflow-auto p-4 pt-0 scrollbar-hide">
          {query && results.length === 0 ? (
            <p className={`text-center ${theme.textMuted} py-8`}>未找到匹配的拼音</p>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {results.map((r, i) => (
                <div key={i} className={`${theme.statCard} p-3 text-center`}>
                  <div className={`text-lg ${theme.text}`}>{r.pinyin}</div>
                  <div className="text-2xl font-mono text-blue-500 font-bold">{r.shuangpin}</div>
                  <div className={`text-xs ${theme.textMuted}`}>
                    {r.initial || '∅'} + {r.final}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 默认显示对照表 - 简洁网格 */
            <div className="space-y-6">
              {/* 声母表 */}
              <div>
                <h3 className={`font-bold mb-3 ${theme.text} flex items-center gap-2`}>
                  <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
                  声母对照
                </h3>
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-1.5">
                  {Object.entries(initialMap).map(([py, key]) => (
                    <div key={py} className={`${theme.statCard} px-2 py-1.5 text-center text-sm`}>
                      <span className={theme.textMuted}>{py}</span>
                      <span className="mx-1 text-slate-400">→</span>
                      <span className="text-blue-500 dark:text-blue-400 font-mono font-bold">{key}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 韵母表 */}
              <div>
                <h3 className={`font-bold mb-3 ${theme.text} flex items-center gap-2`}>
                  <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>
                  韵母对照
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                  {Object.entries(finalMap).map(([py, key]) => (
                    <div key={py} className={`${theme.statCard} px-2 py-1.5 text-center text-sm`}>
                      <span className={theme.textMuted}>{py}</span>
                      <span className="mx-1 text-slate-400">→</span>
                      <span className="text-emerald-500 dark:text-emerald-400 font-mono font-bold">{key}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 零声母 */}
              <div>
                <h3 className={`font-bold mb-3 ${theme.text} flex items-center gap-2`}>
                  <span className="w-3 h-3 bg-amber-500 rounded-sm"></span>
                  零声母（特殊）
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                  {Object.entries(specialSyllables).map(([py, key]) => (
                    <div key={py} className={`${theme.statCard} px-2 py-1.5 text-center text-sm`}>
                      <span className={theme.textMuted}>{py}</span>
                      <span className="mx-1 text-slate-400">→</span>
                      <span className="text-amber-500 dark:text-amber-400 font-mono font-bold">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
