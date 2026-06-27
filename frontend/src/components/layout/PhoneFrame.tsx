import { type ReactNode } from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";

// Wraps the Point-of-Work app so it unmistakably reads as a field/mobile app.
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center py-6">
      <div className="relative w-[390px] rounded-[2.5rem] bg-navy-950 p-3 shadow-lift">
        <div className="absolute left-1/2 top-3 z-10 h-5 w-32 -translate-x-1/2 rounded-b-2xl bg-navy-950" />
        <div className="overflow-hidden rounded-[2rem] bg-slate-50 h-[760px] flex flex-col">
          {/* status bar */}
          <div className="flex items-center justify-between bg-navy-900 px-6 py-2 text-white text-xs">
            <span className="font-semibold">07:42</span>
            <span className="flex items-center gap-1.5">
              <Signal size={13} />
              <Wifi size={13} />
              <BatteryFull size={15} />
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
