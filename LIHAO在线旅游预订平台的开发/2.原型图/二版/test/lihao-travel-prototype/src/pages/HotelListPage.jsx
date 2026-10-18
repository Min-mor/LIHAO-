import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Filter, MapPin, Star, Search, SlidersHorizontal, X, Calendar, Check } from 'lucide-react'

const hotels = [
  {
    id: 1,
    name: '三亚亚龙湾度假酒店',
    location: '三亚市亚龙湾国家旅游度假区',
    rating: 4.8,
    reviews: 2345,
    price: 1299,
    originalPrice: 1899,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop',
    tags: ['海景', '泳池', 'SPA'],
    discount: 30,
    videoCount: 28,
    starRating: 5,
    facilities: ['WiFi', '泳池', '早餐', '停车场', '健身房']
  },
  {
    id: 2,
    name: '三亚海棠湾君悦酒店',
    location: '三亚市海棠区海棠北路68号',
    rating: 4.9,
    reviews: 1890,
    price: 1599,
    originalPrice: 2299,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    tags: ['亲子', '海滨', '美食'],
    discount: 25,
    videoCount: 15,
    starRating: 5,
    facilities: ['WiFi', '泳池', '早餐', '停车场', '健身房']
  },
  {
    id: 3,
    name: '三亚亚特兰蒂斯酒店',
    location: '三亚市海棠区海棠北路36号',
    rating: 4.7,
    reviews: 5678,
    price: 2999,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=300&fit=crop',
    tags: ['水族馆', '水上乐园', '奢华'],
    discount: 20,
    videoCount: 56,
    starRating: 5,
    facilities: ['WiFi', '泳池', '早餐', '停车场', '健身房']
  },
  {
    id: 4,
    name: '三亚湾海居铂尔曼度假酒店',
    location: '三亚市三亚湾158号',
    rating: 4.6,
    reviews: 1234,
    price: 899,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
    tags: ['性价比', '海滨', '家庭'],
    discount: 35,
    videoCount: 8,
    starRating: 4,
    facilities: ['WiFi', '泳池', '早餐', '停车场']
  },
  {
    id: 5,
    name: '三亚艾迪逊酒店',
    location: '三亚市海棠区海棠北路100号',
    rating: 4.8,
    reviews: 1567,
    price: 1899,
    originalPrice: 2599,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
    tags: ['设计感', '时尚', '网红'],
    discount: 25,
    videoCount: 42,
    starRating: 5,
    facilities: ['WiFi', '早餐', '停车场', '健身房']
  },
]

const allTags = [...new Set(hotels.flatMap(h => h.tags))]

const facilityOptions = ['WiFi', '泳池', '早餐', '停车场', '健身房']

