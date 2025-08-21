import React from 'react'
import HomeTopBar from '../components/Home/HomeTopBar'
import IntroText from '../components/Home/IntroText'
import RoleButtons from '../components/Home/RoleButtons'

export default function Home() {
  return (
    <div className="min-h-screen py-10 px-4 pt-28">
      <HomeTopBar isConnected={!!localStorage.getItem('token')} />

      <div className="max-w-4xl mx-auto text-center space-y-8 mt-40">
        <IntroText />
        <RoleButtons />
      </div>
    </div>
  )
}
