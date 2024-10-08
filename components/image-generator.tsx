"use client"

import { useState, useRef, useEffect, KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Loader2, Image as ImageIcon, X, Palette, Sun, Moon, Zap, User, Sparkles } from "lucide-react"
import Image from 'next/image'

const themes = {
  purple: {
    gradient: "from-purple-500 to-pink-500",
    icon: Moon,
    color: "#9333ea",
    background: "bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900",
  },
  blue: {
    gradient: "from-blue-500 to-teal-500",
    icon: Zap,
    color: "#3b82f6",
    background: "bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900",
  },
  green: {
    gradient: "from-green-500 to-yellow-500",
    icon: Sun,
    color: "#22c55e",
    background: "bg-gradient-to-br from-gray-900 via-green-950 to-gray-900",
  },
  random: {
    gradient: "from-gray-500 to-gray-700",
    icon: Sparkles,
    color: "#6b7280",
    background: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
  },
}

const generateRandomColor = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16)
}

const generateRandomTheme = () => {
  const color1 = generateRandomColor()
  const color2 = generateRandomColor()
  return {
    gradient: `from-[${color1}] to-[${color2}]`,
    icon: Sparkles,
    color: color1,
    background: `bg-gradient-to-br from-gray-900 via-[${color1}] to-gray-900`,
  }
}

export function ImageGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<Array<{ src: string; prompt: string; width: number; height: number }>>([])
  const [selectedImage, setSelectedImage] = useState<typeof generatedImages[0] | null>(null)
  const [theme, setTheme] = useState<keyof typeof themes>("green")
  const [randomTheme, setRandomTheme] = useState(generateRandomTheme())
  const [prompt, setPrompt] = useState("")
  const [width, setWidth] = useState("960")
  const [height, setHeight] = useState("720")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [prompt])

  const handleGenerate = () => {
    if (isGenerating) return
    setIsGenerating(true)
    setTimeout(() => {
      const newImage = {
        src: `/placeholder.svg?height=${height}&width=${width}&text=${Math.random().toString(36).substring(7)}`,
        prompt,
        width: parseInt(width),
        height: parseInt(height),
      }
      setGeneratedImages(prev => [newImage, ...prev])
      setIsGenerating(false)
    }, 2000)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  const handleThemeChange = (newTheme: keyof typeof themes) => {
    if (newTheme === "random") {
      setRandomTheme(generateRandomTheme())
    }
    setTheme(newTheme)
  }

  const currentTheme = theme === "random" ? randomTheme : themes[theme]

  return (
    <div className={`min-h-screen text-white p-4 md:p-8 relative overflow-hidden ${currentTheme.background}`}>
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          backgroundImage: [
            `radial-gradient(circle, ${currentTheme.color}11 0%, transparent 70%)`,
            `radial-gradient(circle, ${currentTheme.color}22 0%, transparent 70%)`,
            `radial-gradient(circle, ${currentTheme.color}11 0%, transparent 70%)`,
          ],
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      />

      <div className="relative z-10">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.span
            className={`bg-clip-text text-transparent bg-gradient-to-r ${currentTheme.gradient}`}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            altyshkaCreator
          </motion.span>
        </motion.h1>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 mb-12"
          >
            <Textarea
              ref={textareaRef}
              placeholder="Enter image description"
              className="bg-gray-800 bg-opacity-50 border-gray-700 text-white text-center resize-none overflow-hidden"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <div className="flex justify-center gap-4">
              <Input
                placeholder="Width (px)"
                className="bg-gray-800 bg-opacity-50 border-gray-700 text-white w-24 text-center"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
              <Input
                placeholder="Height (px)"
                className="bg-gray-800 bg-opacity-50 border-gray-700 text-white w-24 text-center"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full max-w-xs bg-gradient-to-r ${currentTheme.gradient} hover:opacity-90 text-white`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">Generation History</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {generatedImages.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="cursor-pointer relative group"
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img.src}
                    alt={`Generated image ${index + 1}`}
                    width={img.width}
                    height={img.height}
                    className="w-full h-auto rounded-lg shadow-lg group-hover:shadow-xl transition-shadow"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="text-white text-center p-2">
                      <p className="font-bold">Click to view details</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-10 h-10 rounded-full fixed bottom-4 right-4 p-0 bg-gray-800 bg-opacity-50 border-gray-700"
            >
              <Palette className="h-6 w-6" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className={`w-52 bg-gradient-to-r ${currentTheme.gradient}`}>
            <div className="grid gap-4">
              <h4 className="font-semibold text-white">Choose theme</h4>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(themes) as Array<keyof typeof themes>).map((t) => {
                  const ThemeIcon = themes[t].icon
                  return (
                    <Button
                      key={t}
                      variant="ghost"
                      className={`w-full p-2 ${theme === t ? 'ring-2 ring-white' : ''}`}
                      onClick={() => handleThemeChange(t)}
                    >
                      <ThemeIcon className="h-6 w-6 mr-2" style={{ color: themes[t].color }} />
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Button>
                  )
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="w-10 h-10 rounded-full fixed bottom-4 left-4 p-0 bg-gray-800 bg-opacity-50 border-gray-700"
              >
                <User className="h-6 w-6" />
                <span className="sr-only">User profile</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              <p>Coming soon...</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-gray-800 bg-opacity-90 p-4 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Image Details</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <Image
                  src={selectedImage.src}
                  alt="Selected generated image"
                  width={selectedImage.width}
                  height={selectedImage.height}
                  className="w-full h-auto rounded-lg mb-4"
                />
                <ScrollArea className="flex-grow">
                  <div className="space-y-2">
                    <p><strong>Prompt:</strong> {selectedImage.prompt}</p>
                    <p><strong>Dimensions:</strong> {selectedImage.width}x{selectedImage.height}px</p>
                  </div>
                </ScrollArea>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
