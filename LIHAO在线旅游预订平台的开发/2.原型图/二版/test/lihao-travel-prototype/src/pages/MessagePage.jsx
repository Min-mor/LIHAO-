import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, MessageCircle, UserPlus, Gift, Settings, Search,
  MoreVertical, Check, Trash2, ChevronDown, ChevronUp, X, Send,
  Bookmark, Share2
} from 'lucide-react'

const notifications = [
  {
    id: 1,
    type: 'like',
    icon: Heart,
    iconColor: 'text-red-500',
    title: '点赞通知',
    desc: '旅行少女小雅 等人点赞了你的视频',
    time: '刚刚',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50',
    userName: '旅行少女小雅',
    videoTitle: '三亚日落延时摄影',
    likeCount: 128,
    detail: '你的视频「三亚日落延时摄影」获得了 128 个赞，其中旅行少女小雅、摄影师阿杰 等 126 人点赞，快去看看吧！'
  },
  {
    id: 2,
    type: 'comment',
    icon: MessageCircle,
    iconColor: 'text-blue-500',
    title: '评论通知',
    desc: '摄影师阿杰: 这个地方太美了！',
    time: '5分钟前',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50',
    userName: '摄影师阿杰',
    videoTitle: '大理古城漫步',
    commentContent: '这个地方太美了！下次一定要去打卡！',
    detail: '摄影师阿杰 评论了你的视频「大理古城漫步」："这个地方太美了！下次一定要去打卡！"'
  },
  {
    id: 3,
    type: 'follow',
    icon: UserPlus,
    iconColor: 'text-green-500',
    title: '关注通知',
    desc: '美食探店王 关注了你',
    time: '1小时前',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50',
    userName: '美食探店王',
    followerCount: '12.6万',
    recentVideo: '成都火锅探店指南',
    detail: '美食探店王（粉丝 12.6万）关注了你，TA 最近发布了「成都火锅探店指南」'
  },
  {
    id: 4,
    type: 'system',
    icon: Gift,
    iconColor: 'text-orange-500',
    title: '活动通知',
    desc: '新用户专属福利，领取100元优惠券',
    time: '昨天',
    avatar: null,
    couponAmount: 100,
    expireDate: '2026-06-30',
    detail: '新用户专属福利活动进行中！现在领取100元旅行优惠券，可用于酒店、机票预订，有效期30天。'
  },
]

const systemMessages = [
  {
    id: 1,
    title: '订单提醒',
    icon: '📦',
    desc: '您的订单已确认，请注意查收',
    time: '今天 10:30',
    detail: '您的三亚亚龙湾酒店订单（订单号：HT20260515001）已确认。入住日期：2026-06-01，退房日期：2026-06-03，共2晚。房间类型：豪华海景大床房。如有问题请联系客服。'
  },
  {
    id: 2,
    title: '优惠券到账',
    icon: '🎫',
    desc: '新人专享优惠券已到账',
    time: '昨天 15:20',
    detail: '恭喜您获得新人专享优惠券包：满500减100优惠券 x1、满200减30优惠券 x2。有效期至2026-06-30，请在"我的-优惠券"中查看。'
  },
]

const defaultSettings = {
  likeNotify: true,
  commentNotify: true,
  followNotify: true,
  systemNotify: true,
  activityNotify: true,
}

