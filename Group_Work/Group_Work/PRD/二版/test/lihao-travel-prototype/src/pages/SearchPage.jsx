import { useState, useEffect, useCallback } from 'react'
import { Search, TrendingUp, X, MapPin, Clock } from 'lucide-react'

const hotSearches = [
  { keyword: '三亚', count: '120万' },
  { keyword: '丽江古城', count: '98万' },
  { keyword: '张家界', count: '85万' },
  { keyword: '成都美食', count: '76万' },
  { keyword: '厦门鼓浪屿', count: '65万' },
  { keyword: '青岛海滨', count: '54万' },
  { keyword: '大理洱海', count: '48万' },
  { keyword: '桂林山水', count: '42万' },
  { keyword: '北京故宫', count: '39万' },
  { keyword: '西藏拉萨', count: '35万' },
]

const categories = [
  { name: '酒店', icon: '🏨', color: 'bg-orange-500' },
  { name: '机票', icon: '✈️', color: 'bg-blue-500' },
  { name: '景点', icon: '🎫', color: 'bg-green-500' },
  { name: '美食', icon: '🍜', color: 'bg-red-500' },
  { name: '玩乐', icon: '🎮', color: 'bg-purple-500' },
  { name: '定制', icon: '🗺️', color: 'bg-teal-500' },
]

const destinations = [
  {
    name: '三亚',
    desc: '热带海滨度假胜地',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300&h=200&fit=crop',
    videos: 2340
  },
  {
    name: '丽江',
    desc: '古城慢生活',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=300&h=200&fit=crop',
    videos: 1890
  },
  {
    name: '成都',
    desc: '天府之国美食之都',
    image: 'https://images.unsplash.com/photo-1609172225755-9e9c979f9b97?w=300&h=200&fit=crop',
    videos: 3200
  },
  {
    name: '厦门',
    desc: '海上花园',
    image: 'https://images.unsplash.com/photo-1569074187119-c87815b476da?w=300&h=200&fit=crop',
    videos: 1560
  },
  {
    name: '青岛',
    desc: '啤酒与海滨',
    image: 'https://images.unsplash.com/photo-1598873237575-6d8c3bb1a8b2?w=300&h=200&fit=crop',
    videos: 980
  },
  {
    name: '西安',
    desc: '千年古都',
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=300&h=200&fit=crop',
    videos: 2100
  },
]

export default function SearchPage({ onNavigate }) {
  const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState('发现')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showMoreSearches, setShowMoreSearches] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '' })

  const showToastMessage = useCallback((message) => {
    setToast({ visible: true, message })
  }, [])

  useEffect(() => {
    if (!toast.visible) return
    const timer = setTimeout(() => {
      setToast({ visible: false, message: '' })
    }, 1500)
    return () => clearTimeout(timer)
  }, [toast.visible])

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat.name)
    showToastMessage(`正在搜索${cat.name}...`)
  }

  const handleHotSearchClick = (keyword) => {
    setSearchText(keyword)
    onNavigate('hotel-list')
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchText.trim()) {
      onNavigate('hotel-list')
    }
  }

  const handleTopicClick = () => {
    onNavigate('home')
  }

  const handleViewAllDestinations = () => {
    onNavigate('hotel-list')
  }

  const displayedSearches = showMoreSearches ? hotSearches : hotSearches.slice(0, 6)

  return (
    <div className="h-full bg-white relative">
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-2 pointer-events-none">
          <div className="bg-black/75 text-white text-sm px-5 py-2.5 rounded-full shadow-lg animate-pulse">
            {toast.message}
          </div>
        </div>
      )}

      {/* Search Header */}
      <div className="sticky top-0 bg-white z-10 px-4 pt-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 flex items-center">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="搜索目的地、酒店、景点..."
              className="flex-1 ml-2 bg-transparent outline-none text-sm"
            />
            {searchText && (
              <button onClick={() => setSearchText('')}>
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
          <button
            className="text-primary font-medium text-sm"
            onClick={() => onNavigate('hotel-list')}
          >
            搜索
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-6 mt-4">
          {['发现', '酒店', '景点', '美食'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium pb-1 transition-all ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-20 overflow-y-auto h-full">
        {/* Categories */}
        <div className="grid grid-cols-6 gap-4 py-4">
          {categories.map(cat => (
            <div
              key={cat.name}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleCategoryClick(cat)}
            >
              <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center text-2xl mb-1 transition-transform ${selectedCategory === cat.name ? 'scale-110 ring-2 ring-offset-2 ring-gray-300' : ''}`}>
                {cat.icon}
              </div>
              <span className={`text-xs ${selectedCategory === cat.name ? 'text-primary font-semibold' : 'text-gray-700'}`}>{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Hot Search */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">🔥 热门搜索</h3>
            <button
              className="text-xs text-gray-500"
              onClick={() => setShowMoreSearches(prev => !prev)}
            >
              {showMoreSearches ? '收起' : '更多'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {displayedSearches.map((item, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors"
                onClick={() => handleHotSearchClick(item.keyword)}
              >
                <span className="text-sm text-gray-700">{item.keyword}</span>
                <span className="text-xs text-gray-400 ml-1">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">
              <TrendingUp size={16} className="inline mr-1 text-orange-500" />
              热门话题
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { title: '#夏日海岛推荐#', desc: '2.3万人参与', color: 'from-blue-400 to-cyan-400' },
              { title: '#小众目的地打卡#', desc: '1.8万人参与', color: 'from-purple-400 to-pink-400' },
              { title: '#周末周边游#', desc: '3.1万人参与', color: 'from-green-400 to-emerald-400' },
            ].map((topic, i) => (
              <div
                key={i}
                className={`bg-gradient-to-r ${topic.color} rounded-xl p-4 text-white cursor-pointer hover:opacity-90 active:opacity-80 transition-opacity`}
                onClick={handleTopicClick}
              >
                <p className="font-semibold">{topic.title}</p>
                <p className="text-sm opacity-80 mt-1">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Destinations */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">📍 热门目的地</h3>
            <button
              className="text-xs text-gray-500"
              onClick={handleViewAllDestinations}
            >
              查看全部
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {destinations.map((dest, i) => (
              <div
                key={i}
                className="relative rounded-xl overflow-hidden cursor-pointer"
                onClick={() => onNavigate('hotel-list')}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-28 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 text-white">
                  <p className="font-semibold text-sm">{dest.name}</p>
                  <p className="text-xs opacity-80">{dest.desc}</p>
                </div>
                <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5">
                  <span className="text-xs text-gray-700">{dest.videos}视频</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
