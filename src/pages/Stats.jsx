import React, { useEffect, useState } from 'react'
import HomeTopBar from '../components/Home/HomeTopBar'
import { getCvProfilesCount, getProfilesCount } from '../api'

export default function Stats() {
const [cvCount, setCvCount] = useState(0)
const [profilesCount, setProfilesCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const n = await getCvProfilesCount()
      setCvCount(n)
      const m = await getProfilesCount()
      setProfilesCount(m)
    }
    fetchData()
  }, [])


  return (
    <div className="min-h-screen py-10 px-4 pt-28">
      <HomeTopBar isConnected={!!localStorage.getItem('token')} />

<div className="relative max-w-6xl mx-auto mt-10 w-full h-[800px]">
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold text-center z-10 space-y-4">

<div className="text-white text-xl font-bold">
  Membres inscrits : {profilesCount}
</div>
<div className="text-white text-xl font-bold">
  CV disponibles : {cvCount}
</div>

    <div className="text-base font-normal space-y-1">
      <div>Contrats membres/membres : ...</div>
      <div>Nombre de contrats signés : ...</div>
      <div>Demandes par membres : ...</div>
      <div>Demandes abouties : ...</div>

          </div>
        </div>
      </div>
    </div>
  )
}
