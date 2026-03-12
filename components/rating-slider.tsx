"use client"

import { Slider } from "@/components/ui/slider"

interface RatingSliderProps {
  label: string
  description: string
  value: number
  onChange: (value: number) => void
}

export function RatingSlider({ label, description, value, onChange }: RatingSliderProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-card-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
          {value}
        </span>
      </div>

      <div className="mt-3">
        <Slider
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          min={1}
          max={5}
          step={1}
          className="w-full"
        />
        <div className="mt-1 flex justify-between">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className="text-[10px] text-muted-foreground"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
