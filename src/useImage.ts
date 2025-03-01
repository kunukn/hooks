import { useState, useEffect } from 'react'

type State = {
  image: HTMLImageElement | null
  error: unknown | null
}

/**
 * Fetch and load an image for programatic use such as in a `<canvas>` element.
 *
 * @param imageOrUrl The `HtmlImageElement` or image url to load
 * @param crossOrigin The `crossorigin` attribute to set
 *
 * ```ts
 * const { image, error } = useImage('/static/kittens.png')
 * const ref = useRef<HTMLCanvasElement>()
 *
 * useEffect(() => {
 *   const ctx = ref.current.getContext('2d')
 *
 *   if (image) {
 *     ctx.drawImage(image, 0, 0)
 *   }
 * }, [ref, image])
 *
 * return (
 *   <>
 *     {error && "there was a problem loading the image"}
 *     <canvas ref={ref} />
 *   </>
 * ```
 */
export default function useImage(
  imageOrUrl?: string | HTMLImageElement | null | undefined,
  crossOrigin?: 'anonymous' | 'use-credentials' | string
) {
  const [state, setState] = useState<State>({
    image: null,
    error: null,
  })

  useEffect(() => {
    if (!imageOrUrl) return undefined

    let image: HTMLImageElement

    if (typeof imageOrUrl === 'string') {
      image = new Image()
      image.src = imageOrUrl
      if (crossOrigin) image.crossOrigin = crossOrigin
    } else {
      image = imageOrUrl

      if (image.complete && image.naturalHeight > 0) {
        setState({ image, error: null })
        return
      }
    }

    function onLoad() {
      setState({ image, error: null })
    }

    function onError(error: ErrorEvent) {
      setState({ image, error })
    }

    image.addEventListener('load', onLoad)
    image.addEventListener('error', onError)

    return () => {
      image.removeEventListener('load', onLoad)
      image.removeEventListener('error', onError)
    }
  }, [imageOrUrl, crossOrigin])

  return state
}
