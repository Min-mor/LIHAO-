import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Heart, Share2, Star, MapPin, Clock, Calendar,
  Users, ChevronRight, Play, Wifi, Car, Coffee, Waves,
  Dumbbell, Check, X, Minus, Plus, Copy, Link2, MessageCircle,
  Image as ImageIcon
} from 'lucide-react'

// Toast component
function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] bg-gray-800 text-white text-sm px-5 py-2.5 rounded-full shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Share panel (bottom sheet)
function SharePanel({ show, onClose }) {
  const shareOptions = [
    { icon: MessageCircle, name: '微信好友', color: 'text-green-500' },
    { icon: MessageCircle, name: '朋友圈', color: 'text-green-500' },
    { icon: Link2, name: '复制链接', color: 'text-blue-500' },
    { icon: Copy, name: '复制口令', color: 'text-orange-500' },
  ]

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[70] px-6 pt-5 pb-8"
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-bold text-gray-800 mb-5 text-center">分享至</h3>
            <div className="grid grid-cols-4 gap-6">
              {shareOptions.map((opt, i) => (
                <button
                  key={i}
                  className="flex flex-col items-center gap-2"
                  onClick={() => {
                    // could trigger different share actions
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                    <opt.icon size={24} className={opt.color} />
                  </div>
                  <span className="text-xs text-gray-600">{opt.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-full mt-6 py-3 text-center text-gray-500 text-sm border border-gray-100 rounded-xl"
            >
              取消
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Date picker panel (bottom sheet)
function DatePickerPanel({ show, onClose }) {
  const today = new Date()
  const [checkIn, setCheckIn] = useState(20)
  const [checkOut, setCheckOut] = useState(22)
  const [month] = useState(4) // May (0-indexed)

  const daysInMonth = 31
  const startDay = 3 // Wednesday

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[70] px-6 pt-5 pb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-1 bg-gray-200 rounded-full absolute left-1/2 -translate-x-1/2 top-3" />
              <h3 className="text-base font-bold text-gray-800 w-full text-center">选择日期</h3>
              <button onClick={onClose} className="absolute right-4 top-4">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                <span className="text-sm text-gray-600">
                  {month + 1}月{checkIn}日 - {month + 1}月{checkOut}日
                </span>
              </div>
              <span className="text-sm text-primary font-semibold">
                共{checkOut - checkIn}晚
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                <span key={d} className="text-xs text-gray-400 py-1">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const isCheckIn = day === checkIn
                const isCheckOut = day === checkOut
                const isInRange = day > checkIn && day < checkOut
                const isPast = day < today.getDate()
                return (
                  <button
                    key={day}
                    disabled={isPast}
                    onClick={() => {
                      if (day < checkIn || day === checkIn) {
                        setCheckIn(day)
                        if (checkOut <= day) setCheckOut(day + 1)
                      } else {
                        setCheckOut(day)
                      }
                    }}
                    className={`
                      w-10 h-10 rounded-full text-sm flex items-center justify-center mx-auto relative
                      ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                      ${isCheckIn ? 'bg-primary text-white font-bold' : ''}
                      ${isCheckOut ? 'bg-primary text-white font-bold' : ''}
                      ${isInRange && !isCheckIn && !isCheckOut ? 'bg-primary/10 text-primary' : ''}
                      ${!isInRange && !isCheckIn && !isCheckOut && !isPast ? 'text-gray-700' : ''}
                    `}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
            <button
              onClick={onClose}
              className="w-full mt-6 py-3 bg-primary text-white rounded-full font-semibold"
            >
              确定
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Guest picker panel (bottom sheet)
function GuestPickerPanel({ show, onClose, guestCounts, setGuestCounts }) {
  const updateCount = (type, delta) => {
    setGuestCounts(prev => {
      const next = { ...prev, [type]: Math.max(type === 'adult' ? 1 : 0, prev[type] + delta) }
      if (next.adult + next.child > 10) return prev
      return next
    })
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[70] px-6 pt-5 pb-8"
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-bold text-gray-800 mb-5 text-center">选择入住人数</h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">成人</p>
                  <p className="text-xs text-gray-400">18岁及以上</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateCount('adult', -1)}
                    disabled={guestCounts.adult <= 1}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-30"
                  >
                    <Minus size={16} className="text-gray-500" />
                  </button>
                  <span className="text-base font-semibold text-gray-800 w-6 text-center">
                    {guestCounts.adult}
                  </span>
                  <button
                    onClick={() => updateCount('adult', 1)}
                    className="w-8 h-8 rounded-full border border-primary flex items-center justify-center"
                  >
                    <Plus size={16} className="text-primary" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">儿童</p>
                  <p className="text-xs text-gray-400">0-17岁</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateCount('child', -1)}
                    disabled={guestCounts.child <= 0}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center disabled:opacity-30"
                  >
                    <Minus size={16} className="text-gray-500" />
                  </button>
                  <span className="text-base font-semibold text-gray-800 w-6 text-center">
                    {guestCounts.child}
                  </span>
                  <button
                    onClick={() => updateCount('child', 1)}
                    className="w-8 h-8 rounded-full border border-primary flex items-center justify-center"
                  >
                    <Plus size={16} className="text-primary" />
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full mt-6 py-3 bg-primary text-white rounded-full font-semibold"
            >
              确定
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Full reviews panel (bottom sheet)
function ReviewPanel({ show, onClose, reviews }) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[70] px-6 pt-5 pb-8 max-h-[80vh] overflow-y-auto"
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-bold text-gray-800 mb-5 text-center">全部用户评价（2345）</h3>
            <div className="space-y-5">
              {reviews.map((review, i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center mb-2">
                    <img src={review.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <div className="ml-2 flex-1">
                      <p className="text-sm font-medium text-gray-800">{review.name}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            size={12}
                            className={j < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          />
                        ))}
                        <span className="text-gray-400 text-xs ml-2">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{review.content}</p>
                </div>
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-full mt-6 py-3 border border-gray-200 text-gray-500 rounded-full font-semibold"
            >
              关闭
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Full-screen image preview
function ImagePreview({ show, onClose, images, initialIndex }) {
  const [idx, setIdx] = useState(initialIndex || 0)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-[80] flex flex-col"
        >
          <div className="flex items-center justify-between px-4 pt-12 pb-3">
            <button onClick={onClose} className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <X size={24} className="text-white" />
            </button>
            <span className="text-white text-sm">{idx + 1}/{images.length}</span>
            <div className="w-10" />
          </div>
          <div className="flex-1 flex items-center justify-center px-4">
            <AnimatePresence mode="wait">
              <motion.img
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                src={images[idx]}
                alt=""
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-center gap-3 pb-8">
            <button
              onClick={() => setIdx(Math.max(0, idx - 1))}
              disabled={idx === 0}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center disabled:opacity-30"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <div className="flex gap-1.5">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
            <button
              onClick={() => setIdx(Math.min(images.length - 1, idx + 1))}
              disabled={idx === images.length - 1}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center disabled:opacity-30"
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Booking confirmation panel
function BookingPanel({ show, onClose, hotel, selectedRoom, rooms, guestCounts }) {
  const room = rooms.find(r => r.id === selectedRoom)
  const nights = 2

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[70] px-6 pt-5 pb-8"
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="text-base font-bold text-gray-800 mb-5 text-center">预订确认</h3>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">酒店</span>
                <span className="text-sm font-medium text-gray-800">{hotel?.name || '三亚亚龙湾度假酒店'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">房型</span>
                <span className="text-sm font-medium text-gray-800">{room?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">日期</span>
                <span className="text-sm font-medium text-gray-800">05-20 至 05-22</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">入住人数</span>
                <span className="text-sm font-medium text-gray-800">
                  {guestCounts.adult}成人{guestCounts.child > 0 ? ` ${guestCounts.child}儿童` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">房间数</span>
                <span className="text-sm font-medium text-gray-800">1间</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  ¥{room?.price} x {nights}晚
                </span>
                <span className="text-lg font-bold text-primary">¥{room ? room.price * nights : 0}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 py-3 bg-primary text-white rounded-full font-semibold"
            >
              确认支付 ¥{room ? room.price * nights : 0}
            </button>
            <button
              onClick={onClose}
              className="w-full mt-3 py-3 text-gray-400 text-sm text-center"
            >
              取消
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Facility detail popup
function FacilityPopup({ show, onClose, facility }) {
  const descriptions = {
    '免费WiFi': '全酒店覆盖高速免费WiFi，支持多设备同时连接，满足您的工作和娱乐需求。',
    '游泳池': '室外恒温泳池，配有儿童戏水区。开放时间：07:00-22:00，提供免费浴巾。',
    '健身房': '24小时开放健身房，配备跑步机、椭圆机、哑铃等专业器材，免费使用。',
    '餐厅': '酒店设有中餐厅、西餐厅及自助餐厅。早餐时间：06:30-10:00，提供丰富中西式早餐。',
    '停车场': '免费地下停车场，提供充电桩。24小时安保，车位充足无需预约。',
  }

  if (!facility) return null

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-[70] px-6 py-5 w-72"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <facility.icon size={20} className="text-primary" />
                <h3 className="text-base font-bold text-gray-800">{facility.name}</h3>
              </div>
              <button onClick={onClose}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {descriptions[facility.name] || '暂无详细信息'}
            </p>
            <button
              onClick={onClose}
              className="w-full mt-4 py-2.5 bg-primary/10 text-primary rounded-full text-sm font-semibold"
            >
              我知道了
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function HotelDetailPage({ hotel, onBack }) {
  // States
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [favorited, setFavorited] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showGuestPicker, setShowGuestPicker] = useState(false)
  const [showReviewPanel, setShowReviewPanel] = useState(false)
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [showBookingPanel, setShowBookingPanel] = useState(false)
  const [guestCounts, setGuestCounts] = useState({ adult: 2, child: 0 })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [previewImages, setPreviewImages] = useState([])
  const [previewIndex, setPreviewIndex] = useState(0)
  const [facilityPopup, setFacilityPopup] = useState(null)

  const scrollRef = useRef(null)

  const images = [
    hotel?.image || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
  ]

  const rooms = [
    { id: 1, name: '豪华海景房', size: '45㎡', bed: '1张大床1.8m', breakfast: '含双早', price: 1299, maxGuest: 2 },
    { id: 2, name: '至尊套房', size: '80㎡', bed: '1张大床2m', breakfast: '含双早', price: 2599, maxGuest: 3 },
    { id: 3, name: '亲子房', size: '50㎡', bed: '1大1小床', breakfast: '含三早', price: 1799, maxGuest: 4 },
  ]

  const facilities = [
    { icon: Wifi, name: '免费WiFi' },
    { icon: Waves, name: '游泳池' },
    { icon: Dumbbell, name: '健身房' },
    { icon: Coffee, name: '餐厅' },
    { icon: Car, name: '停车场' },
  ]

  const reviews = [
    {
      name: '旅行者小明',
      avatar: 'https://i.pravatar.cc/50?img=1',
      rating: 5,
      date: '2024-03-15',
      content: '超级棒的酒店！海景房视野超好，早餐也很丰富。服务人员态度热情，下次还会选择这里。',
      images: [
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop',
      ]
    },
    {
      name: '出差达人',
      avatar: 'https://i.pravatar.cc/50?img=2',
      rating: 4,
      date: '2024-03-10',
      content: '位置很好，离海边很近。房间设施齐全，卫生做的也不错。唯一不足是旺季价格有点贵。',
      images: [
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=100&h=100&fit=crop',
      ]
    },
  ]

  const allReviewImages = reviews.flatMap(r => r.images)

  const triggerToast = useCallback((msg) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }, [])

  // Scroll sync for image carousel
  const handleCarouselScroll = useCallback(() => {
    const container = scrollRef.current
    if (!container) return
    const scrollLeft = container.scrollLeft
    const itemWidth = container.offsetWidth
    const newIndex = Math.round(scrollLeft / itemWidth)
    if (newIndex !== currentImage) {
      setCurrentImage(newIndex)
    }
  }, [currentImage])

  // Scroll to specific image when dot clicked
  const scrollToImage = useCallback((index) => {
    const container = scrollRef.current
    if (!container) return
    container.scrollTo({ left: index * container.offsetWidth, behavior: 'smooth' })
    setCurrentImage(index)
  }, [])

  // Open image preview
  const openImagePreview = useCallback((imgs, index) => {
    setPreviewImages(imgs)
    setPreviewIndex(index)
    setShowImagePreview(true)
  }, [])

  return (
    <div className="h-full bg-gray-50 overflow-y-auto pb-24">
      {/* Toast */}
      <Toast message={toastMessage} visible={showToast} />

      {/* Share Panel */}
      <SharePanel show={showShare} onClose={() => setShowShare(false)} />

      {/* Date Picker */}
      <DatePickerPanel show={showDatePicker} onClose={() => setShowDatePicker(false)} />

      {/* Guest Picker */}
      <GuestPickerPanel
        show={showGuestPicker}
        onClose={() => setShowGuestPicker(false)}
        guestCounts={guestCounts}
        setGuestCounts={setGuestCounts}
      />

      {/* Review Panel */}
      <ReviewPanel show={showReviewPanel} onClose={() => setShowReviewPanel(false)} reviews={reviews} />

      {/* Image Preview */}
      <ImagePreview
        show={showImagePreview}
        onClose={() => setShowImagePreview(false)}
        images={previewImages}
        initialIndex={previewIndex}
      />

      {/* Booking Panel */}
      <BookingPanel
        show={showBookingPanel}
        onClose={() => setShowBookingPanel(false)}
        hotel={hotel}
        selectedRoom={selectedRoom}
        rooms={rooms}
        guestCounts={guestCounts}
      />

      {/* Facility Popup */}
      <FacilityPopup
        show={!!facilityPopup}
        onClose={() => setFacilityPopup(null)}
        facility={facilityPopup}
      />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-0 pb-3">
        <button onClick={onBack} className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <div className="flex space-x-2">
          {/* 1. Heart (favorite) button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setFavorited(f => !f)}
            className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <motion.div
              animate={favorited ? { scale: [1, 1.4, 1], rotate: [0, -15, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Heart
                size={20}
                className={favorited ? 'text-red-500 fill-current' : 'text-white'}
              />
            </motion.div>
          </motion.button>
          {/* 2. Share2 button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setShowShare(true)}
            className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <Share2 size={20} className="text-white" />
          </motion.button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        {/* 4. Image carousel with scroll sync */}
        <div
          ref={scrollRef}
          onScroll={handleCarouselScroll}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="w-full h-72 object-cover flex-shrink-0 snap-center"
              onClick={() => openImagePreview(images, i)}
            />
          ))}
        </div>
        {/* 3. Image carousel dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5">
          {images.map((_, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.7 }}
              onClick={() => scrollToImage(i)}
              className="flex items-center justify-center"
            >
              <motion.div
                animate={{
                  width: i === currentImage ? 16 : 8,
                  backgroundColor: i === currentImage ? '#ffffff' : 'rgba(255,255,255,0.5)',
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
              />
            </motion.button>
          ))}
        </div>
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
          {currentImage + 1}/{images.length}
        </div>
      </div>

      {/* Hotel Info */}
      <div className="bg-white px-4 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800">{hotel?.name || '三亚亚龙湾度假酒店'}</h1>
            <div className="flex items-center mt-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="font-bold text-orange-500 ml-1">{hotel?.rating || 4.8}</span>
              <span className="text-gray-500 text-sm ml-1">({hotel?.reviews || 2345}条评价)</span>
            </div>
          </div>
          {/* 5. "28个视频" link */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => triggerToast('查看全部相关视频')}
            className="flex items-center text-gray-500 text-sm"
          >
            <Play size={16} className="mr-1" />
            <span>28个视频</span>
          </motion.button>
        </div>

        <div className="flex items-center text-gray-500 text-sm mt-2">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{hotel?.location || '三亚市亚龙湾国家旅游度假区'}</span>
        </div>

        {/* 10. Hotel tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {['海景', '泳池', 'SPA', '亲子'].map(tag => (
            <motion.button
              key={tag}
              whileTap={{ scale: 0.9 }}
              onClick={() => triggerToast(`筛选：${tag}`)}
              className="text-xs text-primary bg-primary/10 px-2 py-1 rounded"
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 6. Date & 7. Guest Selection */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 6. Check-in/check-out date area */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowDatePicker(true)}
            className="flex items-center"
          >
            <div className="text-center">
              <p className="text-xs text-gray-500">入住</p>
              <p className="font-semibold text-gray-800">05-20</p>
            </div>
            <div className="mx-4 text-gray-300">-</div>
            <div className="text-center">
              <p className="text-xs text-gray-500">退房</p>
              <p className="font-semibold text-gray-800">05-22</p>
            </div>
          </motion.button>
          {/* 7. Guest selector */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowGuestPicker(true)}
            className="flex items-center text-gray-600"
          >
            <Users size={16} className="mr-1" />
            <span className="text-sm">
              {guestCounts.adult}成人{guestCounts.child > 0 ? `${guestCounts.child}儿童` : ''}
            </span>
            <ChevronRight size={16} className="ml-1" />
          </motion.button>
        </div>
      </div>

      {/* Video Section */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800">📺 相关视频（28）</h2>
          {/* 8. "查看全部" for videos */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => triggerToast('查看全部视频')}
            className="text-gray-500 text-sm"
          >
            查看全部
          </motion.button>
        </div>
        <div className="flex space-x-3 overflow-x-auto no-scrollbar">
          {[1, 2, 3, 4].map(i => (
            /* 9. Video thumbnail cards */
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => triggerToast('播放视频')}
              className="flex-shrink-0 w-28 text-left"
            >
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={`https://picsum.photos/200/280?random=${i}`}
                  alt=""
                  className="w-full h-36 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play size={24} className="text-white" fill="white" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1 truncate">博主名称</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Room Selection */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="font-bold text-gray-800 mb-4">🏠 房型选择</h2>
        <div className="space-y-3">
          {rooms.map(room => (
            <motion.div
              key={room.id}
              whileTap={{ scale: 0.98 }}
              className={`border-2 rounded-xl p-3 transition-colors cursor-pointer ${
                selectedRoom === room.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-100'
              }`}
              onClick={() => setSelectedRoom(room.id)}
            >
              <div className="flex">
                <div className="w-24 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={`https://picsum.photos/200/160?random=${room.id + 10}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 ml-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm">{room.name}</h3>
                    <AnimatePresence>
                      {selectedRoom === room.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        >
                          <Check size={16} className="text-primary" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {room.size} · {room.bed} · {room.breakfast}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">可住{room.maxGuest}人</p>
                  <p className="text-primary font-bold mt-1">¥{room.price}<span className="text-gray-400 text-xs font-normal">/晚</span></p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Facilities */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="font-bold text-gray-800 mb-4">📋 酒店设施</h2>
        <div className="grid grid-cols-5 gap-4">
          {/* 11. Facility icons */}
          {facilities.map((facility, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.85 }}
              onClick={() => setFacilityPopup(facility)}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                <facility.icon size={24} className="text-gray-500 mb-0" />
              </div>
              <span className="text-xs text-gray-600 text-center mt-1">{facility.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800">⭐ 用户评价（2345）</h2>
          {/* 12. "查看全部" for reviews */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowReviewPanel(true)}
            className="text-gray-500 text-sm flex items-center"
          >
            查看全部 <ChevronRight size={14} />
          </motion.button>
        </div>
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center mb-2">
                <img src={review.avatar} alt="" className="w-8 h-8 rounded-full" />
                <div className="ml-2 flex-1">
                  <p className="text-sm font-medium text-gray-800">{review.name}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={12}
                        className={j < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                    <span className="text-gray-400 text-xs ml-2">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">{review.content}</p>
              {/* 13. Review images */}
              {review.images.length > 0 && (
                <div className="flex space-x-2 mt-2">
                  {review.images.map((img, j) => {
                    const globalIdx = allReviewImages.indexOf(img)
                    return (
                      <motion.button
                        key={j}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openImagePreview(allReviewImages, globalIdx)}
                      >
                        <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex items-center z-30">
        <div className="flex-1">
          <div className="flex items-baseline">
            <span className="text-primary font-bold text-xl">¥{selectedRoom ? rooms.find(r => r.id === selectedRoom)?.price : hotel?.price || 1299}</span>
            <span className="text-gray-400 text-sm ml-1">/晚</span>
          </div>
          <p className="text-gray-500 text-xs">价格随时变动，以实际为准</p>
        </div>
        {/* 14. "立即预订" button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (selectedRoom) setShowBookingPanel(true)
          }}
          className={`px-8 py-3 rounded-full font-semibold text-white transition-colors ${
            selectedRoom
              ? 'bg-primary'
              : 'bg-gray-300'
          }`}
          disabled={!selectedRoom}
        >
          {selectedRoom ? '立即预订' : '请选择房型'}
        </motion.button>
      </div>
    </div>
  )
}
