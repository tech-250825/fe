"use client"

import { Video, ImageIcon, Edit } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function ImageSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-full lg:w-12 bg-[#1a1a1a] flex lg:flex-col items-center py-4 space-x-4 lg:space-x-0 lg:space-y-4">
      <Link 
        href="/create/videos" 
        className={`p-2 rounded hover:bg-[#333333] cursor-pointer ${
          pathname.includes('/videos') ? 'bg-[#333333]' : ''
        }`}
      >
        <Video className="w-5 h-5 text-white" />
      </Link>
      <Link 
        href="/create/images" 
        className={`p-2 rounded hover:bg-[#333333] cursor-pointer ${
          pathname.includes('/images') ? 'bg-[#333333]' : ''
        }`}
      >
        <ImageIcon className="w-5 h-5 text-white" />
      </Link>
      <Link 
        href="/edit" 
        className={`p-2 rounded hover:bg-[#333333] cursor-pointer ${
          pathname.includes('/edit') ? 'bg-[#333333]' : ''
        }`}
      >
        <Edit className="w-5 h-5 text-white" />
      </Link>
    </div>
  )
}