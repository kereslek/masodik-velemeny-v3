'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, UploadCloud, X, FileText, ImageIcon,
  ChevronRight, Activity, User, MapPin, AlertCircle
} from 'lucide-react'
import { cn, formatFileSize } from '@/lib/utils'
import { useSpeech } from '@/hooks/useSpeech'

const GENDER_OPTIONS = ['Férfi', 'Nő', 'Egyéb / Nem kívánom megadni']

export function IntakeForm() {
  const router = useRouter()

  // Form state
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [city, setCity] = useState('')
  const [story, setStory] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Voice
  const { isListening, transcript, interimTranscript, isSupported, startListening, stopListening, clearTranscript } = useSpeech()

  // Dropzone
  const onDrop = useCallback((accepted: File[]) => {
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name + f.size))
      return [...prev, ...accepted.filter(f => !existing.has(f.name + f.size))]
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.heic', '.webp'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024,
    onDropRejected: () => setError('Túl nagy fájl (max 10MB) vagy nem támogatott formátum.'),
  })

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i))

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
      setStory(prev => {
        const sep = prev && !prev.endsWith(' ') ? ' ' : ''
        return prev + sep + transcript
      })
      clearTranscript()
    } else {
      startListening()
    }
  }

  const combinedStory = [story, isListening ? interimTranscript : transcript].filter(Boolean).join(' ')

  const handleSubmit = async () => {
    setError('')

    // Validation
    const ageNum = parseInt(age, 10)
    if (!age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setError('Kérlek add meg a korod érvényes formában (1–120 év).')
      return
    }
    if (!gender) {
      setError('Kérlek válaszd ki a nemet a pontosabb elemzéshez.')
      return
    }
    if (!combinedStory.trim() && files.length === 0) {
      setError('Kérlek írj le valamit, vagy tölts fel egy dokumentumot.')
      return
    }

    if (isListening) stopListening()

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('story', combinedStory)
      formData.append('age', age)
      formData.append('gender', gender)
      formData.append('city', city)
      files.forEach(f => formData.append('files', f))

      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Hiba történt. Kérlek próbáld újra.')
        setLoading(false)
        return
      }

      sessionStorage.setItem('analysisResult', JSON.stringify(data))
      router.push('/eredmeny')
    } catch {
      setError('Hálózati hiba. Kérlek ellenőrizd az internetkapcsolatod.')
      setLoading(false)
    }
  }

  // Loading screen
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-32 h-32 flex items-center justify-center mb-8"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: 'hsl(173,80%,40%,0.15)', animation: 'ping-slow 3s cubic-bezier(0,0,0.2,1) infinite' }}
          />
          <div
            className="absolute inset-4 rounded-full"
            style={{ background: 'hsl(173,80%,40%,0.3)', animation: 'pulse 2s ease-in-out infinite' }}
          />
          <div
            className="absolute inset-8 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: 'hsl(173,80%,40%)' }}
          >
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-4 text-center">
          AI orvosi modellek elemzik az adatokat...
        </h2>
        <p className="text-slate-500 text-center max-w-md leading-relaxed">
          Ez eltarthat néhány másodpercig. Ne zárd be ezt az oldalt.
          A rendszer értékeli a tüneteket és a csatolt leleteket.
        </p>
        <div className="flex gap-1.5 mt-8">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: 'hsl(173,80%,40%)',
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* ── Step 1: Demographics ── */}
      <section className="health-card p-6 md:p-8">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-5 h-5" style={{ color: 'hsl(173,80%,40%)' }} />
          <h3 className="text-lg font-bold text-slate-900">Alapadatok</h3>
          <span className="ml-auto text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
            Anonim · Nem tároljuk
          </span>
        </div>
        <p className="text-sm text-slate-500 mb-5">
          Ezek az adatok csak az elemzés pontosságát javítják. Személyazonosítás nélkül dolgozzuk fel.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Age */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Kor (évek) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="pl. 42"
              className="input-field"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Helyszín (opcionális)
              </span>
            </label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="pl. Budapest"
              className="input-field"
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Nem <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {GENDER_OPTIONS.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setGender(opt)}
                className={cn('pill-button', gender === opt && 'selected')}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Step 2: Describe Symptoms ── */}
      <section className="health-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-slate-900">Tünetek leírása</h3>
          {isSupported && (
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300',
                isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {isListening ? (
                <><MicOff className="w-4 h-4" /> Leállítás</>
              ) : (
                <><Mic className="w-4 h-4" /> Diktálás</>
              )}
            </button>
          )}
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Írd le saját szavaiddal: mi fáj, mióta, milyen körülmények között, stb.
          Használhatod a diktálást is magyarról.
        </p>

        <div className="relative">
          <textarea
            value={combinedStory}
            onChange={e => {
              setStory(e.target.value)
              if (isListening) clearTranscript()
            }}
            placeholder={'Pl. "Három napja éles fájdalmat érzek a jobb oldali hasamba, főleg evés után. Kissé hányingerem is van..."'}
            rows={6}
            className="input-field resize-none"
            style={{ borderRadius: '0.75rem' }}
          />
          {isListening && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-500 font-medium">Figyelek...</span>
            </div>
          )}
          <div className="absolute bottom-3 right-3 text-xs text-slate-400">
            {combinedStory.length} karakter
          </div>
        </div>

        {isListening && interimTranscript && (
          <p className="mt-2 text-sm text-slate-400 italic px-1">
            „{interimTranscript}"
          </p>
        )}
      </section>

      {/* ── Step 3: File Upload ── */}
      <section className="health-card p-6 md:p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Leletek, képek feltöltése
        </h3>
        <p className="text-sm text-slate-500 mb-5">
          PDF, JPG, PNG formátum. Maximum 10 MB/fájl. A feltöltött fájlok az elemzés után törlődnek.
        </p>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300',
            isDragActive
              ? 'border-[hsl(173,80%,40%)] bg-[hsl(173,80%,97%)]'
              : 'border-slate-200 hover:border-[hsl(173,80%,60%)] hover:bg-[hsl(173,80%,99%)]'
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud
            className="w-10 h-10 mx-auto mb-3 transition-colors"
            style={{ color: isDragActive ? 'hsl(173,80%,40%)' : '#94a3b8' }}
          />
          {isDragActive ? (
            <p className="font-semibold" style={{ color: 'hsl(173,80%,40%)' }}>Engedd el ide!</p>
          ) : (
            <>
              <p className="font-semibold text-slate-700">Húzd ide a fájlokat</p>
              <p className="text-sm text-slate-400 mt-1">vagy kattints a tallózáshoz</p>
              <p className="text-xs text-slate-400 mt-2">PDF · JPG · PNG · HEIC · max 10 MB</p>
            </>
          )}
        </div>

        {/* File list */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 space-y-2"
            >
              {files.map((file, i) => (
                <motion.li
                  key={file.name + file.size}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  {file.type === 'application/pdf'
                    ? <FileText className="w-5 h-5 text-red-400 flex-shrink-0" />
                    : <ImageIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  }
                  <span className="flex-1 text-sm text-slate-700 truncate font-medium">{file.name}</span>
                  <span className="text-xs text-slate-400 flex-shrink-0">{formatFileSize(file.size)}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="p-1 rounded-full hover:bg-slate-200 transition-colors flex-shrink-0"
                    aria-label="Eltávolítás"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </section>

      {/* ── Error ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Submit ── */}
      <motion.button
        type="button"
        onClick={handleSubmit}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 px-8 health-button btn-primary text-lg flex items-center justify-center gap-3"
      >
        Második vélemény kérése
        <ChevronRight className="w-5 h-5" />
      </motion.button>

      <p className="text-center text-xs text-slate-400 leading-relaxed">
        Az adataidat kizárólag az elemzéshez használjuk. Személyes adatok nem kerülnek tárolásra.
        Ez az elemzés nem helyettesíti az orvosi vizsgálatot.
      </p>
    </div>
  )
}
