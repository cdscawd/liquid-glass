import { SliderLiquidGlass } from '../components/SliderLiquidGlass'
import type { LiquidGlassParams } from '../lib/liquid-glass'
import { PILL_BORDER_RADIUS } from '../lib/liquid-glass/constants'
import { GLOBAL_GLASS_PRESETS } from './demoGlassPresets'
import { formatGlassParams } from './formatCode'
import './DemoGlassControls.scss'

const CONTROL_SLIDER_GLASS: LiquidGlassParams = {
  borderRadius: 999,
  strength: 0.65,
  edgeFalloff: 10,
}

export interface DemoGlassControlsProps {
  value: LiquidGlassParams
  onChange: (params: LiquidGlassParams) => void
  className?: string
}

function formatRadiusLabel(borderRadius: number | undefined): string {
  if (borderRadius === undefined) return '8'
  if (borderRadius >= PILL_BORDER_RADIUS) return 'Pill'
  return String(borderRadius)
}

function sliderRadiusValue(borderRadius: number | undefined): number {
  if (borderRadius === undefined) return 8
  if (borderRadius >= PILL_BORDER_RADIUS) return 24
  return borderRadius
}

export function DemoGlassControls({
  value,
  onChange,
  className = '',
}: DemoGlassControlsProps) {
  const borderRadius = value.borderRadius ?? 8
  const strength = value.strength ?? 1
  const edgeFalloff = value.edgeFalloff ?? 14

  const patch = (next: Partial<LiquidGlassParams>) => {
    onChange({ ...value, ...next })
  }

  return (
    <div className={`demo-glass-controls${className ? ` ${className}` : ''}`}>
      <div className="demo-glass-controls__header">
        <span className="demo-glass-controls__title">Global glassParams</span>
        <code className="demo-glass-controls__code">
          {formatGlassParams(value) || '{ }'}
        </code>
      </div>

      <div className="demo-glass-controls__presets">
        {GLOBAL_GLASS_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="demo-glass-controls__preset"
            onClick={() => onChange(preset.params)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="demo-glass-controls__field">
        <span className="demo-glass-controls__label">
          borderRadius
          <span className="demo-glass-controls__value">
            {formatRadiusLabel(borderRadius)}
          </span>
        </span>
        <SliderLiquidGlass
          className="demo-glass-controls__slider"
          glassParams={CONTROL_SLIDER_GLASS}
          min={0}
          max={24}
          step={1}
          value={sliderRadiusValue(borderRadius)}
          onChange={(event) =>
            patch({ borderRadius: Number(event.target.value) })
          }
        />
      </div>

      <div className="demo-glass-controls__field">
        <span className="demo-glass-controls__label">
          strength
          <span className="demo-glass-controls__value">{strength.toFixed(2)}</span>
        </span>
        <SliderLiquidGlass
          className="demo-glass-controls__slider"
          glassParams={CONTROL_SLIDER_GLASS}
          min={0}
          max={2}
          step={0.05}
          value={strength}
          onChange={(event) =>
            patch({ strength: Number(event.target.value) })
          }
        />
      </div>

      <div className="demo-glass-controls__field">
        <span className="demo-glass-controls__label">
          edgeFalloff
          <span className="demo-glass-controls__value">{edgeFalloff}</span>
        </span>
        <SliderLiquidGlass
          className="demo-glass-controls__slider"
          glassParams={CONTROL_SLIDER_GLASS}
          min={0}
          max={40}
          step={1}
          value={edgeFalloff}
          onChange={(event) =>
            patch({ edgeFalloff: Number(event.target.value) })
          }
        />
      </div>

      <p className="demo-glass-controls__hint">
        通过 LiquidGlassProvider 注入 · 未传 glassParams 的组件会联动
      </p>
    </div>
  )
}
