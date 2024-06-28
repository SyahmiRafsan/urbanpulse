import React from "react";

export default function CommentCard() {
  return (
    <div className="bg-card border-b py-4 flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center px-4">
        <img
          src="https://ui-avatars.com/api/?name=Syahmi+Rafsan"
          className="rounded-full w-5 h-5"
        />
        <p className="font-medium">SyahmiRafsan</p>
        <p className="text-muted-foreground text-sm">• 4h ago</p>
      </div>
      <div className="flex flex-col gap-2 px-4">
        <p className="">
          Please add ramps to help wheel-chaired people like my grandma.
        </p>
      </div>
      <div className="flex flex-row gap-4 overflow-x-auto px-4">
        {[1, 2, 3].map((img) => (
          <img
            src={
              "https://upload.wikimedia.org/wikipedia/commons/2/2d/Bus_Stop_on_Vauxhall_Bridge_Road_-_geograph.org.uk_-_598333.jpg"
            }
            key={img}
            className="rounded-lg max-h-[100px]"
          />
        ))}
      </div>
    </div>
  );
}
