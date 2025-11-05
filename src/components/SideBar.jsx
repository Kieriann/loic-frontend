import React from "react"

export default function SideBar({ selectedTab, setSelectedTab, unreadCount, navigate }) {
  return (
    <div className="w-[14rem] bg-white rounded-2xl shadow-md p-6 h-full">
          <div className="flex flex-col gap-3">
        {['profil', 'experiences', 'realisations', 'prestations', 'messages', 'forum', 'suggestions'].map(tab => (
          <React.Fragment key={tab}>
            {tab === 'suggestions' && <div className="my-3 border-t border-gray-200" />}
            <button
              onClick={() => {
                if (tab === 'forum') {
                  window.location.assign('/forum')
                  return
                }
                setSelectedTab(tab)
                const params = new URLSearchParams(window.location.search)
                const other = params.get('otherId')
                const extra = tab === 'messages' && other ? `&otherId=${other}` : ''
                navigate(`/profile?tab=${tab}${extra}`, { replace: true })
              }}
              className={`w-full rounded-xl px-4 py-2 font-semibold text-left ${
                selectedTab === tab
                  ? 'bg-blue-100 text-darkBlue'
                  : 'hover:bg-blue-50'
              }`}
            >
              <span className="flex justify-between items-center w-full">
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'messages' && unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </span>
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
