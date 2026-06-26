import { DISPLACEMENT_SCALE } from './constants'

interface LiquidGlassFilterProps {
  filterId: string
  mapId: string
  mapUrl: string
  width: number
  height: number
}

export function LiquidGlassFilter({
  filterId,
  mapId,
  mapUrl,
  width,
  height,
}: LiquidGlassFilterProps) {
  if (!mapUrl || width < 1 || height < 1) return null

  return (
    <svg
      width={0}
      height={0}
      className="liquid-glass-filter"
      aria-hidden
    >
      <defs>
        <filter
          id={filterId}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
          x={0}
          y={0}
          width={width}
          height={height}
        >
          <feImage
            result={mapId}
            href={mapUrl}
            width={width}
            height={height}
            preserveAspectRatio="none"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2={mapId}
            xChannelSelector="R"
            yChannelSelector="G"
            scale={DISPLACEMENT_SCALE}
          />
        </filter>
      </defs>
    </svg>
  )
}
