import { useState, useRef, useEffect } from 'react'
import { Heart, MessageCircle, Star, Share2, MapPin, Music, ChevronUp, Play, Plus, X, Check, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const recommendVideos = [
  {
    id: 1, username: '旅行少女小雅',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    location: '三亚·亚龙湾',
    description: '这个海景酒店绝绝子！🏖️ 躺在房间里就能看日出日落，太浪漫了～',
    tags: ['三亚', '海景酒店', '度假'], music: '阳光海岸 - 轻音乐',
    likes: 12500, comments: 1234, favorites: 856, shares: 234,
    thumbnail: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=700&fit=crop',
    product: { name: '三亚亚龙湾度假酒店', price: 1299, rating: 4.8, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200&h=150&fit=crop' }
  },
  {
    id: 2, username: '摄影师阿杰',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    location: '丽江·古城',
    description: '丽江古城夜景太美了！✨ 第一次来就被深深吸引了',
    tags: ['丽江', '古城', '夜景'], music: '丽江小倩 - 一瞬间',
    likes: 8900, comments: 567, favorites: 432, shares: 123,
    thumbnail: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&h=700&fit=crop',
    product: { name: '丽江古城客栈', price: 299, rating: 4.6, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=200&h=150&fit=crop' }
  },
  {
    id: 3, username: '美食探店王',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    location: '成都·宽窄巷子',
    description: '成都宽窄巷子必吃美食清单🍜 跟着我吃遍成都！',
    tags: ['成都', '美食', '宽窄巷子'], music: '成都 - 赵雷',
    likes: 15600, comments: 2341, favorites: 1100, shares: 456,
    thumbnail: 'https://images.unsplash.com/photo-1609172225755-9e9c979f9b97?w=400&h=700&fit=crop',
    product: { name: '成都特色美食体验', price: 199, rating: 4.9, image: 'https://images.unsplash.com/photo-1609172225755-9e9c979f9b97?w=200&h=150&fit=crop' }
  },
  {
    id: 4, username: '户外探险家',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    location: '张家界·天门山',
    description: '天门山玻璃栈道太刺激了！😱 恐高症患者慎入哈哈哈',
    tags: ['张家界', '天门山', '玻璃栈道'], music: '探险 - 主题曲',
    likes: 9800, comments: 890, favorites: 678, shares: 234,
    thumbnail: 'https://images.unsplash.com/photo-1504633624079-a4f22d0fd2eb?w=400&h=700&fit=crop',
    product: { name: '张家界天门山门票', price: 278, rating: 4.7, image: 'https://images.unsplash.com/photo-1504633624079-a4f22d0fd2eb?w=200&h=150&fit=crop' }
  }
]

const followVideos = [
  {
    id: 101, username: '旅行少女小雅',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    location: '巴厘岛·乌布',
    description: '巴厘岛乌布梯田日落🌅 每一帧都是壁纸！',
    tags: ['巴厘岛', '乌布', '日落'], music: 'Bali Sunset - Chill Mix',
    likes: 23400, comments: 3456, favorites: 2100, shares: 567,
    thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=700&fit=crop',
    product: { name: '巴厘岛5日自由行', price: 4599, rating: 4.9, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&h=150&fit=crop' }
  },
  {
    id: 102, username: '摄影师阿杰',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    location: '冰岛·雷克雅未克',
    description: '冰岛极光拍摄攻略🌌 追了3天终于拍到了！',
    tags: ['冰岛', '极光', '摄影'], music: 'Aurora - Instrumental',
    likes: 45600, comments: 5678, favorites: 4300, shares: 1234,
    thumbnail: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=400&h=700&fit=crop',
    product: { name: '冰岛极光跟拍团', price: 8999, rating: 5.0, image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=200&h=150&fit=crop' }
  },
  {
    id: 103, username: '美食探店王',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    location: '东京·新宿',
    description: '东京新宿拉面横丁🍜 一条街吃到撑！',
    tags: ['东京', '拉面', '美食'], music: '东京物语 - 主题曲',
    likes: 18900, comments: 2345, favorites: 1567, shares: 789,
    thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=700&fit=crop',
    product: { name: '东京美食半日游', price: 599, rating: 4.8, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&h=150&fit=crop' }
  },
  {
    id: 104, username: '户外探险家',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    location: '瑞士·少女峰',
    description: '瑞士少女峰徒步🇨🇭 欧洲之巅太震撼了！',
    tags: ['瑞士', '少女峰', '徒步'], music: 'The Alps - Nature Sound',
    likes: 32100, comments: 4321, favorites: 3456, shares: 890,
    thumbnail: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=700&fit=crop',
    product: { name: '瑞士少女峰一日游', price: 1299, rating: 4.7, image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=200&h=150&fit=crop' }
  }
]

const nearbyVideos = [
  {
    id: 201, username: '同城小探',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    location: '附近·3km',
    description: '发现一家超赞的咖啡厅☕ 就在楼下！',
    tags: ['同城', '咖啡厅', '探店'], music: '慵懒午后 - 轻音乐',
    likes: 3200, comments: 456, favorites: 234, shares: 67,
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=700&fit=crop',
    product: { name: '网红咖啡厅双人下午茶', price: 128, rating: 4.5, image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=150&fit=crop' }
  },
  {
    id: 202, username: '周末去哪玩',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    location: '附近·5km',
    description: '周末遛娃好去处👨‍👩‍👧 这个亲子乐园太好玩了！',
    tags: ['同城', '亲子', '周末'], music: '快乐周末 - 儿歌',
    likes: 5600, comments: 789, favorites: 456, shares: 123,
    thumbnail: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=400&h=700&fit=crop',
    product: { name: '欢乐亲子乐园门票', price: 168, rating: 4.6, image: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=200&h=150&fit=crop' }
  },
  {
    id: 203, username: '吃货日记',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    location: '附近·1km',
    description: '附近新开的火锅店🍲 人均80吃到撑！',
    tags: ['同城', '火锅', '美食'], music: '火锅进行曲 - 欢快',
    likes: 7800, comments: 1234, favorites: 678, shares: 234,
    thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=700&fit=crop',
    product: { name: '重庆老火锅4人套餐', price: 298, rating: 4.7, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=150&fit=crop' }
  },
  {
    id: 204, username: '城市漫步',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    location: '附近·2km',
    description: '城市公园日落漫步🌅 治愈系风景就在身边',
    tags: ['同城', '公园', '日落'], music: '漫步人生路 - 轻音乐',
    likes: 2100, comments: 345, favorites: 189, shares: 56,
    thumbnail: 'https://images.unsplash.com/photo-1518173946687-a1e4e3e5f654?w=400&h=700&fit=crop',
    product: { name: '城市公园年卡', price: 199, rating: 4.4, image: 'https://images.unsplash.com/photo-1518173946687-a1e4e3e5f654?w=200&h=150&fit=crop' }
  }
]

const videoTabs = [
  { label: '推荐', videos: recommendVideos },
  { label: '关注', videos: followVideos },
  { label: '附近', videos: nearbyVideos },
]

function formatNumber(num) {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : num.toString()
}

export default function HomePage({ onNavigate }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [activeTopTab, setActiveTopTab] = useState(0)
  const [likedVideos, setLikedVideos] = useState({})
  const [followedUsers, setFollowedUsers] = useState({})
  const [favoritedVideos, setFavoritedVideos] = useState({})
  const [showProduct, setShowProduct] = useState(true)
  const [showComment, setShowComment] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([
    { user: '旅行爱好者', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50', text: '这个地方太美了！已经收藏了', likes: 234, liked: false },
    { user: '小清新', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50', text: '求攻略！准备下个月去', likes: 89, liked: false },
    { user: '摄影达人', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50', text: '这个机位绝了！', likes: 156, liked: false },
  ])
  const containerRef = useRef(null)

  const currentVideos = videoTabs[activeTopTab].videos
  const currentVideo = currentVideos[currentVideoIndex]

  const handleTabChange = (index) => {
    setActiveTopTab(index)
    setCurrentVideoIndex(0)
    setIsPlaying(true)
  }

  useEffect(() => {
    const handleScroll = (e) => {
      if (e.deltaY > 0 && currentVideoIndex < currentVideos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1)
        setIsPlaying(true)
      } else if (e.deltaY < 0 && currentVideoIndex > 0) {
        setCurrentVideoIndex(prev => prev - 1)
        setIsPlaying(true)
      }
    }
    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleScroll)
      return () => container.removeEventListener('wheel', handleScroll)
    }
  }, [currentVideoIndex, currentVideos.length])

  const handleLike = () => {
    setLikedVideos(prev => ({ ...prev, [currentVideo.id]: !prev[currentVideo.id] }))
  }

  const handleDoubleClick = () => {
    if (!likedVideos[currentVideo.id]) handleLike()
  }

  const handleFollow = () => {
    setFollowedUsers(prev => ({ ...prev, [currentVideo.id]: !prev[currentVideo.id] }))
  }

  // 判断当前博主是否已关注：关注Tab下的博主默认已关注
  const isCurrentlyFollowed = activeTopTab === 1 
    ? !followedUsers[currentVideo.id] // 关注Tab：默认已关注，点击后取消
    : followedUsers[currentVideo.id]  // 其他Tab：默认未关注，点击后关注

  const handleFavorite = () => {
    setFavoritedVideos(prev => ({ ...prev, [currentVideo.id]: !prev[currentVideo.id] }))
  }

  const handleSendComment = () => {
    if (!commentText.trim()) return
    setComments(prev => [{ user: '我', avatar: 'https://i.pravatar.cc/50?img=5', text: commentText, likes: 0, liked: false }, ...prev])
    setCommentText('')
  }

  const handleCommentLike = (index) => {
    setComments(prev => prev.map((c, i) => i === index ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 } : c))
  }

  const shareOptions = [
    { icon: '💬', label: '微信好友' },
    { icon: '👥', label: '朋友圈' },
    { icon: '🔗', label: '复制链接' },
    { icon: '📷', label: '保存图片' },
    { icon: '📋', label: '举报' },
  ]

  return (
    <div ref={containerRef} className="h-full bg-dark relative overflow-hidden" onClick={handleDoubleClick}>
      {/* Video Background */}
      <div className="absolute inset-0">
        <img src={currentVideo.thumbnail} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </div>

      {/* Top Tab */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-0 px-4">
        <div className="flex items-center justify-center space-x-6">
          {videoTabs.map((tab, index) => (
            <button key={tab.label} onClick={(e) => { e.stopPropagation(); handleTabChange(index); }}
              className={`text-sm font-medium pb-1 transition-all ${activeTopTab === index ? 'text-white border-b-2 border-primary' : 'text-white/60'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Content */}
      <div className="absolute inset-0 flex items-end pb-20">
        <div className="flex-1 px-4 pb-4">
          {/* User Info */}
          <div className="flex items-center mb-3">
            <img src={currentVideo.userAvatar} alt={currentVideo.username} className="w-10 h-10 rounded-full border-2 border-white" />
            <div className="ml-3 flex items-center">
              <span className="text-white font-semibold text-sm">@{currentVideo.username}</span>
              <button onClick={(e) => { e.stopPropagation(); handleFollow(); }}
                className={`ml-2 px-2 py-0.5 text-xs rounded-full font-medium transition-all ${isCurrentlyFollowed ? 'bg-white/20 text-white' : 'bg-primary text-white'}`}>
                {isCurrentlyFollowed ? '✓ 已关注' : '+ 关注'}
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-white/90 text-sm mb-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); onNavigate('hotel-list'); }}>
            <MapPin size={14} className="mr-1" />
            <span>{currentVideo.location}</span>
          </div>

          {/* Description */}
          <p className="text-white text-sm leading-relaxed mb-2 line-clamp-2">{currentVideo.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {currentVideo.tags.map(tag => (
              <button key={tag} onClick={(e) => { e.stopPropagation(); onNavigate('search'); }}
                className="text-primary text-xs hover:underline">#{tag}</button>
            ))}
          </div>

          {/* Music */}
          <button className="flex items-center text-white/80 text-sm" onClick={(e) => e.stopPropagation()}>
            <Music size={14} className="mr-2 animate-pulse" />
            <span className="truncate max-w-[200px]">{currentVideo.music}</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex flex-col items-center space-y-5 px-3 pb-4">
          {/* User Avatar */}
          <button className="relative" onClick={(e) => { e.stopPropagation(); handleFollow(); }}>
            <img src={currentVideo.userAvatar} alt="" className="w-12 h-12 rounded-full border-2 border-white" />
            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${isCurrentlyFollowed ? 'bg-gray-400' : 'bg-primary'} rounded-full p-0.5`}>
              {isCurrentlyFollowed ? <Check size={16} className="text-white" /> : <Plus size={16} className="text-white" />}
            </div>
          </button>

          {/* Like */}
          <div className="flex flex-col items-center">
            <button onClick={(e) => { e.stopPropagation(); handleLike(); }}>
              <Heart size={32} className={likedVideos[currentVideo.id] ? 'text-red-500 fill-current like-animation' : 'text-white'} />
            </button>
            <span className="text-white text-xs mt-1">{formatNumber(likedVideos[currentVideo.id] ? currentVideo.likes + 1 : currentVideo.likes)}</span>
          </div>

          {/* Comment */}
          <div className="flex flex-col items-center">
            <button onClick={(e) => { e.stopPropagation(); setShowComment(true); }}>
              <MessageCircle size={32} className="text-white" />
            </button>
            <span className="text-white text-xs mt-1">{formatNumber(comments.length)}</span>
          </div>

          {/* Favorite */}
          <div className="flex flex-col items-center">
            <button onClick={(e) => { e.stopPropagation(); handleFavorite(); }}>
              <Star size={32} className={favoritedVideos[currentVideo.id] ? 'text-yellow-400 fill-current' : 'text-white'} />
            </button>
            <span className="text-white text-xs mt-1">{formatNumber(favoritedVideos[currentVideo.id] ? currentVideo.favorites + 1 : currentVideo.favorites)}</span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center">
            <button onClick={(e) => { e.stopPropagation(); setShowShare(true); }}>
              <Share2 size={32} className="text-white" />
            </button>
            <span className="text-white text-xs mt-1">{formatNumber(currentVideo.shares)}</span>
          </div>

          {/* Music Disc */}
          <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center animate-spin" style={{ animationDuration: '3s' }}>
            <img src={currentVideo.userAvatar} alt="" className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Product Card */}
      <AnimatePresence>
        {showProduct && currentVideo.product && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-24 left-4 right-16 z-20">
            <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 flex items-center"
              onClick={(e) => { e.stopPropagation(); onNavigate('hotel-detail', { hotel: currentVideo.product }); }}>
              <img src={currentVideo.product.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{currentVideo.product.name}</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400 text-xs">⭐ {currentVideo.product.rating}</span>
                  <span className="text-primary font-bold text-sm ml-2">¥{currentVideo.product.price}</span>
                  <span className="text-white/60 text-xs">起</span>
                </div>
              </div>
              <button className="bg-primary text-white text-xs px-3 py-1.5 rounded-full font-medium">预订</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-10" onClick={(e) => { e.stopPropagation(); setIsPlaying(true); }}>
          <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer">
            <Play size={32} className="text-white ml-1" fill="white" />
          </div>
        </div>
      )}

      {/* Swipe Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 swipe-indicator">
        <ChevronUp size={24} className="text-white/60" />
      </div>

      {/* Comment Panel */}
      <AnimatePresence>
        {showComment && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
            className="absolute inset-x-0 bottom-0 z-30 bg-white rounded-t-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <p className="text-gray-500 text-sm mb-4">{comments.length} 条评论</p>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {comments.map((comment, i) => (
                  <div key={i} className="flex gap-3">
                    <img src={comment.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <p className="text-gray-700 text-sm font-medium">{comment.user}</p>
                      <p className="text-gray-600 text-sm mt-0.5">{comment.text}</p>
                      <div className="flex items-center mt-1 text-gray-400 text-xs">
                        <span>2小时前</span>
                        <span className="mx-2">·</span>
                        <button onClick={() => handleCommentLike(i)} className={comment.liked ? 'text-red-400' : ''}>
                          {comment.likes}赞
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 border-t pt-4">
                <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                  placeholder="写评论..." className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none" />
                <button onClick={handleSendComment} disabled={!commentText.trim()}
                  className={`font-medium text-sm ${commentText.trim() ? 'text-primary' : 'text-gray-300'}`}>
                  发送
                </button>
              </div>
            </div>
            <button onClick={() => setShowComment(false)} className="absolute top-4 right-4 text-gray-400">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Panel */}
      <AnimatePresence>
        {showShare && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
            className="absolute inset-x-0 bottom-0 z-30 bg-white rounded-t-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <p className="text-gray-800 font-semibold mb-4">分享到</p>
              <div className="grid grid-cols-5 gap-4 mb-4">
                {shareOptions.map((opt, i) => (
                  <button key={i} className="flex flex-col items-center" onClick={() => { setShowShare(false); }}>
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-1 hover:bg-gray-200 transition-colors">{opt.icon}</div>
                    <span className="text-xs text-gray-600">{opt.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowShare(false)} className="w-full py-3 text-center text-gray-500 text-sm border-t">取消</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
