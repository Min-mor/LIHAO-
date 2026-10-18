import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings, Heart, Star, Clock, ShoppingBag, Ticket, Wallet, MapPin,
  ChevronRight, Edit2, Grid, Bookmark, Camera, Image, X, Shield, Bell,
  Trash2, Info, User, Users, ThumbsUp, ChevronDown, Copy, Plus, Eye
} from 'lucide-react'

// ─── 底部弹出面板组件 ───
function BottomSheet({ show, onClose, title, children }) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[70vh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="sticky top-0 bg-white px-4 pt-3 pb-2 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-semibold text-gray-800 text-base">{title}</h3>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Toast 组件 ───
function Toast({ message, options, onOptionClick, onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="fixed top-16 left-1/2 z-[60] flex flex-col items-center"
          initial={{ x: '-50%', opacity: 0, y: -20 }}
          animate={{ x: '-50%', opacity: 1, y: 0 }}
          exit={{ x: '-50%', opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-gray-800 text-white text-sm px-5 py-2.5 rounded-lg shadow-lg">
            {message}
          </div>
          {options && options.length > 0 && (
            <motion.div
              className="mt-2 bg-white rounded-xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => onOptionClick?.(opt.value)}
                  className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 w-full border-b border-gray-50 last:border-0"
                >
                  {opt.icon && <opt.icon size={18} className="text-gray-500" />}
                  <span>{opt.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── 模拟数据 ───
const mockFollowers = [
  { id: 1, name: '旅行达人小王', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80' },
  { id: 2, name: '摄影爱好者', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80' },
  { id: 3, name: '背包客小李', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80' },
  { id: 4, name: '环球旅行家', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80' },
  { id: 5, name: '美食探索者', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80' },
]

const mockFollowing = [
  { id: 1, name: '旅游攻略君', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80' },
  { id: 2, name: '酒店体验师', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80' },
  { id: 3, name: '机票达人', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80' },
]

const mockOrders = [
  { id: 'ORD001', title: '三亚5日自由行', status: '待付款', price: '¥3,299', date: '2026-05-20', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120' },
  { id: 'ORD002', title: '丽江古城民宿', status: '待出行', price: '¥688', date: '2026-05-18', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120' },
  { id: 'ORD003', title: '张家界门票', status: '待出行', price: '¥225', date: '2026-05-22', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120' },
  { id: 'ORD004', title: '成都美食团', status: '待评价', price: '¥1,580', date: '2026-05-10', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120' },
  { id: 'ORD005', title: '厦门鼓浪屿', status: '待评价', price: '¥2,100', date: '2026-05-08', img: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=120' },
  { id: 'ORD006', title: '桂林山水游', status: '待评价', price: '¥1,960', date: '2026-05-05', img: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=120' },
  { id: 'ORD007', title: '黄山日出团', status: '退款', price: '¥899', date: '2026-04-28', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=120' },
]

const mockCoupons = [
  { id: 1, title: '酒店满减券', discount: '满500减100', expire: '2026-06-30', used: false },
  { id: 2, title: '机票折扣券', discount: '8折', expire: '2026-06-15', used: false },
  { id: 3, title: '新人专享', discount: '满200减50', expire: '2026-07-01', used: false },
]

const mockFavorites = [
  { id: 1, title: '巴厘岛浪漫之旅', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200' },
  { id: 2, title: '北海道温泉行', img: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=200' },
  { id: 3, title: '瑞士雪山探险', img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=200' },
]

const mockAddresses = [
  { id: 1, name: '张三', phone: '138****8888', address: '北京市朝阳区建国路88号', isDefault: true },
  { id: 2, name: '李四', phone: '139****6666', address: '上海市浦东新区陆家嘴环路1000号', isDefault: false },
]

// ─── 主组件 ───
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('video')
  const [showPanel, setShowPanel] = useState(null)
  const [showToast, setShowToast] = useState(null)
  const [toastOptions, setToastOptions] = useState([])
  const [activeOrderTab, setActiveOrderTab] = useState('全部')
  const [editProfile, setEditProfile] = useState({ nickname: '旅行爱好者', bio: '热爱旅行，用脚步丈量世界' })
  const [userData, setUserData] = useState({
    name: '旅行爱好者',
    id: 'lihao_user_123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    followers: 1256,
    following: 328,
    likes: '2.3w',
  })

  const closePanel = useCallback(() => setShowPanel(null), [])
  const closeToast = useCallback(() => { setShowToast(null); setToastOptions([]) }, [])

  const triggerToast = useCallback((msg, options = []) => {
    setShowToast(msg)
    setToastOptions(options)
    if (options.length === 0) {
      setTimeout(closeToast, 2000)
    }
  }, [closeToast])

  // ─── 设置面板选项 ───
  const settingsOptions = [
    { icon: User, label: '编辑资料', value: 'editProfile' },
    { icon: Shield, label: '账号安全', value: 'security' },
    { icon: Eye, label: '隐私设置', value: 'privacy' },
    { icon: Bell, label: '通知设置', value: 'notification' },
    { icon: Trash2, label: '清除缓存', value: 'cache' },
    { icon: Info, label: '关于我们', value: 'about' },
  ]

  const handleSettingClick = (value) => {
    closePanel()
    setTimeout(() => {
      if (value === 'editProfile') {
        setEditProfile({ nickname: userData.name, bio: '热爱旅行，用脚步丈量世界' })
        setShowPanel('editProfile')
      } else if (value === 'cache') {
        triggerToast('缓存已清除')
      } else if (value === 'about') {
        setShowPanel('about')
      } else {
        triggerToast(`${settingsOptions.find(o => o.value === value)?.label} 功能开发中`)
      }
    }, 300)
  }

  // ─── 订单状态标签 ───
  const orderStatuses = ['全部', '待付款', '待出行', '待评价', '退款']
  const filteredOrders = activeOrderTab === '全部'
    ? mockOrders
    : mockOrders.filter(o => o.status === activeOrderTab)

  // ─── 菜单项 ───
  const menuItems = [
    { icon: ShoppingBag, label: '我的订单', badge: 2, color: 'text-orange-500', panel: 'orders' },
    { icon: Ticket, label: '优惠券', badge: 3, color: 'text-red-500', panel: 'coupons' },
    { icon: Heart, label: '我的收藏', color: 'text-pink-500', panel: 'favorites' },
    { icon: Star, label: '会员中心', color: 'text-yellow-500', panel: 'vip' },
    { icon: Wallet, label: '钱包', color: 'text-green-500', panel: 'wallet' },
    { icon: MapPin, label: '常用地址', color: 'text-blue-500', panel: 'addresses' },
  ]

  const tabs = [
    { id: 'video', icon: Grid, label: '作品' },
    { id: 'favorite', icon: Bookmark, label: '收藏' },
    { id: 'history', icon: Clock, label: '历史' },
  ]

  return (
    <div className="h-full bg-gray-50 overflow-y-auto pb-20 relative">
      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-primary to-orange-400 px-4 pt-0 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-lg font-semibold">我的</h1>
          <button
            className="text-white active:scale-90 transition-transform"
            onClick={() => setShowPanel('settings')}
          >
            <Settings size={22} />
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center">
          <div className="relative">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-20 h-20 rounded-full border-4 border-white/30 object-cover"
            />
            <button
              className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center active:scale-90 transition-transform"
              onClick={() => triggerToast('选择头像来源', [
                { icon: Camera, label: '拍照', value: 'camera' },
                { icon: Image, label: '从相册选择', value: 'album' },
              ])}
            >
              <Edit2 size={12} className="text-primary" />
            </button>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center">
              <h2 className="text-white text-xl font-bold">{userData.name}</h2>
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-white text-xs">Lv.5</span>
            </div>
            <p className="text-white/70 text-sm mt-1">ID: {userData.id}</p>
            <button
              className="mt-2 px-4 py-1 bg-white/20 rounded-full text-white text-sm active:scale-95 transition-transform"
              onClick={() => {
                setEditProfile({ nickname: userData.name, bio: '热爱旅行，用脚步丈量世界' })
                setShowPanel('editProfile')
              }}
            >
              编辑资料
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-around mt-6">
          {[
            { value: userData.followers, label: '粉丝', key: 'followers' },
            { value: userData.following, label: '关注', key: 'following' },
            { value: userData.likes, label: '获赞', key: 'likes' },
          ].map(stat => (
            <button
              key={stat.key}
              className="text-center active:scale-95 transition-transform"
              onClick={() => setShowPanel(`stat_${stat.key}`)}
            >
              <p className="text-white text-lg font-bold">{stat.value}</p>
              <p className="text-white/70 text-xs">{stat.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Order Section ── */}
      <div className="bg-white mx-4 -mt-4 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">我的订单</h3>
          <button
            className="text-gray-500 text-sm flex items-center active:opacity-70 transition-opacity"
            onClick={() => { setActiveOrderTab('全部'); setShowPanel('orders') }}
          >
            全部订单 <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: '💳', label: '待付款', badge: 1, status: '待付款' },
            { icon: '📦', label: '待出行', badge: 2, status: '待出行' },
            { icon: '⭐', label: '待评价', badge: 3, status: '待评价' },
            { icon: '💰', label: '退款', badge: 0, status: '退款' },
          ].map((item, i) => (
            <button
              key={i}
              className="flex flex-col items-center relative active:scale-95 transition-transform"
              onClick={() => { setActiveOrderTab(item.status); setShowPanel('orders') }}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-gray-600 text-xs">{item.label}</span>
              {item.badge > 0 && (
                <span className="absolute top-0 right-2 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Menu List ── */}
      <div className="bg-white mx-4 mt-4 rounded-xl divide-y">
        {menuItems.map((item, i) => (
          <button
            key={i}
            className="flex items-center px-4 py-3.5 w-full text-left active:bg-gray-50 transition-colors"
            onClick={() => setShowPanel(item.panel)}
          >
            <div className={`w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mr-3 ${item.color}`}>
              <item.icon size={18} />
            </div>
            <span className="flex-1 text-gray-800 text-sm">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span className="w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center mr-2">
                {item.badge}
              </span>
            )}
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        ))}
      </div>

      {/* ── Content Tabs ── */}
      <div className="bg-white mx-4 mt-4 rounded-xl overflow-hidden">
        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-1 ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'video' && (
            <div className="grid grid-cols-3 gap-1">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <button
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden relative bg-gray-100 active:opacity-80 transition-opacity"
                  onClick={() => triggerToast('打开视频详情')}
                >
                  <img
                    src={`https://images.unsplash.com/photo-${1580000000000 + i * 10000000}?w=200&h=200&fit=crop`}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/200?random=${i}`
                    }}
                  />
                  <div className="absolute bottom-1 left-1 text-white text-xs flex items-center">
                    <span>1.2k</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'favorite' && (
            <div className="text-center py-8">
              <Heart size={48} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">暂无收藏内容</p>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="text-center py-8">
              <Clock size={48} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">暂无浏览记录</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          面板 & Toast
         ═══════════════════════════════════════════ */}

      {/* Toast */}
      <Toast
        message={showToast}
        options={toastOptions}
        onOptionClick={(val) => {
          if (val === 'camera') triggerToast('正在打开相机...')
          else if (val === 'album') triggerToast('正在打开相册...')
          else closeToast()
        }}
        onClose={closeToast}
      />

      {/* ── 设置面板 ── */}
      <BottomSheet show={showPanel === 'settings'} onClose={closePanel} title="设置">
        <div className="divide-y">
          {settingsOptions.map((opt, i) => (
            <button
              key={i}
              className="flex items-center gap-4 w-full px-2 py-3.5 text-left active:bg-gray-50 transition-colors"
              onClick={() => handleSettingClick(opt.value)}
            >
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <opt.icon size={18} className="text-gray-600" />
              </div>
              <span className="flex-1 text-gray-800 text-sm">{opt.label}</span>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* ── 编辑资料面板 ── */}
      <BottomSheet show={showPanel === 'editProfile'} onClose={closePanel} title="编辑资料">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">昵称</label>
            <input
              type="text"
              value={editProfile.nickname}
              onChange={e => setEditProfile(p => ({ ...p, nickname: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
              placeholder="请输入昵称"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">简介</label>
            <textarea
              value={editProfile.bio}
              onChange={e => setEditProfile(p => ({ ...p, bio: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
              rows={3}
              placeholder="介绍一下自己吧"
            />
          </div>
          <button
            className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium active:opacity-90 transition-opacity"
            onClick={() => {
              setUserData(d => ({ ...d, name: editProfile.nickname }))
              closePanel()
              triggerToast('资料已保存')
            }}
          >
            保存
          </button>
        </div>
      </BottomSheet>

      {/* ── 粉丝/关注/获赞 列表面板 ── */}
      <BottomSheet show={showPanel === 'stat_followers'} onClose={closePanel} title="粉丝列表">
        <div className="divide-y">
          {mockFollowers.map(u => (
            <div key={u.id} className="flex items-center gap-3 py-3">
              <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
              <span className="flex-1 text-sm text-gray-800">{u.name}</span>
              <button className="px-3 py-1 border border-primary text-primary text-xs rounded-full active:bg-primary active:text-white transition-colors">
                关注
              </button>
            </div>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet show={showPanel === 'stat_following'} onClose={closePanel} title="关注列表">
        <div className="divide-y">
          {mockFollowing.map(u => (
            <div key={u.id} className="flex items-center gap-3 py-3">
              <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
              <span className="flex-1 text-sm text-gray-800">{u.name}</span>
              <button className="px-3 py-1 border border-gray-300 text-gray-500 text-xs rounded-full active:bg-gray-100 transition-colors">
                已关注
              </button>
            </div>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet show={showPanel === 'stat_likes'} onClose={closePanel} title="获赞详情">
        <div className="text-center py-6">
          <ThumbsUp size={40} className="text-orange-400 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-800">{userData.likes}</p>
          <p className="text-gray-500 text-sm mt-1">累计获赞</p>
        </div>
      </BottomSheet>

      {/* ── 订单列表面板 ── */}
      <BottomSheet show={showPanel === 'orders'} onClose={closePanel} title="我的订单">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {orderStatuses.map(s => (
            <button
              key={s}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                activeOrderTab === s
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 active:bg-gray-200'
              }`}
              onClick={() => setActiveOrderTab(s)}
            >
              {s}
            </button>
          ))}
        </div>
        {filteredOrders.length > 0 ? (
          <div className="divide-y">
            {filteredOrders.map(order => (
              <div key={order.id} className="flex gap-3 py-3">
                <img src={order.img} alt={order.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{order.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-sm font-semibold text-primary">{order.price}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === '待付款' ? 'bg-orange-100 text-orange-600' :
                      order.status === '待出行' ? 'bg-blue-100 text-blue-600' :
                      order.status === '待评价' ? 'bg-green-100 text-green-600' :
                      'bg-red-100 text-red-600'
                    }`}>{order.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingBag size={40} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">暂无{activeOrderTab}订单</p>
          </div>
        )}
      </BottomSheet>

      {/* ── 优惠券面板 ── */}
      <BottomSheet show={showPanel === 'coupons'} onClose={closePanel} title="我的优惠券">
        <div className="space-y-3">
          {mockCoupons.map(c => (
            <div key={c.id} className="border border-dashed border-orange-300 rounded-xl p-4 flex items-center gap-3 bg-orange-50/50">
              <div className="text-center">
                <p className="text-lg font-bold text-orange-500">{c.discount}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{c.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">有效期至 {c.expire}</p>
              </div>
              <button className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full active:opacity-90 transition-opacity">
                使用
              </button>
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* ── 我的收藏面板 ── */}
      <BottomSheet show={showPanel === 'favorites'} onClose={closePanel} title="我的收藏">
        <div className="space-y-3">
          {mockFavorites.map(f => (
            <div key={f.id} className="flex gap-3 items-center">
              <img src={f.img} alt={f.title} className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{f.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">已收藏</p>
              </div>
              <button className="text-gray-400 active:text-red-500 transition-colors">
                <Heart size={18} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* ── 会员中心面板 ── */}
      <BottomSheet show={showPanel === 'vip'} onClose={closePanel} title="会员中心">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-3">
            <Star size={36} className="text-white" />
          </div>
          <p className="text-lg font-bold text-gray-800">黄金会员</p>
          <p className="text-sm text-gray-500 mt-1">Lv.5 · 距离下一等级还需 320 成长值</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{ width: '68%' }} />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: '专属折扣', value: '9折' },
              { label: '积分翻倍', value: '2x' },
              { label: '优先客服', value: 'VIP' },
            ].map((priv, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3">
                <p className="text-lg font-bold text-primary">{priv.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{priv.label}</p>
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* ── 钱包面板 ── */}
      <BottomSheet show={showPanel === 'wallet'} onClose={closePanel} title="我的钱包">
        <div className="text-center mb-5">
          <p className="text-sm text-gray-500">账户余额</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">¥ 1,280.00</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: '充值', icon: Plus },
            { label: '提现', icon: ChevronDown },
            { label: '明细', icon: Copy },
          ].map((act, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-1 py-3 bg-gray-50 rounded-lg active:bg-gray-100 transition-colors"
              onClick={() => triggerToast(`${act.label}功能开发中`)}
            >
              <act.icon size={18} className="text-primary" />
              <span className="text-xs text-gray-600">{act.label}</span>
            </button>
          ))}
        </div>
        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">最近交易</p>
          {[
            { title: '三亚自由行退款', amount: '+¥3,299', time: '05-10', positive: true },
            { title: '丽江民宿支付', amount: '-¥688', time: '05-08', positive: false },
            { title: '优惠券返还', amount: '+¥50', time: '05-05', positive: true },
          ].map((tx, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm text-gray-800">{tx.title}</p>
                <p className="text-xs text-gray-400">{tx.time}</p>
              </div>
              <span className={`text-sm font-medium ${tx.positive ? 'text-green-500' : 'text-gray-800'}`}>
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* ── 常用地址面板 ── */}
      <BottomSheet show={showPanel === 'addresses'} onClose={closePanel} title="常用地址">
        <div className="space-y-3">
          {mockAddresses.map(addr => (
            <div key={addr.id} className="border border-gray-100 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-800">{addr.name}</span>
                {addr.isDefault && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">默认</span>
                )}
              </div>
              <p className="text-xs text-gray-500">{addr.phone}</p>
              <p className="text-sm text-gray-600 mt-1">{addr.address}</p>
            </div>
          ))}
          <button
            className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-gray-300 rounded-xl text-gray-500 text-sm active:bg-gray-50 transition-colors"
            onClick={() => triggerToast('添加地址功能开发中')}
          >
            <Plus size={16} />
            添加新地址
          </button>
        </div>
      </BottomSheet>

      {/* ── 关于我们面板 ── */}
      <BottomSheet show={showPanel === 'about'} onClose={closePanel} title="关于我们">
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center mb-3">
            <span className="text-white text-xl font-bold">旅</span>
          </div>
          <p className="text-lg font-bold text-gray-800">里好旅行</p>
          <p className="text-sm text-gray-500 mt-1">版本 2.6.0</p>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            里好旅行致力于为用户提供最优质的旅行体验，涵盖酒店预订、机票购买、旅游攻略等一站式服务。
          </p>
          <div className="mt-5 space-y-2">
            {['用户协议', '隐私政策', '联系客服'].map((item, i) => (
              <button
                key={i}
                className="w-full py-2.5 text-sm text-primary active:bg-gray-50 rounded-lg transition-colors"
                onClick={() => triggerToast(`${item}页面开发中`)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}

