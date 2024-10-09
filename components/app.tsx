"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Editor, useMonaco } from '@monaco-editor/react'
import { Button, Input, Typography, Space, Tabs, Modal, Form, Checkbox, Divider, Card, List, Avatar, Tag, message } from 'antd'
import { LockOutlined, UserOutlined, CheckOutlined, CrownOutlined, RocketOutlined, TeamOutlined, AudioOutlined, FileTextOutlined, SearchOutlined, DeleteOutlined, ExpandOutlined, CompressOutlined, EyeInvisibleOutlined, LeftOutlined, RightOutlined, KeyOutlined, GoogleOutlined, FacebookOutlined, TwitterOutlined, MailOutlined, LogoutOutlined, FileOutlined, ShieldOutlined, SettingOutlined, LineChartOutlined, GiftOutlined, BarChartOutlined, ScissorOutlined, CopyOutlined, FileAddOutlined, CloseOutlined, InboxOutlined } from '@ant-design/icons'
import axios from 'axios'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import confetti from 'canvas-confetti'
import { v4 as uuidv4 } from 'uuid'

const { Title, Text } = Typography
const { TabPane } = Tabs
const { TextArea } = Input

const pricingData = [
  {
    title: 'Free',
    price: '$0',
    period: '/month',
    features: [
      'Basic Protection',
      'Limited Encryption',
      'Community Support',
    ],
    action: 'Current Plan',
    trial: null,
    icon: <TeamOutlined className="text-2xl text-blue-500" />,
    color: 'from-blue-400 to-blue-600',
    design: 'bg-blue-100',
  },
  {
    title: 'Pro',
    price: '$9.99',
    period: '/month',
    features: [
      'Advanced Protection',
      'Full Encryption Suite',
      'Priority Support',
      'Custom Algorithms',
      'AuraCrypt Beta Access',
    ],
    action: 'Upgrade',
    trial: '14-day free trial',
    icon: <CrownOutlined className="text-2xl text-yellow-500" />,
    color: 'from-yellow-400 to-yellow-600',
    design: 'bg-yellow-100',
    badge: 'Most Popular',
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'Ultimate Protection',
      'Tailored Solutions',
      'Dedicated Support Team',
      'On-Premise Options',
      'AuraCrypt Beta Access',
    ],
    action: 'Contact Us',
    trial: '30-day free trial',
    icon: <RocketOutlined className="text-2xl text-purple-500" />,
    color: 'from-purple-400 to-purple-600',
    design: 'bg-purple-100',
  },
]

const randomEditorMessages = [
  "Who writes these messages?",
  "Oh hi there!",
  "Did you know? Ctrl+S checks AI score!",
  "Remember to stay hydrated!",
  "You're doing great!",
  "Fun fact: The first computer bug was an actual bug.",
  "Keep up the good work!",
  "Don't forget to take breaks!",
  "Coding is like writing a story, but for computers.",
  "Have you tried turning it off and on again?",
]

const ActionButton = ({ icon, onClick, isActive, tooltip, loading }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <motion.div
        className="w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        {loading ? (
          <motion.div
            className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          icon
        )}
      </motion.div>
    </TooltipTrigger>
    <TooltipContent>{tooltip}</TooltipContent>
  </Tooltip>
)

const RecordButton = ({ isRecording, onClick }) => (
  <ActionButton
    icon={
      <div className="relative">
        <AudioOutlined className="text-2xl text-gray-600" />
        <motion.div
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-300'}`}
          animate={{ scale: isRecording ? [1, 1.2, 1] : 1 }}
          transition={{ repeat: isRecording ? Infinity : 0, duration: 1 }}
        />
      </div>
    }
    onClick={onClick}
    isActive={isRecording}
    tooltip={isRecording ? "Stop Recording" : "Start Recording"}
  />
)

const AntiDetectButton = ({ onClick, isActive }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    onClick()
    setTimeout(() => setIsAnimating(false), 2000)
  }

  return (
    <ActionButton
      icon={
        <motion.div
          className={`w-6 h-6 rounded-full ${isAnimating ? 'bg-green-500' : 'bg-gray-400'}`}
          animate={{ scale: isAnimating ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.5 }}
        />
      }
      onClick={handleClick}
      isActive={isActive}
      tooltip="Request Anti Detect"
    />
  )
}

const LoadingScreen = () => (
  <motion.div
    className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center z-50"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="text-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center mb-8 mx-auto relative overflow-hidden"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
      >
        <LockOutlined className="text-white text-5xl" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-blue-600 to-transparent"
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
      </motion.div>
      <motion.div
        className="w-64 h-2 bg-blue-800 rounded-full mt-8 mx-auto overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-blue-400 absolute left-0 top-0 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="h-full bg-white opacity-20 absolute left-0 top-0 rounded-full"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ width: "50%" }}
        />
      </motion.div>
    </motion.div>
  </motion.div>
)