export default function MessagePage() {
  const [activeTab, setActiveTab] = useState('通知')
  const [showSearch, setShowSearch] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [expandedNotification, setExpandedNotification] = useState(null)
  const [showActionMenu, setShowActionMenu] = useState(null)
  const [readNotifications, setReadNotifications] = useState(new Set())
  const [deletedNotifications, setDeletedNotifications] = useState(new Set())
  const [deletedSystemMessages, setDeletedSystemMessages] = useState(new Set())
  const [toast, setToast] = useState(null)
  const [settings, setSettings] = useState(defaultSettings)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyTarget, setReplyTarget] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [showVideoDetail, setShowVideoDetail] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(null)

  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2000)
  }, [])

  const handleMarkRead = useCallback((id) => {
    setReadNotifications(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setShowActionMenu(null)
    showToast('已标记为已读')
  }, [showToast])

  const handleDelete = useCallback((id) => {
    setDeletedNotifications(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setShowActionMenu(null)
    showToast('已删除')
  }, [showToast])

  const handleDeleteSystem = useCallback((id) => {
    setDeletedSystemMessages(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setShowActionMenu(null)
    showToast('已删除')
  }, [showToast])

  const handleMarkReadSystem = useCallback((id) => {
    setReadNotifications(prev => {
      const next = new Set(prev)
      next.add(`sys-${id}`)
      return next
    })
    setShowActionMenu(null)
    showToast('已标记为已读')
  }, [showToast])

  const handleActivityClick = useCallback((notif) => {
    // 切换展开状态
    setExpandedNotification(prev => prev === `act-${notif.id}` ? null : `act-${notif.id}`)
  }, [])

  const handleViewDetail = useCallback((msg) => {
    showToast(`查看详情：${msg.title}`)
  }, [showToast])

  const handleInteractionAction = useCallback((notif, action) => {
    switch (action) {
      case 'viewVideo':
        // 打开视频详情弹窗
        setCurrentVideo({
          title: notif.videoTitle,
          user: notif.userName,
          avatar: notif.avatar,
          type: notif.type
        })
        setShowVideoDetail(true)
        break
      case 'reply':
        // 打开回复弹窗
        setReplyTarget({
          userName: notif.userName,
          avatar: notif.avatar,
          comment: notif.commentContent,
          videoTitle: notif.videoTitle
        })
        setShowReplyModal(true)
        break
      case 'followBack':
        showToast(`已回关 ${notif.userName || '用户'}`)
        break
      case 'claim':
        showToast('已领取优惠券')
        break
      default:
        showToast(`执行操作：${action}`)
    }
  }, [showToast])

  const handleSendReply = useCallback(() => {
    if (!replyText.trim()) {
      showToast('请输入回复内容')
      return
    }
    showToast(`回复成功：${replyText}`)
    setReplyText('')
    setShowReplyModal(false)
    setReplyTarget(null)
  }, [replyText, showToast])

  const handleCloseReply = useCallback(() => {
    setShowReplyModal(false)
    setReplyTarget(null)
    setReplyText('')
  }, [])

  const handleCloseVideoDetail = useCallback(() => {
    setShowVideoDetail(false)
    setCurrentVideo(null)
  }, [])

  const toggleSetting = useCallback((key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const filteredNotifications = notifications.filter(n => {
    if (deletedNotifications.has(n.id)) return false
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      return n.desc.toLowerCase().includes(q) || n.title.toLowerCase().includes(q)
    }
    return true
  })

  const filteredSystemMessages = systemMessages.filter(m => {
    if (deletedSystemMessages.has(m.id)) return false
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      return m.title.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="h-full bg-gray-50 relative">
      {/* Header */}
      <div className="sticky top-0 bg-white z-20 px-4 pt-0 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">消息</h1>
          <div className="flex items-center space-x-4">
            <button onClick={() => { setShowSettings(false); setShowSearch(prev => !prev); if (showSearch) setSearchText('') }}>
              {showSearch ? <X size={20} className="text-gray-600" /> : <Search size={20} className="text-gray-600" />}
            </button>
            <button onClick={() => { setShowSearch(false); setShowSettings(prev => !prev) }}>
              <Settings size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="搜索通知..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex items-center space-x-6 mt-4">
          {['通知', '私信'].map(tab => (
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
      <div className="overflow-y-auto h-full pb-20">
        {activeTab === '通知' ? (
          <div className="p-4 space-y-4">
            {/* System Messages */}
            {filteredSystemMessages.length > 0 && (
              <div className="bg-white rounded-xl divide-y">
                {filteredSystemMessages.map(msg => {
                  const isExpanded = expandedNotification === `sys-${msg.id}`
                  const isRead = readNotifications.has(`sys-${msg.id}`)
                  return (
                    <div key={msg.id}>
                      <motion.div
                        layout
                        className={`p-4 flex items-center cursor-pointer transition-colors ${isRead ? 'opacity-60' : ''}`}
                        onClick={() => setExpandedNotification(prev => prev === `sys-${msg.id}` ? null : `sys-${msg.id}`)}
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl mr-3 shrink-0">
                          {msg.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-gray-800 font-medium text-sm">{msg.title}</p>
                            {!isRead && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                          </div>
                          <p className="text-gray-500 text-sm truncate mt-0.5">{msg.desc}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-2 shrink-0">
                          <span className="text-gray-400 text-xs">{msg.time}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowActionMenu(prev => prev === `sys-${msg.id}` ? null : `sys-${msg.id}`)
                            }}
                            className="text-gray-400 hover:text-gray-600 ml-1 p-1"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </motion.div>

                      {/* Expanded Detail */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pl-[68px]">
                              <p className="text-gray-600 text-sm leading-relaxed">{msg.detail}</p>
                              <button
                                onClick={() => handleViewDetail(msg)}
                                className="mt-2 text-primary text-sm font-medium hover:underline"
                              >
                                查看详情
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Action Menu */}
                      <AnimatePresence>
                        {showActionMenu === `sys-${msg.id}` && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-4 bg-white rounded-lg shadow-lg border border-gray-100 z-30 overflow-hidden"
                            style={{ minWidth: 120 }}
                          >
                            <button
                              onClick={() => handleMarkReadSystem(msg.id)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Check size={14} className="text-green-500" />
                              标记已读
                            </button>
                            <button
                              onClick={() => handleDeleteSystem(msg.id)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={14} />
                              删除
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Activity Notifications */}
            {filteredNotifications.length > 0 && (
              <div>
                <h3 className="text-gray-500 text-xs font-medium mb-2 px-2">互动</h3>
                <div className="bg-white rounded-xl divide-y">
                  {filteredNotifications.map(notif => {
                    const isExpanded = expandedNotification === `act-${notif.id}`
                    const isRead = readNotifications.has(notif.id)
                    return (
                      <div key={notif.id} className="relative">
                        <motion.div
                          layout
                          className={`p-4 flex items-center cursor-pointer transition-colors ${isRead ? 'opacity-60' : ''}`}
                          onClick={() => handleActivityClick(notif)}
                        >
                          {notif.avatar ? (
                            <img src={notif.avatar} alt="" className="w-10 h-10 rounded-full mr-3 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 shrink-0">
                              <notif.icon size={20} className={notif.iconColor} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-gray-800 text-sm">{notif.desc}</p>
                              {!isRead && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                            </div>
                            <p className="text-gray-400 text-xs mt-0.5">{notif.time}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={16} className="text-gray-400" />
                            </motion.div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowActionMenu(prev => prev === `act-${notif.id}` ? null : `act-${notif.id}`)
                              }}
                              className="text-gray-400 hover:text-gray-600 ml-1 p-1"
                            >
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </motion.div>

                        {/* Expanded Detail for Activity Notifications */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pl-[68px]">
                                {/* 点赞通知详情 */}
                                {notif.type === 'like' && (
                                  <>
                                    <div className="flex items-center gap-2 mb-2">
                                      <Heart size={14} className="text-red-500" />
                                      <span className="text-gray-600 text-sm">{notif.likeCount} 人点赞了你的视频</span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{notif.detail}</p>
                                    <button
                                      onClick={() => handleInteractionAction(notif, 'viewVideo')}
                                      className="text-primary text-sm font-medium hover:underline"
                                    >
                                      查看视频 →
                                    </button>
                                  </>
                                )}

                                {/* 评论通知详情 */}
                                {notif.type === 'comment' && (
                                  <>
                                    <div className="bg-gray-50 rounded-lg p-3 mb-2">
                                      <p className="text-gray-500 text-xs mb-1">评论了「{notif.videoTitle}」</p>
                                      <p className="text-gray-800 text-sm">"{notif.commentContent}"</p>
                                    </div>
                                    <div className="flex gap-3">
                                      <button
                                        onClick={() => handleInteractionAction(notif, 'viewVideo')}
                                        className="text-primary text-sm font-medium hover:underline"
                                      >
                                        查看视频
                                      </button>
                                      <button
                                        onClick={() => handleInteractionAction(notif, 'reply')}
                                        className="text-gray-600 text-sm font-medium hover:underline"
                                      >
                                        回复
                                      </button>
                                    </div>
                                  </>
                                )}

                                {/* 关注通知详情 */}
                                {notif.type === 'follow' && (
                                  <>
                                    <div className="flex items-center gap-3 mb-2">
                                      <img src={notif.avatar} alt="" className="w-12 h-12 rounded-full" />
                                      <div>
                                        <p className="text-gray-800 text-sm font-medium">{notif.userName}</p>
                                        <p className="text-gray-500 text-xs">粉丝 {notif.followerCount}</p>
                                      </div>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">最近发布：{notif.recentVideo}</p>
                                    <button
                                      onClick={() => handleInteractionAction(notif, 'followBack')}
                                      className="px-4 py-1.5 bg-primary text-white text-sm rounded-full"
                                    >
                                      回关
                                    </button>
                                  </>
                                )}

                                {/* 活动通知详情 */}
                                {notif.type === 'system' && (
                                  <>
                                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 mb-2">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Gift size={16} className="text-orange-500" />
                                        <span className="text-orange-600 text-sm font-medium">¥{notif.couponAmount} 优惠券</span>
                                      </div>
                                      <p className="text-gray-600 text-xs">有效期至 {notif.expireDate}</p>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">{notif.detail}</p>
                                    <button
                                      onClick={() => handleInteractionAction(notif, 'claim')}
                                      className="px-4 py-1.5 bg-orange-500 text-white text-sm rounded-full"
                                    >
                                      立即领取
                                    </button>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Action Menu */}
                        <AnimatePresence>
                          {showActionMenu === `act-${notif.id}` && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-4 top-10 bg-white rounded-lg shadow-lg border border-gray-100 z-30 overflow-hidden"
                              style={{ minWidth: 120 }}
                            >
                              <button
                                onClick={() => handleMarkRead(notif.id)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                <Check size={14} className="text-green-500" />
                                标记已读
                              </button>
                              <button
                                onClick={() => handleDelete(notif.id)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={14} />
                                删除
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Empty state when all filtered out */}
            {filteredSystemMessages.length === 0 && filteredNotifications.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-500">没有找到相关通知</p>
                <p className="text-gray-400 text-sm mt-1">试试其他关键词吧</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500">暂无私信消息</p>
              <p className="text-gray-400 text-sm mt-1">关注感兴趣的人，开始聊天吧</p>
            </div>
          </div>
        )}
      </div>

      {/* Settings Panel (Bottom Sheet) */}
      <AnimatePresence>
        {showSettings && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 z-30"
              onClick={() => setShowSettings(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-40 max-h-[70vh] overflow-y-auto"
            >
              <div className="p-4">
                {/* Handle bar */}
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                <h2 className="text-lg font-bold text-gray-800 mb-4">通知设置</h2>

                <div className="space-y-1">
                  {[
                    { key: 'likeNotify', label: '点赞通知', desc: '有人点赞你的内容时通知' },
                    { key: 'commentNotify', label: '评论通知', desc: '有人评论你的内容时通知' },
                    { key: 'followNotify', label: '关注通知', desc: '有新粉丝关注你时通知' },
                    { key: 'systemNotify', label: '系统消息', desc: '订单、优惠券等系统通知' },
                    { key: 'activityNotify', label: '活动通知', desc: '优惠活动、福利推送' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3 px-1">
                      <div>
                        <p className="text-gray-800 text-sm font-medium">{item.label}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => toggleSetting(item.key)}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                          settings[item.key] ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <motion.div
                          layout
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm ${
                            settings[item.key] ? 'left-[22px]' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-6 py-3 bg-primary text-white rounded-xl font-medium text-sm"
                >
                  完成
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-5 py-2.5 rounded-full shadow-lg z-50 whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click-away overlay for action menus */}
      {showActionMenu && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowActionMenu(null)}
        />
      )}

      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyModal && replyTarget && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={handleCloseReply}
            />
            {/* Modal */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50"
            >
              <div className="p-4">
                {/* Handle bar */}
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handleCloseReply} className="text-gray-500 text-sm">
                    取消
                  </button>
                  <h3 className="text-base font-bold text-gray-800">回复评论</h3>
                  <button 
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className={`text-sm font-medium ${replyText.trim() ? 'text-primary' : 'text-gray-400'}`}
                  >
                    发送
                  </button>
                </div>

                {/* Original Comment */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={replyTarget.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <span className="text-gray-800 text-sm font-medium">{replyTarget.userName}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{replyTarget.comment}</p>
                  <p className="text-gray-400 text-xs mt-2">评论了「{replyTarget.videoTitle}」</p>
                </div>

                {/* Reply Input */}
                <div className="relative">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`回复 ${replyTarget.userName}...`}
                    className="w-full h-24 p-3 bg-gray-100 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-primary/30"
                    autoFocus
                  />
                  <div className="absolute bottom-3 right-3 text-gray-400 text-xs">
                    {replyText.length}/200
                  </div>
                </div>

                {/* Quick Replies */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {['谢谢支持！', '欢迎来玩！', '确实很美！', '感谢关注！'].map(text => (
                    <button
                      key={text}
                      onClick={() => setReplyText(text)}
                      className="px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Video Detail Modal - Full Screen Video Player */}
      <AnimatePresence>
        {showVideoDetail && currentVideo && (
          <motion.div 
            className="absolute inset-0 z-50 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Video Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-purple-900 to-pink-800">
              {/* Simulated Video Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <Heart size={40} className="text-white" />
                  </div>
                  <p className="text-lg font-medium">{currentVideo.title}</p>
                  <p className="text-sm text-white/60 mt-2">视频播放中...</p>
                </div>
              </div>
            </div>

            {/* Top Bar - Close Button */}
            <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-center z-10">
              <button 
                onClick={handleCloseVideoDetail}
                className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center"
              >
                <X size={20} className="text-white" />
              </button>
              <button className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
                <MoreVertical size={20} className="text-white" />
              </button>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center gap-4 z-10">
              {/* Avatar */}
              <div className="relative">
                <img 
                  src={currentVideo.avatar} 
                  alt="" 
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                <button className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">+</span>
                </button>
              </div>

              {/* Like Button */}
              <button 
                onClick={() => showToast('已点赞')}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
                  <Heart size={24} className="text-white" />
                </div>
                <span className="text-white text-xs">128</span>
              </button>

              {/* Comment Button */}
              <button 
                onClick={() => showToast('打开评论')}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <span className="text-white text-xs">32</span>
              </button>

              {/* Bookmark Button */}
              <button 
                onClick={() => showToast('已收藏')}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
                  <Bookmark size={24} className="text-white" />
                </div>
                <span className="text-white text-xs">收藏</span>
              </button>

              {/* Share Button */}
              <button 
                onClick={() => showToast('分享视频')}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
                  <Share2 size={24} className="text-white" />
                </div>
                <span className="text-white text-xs">分享</span>
              </button>
            </div>

            {/* Bottom - Video Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white font-medium">@{currentVideo.user}</span>
                <span className="text-white/60 text-sm">{currentVideo.type === 'like' ? '点赞了你的视频' : '评论了你的视频'}</span>
              </div>
              <p className="text-white text-sm mb-3">{currentVideo.title}</p>
              
              {/* Music Info */}
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <span className="text-lg">🎵</span>
                <span>原声 - {currentVideo.user}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
