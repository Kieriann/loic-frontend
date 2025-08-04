import React from 'react'
import HomeTopBar from '../components/Home/HomeTopBar'

export default function Stats() {
  return (
    <div className="min-h-screen py-10 px-4 pt-28">
      <HomeTopBar isConnected={!!localStorage.getItem('token')} />

      <div className="relative max-w-6xl mx-auto mt-10 w-full h-[800px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold text-center z-10">
          Les chiffres
        </div>
      </div>
    </div>
  )
}
