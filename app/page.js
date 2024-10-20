'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Upload, Download, Info } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import html2canvas from 'html2canvas'

const fontStyles = [
  'font-sans', 'font-serif', 'font-mono',
  'font-bold', 'font-extrabold', 'font-black',
  'italic', 'uppercase', 'lowercase', 'capitalize'
]

export default function YouTubeThumbnailCreator() {
  const [title, setTitle] = useState('POV')
  const [titleColor, setTitleColor] = useState('#FFFFFF')
  const [titleFontSize, setTitleFontSize] = useState(4)
  const [titleFontStyle, setTitleFontStyle] = useState('font-sans font-bold uppercase')
  const [titleSpacing, setTitleSpacing] = useState(0)
  const [bgImage, setBgImage] = useState('/placeholder.svg?height=720&width=1280')
  const [fgImage, setFgImage] = useState('/placeholder.svg?height=720&width=1280')
  const [fgPosition, setFgPosition] = useState({ x: 50, y: 50 })
  const [fgScale, setFgScale] = useState(100)
  const bgFileInputRef = useRef(null)
  const fgFileInputRef = useRef(null)
  const thumbnailRef = useRef(null)

  const handleImageUpload = useCallback((event, setImage) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleFontStyleChange = (style) => {
    setTitleFontStyle(prev => {
      const styles = prev.split(' ')
      if (styles.includes(style)) {
        return styles.filter(s => s !== style).join(' ')
      } else {
        return [...styles, style].join(' ')
      }
    })
  }

  const generateThumbnail = async () => {
    if (thumbnailRef.current) {
      const canvas = await html2canvas(thumbnailRef.current, {
        inlineSize: 1280,
        blockSize: 720,
        scale: 1,
        backgroundColor: null,
      })
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'youtube-thumbnail.png'
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-8 drop-shadow-lg">
          YouTube Thumbnail Creator
        </h1>
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Thumbnail Preview */}
            <div className="bg-black bg-opacity-50 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white">Preview</h2>
              <div className="relative w-full pt-[56.25%]">
                <div ref={thumbnailRef} className="absolute inset-0">
                  {/* Background Image */}
                  <Image
                    src={bgImage}
                    alt="Thumbnail background"
                    layout="fill"
                    objectFit="cover"
                  />
                  {/* Text Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 text-center">
                    <h3 className={`text-[${titleFontSize}rem] ${titleFontStyle} leading-none tracking-tighter text-center px-4`}
                        style={{
                          color: titleColor,
                          WebkitTextStroke: '1px black',
                          textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                          letterSpacing: `${titleSpacing}px`,
                        }}>
                      {title}
                    </h3>
                  </div>
                  {/* Foreground Image */}
                  <div 
                    className="absolute z-20"
                    style={{
                      insetInlineStart: `${fgPosition.x}%`,
                      insetBlockStart: `${fgPosition.y}%`,
                      transform: `translate(-50%, -50%) scale(${fgScale / 100})`,
                      inlineSize: '100%',
                      blockSize: '100%',
                    }}
                  >
                    <Image
                      src={fgImage}
                      alt="Thumbnail foreground"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Customization Controls */}
            <div className="bg-white bg-opacity-25 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white">Customize Your Thumbnail</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">Title</Label>
                  <Input
                    id="title"
                    value={title}

                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter main title"
                    className="bg-white bg-opacity-50"
                  />
                </div>
                <div>
                  <Label htmlFor="titleColor" className="text-white">Title Color</Label>
                  <Input
                    id="titleColor"
                    type="color"
                    value={titleColor}
                    onChange={(e) => setTitleColor(e.target.value)}
                    className="h-10 p-1 bg-white bg-opacity-50"
                  />
                </div>
                <div>
                  <Label htmlFor="titleFontSize" className="text-white">Title Font Size</Label>
                  <Slider
                    id="titleFontSize"
                    min={-5}
                    max={20}
                    step={2}
                    value={[titleFontSize]}
                    onValueChange={(value) => setTitleFontSize(value[0])}
                    className="bg-white bg-opacity-50 rounded-md"
                  />
                </div>
                <div>
                  <Label htmlFor="titleSpacing" className="text-white">Title Letter Spacing</Label>
                  <Slider
                    id="titleSpacing"
                    min={-5}
                    max={20}
                    step={1}
                    value={[titleSpacing]}
                    onValueChange={(value) => setTitleSpacing(value[0])}
                    className="bg-white bg-opacity-50 rounded-md"
                  />
                </div>
                <div>
                  <Label className="text-white">Title Font Style</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {fontStyles.map((style) => (
                      <Button
                        key={style}
                        variant={titleFontStyle.includes(style) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFontStyleChange(style)}
                        className="bg-white bg-opacity-50 text-black hover:bg-white hover:bg-opacity-75"
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="bgImage" className="text-white">Upload Background Image</Label>
                  <Input
                    id="bgImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setBgImage)}
                    className="hidden"
                    
                    ref={bgFileInputRef}
                  />
                  <Button 
                    onClick={() => bgFileInputRef.current?.click()} 
                    className="w-full bg-white bg-opacity-50 text-black hover:bg-white hover:bg-opacity-75"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload Background Image
                  </Button>
                </div>
                <div>
                  <Label htmlFor="fgImage" className="text-white">Upload Foreground Image (No Background)</Label>
                  <Input
                    id="fgImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setFgImage)}
                    className="hidden"
                    ref={fgFileInputRef}
                  />
                  <Button 
                    onClick={() => fgFileInputRef.current?.click()} 
                    className="w-full bg-white bg-opacity-50 text-black hover:bg-white hover:bg-opacity-75"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload Foreground Image
                  </Button>
                </div>
                <div>
                  <Label className="text-white">Foreground Image Position</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fgPositionX" className="text-white">X Position</Label>
                      <Slider
                        id="fgPositionX"
                        min={0}
                        max={100}
                        step={1}
                        value={[fgPosition.x]}
                        onValueChange={(value) => setFgPosition(prev => ({ ...prev, x: value[0] }))}
                        className="bg-white bg-opacity-50 rounded-md"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fgPositionY" className="text-white">Y Position</Label>
                      <Slider
                        id="fgPositionY"
                        min={0}
                        max={100}
                        step={1}
                        value={[fgPosition.y]}
                        onValueChange={(value) => setFgPosition(prev => ({ ...prev, y: value[0] }))}
                        className="bg-white bg-opacity-50 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="fgScale" className="text-white">Foreground Image Scale</Label>
                  <Slider
                    id="fgScale"
                    min={10}
                    max={200}
                    step={1}
                    value={[fgScale]}
                    onValueChange={(value) => setFgScale(value[0])}
                    className="bg-white bg-opacity-50 rounded-md"
                  />
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={generateThumbnail}>
                  <Download className="mr-2 h-4 w-4" /> Generate and Save Thumbnail
                </Button>
              </div>
            </div>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="fixed bottom-4 right-4 bg-white bg-opacity-50 hover:bg-opacity-75">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Create your YouTube thumbnail by customizing the title, uploading images, and adjusting positions. Click 'Generate and Save' when you're done!
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}