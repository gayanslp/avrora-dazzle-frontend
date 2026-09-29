import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, Mail } from 'lucide-react'
import { toast } from 'react-toastify'
import axiosInstance from '../api/axiosInstance'
import { mergeCartApi } from '../api/cartApi'
const OTP_LENGTH = 6

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const redirect = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [step, setStep] = useState('email')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const otpValue = useMemo(() => otp.join(''), [otp])

  const handleEmailSubmit = async (event) => {
    event.preventDefault()

    const trimmedEmail = email.trim()
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)

    if (!isValidEmail) {
      const errorMessage = 'Please enter a valid email address.'
      setMessage(errorMessage)
      toast.error(errorMessage)
      return
    }

    setIsSubmitting(true)
    setMessage('Sending OTP...')

    try {
      const response = await axiosInstance.post('/auth/send-otp', {
        email: trimmedEmail,
      })

      const data = response?.data

      if (data?.success) {
        setStep('otp')
        setOtp(Array(OTP_LENGTH).fill(''))
        setMessage(data?.message || 'OTP sent successfully! Please check your email (Inbox & Spam).')
        toast.success(data?.message || 'OTP sent successfully! Please check your email.')
      } else {
        const errorMessage = data?.message || 'Failed to send OTP. Please try again.'
        setMessage(errorMessage)
        toast.error(errorMessage)
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        'Unable to send OTP right now. Please try again.'

      setMessage(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpChange = (index, value) => {
    const sanitizedValue = value.replace(/\D/g, '').slice(-1)

    if (!sanitizedValue && otp[index] === '') return

    const newOtp = [...otp]
    newOtp[index] = sanitizedValue
    setOtp(newOtp)

    if (sanitizedValue && index < OTP_LENGTH - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleOtpSubmit = async (event) => {
    event.preventDefault()

    const finalOtp = otp.join('')

    if (finalOtp.length !== OTP_LENGTH) {
      const errorMessage = 'Please enter the full 6-digit OTP.'
      setMessage(errorMessage)
      toast.error(errorMessage)
      return
    }

    setIsSubmitting(true)
    setMessage('Verifying OTP...')

    try {
      const response = await axiosInstance.post('/auth/verify-otp', {
        email,
        otp: finalOtp,
      })

      const data = response?.data

      if (data?.success) {
        const successMessage = data?.message || 'Login successful!'
        const token = data?.token
        const user = data?.user




        if (token) {
          localStorage.setItem('token', token)

          // Merge guest cart if exists
          try {
            const localCart = localStorage.getItem('avora_cart');
            if (localCart) {
              const parsed = JSON.parse(localCart);
              if (Array.isArray(parsed) && parsed.length > 0) {
                // Map to required structure
                const itemsToMerge = parsed.map(item => ({
                  product: item.productId || item.id,
                  qty: item.quantity || item.qty || 1,
                  size: item.size || 'Standard',
                  color: item.color || 'Standard'
                }));
                await mergeCartApi(itemsToMerge);
              }
              localStorage.removeItem('avora_cart');
            }
          } catch (err) {
            console.error('Cart merge failed', err);
          }

          window.dispatchEvent(new Event('storage'))
        }

        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
        }

        setMessage(successMessage)
        toast.success(successMessage)
        navigate(redirect, { replace: true })
      } else {
        const errorMessage = data?.message || 'Invalid OTP. Please try again.'
        setMessage(errorMessage)
        toast.error(errorMessage)
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        'OTP verification failed. Please try again.'

      setMessage(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    setStep('email')
    setOtp(Array(OTP_LENGTH).fill(''))
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12 text-slate-900 sm:px-6 lg:px-8 font-sans">
      <div className="mb-8 text-center cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
        <h1 className="text-3xl tracking-tight text-slate-900 whitespace-nowrap">
          <span className="font-extrabold">AVRORA </span>
          <span className="font-thin -ml-2"> DAZZLE</span>
        </h1>
      </div>
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold tracking-widest text-slate-900 uppercase">
            {step === 'email' ? 'Sign In' : 'Verify OTP'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {step === 'email' ? 'Enter your email to continue securely.' : 'Enter the code sent to your email.'}
          </p>
        </div>

            <div className="overflow-hidden">
              <div
                className={`transition-all duration-300 ${step === 'email' ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 absolute -left-[9999px]'
                  }`}
              >
                <form onSubmit={handleEmailSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-base text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-4 text-xs tracking-widest uppercase font-bold text-white transition-all duration-300 hover:shadow-lg hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                    {!isSubmitting && <ArrowRight size={18} />}
                  </button>
                </form>
              </div>

              <div
                className={`transition-all duration-300 ${step === 'otp' ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0 absolute -left-[9999px]'
                  }`}
              >
                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Enter OTP sent to {email}
                    </label>
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(event) => handleOtpChange(index, event.target.value)}
                          onKeyDown={(event) => handleOtpKeyDown(index, event)}
                          className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 text-center text-lg font-semibold text-slate-900 outline-none transition-all duration-200 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-4 text-xs tracking-widest uppercase font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-4 text-xs tracking-widest uppercase font-bold text-white transition-all duration-300 hover:shadow-lg hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                      {!isSubmitting && <ArrowRight size={18} />}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {message && (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 text-center">
                {message}
              </div>
            )}

            <p className="mt-6 text-center text-sm text-slate-500">
              Need help?{' '}
              <a href="mailto:support@avrora.com" className="font-semibold text-cyan-600 hover:text-cyan-500">
                Contact support
              </a>
            </p>
      </div>
    </div>
  )
}

export default Login