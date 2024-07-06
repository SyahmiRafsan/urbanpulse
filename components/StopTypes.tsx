import React from 'react'
import { Button } from './ui/button'
import { getIconByStopCategory } from '@/lib/utils';


export default function StopTypes() {

    const modes = [
        { label: "Bus", value: "bus" },
        { label: "LRT", value: "lrt" },
        { label: "MRT", value: "mrt" },
        { label: "Monorail", value: "mr" },
        // { label: "KTM", value: "ktm" },
      ];

  return (
    <div className="flex flex-row gap-2 items-center overflow-x-auto">
    <Button className="rounded-full" size={"sm"}>
      <p className="whitespace-nowrap">All Stops</p>
    </Button>
    {modes.map((md, i) => (
      <Button
        key={md.label + i}
        className="rounded-full px-5"
        variant={"outline"}
        size={"sm"}
      >
        <img
          src={getIconByStopCategory(md.value)}
          className="w-5 h-5 mr-1 rounded-sm"
        />
        <p className="">{md.label}</p>
      </Button>
    ))}
  </div>
  )
}
