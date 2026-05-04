import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const { signup, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    const result = await signup(form.name, form.email, form.password)
    if (result.success) {
      toast.success('Account created!')
      navigate('/')
    } else {
      toast.error(result.message)
    }
  }

  const Field = ({ id, label, icon: Icon, ...props }) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input id={id} value={form[id]} onChange={e => setForm(prev => ({ ...prev, [id]: e.target.value }))} required className="input-field pl-9" {...props} />
      </div>
    </div>
  )

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <h1 className="text-2xl font-bold">Create account</h1>
            <p className="text-gray-400 text-sm mt-1">Join Braid and start shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field id="name" label="Full Name" icon={User} placeholder="John Doe" />
            <Field id="email" label="Email" icon={Mail} type="email" placeholder="you@example.com" />
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" required className="input-field pl-9 pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} placeholder="Repeat password" required className="input-field pl-9" />
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" required className="accent-primary mt-0.5" />
              <span className="text-gray-500">I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a></span>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? <Spinner size="sm" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
