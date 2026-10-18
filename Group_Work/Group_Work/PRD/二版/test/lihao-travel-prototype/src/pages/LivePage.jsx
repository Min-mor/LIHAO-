import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, Heart, MessageCircle, Gift, Share2, ShoppingBag, MoreHorizontal, Send, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const initialMessages = [
  { id: 1, user: '用户1234', text: '这个地方好美啊！', color: 'from-pink-500 to-rose-500' },
  { id: 2, user: '旅行爱好者', text: '多少钱一晚？', color: 'from-blue-500 to-cyan-500' },
  { id: 3, user: '美食达人', text: '主播好漂亮 😍', color: 'from-purple-500 to-pink-500' },
  { id: 4, user: '小清新', text: '求酒店名字！', color: 'from-green-500 to-emerald-500' },
  { id: 5, user: '摄影师', text: '这个机位绝了', color: 'from-orange-500 to-yellow-500' },
  { id: 6, user: '背包客', text: '推荐一下路线呗', color: 'from-teal-500 to-cyan-500' },
]

const products = [
  { id: 1, name: '三亚亚龙湾度假酒店', price: 1299, originalPrice: 1899, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200', sales: 256 },
  { id: 2, name: '双人海鲜自助餐', price: 299, originalPrice: 399, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200', sales: 128 },
  { id: 3, name: '亚特兰蒂斯水世界门票', price: 298, originalPrice: 358, image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=200', sales: 89 },
]

const gifts = [
  { id: 1, name: '玫瑰', emoji: '🥀', price: 9 },
  { id: 2, name: '爱心', emoji: '❤️', price: 19 },
  { id: 3, name: '火箭', emoji: '🚀', price: 99 },
  { id: 4, name: '皇冠', emoji: '👑', price: 199 },
  { id: 5, name: '城堡', emoji: '🏰', price: 520 },
]

const shareOptions = [
  { id: 1, name: '微信好友', icon: '💬', color: 'bg-green-500' },
  { id: 2, name: '朋友圈', icon: '📷', color: 'bg-green-600' },
  { id: 3, name: '微博', icon: '🔴', color: 'bg-red-500' },
  { id: 4, name: 'QQ', icon: '🐧', color: 'bg-blue-500' },
  { id: 5, name: '复制链接', icon: '🔗', color: 'bg-gray-500' },
]

const moreMenuItems = [
  { id: 1, label: '分享直播间', icon: '📤' },
  { id: 2, label: '举报', icon: '⚠️' },
  { id: 3, label: '画质切换', icon: '🖥️' },
]

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const bottomSheetVariants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { y: '100%', transition: { duration: 0.2 } },
}

const menuVariants = {
  hidden: { opacity: 0, scale: 0.9, y: -10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.1 } },
}

const toastVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 300 } },
  exit: { opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } },
}

