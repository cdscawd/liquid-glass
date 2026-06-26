# Liquid Glass — Code Templates

Replace placeholders:

- `{Semantic}` — PascalCase name (e.g. `Chip`)
- `{kebab}` — kebab-case (e.g. `chip`)
- `{Host}` — HTML element type (`HTMLDivElement`, `HTMLButtonElement`, …)

---

## index.ts

```ts
export {
  {Semantic}LiquidGlass,
  type {Semantic}LiquidGlassProps,
  type {Semantic}LiquidGlassSize,
} from './{Semantic}LiquidGlass'
export { default } from './{Semantic}LiquidGlass'
```

Omit `Size` export if the component has no size prop.

---

## Archetype A — basic-host

**TSX** (`{Semantic}LiquidGlass.tsx`):

```tsx
import { type HTMLAttributes } from 'react'
import {
  GLASS_SHAPE,
  LiquidGlassFilter,
  useLiquidGlassEffect,
  type LiquidGlassParams,
  type LiquidGlassVariant,
} from '../../lib/liquid-glass'
import './{Semantic}LiquidGlass.scss'

export interface {Semantic}LiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
  glassParams?: LiquidGlassParams
  variant?: LiquidGlassVariant
}

export function {Semantic}LiquidGlass({
  glassParams,
  variant,
  className = '',
  style,
  children,
  ...props
}: {Semantic}LiquidGlassProps) {
  const { hostRef, filterId, mapId, mapUrl, filterSize, filterStyle, borderRadius, variantClass } =
    useLiquidGlassEffect<HTMLDivElement>(glassParams, {
      preset: { borderRadius: GLASS_SHAPE.default },
      baseClass: '{kebab}-liquid-glass',
      variant,
    })

  return (
    <>
      <LiquidGlassFilter
        filterId={filterId}
        mapId={mapId}
        mapUrl={mapUrl}
        width={filterSize.width}
        height={filterSize.height}
      />
      <div
        ref={hostRef}
        className={`{kebab}-liquid-glass${variantClass}${className ? ` ${className}` : ''}`}
        style={{ ...filterStyle, borderRadius, ...style }}
        {...props}
      >
        {children}
      </div>
    </>
  )
}

export default {Semantic}LiquidGlass
```

**SCSS**:

```scss
@use '../../styles/glass-mixins' as *;

.{kebab}-liquid-glass {
  @include glass-surface;
  @include glass-variant-modifiers;
  @include glass-text;
}
```

---

## Archetype B — interactive (button)

Use `HTMLButtonElement`, `GLASS_SHAPE.pill`, add `size`:

```tsx
export type {Semantic}LiquidGlassSize = 'sm' | 'md' | 'lg'

export interface {Semantic}LiquidGlassProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  glassParams?: LiquidGlassParams
  variant?: LiquidGlassVariant
  size?: {Semantic}LiquidGlassSize
}

// hook:
useLiquidGlassEffect<HTMLButtonElement>(glassParams, {
  preset: { borderRadius: GLASS_SHAPE.pill },
  baseClass: '{kebab}-liquid-glass',
  variant,
})

const sizeClass = size === 'md' ? '' : ` {kebab}-liquid-glass--${size}`
```

**SCSS** adds `@include glass-interactive` and size modifiers:

```scss
.{kebab}-liquid-glass {
  @include glass-surface;
  @include glass-variant-modifiers;
  @include glass-interactive;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;

  &--sm { min-height: 32px; padding: 6px 14px; font-size: 13px; }
  &--lg { min-height: 48px; padding: 12px 28px; font-size: 16px; }
}
```

Icon buttons: require `aria-label`, use circular dimensions + pill preset.

---

## Archetype C — input-host

Glass on **wrapper**; native input is transparent:

```tsx
export interface {Semantic}LiquidGlassProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  glassParams?: LiquidGlassParams
  size?: {Semantic}LiquidGlassSize
}

// Structure:
<div ref={hostRef} className="{kebab}-liquid-glass" style={{ ...filterStyle, borderRadius }}>
  <input className="{kebab}-liquid-glass__input" {...inputProps} />
</div>
```

**SCSS**:

```scss
.{kebab}-liquid-glass {
  @include glass-surface;
  @include glass-input-host;
  display: flex;
  align-items: center;

  &__input {
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
    outline: none;
  }
}
```

---

## Archetype D — thumb-slider (Switch pattern)

- **One** filter on track (`HTMLButtonElement` or `div`)
- Thumb is `<span>` with SCSS knob — **no** second `useLiquidGlassEffect`
- Measure track with `clientWidth` / `clientHeight` (excludes border)
- Drag: `pointerdown` → threshold → `pointermove` → `pointerup` snap; `ignoreClickRef` prevents double toggle

```tsx
const THUMB_INSET = 2

// After measure:
const thumbSize = Math.max(trackSize.height - THUMB_INSET * 2, 0)
const offLeft = THUMB_INSET
const onLeft = Math.max(trackSize.width - thumbSize - THUMB_INSET, THUMB_INSET)

// Thumb style:
style={{
  width: thumbSize,
  height: thumbSize,
  transform: `translate3d(${thumbLeft}px, ${THUMB_INSET}px, 0)`,
  borderRadius: thumbSize >= height / 2 ? '999px' : `${borderRadius - 1}px`,
}}
```

Optional `thumbGlassParams` affects thumb **visual** only (border/shadow), not a second filter.

---

## Archetype E — overlay-portal

```tsx
import { createPortal } from 'react-dom'

// Panel uses useLiquidGlassEffect on dialog surface
// Overlay sibling or wrapper uses glass-overlay-backdrop mixin (no filter on overlay)

return createPortal(
  <div className="{kebab}-liquid-glass-overlay" onClick={onOverlayClick}>
    <div ref={hostRef} className="{kebab}-liquid-glass" role="dialog" aria-modal …>
      {children}
    </div>
  </div>,
  document.body,
)
```

- Close on ESC for modals
- Trap focus if modal semantics required
- `LiquidGlassFilter` as sibling inside portal fragment

**SCSS**:

```scss
.{kebab}-liquid-glass-overlay {
  @include glass-overlay-backdrop;
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## Archetype F — list-single

One filter on `<ul>` / container; items toggle `--selected` class with `$glass-bg-selected` — no per-item filter.

---

## Demo section snippet

```tsx
export function {Semantic}Section() {
  return (
    <DemoSection
      id="{kebab}"
      title="{Semantic}"
      hint="简短中文说明"
      propsHint="Props: size?, glassParams?, variant?"
    >
      <SizeDemoBlock
        component="{Semantic}LiquidGlass"
        render={(size) => <{Semantic}LiquidGlass key={size} size={size} />}
      />
      <GlassPresetDemoBlocks
        component="{Semantic}LiquidGlass"
        presets={GLASS_PRESETS.slice(1, 4)}
        render={(preset) => <{Semantic}LiquidGlass glassParams={preset.params} />}
      />
    </DemoSection>
  )
}
```

Add to `DEMO_SECTIONS` and `demoNav.ts`.

---

## Provider wrapper (app root)

```tsx
import { LiquidGlassProvider } from './lib/liquid-glass'

<LiquidGlassProvider glassParams={{ borderRadius: 8, strength: 1, edgeFalloff: 14 }}>
  <App />
</LiquidGlassProvider>
```

Glass effect needs content **behind** the component (dynamic background or imagery) to show refraction.
