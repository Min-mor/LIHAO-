import { useState, useCallback } from 'react'
import { Camera, Upload, Sparkles, MapPin, Music, Tag, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const templates = [
  { name: '旅行Vlog', icon: '✈️', color: 'from-blue-500 to-purple-500' },
  { name: '美食探店', icon: '🍜', color: 'from-orange-500 to-red-500' },
  { name: '酒店测评', icon: '🏨', color: 'from-green-500 to-teal-500' },
  { name: '攻略分享', icon: '📝', color: 'from-pink-500 to-rose-500' },
]

const editTools = [
  { icon: '✂️', label: '剪辑' },
  { icon: '🎵', label: '音乐' },
  { icon: '🏷️', label: '标签' },
  { icon: '📍', label: '地点' },
  { icon: '✨', label: '特效' },
  { icon: '📝', label: '字幕' },
  { icon: '🎨', label: '滤镜' },
  { icon: '📤', label: '封面' },
]

const popularTags = ['#旅行', '#酒店', '#美食', '#攻略', '#打卡', '#海景', '#民宿', '#自驾游', '#亲子游', '#小众景点']

const recentLocations = [
  { name: '三亚·亚龙湾', detail: '海南省三亚市' },
  { name: '成都·宽窄巷子', detail: '四川省成都市' },
  { name: '丽江·古城', detail: '云南省丽江市' },
  { name: '杭州·西湖', detail: '浙江省杭州市' },
  { name: '厦门·鼓浪屿', detail: '福建省厦门市' },
]

const popularMusic = [
  { name: '阳光海岸', artist: '旅行乐队', duration: '3:24' },
  { name: '漫步云端', artist: '轻音乐', duration: '4:10' },
  { name: '海浪声', artist: '自然音效', duration: '5:00' },
  { name: '旅途风光', artist: '民谣集', duration: '3:45' },
  { name: '夏日微风', artist: '清新旋律', duration: '2:58' },
]

const panelVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, y: 40, transition: { duration: 0.2 } },
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const toastVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 300 } },
  exit: { opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } },
}