export default function LivePage({ onBack }) {
  const [message, setMessage] = useState('')
  const [liked, setLiked] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [followed, setFollowed] = useState(false)
  const [showGiftPanel, setShowGiftPanel] = useState(false)
  const [showSharePanel, setShowSharePanel] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showToast, setShowToast] = useState(null)
  const [chatMessages, setChatMessages] = useState(initialMessages)
  const [cartItems, setCartItems] = useState([])
  const chatEndRef = useRef(null)
  const toastTimerRef = useRef(null)

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages])

  const triggerToast = (text) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setShowToast(text)
    toastTimerRef.current = setTimeout(() => setShowToast(null), 2000)
  }

  const handleSendMessage = () => {
    const trimmed = message.trim()
    if (!trimmed) return
    const newMsg = {
      id: Date.now(),
      user: '我',
      text: trimmed,
      color: 'from-violet-500 to-purple-500',
    }
    setChatMessages((prev) => [...prev, newMsg])
    setMessage('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFollow = () => {
    setFollowed((prev) => !prev)
    triggerToast(followed ? '已取消关注' : '关注成功')
  }

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id)
      if (exists) return prev
      return [...prev, product]
    })
    triggerToast(`已加入购物车: ${product.name}`)
  }

  const handleBuyNow = () => {
    triggerToast('正在跳转到结算页面...')
  }

  const handleSendGift = (gift) => {
    triggerToast(`已送出 ${gift.name}`)
    setShowGiftPanel(false)
  }

  const handleShare = (option) => {
    triggerToast(`已分享到${option.name}`)
    setShowSharePanel(false)
  }

  const handleMoreMenu = (item) => {
    triggerToast(item.label)
    setShowMoreMenu(false)
  }

  const handleHostClick = () => {
    triggerToast('查看主播主页')
  }

  return (
    <div className="h-full bg-dark relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-0 px-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-90 transition-transform">
            <ChevronLeft size={24} className="text-white" />
          </button>

          {/* Live Info */}
          <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-2 animate-pulse text-white text-xs font-bold">
              LIVE
            </div>
            <span className="text-white text-sm font-medium">125.6万</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-90 transition-transform"
            >
              <MoreHorizontal size={24} className="text-white" />
            </button>

            <AnimatePresence>
              {showMoreMenu && (
                <>
                  <motion.div
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-30"
                    onClick={() => setShowMoreMenu(false)}
                  />
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 top-12 z-40 bg-gray-900/95 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden min-w-[160px] shadow-2xl"
                  >
                    {moreMenuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMoreMenu(item)}
                        className="w-full flex items-center px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors"
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Video Background */}
      <img
        src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=1200&fit=crop"
        alt=""
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      {/* Host Info */}
      <div className="absolute top-24 left-4 z-20">
        <div className="flex items-center">
          <button onClick={handleHostClick} className="active:scale-95 transition-transform">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
              alt=""
              className="w-12 h-12 rounded-full border-2 border-white"
            />
          </button>
          <button onClick={handleHostClick} className="ml-2 text-left active:scale-95 transition-transform">
            <p className="text-white font-semibold text-sm">@旅行达人小雅</p>
            <p className="text-white/70 text-xs">125.6万粉丝</p>
          </button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleFollow}
            className={`ml-3 px-3 py-1 text-white text-xs rounded-full font-medium transition-colors ${
              followed
                ? 'bg-white/20 border border-white/30'
                : 'bg-red-500'
            }`}
          >
            {followed ? '已关注' : '+ 关注'}
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="absolute top-40 left-4 right-20 z-20">
        <div className="space-y-2 max-h-64 overflow-hidden">
          {chatMessages.slice(-6).map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5 max-w-[250px]"
            >
              <span className="text-white/80 text-xs font-medium">{msg.user}: </span>
              <span className="text-white text-sm">{msg.text}</span>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Products Panel */}
      <AnimatePresence>
        {showShop && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-32 left-4 right-4 z-20"
          >
            <div className="bg-black/70 backdrop-blur-md rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-semibold">🛒 直播商品 ({products.length})</p>
                <button onClick={() => setShowShop(false)} className="text-white/60 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center bg-white/10 rounded-lg p-2">
                    <img
                      src={product.image}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 ml-2 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{product.name}</p>
                      <p className="text-primary font-bold">¥{product.price}</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddToCart(product)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                        cartItems.find((item) => item.id === product.id)
                          ? 'bg-white/20 text-white/70'
                          : 'bg-primary text-white'
                      }`}
                    >
                      {cartItems.find((item) => item.id === product.id) ? '已加购' : '抢购'}
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Actions */}
      <div className="absolute bottom-6 left-4 right-4 z-20">
        {/* Featured Product */}
        <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 mb-3 flex items-center">
          <img
            src={products[0].image}
            alt=""
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1 ml-3">
            <p className="text-white font-semibold text-sm">{products[0].name}</p>
            <div className="flex items-center mt-1">
              <span className="text-primary font-bold text-lg">¥{products[0].price}</span>
              <span className="text-white/50 text-xs line-through ml-2">¥{products[0].originalPrice}</span>
            </div>
            <p className="text-white/60 text-xs mt-1">已售 {products[0].sales}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleBuyNow}
            className="bg-primary text-white px-4 py-2 rounded-full font-medium text-sm active:brightness-110 transition-all"
          >
            立即购买
          </motion.button>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          {/* Message Input */}
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center mr-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="说点什么..."
              className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm"
            />
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleSendMessage}
              className="ml-2 active:scale-90 transition-transform"
            >
              <Send size={18} className={message.trim() ? 'text-primary' : 'text-white/70'} />
            </motion.button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setLiked(!liked)}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={liked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  size={28}
                  className={liked ? 'text-red-500 fill-current' : 'text-white'}
                />
              </motion.div>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setShowShop(!showShop)}
              className="flex flex-col items-center relative"
            >
              <ShoppingBag size={28} className="text-white" />
              {cartItems.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
                >
                  {cartItems.length}
                </motion.div>
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setShowGiftPanel(true)}
              className="flex flex-col items-center"
            >
              <Gift size={28} className="text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setShowSharePanel(true)}
              className="flex flex-col items-center"
            >
              <Share2 size={28} className="text-white" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Shop Badge */}
      <motion.div
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-36 right-4 z-20 bg-red-500 rounded-full p-2 animate-bounce"
        onClick={() => setShowShop(true)}
      >
        <ShoppingBag size={20} className="text-white" />
      </motion.div>

      {/* Gift Panel (Bottom Sheet) */}
      <AnimatePresence>
        {showGiftPanel && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 z-30"
              onClick={() => setShowGiftPanel(false)}
            />
            <motion.div
              variants={bottomSheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md rounded-t-2xl border-t border-white/10"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">礼物</h3>
                  <button onClick={() => setShowGiftPanel(false)} className="text-white/60 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {gifts.map((gift) => (
                    <motion.button
                      key={gift.id}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSendGift(gift)}
                      className="flex flex-col items-center p-2 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <span className="text-3xl mb-1">{gift.emoji}</span>
                      <span className="text-white text-xs">{gift.name}</span>
                      <span className="text-primary text-xs font-bold">{gift.price}币</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Share Panel (Bottom Sheet) */}
      <AnimatePresence>
        {showSharePanel && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 z-30"
              onClick={() => setShowSharePanel(false)}
            />
            <motion.div
              variants={bottomSheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md rounded-t-2xl border-t border-white/10"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">分享</h3>
                  <button onClick={() => setShowSharePanel(false)} className="text-white/60 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex justify-around">
                  {shareOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleShare(option)}
                      className="flex flex-col items-center p-3 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className={`w-12 h-12 ${option.color} rounded-full flex items-center justify-center text-xl mb-2`}>
                        {option.icon}
                      </div>
                      <span className="text-white text-xs">{option.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md text-white text-sm px-5 py-2.5 rounded-full border border-white/10 shadow-lg whitespace-nowrap"
          >
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
