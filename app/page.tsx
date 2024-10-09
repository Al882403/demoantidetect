'use client'

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, XCircle, Square, Clock, ChevronDown, FileText, Trash, Shield, Lock, ChevronLeft, ChevronRight, X, Settings, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import confetti from 'canvas-confetti'
import { Skeleton } from "@/components/ui/skeleton"

const timezones = [
  { name: "Local", value: Intl.DateTimeFormat().resolvedOptions().timeZone },
  { name: "New York", value: "America/New_York" },
  { name: "London", value: "Europe/London" },
  { name: "Tokyo", value: "Asia/Tokyo" },
  { name: "Sydney", value: "Australia/Sydney" },
]

const instructionSlides = [
  { 
    title: "Welcome to Quick Hide", 
    content: "This feature allows you to lock your Dynamic Island for privacy.",
    image: "/placeholder.svg?height=150&width=280"
  },
  { 
    title: "Set Up Your Passcode", 
    content: "Choose a 4-digit passcode to secure your Dynamic Island.",
    image: "/placeholder.svg?height=150&width=280"
  },
  { 
    title: "How to Use", 
    content: "Click the lock icon to hide. Type your passcode to unlock.",
    image: "/placeholder.svg?height=150&width=280"
  },
]

const pricingPlans = [
  {
    name: "Free Trial",
    price: "$0",
    duration: "14 days",
    features: ["Basic protection", "Limited scans", "Email support"],
  },
  {
    name: "Pro",
    price: "$9.99",
    duration: "per month",
    features: ["Advanced protection", "Unlimited scans", "24/7 support", "Custom rules"],
  },
  {
    name: "Enterprise",
    price: "$29.99",
    duration: "per month",
    features: ["Ultimate protection", "Unlimited scans", "Dedicated support", "Custom integration", "Team management"],
  },
]

