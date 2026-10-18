import { useState, useCallback } from 'react'
import { Heart, MessageCircle, Star, Share2, ChevronLeft, MoreHorizontal, MapPin, Music, Plus, X, Check, Link2, Image, MessageSquare, Copy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const menuVariants = {
  hidden: { opacity: 0, scale: 0.9, y: -10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.15 } },
}

const bottomSheetVariants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } },
  exit: { y: '100%', transition: { duration: 0.2 } },
}

const toastVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, y: 40, transition: { duration: 0.2 } },
}

const moreMenuItems = [
  { label: '举报', icon: '🚫' },
  { label: '不感兴趣', icon: '👎' },
  { label: '保存到相册', icon: '📥' },
  { label: '稍后再看', icon: '🕐' },
]

const shareOptions = [
  { label: '微信好友', icon: MessageSquare, color: '#07C160' },
  { label: '朋友圈', icon: Image, color: '#07C160' },
  { label: '复制链接', icon: Link2, color: '#576B95' },
  { label: '保存图片', icon: Image, color: '#FA9D3B' },
]

export default function VideoDetailPage({ video, onBack }) {
  const [liked, setLiked] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const [followed, setFollowed] = useState(false)
  const [favorited, setFavorited] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showToast, setShowToast] = useState(null)

  const triggerToast = useCallback((message) => {
    setShowToast(message)
    setTimeout(() => setShowToast(null), 2000)
  }, [])

  const handleFollow = useCallback(() => {
    setFollowed(prev => !prev)
    triggerToast(followed ? '已取消关注' : '关注成功')
  }, [followed, triggerToast])

  const handleTagClick = useCallback((tag) => {
    triggerToast(`搜索 #${tag}`)
  }, [triggerToast])

  const handleMusicClick = useCallback(() => {
    triggerToast(`正在播放: ${video.music}`)
  }, [video.music, triggerToast])

  const handleProductClick = useCallback(() => {
    triggerToast('查看产品详情')
  }, [triggerToast])

  const handleBookClick = useCallback((e) => {
    e.stopPropagation()
    triggerToast('正在跳转到预订页面...')
  }, [triggerToast])

  const handleFavorite = useCallback(() => {
    setFavorited(prev => !prev)
    triggerToast(favorited ? '已取消收藏' : '收藏成功')
  }, [favorited, triggerToast])

  const handleShare = useCallback(() => {
    setShowShare(true)
  }, [])

  const handleShareOption = useCallback((label) => {
    setShowShare(false)
    triggerToast(`已${label === '复制链接' ? '复制' : '分享到'}${label}`)
  }, [triggerToast])

  const handleMoreMenu = useCallback(() => {
    setShowMoreMenu(prev => !prev)
  }, [])

  const handleMoreMenuItem = useCallback((label) => {
    setShowMoreMenu(false)
    triggerToast(label === '举报' ? '举报已提交' : label === '不感兴趣' ? '将减少推荐' : label === '保存到相册' ? '已保存到相册' : '已加入稍后再看')
  }, [triggerToast])

  const favoriteCount = favorited ? video.favorites + 1 : video.favorites
  const likeCount = liked ? video.likes + 1 : video.likes

  return (
    <div className="h-full bg-dark relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-0 pb-3">
        <button onClick={onBack} className="text-white hover:bg-white/10 rounded-full p-1 transition-colors">
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={handleMoreMenu}
          className="text-white hover:bg-white/10 rounded-full p-1 transition-colors relative"
        >
          <MoreHorizontal size={24} />
          <AnimatePresence>
            {showMoreMenu && (
              <>
                <motion.div
                  className="fixed inset-0 z-30"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => setShowMoreMenu(false)}
                />
                <motion.div
                  className="absolute top-12 right-4 z-40 bg-gray-900/95 backdrop-blur-lg rounded-xl border border-white/10 py-2 min-w-[160px] shadow-2xl"
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {moreMenuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleMoreMenuItem(item.label)}
                      className="w-full flex items-center px-4 py-3 text-white/90 text-sm hover:bg-white/10 transition-colors"
                    >
                      <span className="mr-3 text-base">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Video */}
      <div className="h-full">
        <img
          src={video.thumbnail}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 pb-6 px-4">
        {/* Author Info */}
        <div className="flex items-center mb-4">
          <img
            src={video.userAvatar}
            alt=""
            className="w-12 h-12 rounded-full border-2 border-white"
          />
          <div className="ml-3 flex-1">
            <div className="flex items-center">
              <span className="text-white font-semibold">@{video.username}</span>
              <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">认证</span>
            </div>
            <div className="flex items-center text-white/80 text-sm mt-0.5">
              <MapPin size={14} className="mr-1" />
              <span>{video.location}</span>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleFollow}
            className={`px-4 py-1.5 text-sm rounded-full font-medium transition-all duration-300 ${
              followed
                ? 'bg-white/20 text-white/80 border border-white/30'
                : 'bg-primary text-white'
            }`}
          >
            {followed ? (
              <span className="flex items-center gap-1">
                <Check size={14} />
                已关注
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Plus size={14} />
                关注
              </span>
            )}
          </motion.button>
        </div>

        {/* Description */}
        <p className="text-white text-sm leading-relaxed mb-3">
          {video.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {video.tags.map(tag => (
            <motion.button
              key={tag}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTagClick(tag)}
              className="text-primary text-xs hover:text-primary/80 transition-colors"
            >
              #{tag}
            </motion.button>
          ))}
        </div>

        {/* Music */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleMusicClick}
          className="flex items-center text-white/80 text-sm mb-4 hover:text-white transition-colors"
        >
          <Music size={14} className="mr-2" />
          <span>原声 - {video.music}</span>
        </motion.button>

        {/* Stats */}
        <div className="flex items-center text-white/80 text-sm mb-4">
          <span className="mr-4">{liked ? '❤️' : '🤍'} {likeCount.toLocaleString()}</span>
          <span className="mr-4">💬 {video.comments.toLocaleString()}</span>
          <span>{favorited ? '⭐' : '☆'} {favoriteCount.toLocaleString()}</span>
        </div>

        {/* Related Products */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={handleProductClick}
          className="bg-white/10 backdrop-blur-md rounded-xl p-3 mb-4 cursor-pointer hover:bg-white/15 transition-colors"
        >
          <p className="text-white/80 text-xs mb-2">📦 关联产品</p>
          <div className="flex items-center">
            <img
              src={video.product?.image}
              alt=""
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="ml-3 flex-1">
              <p className="text-white font-medium text-sm">{video.product?.name}</p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-400 text-xs">⭐ {video.product?.rating}</span>
                <span className="text-primary font-bold text-sm ml-2">¥{video.product?.price}</span>
                <span className="text-white/60 text-xs">起</span>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBookClick}
              className="px-4 py-2 bg-primary text-white text-sm rounded-full font-medium hover:bg-primary/80 transition-colors"
            >
              预订
            </motion.button>
          </div>
        </motion.div>

        {/* Comments Preview */}
        <div
          className="bg-white/10 backdrop-blur-md rounded-xl p-3 cursor-pointer hover:bg-white/15 transition-colors"
          onClick={() => setShowComment(true)}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 text-xs">💬 评论 ({video.comments.toLocaleString()})</p>
            <span className="text-white/60 text-xs">查看全部</span>
          </div>
          <div className="space-y-2">
            {[
              { user: '旅行爱好者', text: '这个地方太美了！已收藏' },
              { user: '小清新', text: '酒店价格怎么样？' },
            ].map((comment, i) => (
              <div key={i} className="flex items-start">
                <span className="text-white/80 text-sm font-medium">{comment.user}: </span>
                <span className="text-white/60 text-sm">{comment.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-around mt-4 pt-3 border-t border-white/10">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setLiked(!liked)}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={liked ? { scale: [1, 1.3, 1], rotate: [0, -15, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart size={24} className={liked ? 'text-red-500 fill-current' : 'text-white'} />
            </motion.div>
            <span className="text-white/60 text-xs mt-1">{likeCount.toLocaleString()}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            className="flex flex-col items-center"
            onClick={() => setShowComment(true)}
          >
            <MessageCircle size={24} className="text-white" />
            <span className="text-white/60 text-xs mt-1">{video.comments.toLocaleString()}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleFavorite}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={favorited ? { scale: [1, 1.3, 1], rotate: [0, 72, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Star size={24} className={favorited ? 'text-yellow-400 fill-current' : 'text-white'} />
            </motion.div>
            <span className="text-white/60 text-xs mt-1">{favoriteCount.toLocaleString()}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleShare}
            className="flex flex-col items-center"
          >
            <Share2 size={24} className="text-white" />
            <span className="text-white/60 text-xs mt-1">分享</span>
          </motion.button>
        </div>
      </div>

      {/* Share Bottom Sheet */}
      <AnimatePresence>
        {showShare && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setShowShare(false)}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg rounded-t-2xl border-t border-white/10"
              variants={bottomSheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-white/30 rounded-full" />
              </div>
              <p className="text-white text-center text-sm font-medium mb-4">分享至</p>
              <div className="grid grid-cols-4 gap-4 px-8 pb-6">
                {shareOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <motion.button
                      key={option.label}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleShareOption(option.label)}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: option.color + '20' }}
                      >
                        <Icon size={22} style={{ color: option.color }} />
                      </div>
                      <span className="text-white/80 text-xs">{option.label}</span>
                    </motion.button>
                  )
                })}
              </div>
              <div className="px-4 pb-8">
                <button
                  onClick={() => setShowShare(false)}
                  className="w-full py-3 bg-white/10 text-white/80 rounded-xl text-sm font-medium hover:bg-white/15 transition-colors"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-black/80 backdrop-blur-md text-white text-sm rounded-full shadow-lg"
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