export default function CreatePage() {
  const [step, setStep] = useState('select')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [caption, setCaption] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedMusic, setSelectedMusic] = useState(null)
  const [showToast, setShowToast] = useState(null)
  const [showToolPanel, setShowToolPanel] = useState(null)

  const triggerToast = useCallback((message) => {
    setShowToast(message)
    setTimeout(() => setShowToast(null), 2000)
  }, [])

  const handleCancel = useCallback(() => {
    setStep('select')
    setSelectedTemplate(null)
    setCaption('')
    setSelectedTags([])
    setSelectedLocation(null)
    setSelectedMusic(null)
    setShowToolPanel(null)
    triggerToast('已取消')
  }, [triggerToast])

  const handlePublish = useCallback(() => {
    triggerToast('发布成功！')
    setTimeout(() => {
      setStep('select')
      setSelectedTemplate(null)
      setCaption('')
      setSelectedTags([])
      setSelectedLocation(null)
      setSelectedMusic(null)
      setShowToolPanel(null)
    }, 1500)
  }, [triggerToast])

  const handleTemplateSelect = useCallback((template) => {
    setSelectedTemplate(template)
    setStep('edit')
    triggerToast(`已选择${template.name}模板`)
  }, [triggerToast])

  const handleToolClick = useCallback((tool) => {
    setShowToolPanel((prev) => (prev === tool.label ? null : tool.label))
    triggerToast(`正在打开${tool.label}...`)
  }, [triggerToast])

  const handleTagToggle = useCallback((tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }, [])

  const handleLocationSelect = useCallback((loc) => {
    setSelectedLocation(loc)
    setShowToolPanel(null)
    triggerToast(`已选择地点：${loc.name}`)
  }, [triggerToast])

  const handleMusicSelect = useCallback((music) => {
    setSelectedMusic(music)
    setShowToolPanel(null)
    triggerToast(`已选择音乐：${music.name}`)
  }, [triggerToast])

  return (
    <div className="h-full bg-gray-900 flex flex-col relative overflow-hidden">
      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            key="toast"
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-700/90 backdrop-blur-sm text-white text-sm px-5 py-2.5 rounded-full shadow-lg border border-gray-600"
          >
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-0 pb-4 relative z-10">
        <button
          className="text-white text-sm active:scale-95 transition-transform"
          onClick={handleCancel}
        >
          取消
        </button>
        <h2 className="text-white font-semibold">发布作品</h2>
        <button
          className="text-primary font-medium text-sm active:scale-95 transition-transform"
          onClick={handlePublish}
        >
          发布
        </button>
      </div>

      {step === 'select' ? (
        <>
          {/* Upload Options */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
            <div
              className="w-full max-w-xs aspect-square border-2 border-dashed border-gray-600 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors active:scale-[0.98]"
              onClick={() => setStep('record')}
            >
              <Camera size={64} className="text-gray-500 mb-4" />
              <p className="text-white text-lg font-medium mb-2">拍摄视频</p>
              <p className="text-gray-500 text-sm">记录你的旅行瞬间</p>
            </div>

            <div className="text-white text-sm">或</div>

            <div
              className="w-full max-w-xs aspect-[3/1] border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center cursor-pointer hover:border-primary transition-colors active:scale-[0.98]"
              onClick={() => setStep('edit')}
            >
              <Upload size={24} className="text-gray-500 mr-3" />
              <p className="text-gray-400">从相册选择视频</p>
            </div>
          </div>

          {/* Templates */}
          <div className="px-4 pb-24">
            <p className="text-gray-400 text-sm mb-3">视频模板</p>
            <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-4">
              {templates.map((template, i) => (
                <div
                  key={i}
                  onClick={() => handleTemplateSelect(template)}
                  className={`flex-shrink-0 w-24 h-24 rounded-xl bg-gradient-to-br ${template.color} flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 ${
                    selectedTemplate?.name === template.name
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105'
                      : 'hover:scale-105'
                  }`}
                >
                  <span className="text-3xl mb-1">{template.icon}</span>
                  <span className="text-white text-xs font-medium">{template.name}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Video Preview */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={48} className="text-primary" />
              </div>
              <p className="text-gray-400">视频编辑界面</p>
              <p className="text-gray-600 text-sm mt-1">选择视频后在此处编辑</p>
              {selectedTemplate && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-primary text-xs mt-2"
                >
                  当前模板：{selectedTemplate.name}
                </motion.p>
              )}
            </div>
          </div>

          {/* Edit Tools */}
          <div className="px-4 py-6 bg-gray-800 rounded-t-3xl relative z-10">
            <div className="grid grid-cols-4 gap-4">
              {editTools.map((tool, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleToolClick(tool)}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-1 transition-all active:scale-90 ${
                      showToolPanel === tool.label
                        ? 'bg-primary/20 ring-1 ring-primary'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {tool.icon}
                  </div>
                  <span
                    className={`text-xs ${
                      showToolPanel === tool.label ? 'text-primary' : 'text-gray-400'
                    }`}
                  >
                    {tool.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Caption */}
            <div className="mt-6">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="说点什么..."
                className="w-full bg-gray-700 rounded-xl p-4 text-white placeholder-gray-500 outline-none resize-none h-24 text-sm focus:ring-1 focus:ring-primary transition-shadow"
              />
              <p className="text-gray-600 text-xs text-right mt-1">{caption.length}/300</p>
            </div>

            {/* Options */}
            <div className="mt-4 space-y-3">
              {/* Tags */}
              <div
                className="flex items-center justify-between bg-gray-700 rounded-xl px-4 py-3 cursor-pointer active:scale-[0.99] transition-transform"
                onClick={() => handleToolClick({ label: '标签' })}
              >
                <div className="flex items-center">
                  <Tag size={18} className="text-gray-400 mr-2" />
                  <span className="text-gray-300 text-sm">添加标签</span>
                </div>
                <span className="text-gray-500 text-sm truncate max-w-[120px]">
                  {selectedTags.length > 0 ? selectedTags.join(' ') : '未添加'}
                </span>
              </div>

              {/* Location */}
              <div
                className="flex items-center justify-between bg-gray-700 rounded-xl px-4 py-3 cursor-pointer active:scale-[0.99] transition-transform"
                onClick={() => handleToolClick({ label: '地点' })}
              >
                <div className="flex items-center">
                  <MapPin size={18} className="text-gray-400 mr-2" />
                  <span className="text-gray-300 text-sm">添加地点</span>
                </div>
                <span className="text-gray-500 text-sm truncate max-w-[120px]">
                  {selectedLocation ? selectedLocation.name : '未添加'}
                </span>
              </div>

              {/* Music */}
              <div
                className="flex items-center justify-between bg-gray-700 rounded-xl px-4 py-3 cursor-pointer active:scale-[0.99] transition-transform"
                onClick={() => handleToolClick({ label: '音乐' })}
              >
                <div className="flex items-center">
                  <Music size={18} className="text-gray-400 mr-2" />
                  <span className="text-gray-300 text-sm">添加音乐</span>
                </div>
                <span className="text-gray-500 text-sm truncate max-w-[120px]">
                  {selectedMusic ? selectedMusic.name : '未添加'}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-20 left-0 right-0 text-center pointer-events-none">
        <p className="text-gray-500 text-xs">点击发布即表示同意《用户协议》</p>
      </div>

      {/* ========== Panels ========== */}
      <AnimatePresence>
        {showToolPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              key="panel-backdrop"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute inset-0 bg-black/50 z-20"
              onClick={() => setShowToolPanel(null)}
            />

            {/* Panel Content */}
            <motion.div
              key={`panel-${showToolPanel}`}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute bottom-0 left-0 right-0 bg-gray-800 rounded-t-3xl z-30 max-h-[60%] overflow-y-auto"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 sticky top-0 bg-gray-800 z-10">
                <h3 className="text-white font-semibold text-base">{showToolPanel}</h3>
                <button
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center active:scale-90 transition-transform"
                  onClick={() => setShowToolPanel(null)}
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>

              <div className="px-5 pb-8">
                {/* 标签面板 */}
                {showToolPanel === '标签' && (
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm">热门标签（点击选择/取消）</p>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all active:scale-95 ${
                            selectedTags.includes(tag)
                              ? 'bg-primary text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    {selectedTags.length > 0 && (
                      <p className="text-gray-500 text-xs">
                        已选：{selectedTags.join(' ')}
                      </p>
                    )}
                  </div>
                )}

                {/* 地点面板 */}
                {showToolPanel === '地点' && (
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm mb-3">最近去过的地方</p>
                    {recentLocations.map((loc) => (
                      <div
                        key={loc.name}
                        onClick={() => handleLocationSelect(loc)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all active:scale-[0.99] ${
                          selectedLocation?.name === loc.name
                            ? 'bg-primary/20 border border-primary'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <div>
                          <p className="text-white text-sm">{loc.name}</p>
                          <p className="text-gray-500 text-xs">{loc.detail}</p>
                        </div>
                        {selectedLocation?.name === loc.name && (
                          <Check size={16} className="text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 音乐面板 */}
                {showToolPanel === '音乐' && (
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm mb-3">热门音乐</p>
                    {popularMusic.map((music) => (
                      <div
                        key={music.name}
                        onClick={() => handleMusicSelect(music)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all active:scale-[0.99] ${
                          selectedMusic?.name === music.name
                            ? 'bg-primary/20 border border-primary'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center mr-3">
                            <Music size={16} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="text-white text-sm">{music.name}</p>
                            <p className="text-gray-500 text-xs">{music.artist} · {music.duration}</p>
                          </div>
                        </div>
                        {selectedMusic?.name === music.name && (
                          <Check size={16} className="text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 通用工具面板（剪辑/特效/字幕/滤镜/封面） */}
                {!['标签', '地点', '音乐'].includes(showToolPanel) && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-20 h-20 rounded-2xl bg-gray-700 flex items-center justify-center mb-4">
                      <Sparkles size={32} className="text-primary" />
                    </div>
                    <p className="text-white font-medium mb-1">{showToolPanel}工具</p>
                    <p className="text-gray-500 text-sm text-center">
                      {showToolPanel === '剪辑' && '裁剪、分割、调整视频片段'}
                      {showToolPanel === '特效' && '添加转场、动画和视觉特效'}
                      {showToolPanel === '字幕' && '自动识别或手动添加字幕'}
                      {showToolPanel === '滤镜' && '选择视频滤镜和调色方案'}
                      {showToolPanel === '封面' && '选择或自定义视频封面'}
                    </p>
                    <button
                      className="mt-6 bg-primary text-white px-6 py-2.5 rounded-full text-sm font-medium active:scale-95 transition-transform"
                      onClick={() => {
                        setShowToolPanel(null)
                        triggerToast(`${showToolPanel}功能开发中`)
                      }}
                    >
                      了解更多
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
