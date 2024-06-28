import React from 'react'
import { Badge } from './ui/badge'
import { ChatBubbleIcon, ThickArrowUpIcon } from '@radix-ui/react-icons'


export default function RecommendationCard() {
  return (
    <div className="px-4 border-b py-4">
    <div className="flex flex-row gap-1 items-center mb-2 text-sm">
      <img src="/icons/bus.png" className="w-5 h-5" />
      <p>SMK Sungai Soi Bus Stop</p>
    </div>
    <div className="flex flex-row gap-4 w-full justify-between">
      <div>
        <p className="text-xl font-bold mb-2">
          Add ramps and elevators for wheelchair access
        </p>
        <div className="flex flex-row gap-1 flex-wrap">
          <Badge variant={"muted"}>Quality of Life</Badge>
          <Badge variant={"muted"}>Safety</Badge>
          <Badge variant={"muted"}>Connectivity</Badge>
        </div>
      </div>
      <div className="w-20 h-20 ./md:w-24 /md:h-24 shrink-0">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/2d/Bus_Stop_on_Vauxhall_Bridge_Road_-_geograph.org.uk_-_598333.jpg"
          className="aspect-square object-cover rounded-lg"
        />
      </div>
    </div>
    <div className="mt-4 flex flex-row gap-4 justify-between">
      <p className="text-sm text-muted-foreground">4h ago</p>
      <div className="flex flex-row gap-2 items-center text-muted-foreground">
        <div className="flex flex-row items-center gap-1">
          <ChatBubbleIcon /> <p>4</p>
        </div>
        <div className="flex flex-row items-center gap-1">
          <ThickArrowUpIcon /> <p>4</p>
        </div>
      </div>
    </div>
  </div>
  )
}
