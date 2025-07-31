"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  User,
  Briefcase,
  Edit3,
  Star,
  Figma,
  FileTextIcon,
  Globe,
  Camera,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

// Animated Text Component
const AnimatedText = ({ roles, className }) => {
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const typingSpeed = 150 // Speed for typing
  const deletingSpeed = 100 // Speed for deleting
  const pauseBeforeTyping = 1000 // Pause after deleting
  const pauseAfterTyping = 2000 // Pause after typing

  useEffect(() => {
    let ticker

    const tick = () => {
      const i = loopNum % roles.length
      const fullText = roles[i]

      if (isDeleting) {
        setCurrentText(fullText.substring(0, charIndex - 1))
        setCharIndex((prev) => prev - 1)
      } else {
        setCurrentText(fullText.substring(0, charIndex + 1))
        setCharIndex((prev) => prev + 1)
      }

      let delta = isDeleting ? deletingSpeed : typingSpeed

      if (!isDeleting && currentText === fullText) {
        delta = pauseAfterTyping
        setIsDeleting(true)
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false)
        setLoopNum((prev) => prev + 1)
        delta = pauseBeforeTyping
      }

      ticker = setTimeout(tick, delta)
    }

    ticker = setTimeout(tick, typingSpeed) // Initial start

    return () => {
      clearTimeout(ticker)
    }
  }, [currentText, isDeleting, charIndex, loopNum, roles])

  return (
    <motion.h2 className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {currentText}
      <span className="inline-block w-0.5 h-full bg-white animate-blink ml-1"></span> {/* Blinking cursor */}
    </motion.h2>
  )
}

