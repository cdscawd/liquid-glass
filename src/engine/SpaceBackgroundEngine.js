import { Timer, WebGLRenderer } from 'three'
import { MOBILE_MQ } from './config/media.js'
import { SpaceManager } from './space/SpaceManager.js'
import { debounce, getPixelRatio, getWinSize } from './utils/dom.js'

/** 隧道持续向内推进，单周期时长（秒），结束后无缝循环 */
const DIVE_CYCLE_SEC = 60
/** 全局动画速率（0.5 = 在当前基础上再慢 50%） */
const ANIM_SPEED = 0.4

export class SpaceBackgroundEngine {
  constructor(containerEl) {
    this.containerEl = containerEl
    this.disposed = false
    this.isLooping = false

    const winSize = getWinSize()
    const aspect = winSize.wd / winSize.wh

    this.timer = new Timer()
    this.spaceManager = new SpaceManager({
      aspect,
      isLowPower: MOBILE_MQ.matches,
    })

    this.renderer = new WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(getPixelRatio())
    this.renderer.setSize(winSize.wd, winSize.wh)
    this.renderer.setClearColor(0x000000, 1)

    this.debouncedResize = debounce(() => this.handleResize(), 150)
    this.bindHandlers()
  }

  bindHandlers() {
    this.onRender = () => {
      if (this.disposed) return

      this.timer.update()
      const elapsed = this.timer.getElapsed()
      const animTime = elapsed * ANIM_SPEED

      this.spaceManager.setDive(animTime / DIVE_CYCLE_SEC)
      this.spaceManager.update(animTime)
      this.renderer.render(this.spaceManager.scene, this.spaceManager.camera)
    }

    this.onResize = () => {
      const winSize = getWinSize()
      const aspect = winSize.wd / winSize.wh

      this.renderer.setSize(winSize.wd, winSize.wh)
      this.spaceManager.setAspect(aspect)
      this.resizeSpaceTarget(winSize)
      this.startLoop()
      this.debouncedResize()
    }

    this.onMqChange = () => {
      this.spaceManager.setLowPower(MOBILE_MQ.matches)
      this.onResize()
    }

    this.onVisibilityChange = () => {
      if (document.hidden) this.stopLoop()
      else this.startLoop()
    }

    this.onContextLost = (event) => {
      event.preventDefault()
      this.stopLoop()
    }

    this.onContextRestored = () => this.startLoop()
  }

  resizeSpaceTarget({ wd, wh }) {
    let width = Math.round(wd * getPixelRatio())
    let height = Math.round(wh * getPixelRatio())
    const cap = 2048

    if (width > cap) {
      height = Math.round((height * cap) / width)
      width = cap
    }

    this.spaceManager.resize(width, height)
  }

  startLoop() {
    if (this.isLooping || this.disposed) return
    this.isLooping = true
    this.renderer.setAnimationLoop(this.onRender)
  }

  stopLoop() {
    if (!this.isLooping) return
    this.isLooping = false
    this.renderer.setAnimationLoop(null)
  }

  handleResize() {
    const ratio = getPixelRatio()
    if (ratio === this.renderer.getPixelRatio()) return

    this.renderer.setPixelRatio(ratio)
    const winSize = getWinSize()
    this.renderer.setSize(winSize.wd, winSize.wh)
    this.resizeSpaceTarget(winSize)
    this.startLoop()
  }

  addEventListeners() {
    const { domElement } = this.renderer

    window.addEventListener('resize', this.onResize)
    document.addEventListener('visibilitychange', this.onVisibilityChange)
    domElement.addEventListener('webglcontextlost', this.onContextLost)
    domElement.addEventListener('webglcontextrestored', this.onContextRestored)
    MOBILE_MQ.addEventListener('change', this.onMqChange)
  }

  removeEventListeners() {
    const { domElement } = this.renderer

    window.removeEventListener('resize', this.onResize)
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
    domElement.removeEventListener('webglcontextlost', this.onContextLost)
    domElement.removeEventListener('webglcontextrestored', this.onContextRestored)
    MOBILE_MQ.removeEventListener('change', this.onMqChange)
  }

  load() {
    if (!this.containerEl || this.disposed) return

    this.containerEl.appendChild(this.renderer.domElement)
    this.onResize()
    this.addEventListeners()
    this.startLoop()
  }

  dispose() {
    if (this.disposed) return
    this.disposed = true

    this.stopLoop()
    this.removeEventListeners()

    this.spaceManager.renderTarget.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}
