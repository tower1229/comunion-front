import { defineComponent, ref } from 'vue'
import defaultBanner from './assets/banner_default.jpg'
import defaultLogo from './assets/logo_default.png'

export type infoItem = {
  count: string | number
  unit?: string
  label: string
}

export type generatePropsType = {
  imageUrl: string
  logoUrl: string
  title: string
  infos?: infoItem[]
  content?: string
  noShadow?: boolean
}

const circleImage = (
  ctx: any,
  img: any,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  noShadow = false
) => {
  if (w < 2 * r) r = w / 2
  if (h < 2 * r) r = h / 2
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
  // ctx.strokeStyle = noShadow ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,.7)'
  // ctx.lineWidth = noShadow ? 0 : 1
  // ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0)'
  ctx.fill()
  ctx.clip()
  ctx.drawImage(img, x, y, w, h)
  ctx.restore()
}

export default defineComponent({
  name: 'GenerateShareImage',
  setup(p, { expose }) {
    const domRef = ref()

    const generate = (props: generatePropsType) => {
      console.warn('generate', props)
      const logoTopBase = props.infos || props.content ? 280 : 380
      return new Promise((resolve, reject) => {
        if (domRef.value) {
          const ctx = domRef.value.getContext('2d')
          // console.log('domRef==', domRef.value, domRef.value.width, domRef.value.height)
          if (props.title) {
            // draw banner
            const drawBanner = function () {
              console.log('ready to draw banner')

              const targetRatio = domRef.value.width / domRef.value.height
              let moveX = 0
              let moveY = 0
              let clipX
              let clipY
              // console.log(bannerImg.width, bannerImg.height, targetRatio)
              if (bannerImg.width / bannerImg.height < targetRatio) {
                // narrower
                clipX = bannerImg.width
                moveX = 0
                clipY = clipX / targetRatio
                moveY = (bannerImg.height - clipY) / 2
              } else {
                // wider
                clipY = bannerImg.height
                moveY = 0
                clipX = clipY * targetRatio
                moveX = (bannerImg.width - clipX) / 2
              }
              // console.log(moveX, moveY, clipX, clipY)

              ctx.drawImage(
                bannerImg,
                moveX,
                moveY,
                clipX,
                clipY,
                0,
                0,
                domRef.value.width,
                domRef.value.height
              )
              // draw shadow
              const gradient = ctx.createLinearGradient(
                0,
                domRef.value.height / 3,
                0,
                domRef.value.height
              )
              gradient.addColorStop(0, 'rgba(0,0,0,0)')
              gradient.addColorStop(1, 'rgba(0,0,0,0.9)')
              ctx.fillStyle = gradient
              ctx.fillRect(0, domRef.value.height / 3, domRef.value.width, domRef.value.height)
            }

            // draw infos
            const drawInfos = function () {
              ctx.save()
              if (Array.isArray(props.infos) && props.infos.length) {
                // sync cell with
                const leftPadding = 60
                let leftCellWidth = 0
                const cellSpace = 40
                props.infos.forEach((info, index) => {
                  ctx.fillStyle = 'white'
                  ctx.font = 'bold 40px Outfit,sans-serif'
                  let currentCellWidth = ctx.measureText(info.count).width
                  ctx.fillText(info.count, leftPadding + leftCellWidth + index * cellSpace, 450)

                  if (info.unit) {
                    ctx.font = '28px Outfit,sans-serif'
                    // ctx.textAlign = 'left'
                    ctx.fillText(
                      ` ${info.unit}`,
                      leftPadding + leftCellWidth + index * cellSpace + currentCellWidth,
                      450
                    )
                    currentCellWidth += ctx.measureText(` ${info.unit}`).width
                  }
                  // check line2 width

                  ctx.fillStyle = 'rgba(255,255,255,0.6)'
                  ctx.font = 'bold 28px Outfit,sans-serif'
                  currentCellWidth = Math.max(currentCellWidth, ctx.measureText(info.label).width)
                  ctx.fillText(info.label, leftPadding + leftCellWidth + index * cellSpace, 490)

                  leftCellWidth += currentCellWidth
                })
              } else if (props.content) {
                ctx.fillStyle = 'white'
                ctx.font = '28px Outfit,sans-serif'
                const drawStrLength = Math.floor((domRef.value.width - 120) / 28)
                const drawStr =
                  drawStrLength < props.content.length
                    ? props.content.substring(0, drawStrLength) + '...'
                    : props.content
                ctx.fillText(drawStr, 60, 450)
              }
              ctx.restore()
            }

            // draw name
            const drawName = function () {
              ctx.fillStyle = 'white'
              ctx.font = 'bold 44px Outfit,sans-serif'
              ctx.fillText(props.title, 180, logoTopBase + 60)
            }

            const outpute = function () {
              // output
              domRef.value.toBlob((blob: any) => {
                const imageFile = new File([blob], `generate-${new Date().getTime()}.jpg`)
                resolve(imageFile)
              }, 'image/jpeg')
            }
            // Start

            // load banner
            const bannerImg = new Image()
            bannerImg.crossOrigin = 'Anonymous'
            bannerImg.onload = () => {
              drawBanner()
              // load logo
              const logoImage = new Image()
              logoImage.crossOrigin = 'Anonymous'
              logoImage.onload = () => {
                circleImage(ctx, logoImage, 60, logoTopBase, 96, 96, 4, props.noShadow)
                drawInfos()
                drawName()
                outpute()
              }
              bannerImg.onerror = () => {
                reject(new Error('logoLoaded load error'))
              }
              logoImage.src = props.logoUrl
                ? `${props.logoUrl}?_t=${new Date().getTime()}`
                : defaultLogo
            }
            bannerImg.onerror = () => {
              reject(new Error('bannerImg load error'))
            }
            bannerImg.src = props.imageUrl
              ? `${props.imageUrl}?_t=${new Date().getTime()}`
              : defaultBanner
          } else {
            reject(new Error('missing params title'))
          }
        } else {
          reject(new Error('canvas dom unset'))
        }
      })
    }

    expose({
      generate
    })

    return {
      domRef
    }
  },
  render() {
    return (
      <div style="position:absolute;left:-9999em;top:-9999em;z-index:-1">
        <canvas
          ref={(ref: any) => (this.domRef = ref)}
          width={1008}
          height={528}
          style="width: 504px;height: 264px;"
        ></canvas>
      </div>
    )
  }
})