// Photo Carousel Component
const PhotoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const containerRef = useRef(null)

  // Sample photography images - replace with actual image URLs
  const images = [
    "/images/1.jpg",
    "/images/2.JPG",
    "/images/3.jpg",
    "/images/4.png",
    "/images/5.jpg",
    "/images/6.JPG",
    "/images/7.jpg",
    "/images/8.jpg",
    "/images/9.jpg",
    "/images/10.jpg",
  ]

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return

    const currentX = e.clientX
    const diff = startX - currentX
    setTranslateX(diff)
  }

  const handleMouseUp = () => {
    if (!isDragging) return

    setIsDragging(false)

    // Determine if we should move to next/previous image
    if (Math.abs(translateX) > 100) {
      if (translateX > 0 && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else if (translateX < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      }
    }

    setTranslateX(0)
  }

  const handleTouchStart = (e) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return

    const currentX = e.touches[0].clientX
    const diff = startX - currentX
    setTranslateX(diff)
  }

  const handleTouchEnd = () => {
    handleMouseUp()
  }

  return (
    <div className="relative h-[550px] flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl h-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-center h-full relative">
          {images.map((image, index) => {
            const offset = index - currentIndex
            const isCenter = index === currentIndex

            return (
              <motion.div
                key={index}
                className="absolute"
                animate={{
                  x: offset * 200 + (isDragging ? -translateX : 0), // Increased offset for larger images
                  scale: isCenter ? 1 : 0.85,
                  zIndex: isCenter ? 10 : 5 - Math.abs(offset),
                  opacity: Math.abs(offset) > 2 ? 0 : 1,
                }}
                transition={{
                  duration: 0.4, // Speed up animation
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  filter: isCenter ? "none" : "grayscale(70%) brightness(0.6)",
                }}
              >
                <div className="w-[550px] h-[450px] rounded-2xl overflow-hidden shadow-2xl">
                  {" "}
                  {/* Increased image size */}
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Photography ${index + 1}`}
                    width={550} // Increased image width
                    height={450} // Increased image height
                    className="w-full h-full object-cover transition-all duration-800"
                    draggable={false}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Navigation dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${index === currentIndex ? "bg-white" : "bg-white/30"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Timer Component
const TimerComponent = ({ scrollToSection }) => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const startTime = Date.now()

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const hours = Math.floor(elapsed / (1000 * 60 * 60))
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000)

      setTime({ hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (value) => value.toString().padStart(2, "0")

  return (
    <div className="text-center">
      <h3 className="text-sm sm:text-xl font-bold text-white uppercase tracking-wide mb-3">You've spent</h3>
      <div className="mb-4">
        <div className="flex justify-center items-center gap-1 text-xl sm:text-4xl font-bold">
          <span className="text-[#FF6B6B]">{formatTime(time.hours)}</span>
          <span className="text-white">h</span>
          <span className="text-[#4ECDC4]">{formatTime(time.minutes)}</span>
          <span className="text-white">m</span>
          <span className="text-[#45B7D1]">{formatTime(time.seconds)}</span>
          <span className="text-white">s</span>
        </div>
        <div className="text-xs text-white/70 mt-1">on my portfolio</div>
      </div>
      <div className="text-xs text-[#AAAAAA] leading-relaxed">
        What are you waiting for, Let's{" "}
        <motion.span
          className="text-white font-semibold cursor-pointer relative inline-block"
          whileHover={{
            scale: 1.1,
            color: "#9D00FF",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scrollToSection("contact")}
          transition={{ duration: 0.2 }}
        >
          Collab
          <motion.div
            className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#9D00FF] to-[#FF006F]"
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </motion.span>
      </div>
    </div>
  )
}


const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const navigationVariants = {
  hidden: {
    x: -100,
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 1,
      duration: 0.8,
    },
  },
}

// Interactive Background Component
const InteractiveBackground = () => {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const dots = []
    const GRID_SIZE = 30
    const EFFECT_RADIUS = 150
    const MAX_SCALE = 2.5
    const ANIMATION_SPEED = 0.1

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Create dot grid
    const createDots = () => {
      dots.length = 0
      for (let x = 0; x < canvas.width; x += GRID_SIZE) {
        for (let y = 0; y < canvas.height; y += GRID_SIZE) {
          dots.push({
            x,
            y,
            originalX: x,
            originalY: y,
            scale: 1,
            targetScale: 1,
            opacity: 0.3,
            targetOpacity: 0.3,
          })
        }
      }
    }

    // Handle mouse movement
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mouseX = mouseRef.current.x
      const mouseY = mouseRef.current.y

      dots.forEach((dot) => {
        // Calculate distance from mouse
        const dx = mouseX - dot.x
        const dy = mouseY - dot.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Calculate effect based on distance
        if (distance < EFFECT_RADIUS) {
          const effect = 1 - distance / EFFECT_RADIUS
          dot.targetScale = 1 + effect * MAX_SCALE
          dot.targetOpacity = 0.3 + effect * 0.7

          // Add slight displacement towards mouse
          const displacement = effect * 15
          dot.x = dot.originalX + (dx / distance) * displacement
          dot.y = dot.originalY + (dy / distance) * displacement
        } else {
          dot.targetScale = 1
          dot.targetOpacity = 0.3
          dot.x = dot.originalX
          dot.y = dot.originalY
        }

        // Smooth animation
        dot.scale += (dot.targetScale - dot.scale) * ANIMATION_SPEED
        dot.opacity += (dot.targetOpacity - dot.opacity) * ANIMATION_SPEED

        // Draw dot
        ctx.save()
        ctx.globalAlpha = dot.opacity
        ctx.fillStyle = "#555"
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, 1.5 * dot.scale, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Initialize
    resizeCanvas()
    createDots()
    animate()

    // Event listeners
    window.addEventListener("resize", () => {
      resizeCanvas()
      createDots()
    })
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} />
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isTabletOrLarger, setIsTabletOrLarger] = useState(false)

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
      setActiveSection(sectionId)
    }
  }

  const navigationItems = [
    { id: "hero", icon: <User className="w-4 h-4" />, label: "About" },
    { id: "cards", icon: <Edit3 className="w-4 h-4" />, label: "Info" },
    { id: "projects", icon: <Briefcase className="w-4 h-4" />, label: "Projects" },
    { id: "photography", icon: <Camera className="w-4 h-4" />, label: "Photography" },
    { id: "contact", icon: <Mail className="w-4 h-4" />, label: "Contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "cards", "projects", "photography", "contact"]
      const scrollPosition = window.scrollY + 100 // Reduced offset for better detection

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    const handleResize = () => {
      setIsTabletOrLarger(window.innerWidth >= 768) // md breakpoint
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Initial check
    handleResize()

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white relative overflow-x-hidden">
      {/* Interactive Animated Background */}
      <InteractiveBackground />

      {/* Left Sidebar Navigation - Only shows on tablet and larger screens */}
      {isTabletOrLarger && (
        <motion.nav
          variants={navigationVariants}
          initial="hidden"
          animate="visible"
          className="fixed z-50"
          style={{
            position: "fixed",
            left: "24px",
            top: "calc(50vh - 120px)",
            transform: "none",
          }}
        >
          <motion.div
            className="bg-[#2A2A2A]/95 backdrop-blur-md rounded-full p-3 shadow-2xl border border-gray-600/30"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex flex-col gap-2">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-11 h-11 flex items-center justify-center transition-all duration-300 group relative ${activeSection === item.id
                    ? "bg-white rounded-full text-black shadow-lg scale-110"
                    : "text-gray-400 hover:text-white rounded-full hover:bg-gray-700/50 hover:scale-105"
                    }`}
                  whileHover={{ scale: activeSection === item.id ? 1.1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                >
                  {item.icon}
                  <motion.span
                    className="absolute left-16 bg-gray-800/95 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 whitespace-nowrap border border-gray-600/50 shadow-xl"
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45 border-l border-b border-gray-600/50"></div>
                  </motion.span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.nav>
      )}

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:pl-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="mb-6 sm:mb-8"
          >
            {/* Removed "Online" status */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 sm:mb-4 leading-tight">
              Hey, I'm <span className="text-white">Himanshu</span>
            </h1>
            <AnimatedText
              roles={["Frontend Developer.", "Graphic Designer.", "UI/UX Designer.", "Photographer."]}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#9D00FF] to-[#FF006F] bg-clip-text text-transparent leading-tight py-1"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.0 }}
            className="text-sm sm:text-base md:text-lg text-[#A3A3A3] mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
          >
            Hi, I'm Himanshu. Front-End Developer from Mumbai, India, with 2 years of experience in React and Next.js.
            Beyond code, I craft visual stories through design, with 80+ bold and creative projects under my belt.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.0 }}
            className="flex gap-3 sm:gap-4 justify-center flex-wrap px-4"
          >
            <a
              href="/resumeHimanshuIT.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-800/90 backdrop-blur-md px-6 py-2 text-sm font-medium text-white transition-all duration-500 hover:bg-gray-700/90 hover:border-gray-500/50 group-hover:scale-105">
                <FileTextIcon className="w-4 h-4 mr-2" />
                Resume
              </span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* More About Me Section - Responsive Grid Layout */}
      <section
        id="cards"
        className="min-h-screen bg-black flex flex-col items-center justify-center py-8 px-4 sm:px-6 md:px-8 relative z-10"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-auto w-full"
          >
            {/* Column 1 - Left */}
            <div className="flex flex-col gap-4 lg:order-1">
              {/* Profile Image - Large Card */}
              <motion.div variants={fadeInUp} className="h-64 sm:h-80 lg:flex-1">
                <Card className="bg-[#1A1A1A] border-0 shadow-lg rounded-3xl hover:scale-105 transition-all duration-500 h-full overflow-hidden">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="flex-1 relative">
                      <Image
                        src="/profilePhoto.png"
                        alt="Profile"
                        width={300}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* AKA Card */}
              <motion.div variants={fadeInUp} className="lg:order-3">
                <Card className="bg-transparent border border-gray-700/30 shadow-lg rounded-2xl hover:scale-105 transition-all duration-500 h-24 sm:h-32">
                  <CardContent className="p-3 sm:p-4 text-left h-full flex flex-col justify-center">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">AKA.</h3>
                    <p className="text-[#BBBBBB] text-xs sm:text-sm">
                      Known for turning <span className="text-white font-semibold">ideas</span> into interactive code &
                      design.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Column 2 - Middle */}
            <div className="flex flex-col gap-4 lg:order-2">
              {/* About Me Card - Wide */}
              <motion.div variants={fadeInUp}>
                <Card className="bg-transparent border border-gray-700/30 shadow-lg rounded-2xl hover:scale-105 transition-all duration-500 h-32 sm:h-40">
                  <CardContent className="p-4 sm:p-5 text-left h-full flex flex-col justify-center">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-4">ABOUT ME</h3>
                    <p className="text-[#BBBBBB] text-xs sm:text-sm leading-relaxed">
                      Developer by logic, designer by heart.<br></br>I create sleek, functional interfaces with code and
                      creativity in perfect sync.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Skills and Time Row */}
              <div className="flex gap-4 h-64 sm:h-80">
                {/* Skills Card - 80% width */}
                <motion.div variants={fadeInUp} className="flex-[4]">
                  <Card className="bg-[#8A5CF6] border-0 shadow-lg rounded-2xl hover:scale-105 transition-all duration-500 h-full">
                    <CardContent className="p-3 sm:p-4 text-left h-full flex flex-col gap-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm sm:text-lg md:text-xl font-bold text-white uppercase tracking-wide mb-4">
                          SKILLS
                        </h3>
                        <div className="relative">
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                          <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 bg-white/30 rounded-full blur-md animate-pulse"></div>
                        </div>
                      </div>
                      <ul className="text-white text-base sm:text-lg space-y-1 list-disc list-inside">
                        <li>UI/UX Design</li>
                        <li>Web Design</li>
                        <li>App Design</li>
                        <li>Development</li>
                        <li>Wireframing</li>
                        <li>Color Theory</li>
                        <li>Typography</li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Time Card - 20% width */}
                <motion.div variants={fadeInUp} className="flex-[1]">
                  <Card className="bg-[#1A1A1A] border-0 shadow-lg rounded-2xl hover:scale-105 transition-all duration-500 h-full">
                    <CardContent className="p-2 sm:p-3 text-center flex flex-col items-center justify-center h-full">
                      <div className="flex-1 flex flex-col justify-center items-center">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-none mb-1">
                          {currentTime.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </div>
                        <div className="text-sm sm:text-base font-medium text-white mb-2">
                          {currentTime
                            .toLocaleTimeString("en-US", {
                              hour12: true,
                            })
                            .slice(-2)}
                        </div>
                      </div>
                      <div className="text-xs text-white/70 font-medium">TIME</div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <motion.div variants={fadeInUp}>
                <Card className="bg-transparent border border-gray-700/30 shadow-lg rounded-2xl hover:scale-105 transition-all duration-500">
                  <CardContent className="p-4 sm:p-6 text-left flex flex-col gap-3">
                    <h3 className="text-xl font-semibold text-white">My Creative Arsenal</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      I design in Figma and build with React, Next.js, and Tailwind — merging visuals with
                      interactivity.
                    </p>
                    <p className="text-gray-400 text-xs italic">
                      Tech evolves, but clean code and good ideas are timeless.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Column 3 - Right */}
            <div className="flex flex-col gap-4 lg:order-3">
              {/* Social Links Section */}
              <motion.div variants={fadeInUp}>
                <div className="bg-transparent shadow-lg rounded-2xl hover:scale-105 transition-all duration-500 h-24 sm:h-28 p-3 sm:p-4">
                  <div className="w-full">
                    {/* Desktop Layout: LINKS text + 4 icons */}
                    <div className="hidden lg:block">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-start justify-center min-w-[50px]">
                          <div className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-none">LIN</div>
                          <div className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-none">KS:</div>
                        </div>

                        {/* Instagram */}
                        <a
                          href="https://www.instagram.com/thehimanshoe"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="ml-5 w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          </div>
                        </a>


                        {/* LinkedIn */}
                        <a
                          href="https://www.linkedin.com/in/himanshu-jangid-346134339"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-white rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                            <Linkedin className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-black" />
                          </div></a>

                        {/* X (Twitter) */}
                        <a
                          href="https://twitter.com/thehimanshoe"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-white rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                            <svg className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.53 3h2.82l-6.19 7.07L22 21h-7.06l-4.93-6.56L4.5 21H1.5l6.66-7.6L2 3h7.2l4.6 6.1L17.53 3ZM16.34 19h2.02L8.15 5H6.02l10.32 14Z" />
                            </svg>
                          </div></a>

                        {/* Facebook */}
                        <a
                          href="https://www.facebook.com/himanshu.jangid.9638718"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white d:w-18 md:h-18 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07C2 17.1 5.66 21.29 10.44 22v-7.03H7.9v-2.9h2.54V9.9c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.62.76-1.62 1.53v1.84h2.77l-.44 2.9h-2.33V22C18.34 21.29 22 17.1 22 12.07z" />
                            </svg>
                          </div></a>
                      </div>
                    </div>

                    {/* Tablet and Mobile Layout: Single row with 5 icons */}
                    <div className="block lg:hidden">
                      <div className="text-center mb-3">
                        <div className="text-2xl font-black text-white">LINKS:</div>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        {/* Instagram */}
                        <a
                          href="https://www.instagram.com/thehimanshoe"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          </div></a>

                        {/* LinkedIn */}
                        <a
                          href="https://www.linkedin.com/in/himanshu-jangid-346134339"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                            <Linkedin className="w-6 h-6 text-black" />
                          </div></a>

                        {/* X (Twitter) */}
                        <a
                          href="https://twitter.com/thehimanshoe"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.53 3h2.82l-6.19 7.07L22 21h-7.06l-4.93-6.56L4.5 21H1.5l6.66-7.6L2 3h7.2l4.6 6.1L17.53 3ZM16.34 19h2.02L8.15 5H6.02l10.32 14Z" />
                            </svg>
                          </div></a>

                        {/* Facebook */}
                        <a
                          href="https://www.facebook.com/himanshu.jangid.9638718"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07C2 17.1 5.66 21.29 10.44 22v-7.03H7.9v-2.9h2.54V9.9c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.62.76-1.62 1.53v1.84h2.77l-.44 2.9h-2.33V22C18.34 21.29 22 17.1 22 12.07z" />
                            </svg>
                          </div></a>

                        {/* Gmail */}
                        <a href="mailto:himanshujangid2003@gmail.com">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4.5-8 5-8-5V6l8 5 8-5v2.5Z" />
                            </svg>
                          </div></a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Timer Card */}
              <motion.div variants={fadeInUp} className="flex-1 mr-0 sm:mr-4 md:mr-6 lg:mr-9">
                <Card className="bg-transparent border border-gray-700/30 shadow-lg rounded-2xl hover:scale-105 transition-all duration-500 h-full min-h-[180px] sm:min-h-[200px]">
                  <CardContent className="p-3 sm:p-4 h-full flex flex-col justify-center">
                    <TimerComponent scrollToSection={scrollToSection} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Location Card */}
              <motion.div variants={fadeInUp} className="mr-0 sm:mr-4 md:mr-6 lg:mr-9">
                <Card className="bg-[#1A1A1A] border-0 shadow-lg rounded-2xl hover:scale-105 transition-all duration-500 h-24 sm:h-32">
                  <CardContent className="p-3 sm:p-4 text-center h-full flex flex-col justify-center">
                    <h3 className="text-sm sm:text-lg font-bold text-white uppercase tracking-wide mb-1 sm:mb-2">
                      LOCATION
                    </h3>
                    <div className="mb-1 flex justify-center items-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-white font-semibold text-xs sm:text-sm mb-1">India</div>
                    <div className="text-[#AAAAAA] text-xs">GMT+5:30</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:pl-24 relative z-10 bg-[#0E0E0E]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            {...fadeInUp}
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 sm:mb-12 text-center text-white"
          >
            Projects
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          >
            {[
              {
                image: "/FairShare.png?height=200&width=300",
                title: "FairShare",
                description: "A sleek, responsive full-stack PWA built to effortlessly manage and split group expenses, with a focus on intuitive design and user-friendly experience.",
                tech: ["React", "Node.js", "Tailwind", "TypeScript", "PostgreSQL"],
                link: "https://fairshare.adityakirti.tech/"
              },
              {
                image: "/url-shortner.png?height=200&width=300",
                title: "URL Shortner",
                description: "A responsive and efficient tool for turning long URLs into sleek, easy-to-share links—optimized for all devices.",
                tech: ["React", "Tailwind", "APIs"],
                link: "https://url-shortener-by-himanshuu.vercel.app/"
              },

            ].map((project, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-gray-900/95 backdrop-blur-md border-gray-700/50 hover:bg-gray-800 transition-all duration-500 hover:scale-105  overflow-hidden h-full flex flex-col">
                  <CardContent className="p-0 flex flex-col flex-1">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold">{project.title}</h3>
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-[#A3A3A3] hover:text-white transition-colors duration-300 flex-shrink-0 ml-2" />
                        </a>

                      </div>
                      <p className="text-[#A3A3A3] mb-3 text-xs sm:text-sm leading-relaxed flex-1">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {project.tech.map((tech, techIndex) => (
                          <span key={techIndex} className="px-2 py-1 bg-gray-800 text-xs rounded-md text-[#A3A3A3]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:pl-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            {...fadeInUp}
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 sm:mb-12 text-center text-white"
          >
            Tech
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4"
          >
            {[
              { name: "Python", src: "/logos/python.svg" },
              { name: "JavaScript", src: "/logos/javascript.svg" },
              { name: "React", src: "/logos/react.svg" },
              { name: "Tailwind", src: "/logos/tailwind.svg" },
              { name: "Git", src: "/logos/git.svg" },
              { name: "GitHub", src: "/logos/github.svg" },
            ].map((tech, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-gray-900/95 backdrop-blur-md border-gray-700/50 hover:bg-gray-800 transition-all duration-500 hover:scale-105 cursor-pointer">
                  <CardContent className="p-4 sm:p-5 md:p-7 text-center flex flex-col items-center justify-center">
                    <img
                      src={tech.src || "/placeholder.svg"}
                      alt={tech.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mb-2"
                    />
                    <div className="text-xs sm:text-sm font-medium text-white">{tech.name}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Personal Favourites Section */}
      <section id="uses" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:pl-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            {...fadeInUp}
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 sm:mb-12 text-center text-white"
          >
            Personal Favourites
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
          >
            {[
              { name: "Figma", icon: <Figma className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" /> },
              { name: "Adobe Photoshop", src: "/logos/photoshop.svg" },
              { name: "Adobe Lightroom", src: "/logos/lightroom.svg" },
              { name: "Snapseed", src: "/logos/snapseed.svg" },
              { name: "Canva", src: "/logos/canva.svg" },
              { name: "Picsart", src: "/logos/picsart.png" },
              { name: "Capcut", src: "/logos/capcut.png" },
              { name: "VN", src: "/logos/vn.png" },
            ].map((tool, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-gray-900/95 backdrop-blur-md border-gray-700/50 hover:bg-gray-800 transition-all duration-500 hover:scale-105 cursor-pointer">
                  <CardContent className="p-4 sm:p-5 md:p-7 text-center flex flex-col items-center justify-center">
                    <div className="mb-2">
                      {tool.icon ? (
                        tool.icon
                      ) : (
                        <img
                          src={tool.src || "/placeholder.svg"}
                          alt={tool.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
                        />
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-white">{tool.name}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Photography Section */}
      <section id="photography" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:pl-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            {...fadeInUp}
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-8 text-center text-white"
          >
            Photography
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="relative overflow-hidden flex items-center justify-center"
          >
            <PhotoCarousel />
          </motion.div>
        </div>
      </section>

      {/* Let's Work Together Section - New Footer Design */}
      <section
        id="contact"
        className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-[#0A0A0A] to-[#000000] relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Main Heading */}
          <motion.h2
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 sm:mb-12 text-white relative leading-tight" // Changed to white color
            style={{
              fontFamily: "Satoshi, sans-serif",
            }}
          >
            Let's work together
          </motion.h2>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12"
          >
            {[
              { number: "97 Times", label: "Ctrl+S saved the day" },
              { number: "80+", label: "Designs Created" },
              { number: "2.5K+", label: "Hours Spent Working" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-black/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-xs sm:text-sm text-[#AAAAAA]">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Contact Email CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.6 }}
            className="space-y-3 sm:space-y-4"
          >
            <a href="mailto:himanshujangid2003@gmail.com">
              <Button
                className="bg-white text-black hover:bg-gray-100 transition-all duration-500 hover:scale-105 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold shadow-lg"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                himanshujangid2003@gmail.com
              </Button></a>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 md:pl-24 border-t border-gray-800 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[#A3A3A3] text-xs sm:text-sm text-center md:text-left">
              If you’ve scrolled this far, let’s create something cool together.
            </div>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="https://www.linkedin.com/in/himanshu-jangid-346134339"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="bg-gray-800/90 backdrop-blur-md border border-gray-600/50 text-white hover:bg-gray-700/90 hover:border-gray-500/50 transition-all duration-500 hover:scale-105"
                  size="icon"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button></a>
              <a href="mailto:himanshujangid2003@gmail.com">
                <Button
                  className="bg-gray-800/90 backdrop-blur-md border border-gray-600/50 text-white hover:bg-gray-700/90 hover:border-gray-500/50 transition-all duration-500 hover:scale-105"
                  size="icon"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
