'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from '../ui/dialog'
import { Button } from '../atoms/Button'
import { Slider } from '../ui/slider'
import { useLabels } from '../i18n/context'

const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
const ALLOWED_ACCEPT = ALLOWED_MIME.join(',')
const RASTER_MIME = new Set(['image/png', 'image/jpeg', 'image/webp'])

export interface IconUploadCropDialogLabels {
  title: string
  description: string
  zoom: string
  cancel: string
  save: string
  uploading: string
}

const defaultLabels: IconUploadCropDialogLabels = {
  title: 'Upload icon',
  description: 'Choose a square crop. The result is saved as PNG.',
  zoom: 'Zoom',
  cancel: 'Cancel',
  save: 'Save',
  uploading: 'Uploading…',
}

interface Props {
  open: boolean
  onOpenChange: (next: boolean) => void
  /** Called with the final square file (PNG for raster, original for SVG). */
  onSubmit: (file: File) => Promise<void> | void
  /** Dialog title. Takes precedence over `labels.title`. */
  title?: string
  labels?: Partial<IconUploadCropDialogLabels>
}

/**
 * File picker → crop dialog → square PNG blob.
 *
 * - PNG/JPEG/WebP: client-side crop in <canvas>, output as PNG.
 * - SVG: no crop (vector), passed through unchanged.
 * - No size/resolution limit.
 *
 * The dialog drives the file picker itself — callers only toggle `open`
 * and implement `onSubmit`.
 */
export function IconUploadCropDialog({ open, onOpenChange, onSubmit, title, labels }: Props) {
  const l = useLabels('iconUploadCropDialog', defaultLabels, labels)
  const inputRef = useRef<HTMLInputElement>(null)
  const [pickedFile, setPickedFile] = useState<File | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPx, setCroppedAreaPx] = useState<Area | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Reset state synchronously when `open` toggles ("adjusting state when a
  // prop changes", https://react.dev/learn/you-might-not-need-an-effect) —
  // not in an effect, which would trip react-hooks/set-state-in-effect.
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

  // Open the file picker when the dialog opens (a real DOM side effect).
  // Deferred via timeout, otherwise the browser's click heuristic blocks it.
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
    e.target.value = '' // Reset so the same file can be picked again.
    if (!f) {
      onOpenChange(false)
      return
    }
    if (!ALLOWED_MIME.includes(f.type)) {
      // Soft fail: close the dialog; the caller may follow up with a toast.
      onOpenChange(false)
      return
    }
    setPickedFile(f)

    if (f.type === 'image/svg+xml') {
      // SVG needs no crop — hand it straight to onSubmit.
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
            <DialogTitle>{title ?? l.title}</DialogTitle>
            <DialogDescription>
              {l.description}
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
                <label className='caption text-muted-foreground'>{l.zoom}</label>
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
            <Button variant='outline' size='lg' onClick={() => onOpenChange(false)} disabled={submitting}>
              {l.cancel}
            </Button>
            <Button size='lg' onClick={() => void handleSubmit()} disabled={submitting || !croppedAreaPx}>
              {submitting ? l.uploading : l.save}
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
