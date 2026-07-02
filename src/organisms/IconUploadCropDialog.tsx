'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'

const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
const ALLOWED_ACCEPT = ALLOWED_MIME.join(',')
const RASTER_MIME = new Set(['image/png', 'image/jpeg', 'image/webp'])

interface Props {
  open: boolean
  onOpenChange: (next: boolean) => void
  /** Aufgerufen mit dem fertigen, quadratischen Blob (PNG für Raster, original für SVG). */
  onSubmit: (file: File) => Promise<void> | void
  title?: string
}

/**
 * Datei-Picker → Crop-Dialog → quadratischer PNG-Blob.
 *
 * - PNG/JPEG/WebP: clientseitiges Crop in <canvas>, Output als PNG.
 * - SVG: kein Crop (Vektor), wird unverändert weitergereicht.
 * - Keine Größen-/Auflösungs-Beschränkung (per Spec).
 *
 * Der Dialog steuert den File-Picker selbst — der Aufrufer muss nur `open`
 * toggeln und `onSubmit` implementieren.
 */
export function IconUploadCropDialog({ open, onOpenChange, onSubmit, title = 'Icon hochladen' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [pickedFile, setPickedFile] = useState<File | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPx, setCroppedAreaPx] = useState<Area | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // State-Reset synchron beim Open-Toggle (React-Pattern „State zurücksetzen,
  // wenn sich ein Prop ändert", https://react.dev/learn/you-might-not-need-an-effect).
  // Nicht in einem useEffect — das löst die react-hooks/set-state-in-effect-Lint aus.
  const [openSnapshot, setOpenSnapshot] = useState(open)
  if (open !== openSnapshot) {
    setOpenSnapshot(open)
    if (open) {
      setPickedFile(null)
      setImageSrc(null)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPx(null)
    }
  }

  // Beim Öffnen den File-Picker triggern (echter DOM-Seiteneffekt).
  // Trick: timeout-deferred, sonst blockt Browser die Click-Heuristik.
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.click(), 0)
    return () => clearTimeout(t)
  }, [open])

  const onCropComplete = useCallback((_area: Area, areaPx: Area) => {
    setCroppedAreaPx(areaPx)
  }, [])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    e.target.value = '' // Reset, sodass dieselbe Datei erneut wählbar ist.
    if (!f) {
      onOpenChange(false)
      return
    }
    if (!ALLOWED_MIME.includes(f.type)) {
      // Soft-Fail: Dialog schließen; Aufrufer kann via toast nachreichen.
      onOpenChange(false)
      return
    }
    setPickedFile(f)

    if (f.type === 'image/svg+xml') {
      // SVG braucht keinen Crop — direkt an onSubmit.
      void (async () => {
        try {
          setSubmitting(true)
          await onSubmit(f)
        } finally {
          setSubmitting(false)
          onOpenChange(false)
        }
      })()
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
    }
    reader.readAsDataURL(f)
  }

  const handleSubmit = async () => {
    if (!pickedFile || !imageSrc || !croppedAreaPx) return
    setSubmitting(true)
    try {
      const blob = await cropToPngBlob(imageSrc, croppedAreaPx)
      const out = new File([blob], `icon-${Date.now()}.png`, { type: 'image/png' })
      await onSubmit(out)
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  const showCropUI = pickedFile && pickedFile.type !== 'image/svg+xml' && imageSrc

  return (
    <>
      { }
      <input
        ref={inputRef}
        type='file'
        accept={ALLOWED_ACCEPT}
        className='hidden'
        onChange={handleFile}
      />
      <Dialog open={open && !!showCropUI} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Wähle einen quadratischen Ausschnitt. Das Ergebnis wird als PNG gespeichert.
            </DialogDescription>
          </DialogHeader>
          {imageSrc && pickedFile && RASTER_MIME.has(pickedFile.type) && (
            <>
              <div className='relative h-72 w-full bg-surface-2 rounded-md overflow-hidden'>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  showGrid={false}
                />
              </div>
              <div className='space-y-2'>
                <label className='caption text-muted-foreground'>Zoom</label>
                <Slider
                  value={[zoom]}
                  onValueChange={([v]) => setZoom(v)}
                  min={1}
                  max={3}
                  step={0.01}
                />
              </div>
            </>
          )}
          <DialogFooter>
            <Button variant='outline' onClick={() => onOpenChange(false)} disabled={submitting}>
              Abbrechen
            </Button>
            <Button onClick={() => void handleSubmit()} disabled={submitting || !croppedAreaPx}>
              {submitting ? 'Lade hoch…' : 'Speichern'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

async function cropToPngBlob(src: string, area: Area): Promise<Blob> {
  const img = await loadImage(src)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(area.width)
  canvas.height = Math.round(area.height)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')
  ctx.drawImage(
    img,
    area.x, area.y, area.width, area.height,
    0, 0, canvas.width, canvas.height,
  )
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))), 'image/png')
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
