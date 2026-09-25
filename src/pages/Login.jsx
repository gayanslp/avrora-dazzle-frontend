import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { toast } from 'react-toastify'
import axiosInstance from '../api/axiosInstance'

const OTP_LENGTH = 6

const Login = () => {
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
        setMessage('OTP sent successfully! Please check your email.')
        toast.success('OTP sent successfully! Please check your email.')
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
        setMessage(successMessage)
        toast.success(successMessage)
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.20),_transparent_35%),linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_45%,_#fdf2f8_100%)] px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden overflow-hidden bg-slate-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.45),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.35),_transparent_30%)]" />

          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-100 backdrop-blur-sm">
              <Sparkles size={14} className="text-cyan-300" />
              Avrora Dazzle
            </div>

            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Secure Access</p>
              <h1 className="max-w-md text-4xl font-semibold leading-tight text-white">
                Welcome back to your premium shopping experience.
              </h1>
              <p className="max-w-md text-base text-slate-300">
                Sign in with your email to receive a one-time passcode and continue securely.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            {[
              'Fast and secure OTP verification',
              'Protected account access',
              'Exclusive deals and order tracking',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-600">Login</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {step === 'email' ? 'Continue' : 'Verify OTP'}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 shadow-sm">
                <ShieldCheck size={22} />
              </div>
            </div>

            <div className="overflow-hidden">
              <div
                className={`transition-all duration-300 ${
                  step === 'email' ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 absolute -left-[9999px]'
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
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-base text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                    {!isSubmitting && <ArrowRight size={18} />}
                  </button>
                </form>
              </div>

              <div
                className={`transition-all duration-300 ${
                  step === 'otp' ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0 absolute -left-[9999px]'
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
                          className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 text-center text-lg font-semibold text-slate-800 outline-none transition-all duration-200 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                      {!isSubmitting && <ArrowRight size={18} />}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {message || 'We will send a one-time password to your email for secure login.'}
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              Need help?{' '}
              <a href="mailto:support@avrora.com" className="font-semibold text-sky-600 hover:text-sky-500">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login