const LoginScreen = ({ onLogin }) => {
  const [form] = Form.useForm()
  const [rememberMe, setRememberMe] = useState(false)
  const [showLicensePanel, setShowLicensePanel] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [generatedKey, setGeneratedKey] = useState(null)

  const handleSubmit = async (values) => {
    setIsLoggingIn(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (values.username === 'Admin' && values.password === 'Admin') {
      if (rememberMe) {
        localStorage.setItem('isLoggedIn', 'true')
      }
      onLogin()
    } else {
      if (values.username !== 'Admin') {
        form.setFields([
          {
            name: 'username',
            errors: ['Invalid username provided'],
          },
        ])
      }
      if (values.password !== 'Admin') {
        form.setFields([
          {
            name: 'password',
            errors: ['Invalid password provided'],
          },
        ])
      }
    }
    setIsLoggingIn(false)
  }

  const handleSocialLogin = (platform) => {
    console.log(`Logging in with ${platform}`)
  }

  const handleRedeemLicense = (licenseKey) => {
    console.log('Redeeming license:', licenseKey)
    setShowLicensePanel(false)
  }

  const handleForgotPassword = (values) => {
    console.log('Resetting password for:', values.email)
    setShowForgotPassword(false)
  }

  const generateSerialKey = () => {
    const key = uuidv4()
    const expirationDate = new Date()
    expirationDate.setMonth(expirationDate.getMonth() + 1)
    setGeneratedKey({
      key,
      expirationDate: expirationDate.toISOString().split('T')[0]
    })
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    Modal.success({
      title: '🎉 Congratulations!',
      content: (
        <div>
          <p>Your new serial key is:</p>
          <p style={{ fontWeight: 'bold', wordBreak: 'break-all' }}>{key}</p>
          <p>Expires on: {expirationDate.toISOString().split('T')[0]}</p>
        </div>
      ),
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl w-96"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full mb-6 inline-block"
            whileHover={{ scale: 1.1, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <LockOutlined className="text-white text-5xl" />
          </motion.div>
          <Title level={2} className="m-0 text-gray-800 font-extrabold text-3xl tracking-tight">
            Anti Detect Pro
          </Title>
          <Text className="text-gray-500 text-lg">Secure & Undetectable</Text>
        </div>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="Username"
              className="rounded-full"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />} 
              placeholder="Password"
              className="rounded-full"
            />
          </Form.Item>
          <Form.Item>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Switch
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  className="mr-2"
                />
                <Label htmlFor="remember-me">Remember me</Label>
              </div>
              <a className="text-sm text-blue-500 hover:text-blue-600" onClick={() => setShowForgotPassword(true)}>Forgot password?</a>
            </div>
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              className="bg-gradient-to-r from-blue-500 to-purple-500 border-0 h-10 font-semibold rounded-full"
              loading={isLoggingIn}
            >
              {isLoggingIn ? 'Logging in...' : 'Log in'}
            </Button>
          </Form.Item>
        </Form>
        <Divider>Or login with</Divider>
        <div className="flex justify-center space-x-4 mb-4">
          <Button icon={<GoogleOutlined />} onClick={() => handleSocialLogin('Google')} shape="circle" />
          <Button icon={<FacebookOutlined />} onClick={() => handleSocialLogin('Facebook')} shape="circle" />
          <Button icon={<TwitterOutlined />} onClick={() => handleSocialLogin('Twitter')} shape="circle" />
        </div>
        <Button 
          onClick={() => setShowLicensePanel(true)} 
          block
          icon={<KeyOutlined />}
          className="mt-4 h-10 rounded-full"
        >
          Redeem or Purchase License
        </Button>
      </motion.div>
      <Modal
        title="License Management"
        open={showLicensePanel}
        onCancel={() => setShowLicensePanel(false)}
        footer={null}
        width={800}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Redeem License" key="1">
            <Form onFinish={handleRedeemLicense}>
              <Form.Item
                name="licenseKey"
                rules={[{ required: true, message: 'Please enter your license key!' }]}
              >
                <Input placeholder="Enter your license key" className="rounded-full" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block className="rounded-full">
                  Redeem
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Purchase License" key="2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingData.map((plan, index) => (
                <div key={index} className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className={`p-6 ${plan.design}`}>
                    <h3 className="text-2xl font-bold text-gray-900">{plan.title}</h3>
                    <div className="mt-4 flex items-baseline text-gray-900">
                      <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                      <span className="ml-1 text-xl font-semibold">{plan.period}</span>
                    </div>
                    {plan.trial && (
                      <p className="mt-4 text-sm text-gray-500">{plan.trial}</p>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between p-6 bg-gray-50 space-y-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start">
                          <div className="flex-shrink-0">
                            <CheckOutlined className="h-6 w-6 text-green-500" />
                          </div>
                          <p className="ml-3 text-base text-gray-700">{feature}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-md shadow">
                      <Button type="primary" block className="rounded-md" onClick={generateSerialKey}>
                        {plan.action}
                      </Button>
                    </div>
                  </div>
                  {plan.badge && (
                    <div className="absolute top-0 right-0 mt-4 mr-4">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabPane>
        </Tabs>
      </Modal>
      <Modal
        title="Forgot Password"
        open={showForgotPassword}
        onCancel={() => setShowForgotPassword(false)}
        footer={null}
      >
        <Form onFinish={handleForgotPassword}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [tabs, setTabs] = useState([])
  const [activeKey, setActiveKey] = useState('1')
  const [editingKey, setEditingKey] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hiddenTabs, setHiddenTabs] = useState({})
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, tabKey: null })
  const [topButtonsVisible, setTopButtonsVisible] = useState(true)
  const [aiPanelVisible, setAiPanelVisible] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showAIReviewPanel, setShowAIReviewPanel] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [aiScores, setAiScores] = useState({})
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [aiReviewPanelContent, setAiReviewPanelContent] = useState([])
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    subscription: 'Free',
    billingCycle: 'N/A',
    nextBillingDate: 'N/A',
    expirationDate: null,
  })
  const [loadingScores, setLoadingScores] = useState({})
  const [useAuraCrypt, setUseAuraCrypt] = useState(false)
  const [auraCryptTrialActive, setAuraCryptTrialActive] = useState(true)
  const [auraCryptTrialTimeLeft, setAuraCryptTrialTimeLeft] = useState(3600) // 1 hour in seconds
  const [showReplacementStats, setShowReplacementStats] = useState(false)
  const [replacementStats, setReplacementStats] = useState({
    replacedCount: 0,
    oldLength: 0,
    newLength: 0,
  })
  const [licenseKeys, setLicenseKeys] = useState([])
  const [showLicenseKeyModal, setShowLicenseKeyModal] = useState(false)
  const [licenseKeyInput, setLicenseKeyInput] = useState('')
  const [selectedText, setSelectedText] = useState('')
  const [selectionMenuVisible, setSelectionMenuVisible] = useState(false)
  const [selectionMenuPosition, setSelectionMenuPosition] = useState({ x: 0, y: 0 })
  const [showExtendTimeModal, setShowExtendTimeModal] = useState(false)
  const [showTrialBanner, setShowTrialBanner] = useState(true)
  const [showAccountSettings, setShowAccountSettings] = useState(false)

  const recognitionRef = useRef(null)
  const monaco = useMonaco()
  const editorRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn')
    if (savedLoginState === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  useEffect(() => {
    const savedTabs = localStorage.getItem('antiDetectTabs')
    const savedActiveKey = localStorage.getItem('antiDetectActiveKey')
    const savedUploadedFiles = localStorage.getItem('uploadedFiles')
    const savedAuraCryptTrial = localStorage.getItem('auraCryptTrial')
    const savedLicenseKeys = localStorage.getItem('licenseKeys')
    const savedUserProfile = localStorage.getItem('userProfile')
    if (savedTabs) {
      const parsedTabs = JSON.parse(savedTabs)
      setTabs(parsedTabs.length > 0 ? parsedTabs : [{ key: '1', title: 'New Tab', content: "", aiPercentage: 0, wordCount: 0 }])
      setActiveKey(savedActiveKey || '1')
    } else {
      setTabs([{ key: '1', title: 'New Tab', content: "", aiPercentage: 0, wordCount: 0 }])
    }
    if (savedUploadedFiles) {
      setUploadedFiles(JSON.parse(savedUploadedFiles))
    }
    if (savedAuraCryptTrial) {
      const { active, timeLeft, expirationTime } = JSON.parse(savedAuraCryptTrial)
      if (active && Date.now() < expirationTime) {
        setAuraCryptTrialActive(true)
        setAuraCryptTrialTimeLeft(Math.max(0, Math.floor((expirationTime - Date.now()) / 1000)))
        setUseAuraCrypt(true)
      }
    }
    if (savedLicenseKeys) {
      setLicenseKeys(JSON.parse(savedLicenseKeys))
    }
    if (savedUserProfile) {
      setUserProfile(JSON.parse(savedUserProfile))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('antiDetectTabs', JSON.stringify(tabs))
    localStorage.setItem('antiDetectActiveKey', activeKey)
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles))
    localStorage.setItem('licenseKeys', JSON.stringify(licenseKeys))
    localStorage.setItem('userProfile', JSON.stringify(userProfile))
  }, [tabs, activeKey, uploadedFiles, licenseKeys, userProfile])

  useEffect(() => {
    const typeMessage = (message) => {
      let i = 0
      setIsTyping(true)
      const intervalId = setInterval(() => {
        setCurrentMessage(message.substring(0, i))
        i++
        if (i > message.length) {
          clearInterval(intervalId)
          setIsTyping(false)
        }
      }, 50)
    }

    const messageInterval = setInterval(() => {
      if (!isTyping) {
        const randomMessage = randomEditorMessages[Math.floor(Math.random() * randomEditorMessages.length)]
        typeMessage(randomMessage)
      }
    }, 3000)

    return () => clearInterval(messageInterval)
  }, [isTyping])

  useEffect(() => {
    let timer
    if (auraCryptTrialActive && auraCryptTrialTimeLeft > 0) {
      timer = setInterval(() => {
        setAuraCryptTrialTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            setAuraCryptTrialActive(false)
            setUseAuraCrypt(false)
            message.info('Your AuraCrypt trial has expired.')
            localStorage.removeItem('auraCryptTrial')
            return 0
          }
          const newTime = prevTime - 1
          localStorage.setItem('auraCryptTrial', JSON.stringify({
            active: true,
            timeLeft: newTime,
            expirationTime: Date.now() + newTime * 1000
          }))
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [auraCryptTrialActive, auraCryptTrialTimeLeft])

  const updateTabContent = useCallback((key, newContent) => {
    setTabs(prevTabs => prevTabs.map(tab => 
      tab.key === key ? { ...tab, content: newContent, wordCount: newContent.trim().split(/\s+/).length } : tab
    ))
  }, [])

  const checkAIScore = useCallback(async (content, fileName) => {
    try {
      setLoadingScores(prev => ({ ...prev, [fileName]: true }))
      const response = await axios.post('https://85gdtn-3000.csb.app/detect', { essay: content })
      const score = response.data
      const aiPercentage = parseInt(score)
      setAiScores(prev => ({ ...prev, [fileName]: aiPercentage }))

      setAiReviewPanelContent(prevContent => {
        const existingIndex = prevContent.findIndex(item => item.name === fileName)
        if (existingIndex !== -1) {
          const updatedContent = [...prevContent]
          updatedContent[existingIndex] = { name: fileName, content, score: aiPercentage }
          return updatedContent
        } else {
          return [...prevContent, { name: fileName, content, score: aiPercentage }]
        }
      })

      setTabs(prevTabs => prevTabs.map(tab => 
        tab.key === activeKey ? { ...tab, aiPercentage } : tab
      ))

      if (aiPercentage >= 80) {
        Modal.warning({
          title: 'High AI Similarity Detected',
          content: `The AI similarity score for ${fileName} is ${aiPercentage}%, which is considered too high. Please review and modify your content.`,
        })
      }

      setShowAIReviewPanel(true)
    } catch (error) {
      console.error('Error checking AI score:', error)
    } finally {
      setLoadingScores(prev => ({ ...prev, [fileName]: false }))
    }
  }, [activeKey])

  const handleRecordToggle = useCallback(() => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
      setIsRecording(false)
    } else {
      if ('webkitSpeechRecognition' in window) {
        recognitionRef.current = new (window as any).webkitSpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = ''
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            }
          }
          if (finalTranscript) {
            updateTabContent(activeKey, (prevContent) => prevContent + ' ' + finalTranscript)
          }
        }

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error)
          setIsRecording(false)
        }

        recognitionRef.current.onend = () => {
          setIsRecording(false)
        }

        recognitionRef.current.start()
        setIsRecording(true)
      } else {
        console.error('Speech recognition not supported')
      }
    }
  }, [isRecording, activeKey, updateTabContent])

  const handleEditorChange = useCallback((value) => {
    if (value !== undefined) {
      updateTabContent(activeKey, value)
    }
  }, [activeKey, updateTabContent])

  const handleRequestAntiDetect = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      if (editorRef.current) {
        const editor = editorRef.current
        const currentContent = editor.getValue()
        
        let replacedContent = currentContent
        let replacedCount = 0
        const oldLength = currentContent.length

        if (useAuraCrypt) {
          const auraCryptUnicodes = '󠀶󠁁󠁎𝅹󠀬󠀠󠀡󠀢󠀣󠀤󠀥󠀦󠀧󠀨󠀩󠀪󠀫󠀬󠀭󠀮󠀯󠀰󠀱󠀲󠀳󠀴󠀵󠀶󠀷󠀸󠀹󠀺󠀻󠀼󠀽󠀾󠀿󠁀󠁁󠁂󠁃󠁄󠁅󠁆󠁇󠁈󠁉󠁊󠁋󠁌󠁍󠁎󠁏󠁐󠁑󠁒󠁓󠁔󠁕󠁖󠁗󠁘󠁙󠁚󠁛󠁜󠁝󠁞󠁟󠁠󠁡󠁢󠁣󠁤󠁥󠁦󠁧󠁨󠁩󠁪󠁫󠁬󠁭󠁮󠁯󠁰󠁱󠁲󠁳󠁴󠁵󠁶󠁷󠁸󠁹󠁺󠁻󠁼󠁽󠁾󠁿'
          replacedContent = currentContent.split('').map(char => {
            if (Math.random() < 0.1) {
              replacedCount++
              return char + auraCryptUnicodes[Math.floor(Math.random() * auraCryptUnicodes.length)]
            }
            return char
          }).join('')
        } else {
          const invisibleChars = ['\u200B', '\u200C', '\u200D', '\u2060', '\u2061', '\u2062', '\u2063', '\u2064']
          replacedContent = currentContent.split('').map(char => {
            if (Math.random() < 0.1) {
              replacedCount++
              return char + invisibleChars[Math.floor(Math.random() * invisibleChars.length)]
            }
            return char
          }).join('')
        }

        editor.setValue(replacedContent)
        updateTabContent(activeKey, replacedContent)

        setReplacementStats({
          replacedCount,
          oldLength,
          newLength: replacedContent.length,
        })
        setShowReplacementStats(true)
      }
      setIsLoading(false)
    }, 2000)
  }, [activeKey, updateTabContent, useAuraCrypt])

  const handleAddTab = useCallback(() => {
    const newTabKey = String(tabs.length + 1)
    setTabs([...tabs, { key: newTabKey, title: `New Tab ${newTabKey}`, content: "", aiPercentage: 0, wordCount: 0 }])
    setActiveKey(newTabKey)
  }, [tabs])

  const handleRemoveTab = useCallback((targetKey) => {
    let newActiveKey = activeKey
    let lastIndex
    tabs.forEach((tab, i) => {
      if (tab.key === targetKey) {
        lastIndex = i - 1
      }
    })
    const newTabs = tabs.filter(tab => tab.key !== targetKey)
    if (newTabs.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newTabs[lastIndex].key
      } else {
        newActiveKey = newTabs[0].key
      }
    }
    setTabs(newTabs)
    setActiveKey(newActiveKey)
  }, [activeKey, tabs])

  const handleEditTab = useCallback((targetKey) => {
    setEditingKey(targetKey)
  }, [])

  const handleTabTitleChange = useCallback((targetKey, newTitle) => {
    setTabs(prevTabs => prevTabs.map(tab => 
      tab.key === targetKey ? { ...tab, title: newTitle || `Tab ${targetKey}` } : tab
    ))
    setEditingKey(null)
  }, [])

  const handleTabsEdit = useCallback((targetKey, action) => {
    if (action === 'add') {
      handleAddTab()
    } else if (action === 'remove') {
      if (tabs.length > 1) {
        handleRemoveTab(targetKey)
      } else {
        setIsConfirmModalVisible(true)
      }
    }
  }, [handleAddTab, handleRemoveTab, tabs.length])

  const handleConfirmRemoveLastTab = useCallback(() => {
    setTabs([])
    setActiveKey('1')
    setIsConfirmModalVisible(false)
  }, [])

  const handleCancelRemoveLastTab = useCallback(() => {
    setIsConfirmModalVisible(false)
  }, [])

  const handleFullscreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }, [])

  const handleTabContextMenu = useCallback((event, tabKey) => {
    event.preventDefault()
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      tabKey
    })
  }, [])

  const handleHideTab = useCallback((tabKey) => {
    setHiddenTabs(prev => ({ ...prev, [tabKey]: true }))
    setContextMenu({ visible: false, x: 0, y: 0, tabKey: null })
  }, [])

  const handleShowAllTabs = useCallback(() => {
    setHiddenTabs({})
  }, [])

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu({ visible: false, x: 0, y: 0, tabKey: null })
  }, [])

  const handleTopButtonsToggle = useCallback(() => {
    setTopButtonsVisible(prev => !prev)
  }, [])

  const handleAIPanelToggle = useCallback(() => {
    setAiPanelVisible(prev => !prev)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDraggingFile(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDraggingFile(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDraggingFile(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileUpload(files)
  }, [])

  const handleFileUpload = useCallback((files) => {
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result
        const newTabKey = String(tabs.length + 1)
        setTabs(prevTabs => [...prevTabs, { key: newTabKey, title: file.name, content: content, aiPercentage: 0, wordCount: 0 }])
        setActiveKey(newTabKey)
        setUploadedFiles(prevFiles => [...prevFiles, { name: file.name, content }])
        checkAIScore(content, file.name)
      }
      reader.readAsText(file)
    })
  }, [tabs, checkAIScore])

  const handleFileInputChange = useCallback((e) => {
    const files = Array.from(e.target.files)
    handleFileUpload(files)
  }, [handleFileUpload])

  const handleAuraCryptToggle = useCallback(() => {
    if (auraCryptTrialActive && auraCryptTrialTimeLeft > 0) {
      setUseAuraCrypt(prev => !prev)
    } else {
      Modal.confirm({
        title: 'Start AuraCrypt Trial',
        content: 'Would you like to start your 1-hour free trial of AuraCrypt?',
        onOk() {
          setUseAuraCrypt(true)
          setAuraCryptTrialActive(true)
          setAuraCryptTrialTimeLeft(3600) // 1 hour in seconds
          localStorage.setItem('auraCryptTrial', JSON.stringify({
            active: true,
            timeLeft: 3600,
            expirationTime: Date.now() + 3600 * 1000
          }))
          message.success('AuraCrypt trial activated for 1 hour!')
        },
      })
    }
  }, [auraCryptTrialActive, auraCryptTrialTimeLeft])

  const handleLicenseKeySubmit = useCallback(() => {
    if (licenseKeyInput.trim()) {
      setLicenseKeys(prevKeys => [...prevKeys, { key: licenseKeyInput.trim(), status: 'Active' }])
      setLicenseKeyInput('')
      setShowLicenseKeyModal(false)
      message.success('License key added successfully!')
    }
  }, [licenseKeyInput])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false)
  }, [])

  const handleSelectionChange = useCallback(() => {
    if (editorRef.current) {
      const editor = editorRef.current
      const selection = editor.getSelection()
      const selectedText = editor.getModel().getValueInRange(selection)
      
      if (selectedText) {
        setSelectedText(selectedText)
        const editorPosition = editor.getScrolledVisiblePosition(selection.getStartPosition())
        const editorContainer = editor.getContainerDomNode()
        const rect = editorContainer.getBoundingClientRect()
        
        setSelectionMenuPosition({
          x: rect.left + editorPosition.left + 10,
          y: rect.top + editorPosition.top - 40
        })
        setSelectionMenuVisible(true)
      } else {
        setSelectionMenuVisible(false)
      }
    }
  }, [])

  const handleSelectionAction = useCallback((action) => {
    if (editorRef.current) {
      const editor = editorRef.current
      const selection = editor.getSelection()
      let replacement = selectedText

      switch (action) {
        case 'uppercase':
          replacement = selectedText.toUpperCase()
          break
        case 'lowercase':
          replacement = selectedText.toLowerCase()
          break
        case 'capitalize':
          replacement = selectedText.replace(/\b\w/g, c => c.toUpperCase())
          break
        case 'remove':
          replacement = ''
          break
        case 'cut':
          navigator.clipboard.writeText(selectedText)
          replacement = ''
          break
        case 'copy':
          navigator.clipboard.writeText(selectedText)
          break
        case 'newTab':
          handleAddTab()
          const newTabKey = String(tabs.length + 1)
          updateTabContent(newTabKey, selectedText)
          break
        case 'checkAI':
          checkAIScore(selectedText, 'Selected Text')
          break
      }

      editor.executeEdits('', [{
        range: selection,
        text: replacement,
        forceMoveMarkers: true
      }])

      setSelectionMenuVisible(false)
    }
  }, [selectedText, handleAddTab, updateTabContent, tabs.length, checkAIScore])

  const handleExtendTime = useCallback(() => {
    setShowExtendTimeModal(true)
  }, [])

  const handlePurchaseTime = useCallback((hours) => {
    const additionalSeconds = hours * 3600
    setAuraCryptTrialTimeLeft(prevTime => prevTime + additionalSeconds)
    setShowExtendTimeModal(false)
    message.success(`Successfully extended AuraCrypt time by ${hours} hour${hours > 1 ? 's' : ''}!`)
  }, [])

  const handleAccountSettingsClick = useCallback(() => {
    setShowAccountSettings(true)
  }, [])

  const handleClearUploadedFiles = useCallback(() => {
    setUploadedFiles([])
    message.success('All uploaded files have been cleared')
  }, [])

  if (!isLoaded) {
    return <LoadingScreen />
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-gray-100">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <motion.div
              className="text-2xl font-bold text-blue-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Anti Detect Pro
            </motion.div>
            <AnimatePresence>
              {topButtonsVisible && (
                <motion.div
                  className="flex space-x-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ActionButton
                    icon={<FileAddOutlined className="text-2xl text-blue-500" />}
                    onClick={() => document.getElementById('fileInput').click()}
                    tooltip="Upload File"
                  />
                  <ActionButton
                    icon={<SearchOutlined className="text-2xl text-green-500" />}
                    onClick={() => checkAIScore(tabs.find(tab => tab.key === activeKey).content, tabs.find(tab => tab.key === activeKey).title)}
                    tooltip="Check AI Score"
                    loading={loadingScores[tabs.find(tab => tab.key === activeKey)?.title]}
                  />
                  <RecordButton isRecording={isRecording} onClick={handleRecordToggle} />
                  <AntiDetectButton onClick={handleRequestAntiDetect} isActive={isLoading} />
                  <ActionButton
                    icon={isFullscreen ? <CompressOutlined className="text-2xl text-purple-500" /> : <ExpandOutlined className="text-2xl text-purple-500" />}
                    onClick={handleFullscreenToggle}
                    tooltip={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center space-x-4">
            <Switch
              checked={useAuraCrypt}
              onCheckedChange={handleAuraCryptToggle}
              className="mr-2"
            />
            <Label htmlFor="auraCrypt-mode">AuraCrypt</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" onClick={handleLogout}>
                  <LogoutOutlined className="mr-2" />
                  Logout
                </Button>
              </TooltipTrigger>
              <TooltipContent>Log out of your account</TooltipContent>
            </Tooltip>
          </div>
        </header>
        {showTrialBanner && (
          <div className="bg-blue-100 border-b border-blue-200 p-4 text-center">
            <p className="text-blue-800">
              Your AuraCrypt trial is active! Enjoy advanced protection for the next {Math.floor(auraCryptTrialTimeLeft / 3600)} hours and {Math.floor((auraCryptTrialTimeLeft % 3600) / 60)} minutes.
              <Button size="sm" className="ml-4" onClick={handleExtendTime}>
                Extend Trial
              </Button>
              <Button size="sm" className="ml-2" onClick={() => setShowTrialBanner(false)}>
                Dismiss
              </Button>
            </p>
          </div>
        )}
        <div className="flex-grow flex">
          <div className="w-64 bg-white shadow-md p-4 flex flex-col border-r border-gray-200 border-dashed">
            <div className="mb-4 flex items-center">
              <Avatar src={userProfile.avatar} alt={userProfile.name} className="mr-2" />
              <div>
                <div className="font-semibold text-gray-800">{userProfile.name}</div>
                <div className="text-xs text-gray-500">{userProfile.email}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm font-semibold mb-1 text-gray-700">Subscription</div>
              <Tag color="blue">{userProfile.subscription}</Tag>
            </div>
            <div className="mb-4">
              <div className="text-sm font-semibold mb-1 text-gray-700">Billing Cycle</div>
              <div className="text-xs text-gray-600">{userProfile.billingCycle}</div>
            </div>
            <div className="mb-4">
              <div className="text-sm font-semibold mb-1 text-gray-700">Next Billing Date</div>
              <div className="text-xs text-gray-600">{userProfile.nextBillingDate}</div>
            </div>
            {auraCryptTrialActive && (
              <div className="mb-4 p-4 bg-blue-100 rounded-lg">
                <div className="text-sm font-semibold mb-1 text-blue-700">AuraCrypt Trial</div>
                <div className="text-2xl font-bold text-blue-800">
                  {Math.floor(auraCryptTrialTimeLeft / 3600)}h {Math.floor((auraCryptTrialTimeLeft % 3600) / 60)}m {auraCryptTrialTimeLeft % 60}s
                </div>
              </div>
            )}
            {userProfile.expirationDate && (
              <div className="mb-4">
                <div className="text-sm font-semibold mb-1 text-gray-700">Expiration Date</div>
                <div className="text-xs text-gray-600">{userProfile.expirationDate}</div>
              </div>
            )}
            <div className="mt-auto space-y-2">
              <Button variant="outline" className="w-full" onClick={handleAccountSettingsClick}>
                <SettingOutlined className="mr-2" />
                Account Settings
              </Button>
              <Button variant="outline" className="w-full">
                <LineChartOutlined className="mr-2" />
                Usage Statistics
              </Button>
              <Button variant="outline" className="w-full">
                <GiftOutlined className="mr-2" />
                Refer a Friend
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setShowLicenseKeyModal(true)}>
                <KeyOutlined className="mr-2" />
                License Keys
              </Button>
            </div>
          </div>

          <div className="flex-grow flex flex-col">
            <div className="bg-white p-2 flex items-center justify-between">
              <Tabs
                type="editable-card"
                onChange={setActiveKey}
                activeKey={activeKey}
                onEdit={handleTabsEdit}
                className="flex-grow"
              >
                {tabs.filter(tab => !hiddenTabs[tab.key]).map(tab => (
                  <TabPane
                    key={tab.key}
                    tab={
                      <div
                        onContextMenu={(e) => handleTabContextMenu(e, tab.key)}
                        className="flex items-center"
                      >
                        {editingKey === tab.key ? (
                          <Input
                            size="small"
                            defaultValue={tab.title}
                            onBlur={(e) => handleTabTitleChange(tab.key, e.target.value)}
                            onPressEnter={(e) => handleTabTitleChange(tab.key, e.target.value)}
                            autoFocus
                          />
                        ) : (
                          <span onDoubleClick={() => handleEditTab(tab.key)}>{tab.title}</span>
                        )}
                      </div>
                    }
                    closable={tabs.length > 1}
                  >
                    <div className="h-full relative" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                      <Editor
                        height="calc(100vh - 150px)"
                        defaultLanguage="plaintext"
                        value={tab.content}
                        onChange={(value) => handleEditorChange(value)}
                        onMount={(editor) => {
                          editorRef.current = editor
                          editor.onDidChangeCursorSelection(handleSelectionChange)
                        }}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          wordWrap: 'on',
                        }}
                      />
                      {isDraggingFile && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center">
                          <div className="text-white text-2xl font-bold">Drop files here</div>
                        </div>
                      )}
                      <div className="absolute bottom-4 right-4 flex space-x-2">
                        <motion.div
                          className="bg-white rounded-full p-2 shadow-lg cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => checkAIScore(tab.content, tab.title)}
                        >
                          <div 
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                              tab.aiPercentage >= 80 ? 'bg-red-500' :
                              tab.aiPercentage >= 50 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{
                              animation: tab.aiPercentage ? 'pulse 2s infinite' : 'none'
                            }}
                          >
                            {tab.aiPercentage || 0}%
                          </div>
                        </motion.div>
                        <motion.div
                          className="bg-white rounded-full p-2 shadow-lg cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {tab.wordCount || 0}
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </TabPane>
                ))}
              </Tabs>
              <div className="flex items-center space-x-2 ml-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" onClick={handleTopButtonsToggle}>
                      {topButtonsVisible ? <EyeInvisibleOutlined /> : <SearchOutlined />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{topButtonsVisible ? "Hide Top Buttons" : "Show Top Buttons"}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" onClick={handleShowAllTabs}>
                      <FileOutlined />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Show All Tabs</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" onClick={handleAIPanelToggle}>
                      <BarChartOutlined />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle AI Panel</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex-grow relative">
              {tabs.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <FileTextOutlined className="text-6xl text-gray-300 mb-4" />
                    <p className="text-xl text-gray-500">No tabs open. Create a new tab to get started!</p>
                    <Button onClick={handleAddTab} className="mt-4">Create New Tab</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-64 bg-white shadow-md flex flex-col border-l border-gray-200 border-dashed">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Uploaded Files</h3>
              <div className="flex justify-between items-center">
                <Button size="sm" onClick={handleClearUploadedFiles}>
                  Clear All
                </Button>
              </div>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
              {uploadedFiles.length === 0 ? (
                <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
                  <InboxOutlined className="text-4xl mb-2" />
                  <p>Nothing to show</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileOutlined className="mr-2" />
                        <span>{file.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setUploadedFiles(files => files.filter((_, i) => i !== index))
                        }}
                      >
                        <CloseOutlined />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <footer className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="font-semibold">Status:</span> {isLoading ? 'Processing...' : 'Ready'}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Mode:</span> {useAuraCrypt ? 'AuraCrypt' : 'Standard'}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleFileInputChange}
              multiple
            />
            <div className="text-sm italic">{currentMessage}</div>
          </div>
        </footer>
        <Modal
          title="Confirm Action"
          open={isConfirmModalVisible}
          onOk={handleConfirmRemoveLastTab}
          onCancel={handleCancelRemoveLastTab}
        >
          <p>Are you sure you want to close the last tab? This will clear all content.</p>
        </Modal>
        {contextMenu.visible && (
          <div
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              zIndex: 1000,
            }}
            className="bg-white shadow-md rounded-md overflow-hidden"
          >
            <ul className="py-2">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleHideTab(contextMenu.tabKey)}
              >
                Hide Tab
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  handleRemoveTab(contextMenu.tabKey)
                  handleCloseContextMenu()
                }}
              >
                Close Tab
              </li>
            </ul>
          </div>
        )}
        <Modal
          title="AI Review Panel"
          open={showAIReviewPanel}
          onCancel={() => setShowAIReviewPanel(false)}
          footer={null}
          width={800}
        >
          <div className="space-y-4">
            {aiReviewPanelContent.map((item, index) => (
              <Card key={index}>
                <h4 className="font-semibold mb-2">{item.name}</h4>
                <p className="text-sm mb-2">AI Score: {item.score}%</p>
                <p className="text-xs text-gray-500">{item.content.substring(0, 200)}...</p>
              </Card>
            ))}
          </div>
        </Modal>
        {showReplacementStats && (
          <Modal
            title="Replacement Statistics"
            open={showReplacementStats}
            onOk={() => setShowReplacementStats(false)}
            onCancel={() => setShowReplacementStats(false)}
          >
            <p>Characters replaced: {replacementStats.replacedCount}</p>
            <p>Original length: {replacementStats.oldLength}</p>
            <p>New length: {replacementStats.newLength}</p>
          </Modal>
        )}
        <Modal
          title="Manage License Keys"
          open={showLicenseKeyModal}
          onCancel={() => setShowLicenseKeyModal(false)}
          footer={[
            <Button key="back" onClick={() => setShowLicenseKeyModal(false)}>
              Close
            </Button>,
          ]}
        >
          <List
            dataSource={licenseKeys}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Tag color={item.status === 'Active' ? 'green' : 'red'}>{item.status}</Tag>
                ]}
              >
                {item.key}
              </List.Item>
            )}
          />
          <Divider />
          <Form layout="inline" onFinish={handleLicenseKeySubmit}>
            <Form.Item>
              <Input
                placeholder="Enter license key"
                value={licenseKeyInput}
                onChange={(e) => setLicenseKeyInput(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Key
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        {selectionMenuVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: selectionMenuPosition.y,
              left: selectionMenuPosition.x,
              zIndex: 1000,
            }}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div className="flex space-x-1 p-1">
              <Button size="sm" onClick={() => handleSelectionAction('uppercase')}>
                <span className="sr-only">Uppercase</span>
                AA
              </Button>
              <Button size="sm" onClick={() => handleSelectionAction('lowercase')}>
                <span className="sr-only">Lowercase</span>
                aa
              </Button>
              <Button size="sm" onClick={() => handleSelectionAction('capitalize')}>
                <span className="sr-only">Capitalize</span>
                Aa
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleSelectionAction('remove')}>
                <DeleteOutlined />
                <span className="sr-only">Remove</span>
              </Button>
              <Button size="sm" onClick={() => handleSelectionAction('cut')}>
                <ScissorOutlined />
                <span className="sr-only">Cut</span>
              </Button>
              <Button size="sm" onClick={() => handleSelectionAction('copy')}>
                <CopyOutlined />
                <span className="sr-only">Copy</span>
              </Button>
              <Button size="sm" onClick={() => handleSelectionAction('newTab')}>
                <FileAddOutlined />
                <span className="sr-only">Open in New Tab</span>
              </Button>
              <Button size="sm" onClick={() => handleSelectionAction('checkAI')}>
                <SearchOutlined />
                <span className="sr-only">Check AI Score</span>
              </Button>
            </div>
          </motion.div>
        )}
        <Modal
          title="Extend AuraCrypt Time"
          open={showExtendTimeModal}
          onCancel={() => setShowExtendTimeModal(false)}
          footer={null}
        >
          <div className="space-y-4">
            <p>Choose the number of hours you want to extend your AuraCrypt time:</p>
            {[1, 2, 5, 10].map((hours) => (
              <Button
                key={hours}
                onClick={() => handlePurchaseTime(hours)}
                block
                className="text-left"
              >
                {hours} hour{hours > 1 ? 's' : ''} - ${hours * 0.99}
              </Button>
            ))}
          </div>
        </Modal>
        {auraCryptTrialActive && auraCryptTrialTimeLeft <= 300 && (
          <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md">
            <div className="flex">
              <div className="py-1">
                <svg className="h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">AuraCrypt Trial Ending Soon!</p>
                <p className="text-sm">Your trial will expire in {Math.floor(auraCryptTrialTimeLeft / 60)}:{(auraCryptTrialTimeLeft % 60).toString().padStart(2, '0')}.</p>
                <Button size="sm" onClick={handleExtendTime} className="mt-2">
                  Extend Time
                </Button>
              </div>
            </div>
          </div>
        )}
        <Modal
          title="Account Settings"
          open={showAccountSettings}
          onCancel={() => setShowAccountSettings(false)}
          footer={null}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input value={userProfile.name} onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))} />
            </Form.Item>
            <Form.Item label="Email">
              <Input value={userProfile.email} onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))} />
            </Form.Item>
            <Form.Item label="Subscription">
              <Input value={userProfile.subscription} disabled />
            </Form.Item>
            <Form.Item label="Billing Cycle">
              <Input value={userProfile.billingCycle} disabled />
            </Form.Item>
            <Form.Item label="Next Billing Date">
              <Input value={userProfile.nextBillingDate} disabled />
            </Form.Item>
            {userProfile.expirationDate && (
              <Form.Item label="Expiration Date">
                <Input value={userProfile.expirationDate} disabled />
              </Form.Item>
            )}
            <Form.Item label="AuraCrypt">
              <Switch
                checked={useAuraCrypt}
                onCheckedChange={handleAuraCryptToggle}
                className="mr-2"
              />
              <Label htmlFor="auraCrypt-mode">Enable AuraCrypt</Label>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => {
                message.success('Account settings updated successfully!')
                setShowAccountSettings(false)
              }}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </TooltipProvider>
  )
}