import { useState } from 'react'
import { Home, Search, PlusSquare, MessageCircle, User } from 'lucide-react'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import CreatePage from './pages/CreatePage'
import MessagePage from './pages/MessagePage'
import ProfilePage from './pages/ProfilePage'
import VideoDetailPage from './pages/VideoDetailPage'
import HotelListPage from './pages/HotelListPage'
import HotelDetailPage from './pages/HotelDetailPage'
import LivePage from './pages/LivePage'

const tabs = [
  { id: 'home', icon: Home, label: '首页' },
  { id: 'search', icon: Search, label: '发现' },
  { id: 'create', icon: PlusSquare, label: '创作' },
  { id: 'message', icon: MessageCircle, label: '消息' },
  { id: 'profile', icon: User, label: '我的' },
]

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [currentPage, setCurrentPage] = useState('home')
  const [pageParams, setPageParams] = useState({})

  const navigateTo = (page, params = {}) => {
    setCurrentPage(page)
    setPageParams(params)
  }

  const goBack = () => {
    setCurrentPage(activeTab)
    setPageParams({})
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setCurrentPage(tabId)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'video-detail':
        return <VideoDetailPage video={pageParams.video} onBack={goBack} />
      case 'hotel-list':
        return <HotelListPage onBack={goBack} navigateTo={navigateTo} />
      case 'hotel-detail':
        return <HotelDetailPage hotel={pageParams.hotel} onBack={goBack} />
      case 'live':
        return <LivePage onBack={goBack} />
      case 'home':
        return <HomePage onNavigate={navigateTo} />
      case 'search':
        return <SearchPage onNavigate={navigateTo} />
      case 'create':
        return <CreatePage />
      case 'message':
        return <MessagePage />
      case 'profile':
        return <ProfilePage />
      default:
        return <HomePage onNavigate={navigateTo} />
    }
  }

  const showTabBar = !['video-detail', 'hotel-detail', 'live'].includes(currentPage)

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="phone-frame bg-white">
        {/* 灵动岛 */}
        <div className="dynamic-island" />
        
        <div className="h-full flex flex-col pt-[47px]">
          <div 
            className="flex-1 overflow-hidden relative"
            onTouchEnd={(e) => {
              const scrollContainer = e.currentTarget.querySelector('.page-content')
              if (scrollContainer) {
                scrollContainer.scrollTop = 0
              }
            }}
          >
            {renderPage()}
          </div>
          
          {showTabBar && (
            <div className="flex items-center justify-around py-2 bg-white border-t border-gray-100 pb-[34px]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex flex-col items-center py-1 px-3 transition-colors ${
                    activeTab === tab.id ? 'text-primary' : 'text-gray-400'
                  }`}
                >
                  <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 1.5} />
                  <span className="text-xs mt-0.5 font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* 底部手势条 */}
        <div className="home-indicator" />
      </div>
    </div>
  )
}

export default App
