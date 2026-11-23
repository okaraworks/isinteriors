import { RoomScene, type RoomKind, type SceneProps } from '../art/RoomScene'
import { conceptBySlug, concepts } from '../../data/concepts'
import { cloudinaryImage } from '../../lib/cloudinary'

interface ArtworkProps {
  /** Real photograph. When supplied it replaces the illustrated placeholder. */
  src?: string
  srcSet?: string
  /** Cloudinary public ID; served responsive with automatic format/quality. */
  cloudinaryId?: string
  sizes?: string
  alt: string
  conceptSlug?: string
  room?: RoomKind
  state?: SceneProps['state']
  seedOffset?: number
  priority?: boolean
  className?: string
  /** Slow zoom on hover of the closest `.group` ancestor. */
  zoom?: boolean
}

/**
 * Single entry point for imagery. Pass `src` once studio photography exists;
 * until then the matching concept's illustrated scene is rendered.
 */
export function Artwork({ src: srcProp, srcSet: srcSetProp, cloudinaryId, sizes = '(min-width: 1024px) 50vw, 100vw', alt, conceptSlug, room, state, seedOffset = 0, priority, className = '', zoom = true }: ArtworkProps) {
  const concept = conceptBySlug(conceptSlug) ?? concepts[0]
  const cld = cloudinaryId ? cloudinaryImage(cloudinaryId) : null
  const src = srcProp ?? cld?.src
  const srcSet = srcSetProp ?? cld?.srcSet
  const zoomCls = zoom ? 'transition-transform duration-[1600ms] ease-[var(--ease-editorial)] group-hover:scale-[1.045]' : ''
  return (
    <div className={`${/(^|\s)absolute(\s|$)/.test(className) ? '' : 'relative '}overflow-hidden bg-beige ${className}`}>
      {src ? (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover ${zoomCls}`}
        />
      ) : (
        <RoomScene
          room={room ?? concept.rooms[0]}
          palette={concept.scene}
          floor={room && room !== concept.rooms[0] ? undefined : concept.floor}
          opening={room && room !== concept.rooms[0] ? undefined : concept.opening}
          seed={concept.seed + seedOffset}
          state={state}
          title={alt}
          className={`absolute inset-0 h-full w-full ${zoomCls}`}
        />
      )}
    </div>
  )
}