export default function Component() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isScanning, setIsScanning] = useState(true)
  const [selectedTimezone, setSelectedTimezone] = useState(timezones[0])
  const [isTimezonePanelOpen, setIsTimezonePanelOpen] = useState(false)
  const [isScanningPanelOpen, setIsScanningPanelOpen] = useState(false)
  const [isSelectingText, setIsSelectingText] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [animatedText, setAnimatedText] = useState("")
  const [isLocked, setIsLocked] = useState(false)
  const [passcode, setPasscode] = useState("")
  const [enteredPasscode, setEnteredPasscode] = useState("")
  const [isSetupMode, setIsSetupMode] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false)
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    autoLock: false,
  })
  const [showAppleWatchClock, setShowAppleWatchClock] = useState(false)
  const [showDynamicWindow, setShowDynamicWindow] = useState(false)
  const islandRef = useRef<HTMLDivElement>(null)
  const passcodeInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    const savedPasscode = localStorage.getItem("dynamicIslandPasscode")
    const savedSettings = localStorage.getItem("dynamicIslandSettings")
    if (savedPasscode) {
      setPasscode(savedPasscode)
    } else {
      setIsSetupMode(true)
      setIsExpanded(true)
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem("dynamicIslandSettings", JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (selectedText && showDynamicWindow) {
      let index = 0
      const intervalId = setInterval(() => {
        setAnimatedText((prev) => prev + selectedText[index])
        index++
        if (index === selectedText.length) {
          clearInterval(intervalId)
        }
      }, 50)
      return () => clearInterval(intervalId)
    }
  }, [selectedText, showDynamicWindow])

  useEffect(() => {
    if (isSelectingText) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('click', handleTextClick)
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('click', handleTextClick)
      removeAllOverlays()
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('click', handleTextClick)
      removeAllOverlays()
    }
  }, [isSelectingText])

  useEffect(() => {
    if (isLocked || isSetupMode) {
      passcodeInputRef.current?.focus()
    }
  }, [isLocked, isSetupMode])

  useEffect(() => {
    if (showAppleWatchClock) {
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const drawClock = () => {
            const now = new Date()
            const radius = canvas.height / 2
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw clock face
            ctx.beginPath()
            ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI)
            ctx.fillStyle = '#000'
            ctx.fill()

            // Draw hour marks
            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.strokeStyle = '#fff'
            for (let i = 0; i < 12; i++) {
              const angle = (i - 3) * (Math.PI * 2) / 12
              ctx.moveTo(radius + Math.cos(angle) * (radius - 20), radius + Math.sin(angle) * (radius - 20))
              ctx.lineTo(radius + Math.cos(angle) * (radius - 30), radius + Math.sin(angle) * (radius - 30))
            }
            ctx.stroke()

            // Draw hands
            const hour = now.getHours() % 12
            const minute = now.getMinutes()
            const second = now.getSeconds()

            // Hour hand
            ctx.beginPath()
            ctx.lineWidth = 6
            ctx.moveTo(radius, radius)
            ctx.lineTo(radius + Math.cos(((hour + minute / 60) * 30 - 90) * Math.PI / 180) * (radius * 0.5),
                       radius + Math.sin(((hour + minute / 60) * 30 - 90) * Math.PI / 180) * (radius * 0.5))
            ctx.stroke()

            // Minute hand
            ctx.beginPath()
            ctx.lineWidth = 4
            ctx.moveTo(radius, radius)
            ctx.lineTo(radius + Math.cos((minute * 6 - 90) * Math.PI / 180) * (radius * 0.8),
                       radius + Math.sin((minute * 6 - 90) * Math.PI / 180) * (radius * 0.8))
            ctx.stroke()

            // Second hand
            ctx.beginPath()
            ctx.lineWidth = 2
            ctx.strokeStyle = '#f00'
            ctx.moveTo(radius, radius)
            ctx.lineTo(radius + Math.cos((second * 6 - 90) * Math.PI / 180) * (radius * 0.9),
                       radius + Math.sin((second * 6 - 90) * Math.PI / 180) * (radius * 0.9))
            ctx.stroke()

            // Center dot
            ctx.beginPath()
            ctx.arc(radius, radius, 3, 0, 2 * Math.PI)
            ctx.fillStyle = '#fff'
            ctx.fill()

            // Draw date
            ctx.font = 'bold 16px Arial'
            ctx.fillStyle = '#fff'
            ctx.textAlign = 'center'
            ctx.fillText(formatDate(now), radius, radius + 50)

            requestAnimationFrame(drawClock)
          }

          drawClock()
        }
      }
    }
  }, [showAppleWatchClock])

  const removeAllOverlays = () => {
    const overlays = document.querySelectorAll('.text-select-overlay')
    overlays.forEach(overlay => overlay.remove())
  }

  const handleMouseMove = (e: MouseEvent) => {
    removeAllOverlays()
    const element = document.elementFromPoint(e.clientX, e.clientY)
    if (element && element.textContent && element.textContent.trim()) {
      const range = document.createRange()
      range.selectNodeContents(element)
      const rect = range.getBoundingClientRect()
      const overlay = document.createElement('div')
      overlay.className = 'text-select-overlay'
      overlay.style.position = 'fixed'
      overlay.style.top = `${rect.top}px`
      overlay.style.left = `${rect.left}px`
      overlay.style.width = `${rect.width}px`
      overlay.style.height = `${rect.height}px`
      overlay.style.border = '2px solid #3b82f6'
      overlay.style.pointerEvents = 'none'
      overlay.style.animation = 'pulse 2s infinite'
      overlay.style.zIndex = '9999'
      document.body.appendChild(overlay)
    }
  }

  const handleTextClick = (e: MouseEvent) => {
    e.preventDefault()
    const element = document.elementFromPoint(e.clientX, e.clientY)
    if (element && element.textContent && element.textContent.trim()) {
      setSelectedText(element.textContent.trim())
      setIsSelectingText(false)
      setAnimatedText("")
      setShowDynamicWindow(true)
      setIsExpanded(false)
    }
  }

  const handleStopScan = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsScanning(!isScanning)
  }

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: selectedTimezone.value
    }
    return new Intl.DateTimeFormat('en-US', options).format(date)
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: selectedTimezone.value
    }
    return new Intl.DateTimeFormat('en-US', options).format(date)
  }

  const handleTimezoneClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsTimezonePanelOpen(!isTimezonePanelOpen)
    setIsScanningPanelOpen(false)
    setIsSettingsPanelOpen(false)
    setShowAppleWatchClock(false)
    setIsExpanded(true)
  }

  const handleScanningClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsScanningPanelOpen(!isScanningPanelOpen)
    setIsTimezonePanelOpen(false)
    setIsSettingsPanelOpen(false)
    setShowAppleWatchClock(false)
    setIsExpanded(true)
  }

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSettingsPanelOpen(!isSettingsPanelOpen)
    setIsTimezonePanelOpen(false)
    setIsScanningPanelOpen(false)
    setShowAppleWatchClock(false)
    setIsExpanded(true)
  }

  const handleLock = () => {
    setIsLocked(true)
    setIsExpanded(true)
    setEnteredPasscode("")
  }

  const handlePasscodeEntry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPasscode = e.target.value.replace(/\D/g, '').slice(0, 4)
    setEnteredPasscode(newPasscode)
    if (newPasscode.length === 4) {
      if (isLocked) {
        if (newPasscode === passcode) {
          setIsLocked(false)
          setEnteredPasscode("")
        } else {
          setTimeout(() => setEnteredPasscode(""), 1000)
        }
      }
    }
  }

  const handleSetPasscode = () => {
    if (enteredPasscode.length === 4) {
      setPasscode(enteredPasscode)
      localStorage.setItem("dynamicIslandPasscode", enteredPasscode)
      setIsSetupMode(false)
      setShowWelcomeScreen(true)
      launchConfetti()
    }
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % instructionSlides.length)
  }

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + instructionSlides.length) % instructionSlides.length)
  }

  const launchConfetti = () => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }))
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }))
    }, 250)
  }

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }))
  }

  const handleClockClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowAppleWatchClock(!showAppleWatchClock)
    setIsTimezonePanelOpen(false)
    setIsScanningPanelOpen(false)
    setIsSettingsPanelOpen(false)
    setIsExpanded(true)
  }

  return (
    <div className={`min-h-screen pt-4 px-4 ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <style jsx global>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
      <div className="max-w-md mx-auto relative">
        <motion.div
          ref={islandRef}
          className="bg-black text-white rounded-[32px] overflow-hidden shadow-lg absolute left-1/2 transform -translate-x-1/2"
          initial={{ width: 120, height: 32 }}
          animate={{
            width: isExpanded || showWelcomeScreen || showPricing ? 320 : 120,
            height: showWelcomeScreen || showPricing ? 400 : (isExpanded ? (isSetupMode ? 400 : (isLocked ? 180 : (isTimezonePanelOpen || isScanningPanelOpen || isSettingsPanelOpen || showAppleWatchClock ? 280 : 140))) : 32),
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onHoverStart={() => !isSelectingText && !isLocked && !isSetupMode && !showWelcomeScreen && !showPricing && setIsExpanded(true)}
          onHoverEnd={() => !isTimezonePanelOpen && !isScanningPanelOpen && !isSettingsPanelOpen && !isLocked && !isSetupMode && !showWelcomeScreen && !showPricing && !showAppleWatchClock && setIsExpanded(false)}
        >
          <AnimatePresence>
            {!isExpanded && !showWelcomeScreen && !showPricing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-end pr-2 relative"
              >
                <span className="sr-only">AI Assistant</span>
                <motion.div
                  animate={{ 
                    backgroundColor: isScanning 
                      ? ['rgba(74, 222, 128, 0.2)', 'rgba(74, 222, 128, 0.5)',  'rgba(74, 222, 128, 0.2)']
                      : 'rgba(239, 68, 68, 0.5)'
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-2 h-2 rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isExpanded && !isLocked && !isSetupMode && !showWelcomeScreen && !showPricing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-start p-4"
              >
                <div className="w-full flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClockClick}
                      className="h-8 bg-gray-800 text-white hover:bg-gray-700 hover:text-white rounded-full px-3"
                    >
                      <Clock className="h-3 w-3 text-gray-400 mr-2" />
                      <span className="text-sm font-bold mr-1">{formatTime(currentTime)}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleTimezoneClick}
                      className="h-8 w-8 bg-gray-800 text-white hover:bg-gray-700 hover:text-white rounded-full"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSettingsClick}
                      className="h-8 w-8 bg-gray-800 text-white hover:bg-gray-700 hover:text-white rounded-full"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLock}
                      className="h-8 w-8 bg-gray-800 text-white hover:bg-gray-700 hover:text-white rounded-full"
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="w-full h-[220px] pr-4">
                  {!showAppleWatchClock && (
                    <div className="w-full bg-gray-800 rounded-xl p-3 mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleScanningClick}
                        className="w-full h-12 text-white hover:bg-gray-700 hover:text-white rounded-xl px-3 flex items-center justify-between"
                      >
                        <motion.div
                          className="flex items-center space-x-3"
                          animate={{ color: isScanning ? ['#4ade80', '#166534', '#4ade80'] : '#ef4444' }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {isScanning ? (
                            <>
                              <motion.div
                                animate={{ 
                                  rotate: 360,
                                }}
                                transition={{ 
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear"
                                }}
                              >
                                <Loader2 className="h-5 w-5" />
                              </motion.div>
                              <span className="font-medium text-sm">Scanning page text...</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5" />
                              <span className="font-medium text-sm">Scanning stopped</span>
                            </>
                          )}
                        </motion.div>
                        <motion.div
                          animate={{ rotate: isScanningPanelOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="h-3 w-3 text-gray-400" />
                        </motion.div>
                      </Button>
                    </div>
                  )}
                  <AnimatePresence>
                    {showAppleWatchClock && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full relative"
                      >
                        <canvas ref={canvasRef} width={200} height={200} className="mx-auto" />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowAppleWatchClock(false)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {isTimezonePanelOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                      >
                        <h3 className="text-sm font-semibold mb-2">Select Timezone</h3>
                        <div className="space-y-2">
                          {timezones.map((tz) => (
                            <Button
                              key={tz.value}
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedTimezone(tz)
                                setIsTimezonePanelOpen(false)
                              }}
                              className={`w-full justify-start ${
                                selectedTimezone.value === tz.value
                                  ? 'bg-gray-700 text-white'
                                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                              }`}
                            >
                              {tz.name}
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {isScanningPanelOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                      >
                        <h3 className="text-sm font-semibold mb-2">Scanning Options</h3>
                        <div className="space-y-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setIsSelectingText(true)
                              setIsScanningPanelOpen(false)
                              setIsExpanded(false)
                            }}
                            className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Select Text to Scan
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedText("")
                              setAnimatedText("")
                              setIsScanningPanelOpen(false)
                            }}
                            className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Clear History
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Handle Add AntiDetect
                              setIsScanningPanelOpen(false)
                            }}
                            className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Add AntiDetect
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {isSettingsPanelOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                      >
                        <h3 className="text-sm font-semibold mb-2">Settings</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Dark Mode</span>
                            <Switch
                              checked={settings.darkMode}
                              onCheckedChange={() => toggleSetting('darkMode')}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Notifications</span>
                            <Switch
                              checked={settings.notifications}
                              onCheckedChange={() => toggleSetting('notifications')}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Auto-Lock</span>
                            <Switch
                              checked={settings.autoLock}
                              onCheckedChange={() => toggleSetting('autoLock')}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black bg-opacity-90"
              >
                <div className="text-lg font-bold mb-4">Enter Passcode</div>
                <div className="flex space-x-4 mb-4">
                  {[0, 1, 2, 3].map((index) => (
                    <motion.div
                      key={index}
                      className={`w-4 h-4 rounded-full ${
                        enteredPasscode.length > index
                          ? enteredPasscode === passcode
                            ? "bg-green-500"
                            : "bg-red-500"
                          : "bg-gray-500"
                      }`}
                      animate={{
                        scale: enteredPasscode.length === 4 ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
                <Input
                  ref={passcodeInputRef}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={enteredPasscode}
                  onChange={handlePasscodeEntry}
                  className="w-24 text-center bg-gray-800 border-gray-700 text-white"
                  aria-label="Enter 4-digit passcode"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isSetupMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-start p-4 bg-black bg-opacity-90"
              >
                <h2 className="text-xl font-bold mb-2">{instructionSlides[currentSlide].title}</h2>
                <img
                  src={instructionSlides[currentSlide].image}
                  alt={instructionSlides[currentSlide].title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <p className="text-sm mb-4 text-center">{instructionSlides[currentSlide].content}</p>
                {currentSlide === instructionSlides.length - 1 && (
                  <div className="mb-4 w-full">
                    <div className="flex justify-center space-x-4 mb-2">
                      {[0, 1, 2, 3].map((index) => (
                        <motion.div
                          key={index}
                          className={`w-4 h-4 rounded-full ${
                            enteredPasscode.length > index ? "bg-blue-500" : "bg-gray-500"
                          }`}
                          animate={{
                            scale: enteredPasscode.length === index + 1 ? [1, 1.2, 1] : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      ))}
                    </div>
                    <Input
                      ref={passcodeInputRef}
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={enteredPasscode}
                      onChange={handlePasscodeEntry}
                      className="w-24 mx-auto text-center bg-gray-800 border-gray-700 text-white"
                      aria-label="Enter 4-digit passcode"
                    />
                  </div>
                )}
                <div className="flex justify-between items-center w-full">
                  <Button onClick={handlePrevSlide} disabled={currentSlide === 0} variant="ghost">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  {currentSlide === instructionSlides.length - 1 ? (
                    <Button onClick={handleSetPasscode} disabled={enteredPasscode.length !== 4}>
                      Set Passcode
                    </Button>
                  ) : (
                    <Button onClick={handleNextSlide}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
                <div className="flex justify-center mt-4">
                  {instructionSlides.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full mx-1 ${
                        currentSlide === index ? 'bg-blue-500' : 'bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showWelcomeScreen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black overflow-hidden"
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 rounded-full"
                    initial={{
                      x: Math.random() * 320,
                      y: Math.random() * 400,
                      scale: 0,
                      backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                    }}
                    animate={{
                      y: [null, -400],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                  className="mb-6 z-10"
                >
                  <Shield className="h-16 w-16 text-blue-500" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-4 text-white z-10">Welcome to AntiDetect</h2>
                <p className="text-lg text-gray-300 text-center mb-6 z-10">
                  Your privacy is now protected. Enjoy enhanced security and anonymity.
                </p>
                <Button
                  onClick={() => {
                    setShowWelcomeScreen(false)
                    setShowPricing(true)
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white z-10"
                >
                  Get Started
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showPricing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 flex flex-col items-center justify-start p-4 bg-black overflow-hidden"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPricing(false)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-bold mb-4 text-white">Choose Your Plan</h2>
                <ScrollArea className="h-[320px] w-full">
                  <div className="space-y-4">
                    {pricingPlans.map((plan, index) => (
                      <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800 p-4 rounded-lg"
                      >
                        <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                        <p className="text-2xl font-bold mb-1">{plan.price}</p>
                        <p className="text-sm text-gray-400 mb-3">{plan.duration}</p>
                        <ul className="text-sm space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center">
                              <Shield className="h-4 w-4 mr-2 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600">
                          {plan.name === "Free Trial" ? "Start Trial" : "Choose Plan"}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {showDynamicWindow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-black text-white rounded-[32px] overflow-hidden shadow-lg absolute left-1/2 transform -translate-x-1/2 mt-4 p-4 w-80"
            style={{ top: "calc(100% + 20px)" }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDynamicWindow(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold mb-2">Scanned Text</h3>
            <ScrollArea className="h-40 w-full">
              <p className="text-sm">{animatedText}</p>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

     
    </div>
  )
}