function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-gray-800 text-white text-sm px-5 py-2.5 rounded-full shadow-lg whitespace-nowrap"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DatePickerPanel({ checkIn, checkOut, onSelect, onClose }) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selecting, setSelecting] = useState('checkIn')

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  const formatDate = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    return `${mm}-${dd}`
  }

  const handleDayClick = (day) => {
    const dateStr = formatDate(currentYear, currentMonth, day)
    if (selecting === 'checkIn') {
      onSelect('checkIn', dateStr)
      setSelecting('checkOut')
    } else {
      onSelect('checkOut', dateStr)
      setSelecting('checkIn')
    }
  }

  const isSameDate = (day) => {
    const dateStr = formatDate(currentYear, currentMonth, day)
    return (selecting === 'checkIn' && dateStr === checkIn) ||
           (selecting === 'checkOut' && dateStr === checkOut)
  }

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] overflow-auto"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800">选择日期</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setSelecting('checkIn')}
            className={`flex-1 py-2 rounded-lg text-center text-sm transition-colors ${
              selecting === 'checkIn' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            入住: {checkIn}
          </button>
          <span className="text-gray-400">-</span>
          <button
            onClick={() => setSelecting('checkOut')}
            className={`flex-1 py-2 rounded-lg text-center text-sm transition-colors ${
              selecting === 'checkOut' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            离店: {checkOut}
          </button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="text-gray-500 text-sm px-2">&lt;</button>
          <span className="text-sm font-medium text-gray-700">{currentYear}年{currentMonth + 1}月</span>
          <button onClick={nextMonth} className="text-gray-500 text-sm px-2">&gt;</button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekDays.map(d => (
            <div key={d} className="text-xs text-gray-400 py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const selected = isSameDate(day)
            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`w-9 h-9 rounded-full text-sm flex items-center justify-center mx-auto transition-colors ${
                  selected
                    ? 'bg-primary text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-medium text-sm"
        >
          确认日期
        </button>
      </div>
    </motion.div>
  )
}

function FilterPanel({ filterSettings, onChange, onClose, onReset, onApply }) {
  const handlePriceChange = (field, value) => {
    const num = value === '' ? '' : Number(value)
    onChange({ ...filterSettings, [field]: num })
  }

  const toggleStarRating = (star) => {
    const ratings = filterSettings.starRatings.includes(star)
      ? filterSettings.starRatings.filter(r => r !== star)
      : [...filterSettings.starRatings, star]
    onChange({ ...filterSettings, starRatings: ratings })
  }

  const toggleFacility = (facility) => {
    const facilities = filterSettings.facilities.includes(facility)
      ? filterSettings.facilities.filter(f => f !== facility)
      : [...filterSettings.facilities, facility]
    onChange({ ...filterSettings, facilities })
  }

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[75vh] overflow-auto"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800">筛选条件</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Price Range */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">价格范围 (元/晚)</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="最低价"
              value={filterSettings.priceMin}
              onChange={(e) => handlePriceChange('priceMin', e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary"
            />
            <span className="text-gray-400 text-sm">-</span>
            <input
              type="number"
              placeholder="最高价"
              value={filterSettings.priceMax}
              onChange={(e) => handlePriceChange('priceMax', e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Star Rating */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">星级</p>
          <div className="flex items-center gap-3">
            {[3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => toggleStarRating(star)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm border transition-colors ${
                  filterSettings.starRatings.includes(star)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {filterSettings.starRatings.includes(star) && <Check size={14} />}
                {star}星
              </button>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">设施</p>
          <div className="flex flex-wrap gap-2">
            {facilityOptions.map(facility => (
              <button
                key={facility}
                onClick={() => toggleFacility(facility)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  filterSettings.facilities.includes(facility)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {facility}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            重置
          </button>
          <button
            onClick={onApply}
            className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            确认筛选
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function HotelListPage({ onBack, onNavigate }) {
  const [activeTab, setActiveTab] = useState('推荐')
  const [searchText, setSearchText] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [checkIn, setCheckIn] = useState('05-20')
  const [checkOut, setCheckOut] = useState('05-22')
  const [activeTag, setActiveTag] = useState(null)
  const [toast, setToast] = useState({ message: '', visible: false })

  const [filterSettings, setFilterSettings] = useState({
    priceMin: '',
    priceMax: '',
    starRatings: [],
    facilities: []
  })

  const [appliedFilterSettings, setAppliedFilterSettings] = useState({
    priceMin: '',
    priceMax: '',
    starRatings: [],
    facilities: []
  })

  const tabs = ['推荐', '距离', '评分', '价格']

  const showToast = useCallback((message) => {
    setToast({ message, visible: true })
    setTimeout(() => setToast({ message: '', visible: false }), 1800)
  }, [])

  const handleSearch = useCallback(() => {
    if (searchText.trim()) {
      showToast(`搜索: "${searchText.trim()}"`)
    }
  }, [searchText, showToast])

  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }, [handleSearch])

  const handleDateSelect = useCallback((field, value) => {
    if (field === 'checkIn') {
      setCheckIn(value)
    } else {
      setCheckOut(value)
    }
  }, [])

  const handleFilterReset = useCallback(() => {
    setFilterSettings({
      priceMin: '',
      priceMax: '',
      starRatings: [],
      facilities: []
    })
    setAppliedFilterSettings({
      priceMin: '',
      priceMax: '',
      starRatings: [],
      facilities: []
    })
    setActiveTag(null)
    showToast('已重置所有筛选条件')
  }, [showToast])

  const handleFilterApply = useCallback(() => {
    setAppliedFilterSettings({ ...filterSettings })
    setShowFilterPanel(false)
    const parts = []
    if (filterSettings.priceMin !== '' || filterSettings.priceMax !== '') {
      parts.push('价格')
    }
    if (filterSettings.starRatings.length > 0) {
      parts.push(`${filterSettings.starRatings.map(s => s + '星').join('/')}`)
    }
    if (filterSettings.facilities.length > 0) {
      parts.push(`${filterSettings.facilities.join('/')}`)
    }
    if (parts.length > 0) {
      showToast(`已应用筛选: ${parts.join(', ')}`)
    } else {
      showToast('未设置筛选条件')
    }
  }, [filterSettings, showToast])

  const handleTagClick = useCallback((tag) => {
    if (activeTag === tag) {
      setActiveTag(null)
      showToast(`已取消筛选: ${tag}`)
    } else {
      setActiveTag(tag)
      showToast(`筛选标签: ${tag}`)
    }
  }, [activeTag, showToast])

  const handleBannerClick = useCallback(() => {
    onNavigate('home')
  }, [onNavigate])

  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => {
      // Search text filter
      if (searchText.trim() && !hotel.name.includes(searchText.trim())) {
        return false
      }

      // Active tag filter
      if (activeTag && !hotel.tags.includes(activeTag)) {
        return false
      }

      // Price filter
      if (appliedFilterSettings.priceMin !== '' && hotel.price < appliedFilterSettings.priceMin) {
        return false
      }
      if (appliedFilterSettings.priceMax !== '' && hotel.price > appliedFilterSettings.priceMax) {
        return false
      }

      // Star rating filter
      if (appliedFilterSettings.starRatings.length > 0 && !appliedFilterSettings.starRatings.includes(hotel.starRating)) {
        return false
      }

      // Facilities filter
      if (appliedFilterSettings.facilities.length > 0) {
        const hasAll = appliedFilterSettings.facilities.every(f => hotel.facilities.includes(f))
        if (!hasAll) return false
      }

      return true
    })
  }, [searchText, activeTag, appliedFilterSettings])

  const hasActiveFilters = activeTag !== null ||
    appliedFilterSettings.priceMin !== '' ||
    appliedFilterSettings.priceMax !== '' ||
    appliedFilterSettings.starRatings.length > 0 ||
    appliedFilterSettings.facilities.length > 0

  const computeNights = () => {
    const [inM, inD] = checkIn.split('-').map(Number)
    const [outM, outD] = checkOut.split('-').map(Number)
    const inDate = new Date(2025, inM - 1, inD)
    const outDate = new Date(2025, outM - 1, outD)
    const diff = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 1
  }

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-0 pb-3 sticky top-0 z-20">
        <div className="flex items-center mb-3">
          <button onClick={onBack} className="text-gray-600 mr-2">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
            <MapPin size={16} className="text-primary mr-2" />
            <span className="text-gray-700 text-sm">三亚</span>
            <span className="text-gray-400 text-sm mx-2">|</span>
            <input
              type="text"
              placeholder="搜索酒店名称..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button onClick={handleSearch} className="text-gray-400 hover:text-primary transition-colors">
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <button
            onClick={() => setShowDatePicker(true)}
            className="px-3 py-1 bg-gray-100 rounded-full mr-2 hover:bg-gray-200 transition-colors flex items-center gap-1"
          >
            <Calendar size={14} />
            {checkIn}
          </button>
          <span className="text-gray-400">-</span>
          <button
            onClick={() => setShowDatePicker(true)}
            className="px-3 py-1 bg-gray-100 rounded-full mx-2 hover:bg-gray-200 transition-colors flex items-center gap-1"
          >
            <Calendar size={14} />
            {checkOut}
          </button>
          <span className="text-gray-400 mx-2">共{computeNights()}晚</span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  activeTab === tab
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilterPanel(true)}
            className={`flex items-center transition-colors ${hasActiveFilters ? 'text-primary' : 'text-gray-600'}`}
          >
            <SlidersHorizontal size={16} className="mr-1" />
            <span className="text-sm">筛选</span>
            {hasActiveFilters && (
              <span className="ml-1 w-1.5 h-1.5 bg-primary rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Video Banner */}
      <div className="bg-white mx-4 mt-3 rounded-xl overflow-hidden">
        <div
          className="relative cursor-pointer"
          onClick={handleBannerClick}
        >
          <img
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=200&fit=crop"
            alt=""
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
          <div className="absolute inset-0 flex items-center px-4">
            <div>
              <p className="text-white text-lg font-bold">三亚旅行季</p>
              <p className="text-white/80 text-sm">看视频，选好酒店</p>
            </div>
            <div className="ml-auto flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/40?img=${i}`}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-white text-sm ml-2">1.2万人正在看</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Bar */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 mt-3 overflow-hidden"
          >
            <div className="flex items-center gap-2 flex-wrap">
              {activeTag && (
                <button
                  onClick={() => handleTagClick(activeTag)}
                  className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full"
                >
                  {activeTag}
                  <X size={12} />
                </button>
              )}
              {appliedFilterSettings.starRatings.map(s => (
                <button
                  key={`star-${s}`}
                  onClick={handleFilterReset}
                  className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full"
                >
                  {s}星
                  <X size={12} />
                </button>
              ))}
              {appliedFilterSettings.facilities.map(f => (
                <button
                  key={`fac-${f}`}
                  onClick={handleFilterReset}
                  className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full"
                >
                  {f}
                  <X size={12} />
                </button>
              ))}
              {(appliedFilterSettings.priceMin !== '' || appliedFilterSettings.priceMax !== '') && (
                <button
                  onClick={handleFilterReset}
                  className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full"
                >
                  ¥{appliedFilterSettings.priceMin || '0'}-{appliedFilterSettings.priceMax || '不限'}
                  <X size={12} />
                </button>
              )}
              <button
                onClick={handleFilterReset}
                className="text-xs text-gray-400 hover:text-gray-600 ml-1"
              >
                清除全部
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hotel List */}
      <div className="px-4 pb-20 mt-3 space-y-3">
        {filteredHotels.length > 0 ? (
          filteredHotels.map(hotel => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer"
              onClick={() => onNavigate('hotel-detail', { hotel })}
            >
              <div className="relative">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-40 object-cover"
                />
                {hotel.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-0.5 rounded">
                    {hotel.discount}折
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center">
                  <span className="mr-1">🎬</span>
                  <span>{hotel.videoCount}个视频</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{hotel.name}</h3>
                <div className="flex items-center text-gray-500 text-xs mb-2">
                  <MapPin size={12} className="mr-1" />
                  <span className="truncate">{hotel.location}</span>
                </div>
                <div className="flex items-center flex-wrap gap-1 mb-2">
                  {hotel.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTagClick(tag)
                      }}
                      className={`text-xs px-2 py-0.5 rounded transition-colors ${
                        activeTag === tag
                          ? 'bg-primary text-white'
                          : 'text-primary bg-primary/10 hover:bg-primary/20'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium text-gray-800">{hotel.rating}</span>
                    <span className="text-gray-400 text-xs ml-1">({hotel.reviews})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-primary font-bold text-lg">¥{hotel.price}</span>
                    <span className="text-gray-400 text-xs line-through ml-1">¥{hotel.originalPrice}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <Search size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">未找到符合条件的酒店</p>
            <button
              onClick={handleFilterReset}
              className="mt-3 text-primary text-sm underline"
            >
              清除筛选条件
            </button>
          </div>
        )}
      </div>

      {/* Date Picker Bottom Sheet */}
      <AnimatePresence>
        {showDatePicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowDatePicker(false)}
            />
            <DatePickerPanel
              checkIn={checkIn}
              checkOut={checkOut}
              onSelect={handleDateSelect}
              onClose={() => setShowDatePicker(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Filter Panel Bottom Sheet */}
      <AnimatePresence>
        {showFilterPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowFilterPanel(false)}
            />
            <FilterPanel
              filterSettings={filterSettings}
              onChange={setFilterSettings}
              onClose={() => setShowFilterPanel(false)}
              onReset={handleFilterReset}
              onApply={handleFilterApply}
            />
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
