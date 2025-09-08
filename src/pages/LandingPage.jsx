import { useNavigate, useLocation } from 'react-router-dom'
import { FaHospital, FaUserShield } from 'react-icons/fa'

// Define reusable styles
const cardBase =
  'relative bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border border-white/20 overflow-hidden'
const btnBase =
  'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:-translate-y-0.5'
const btnTeal = `${btnBase} bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 focus:ring-teal-500 shadow-md hover:shadow-lg`

const LandingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const userRole = location.state?.role || localStorage.getItem('userRole') || 'user'

  // Determine if user has admin access
  const isAdmin = ['admin', 'super_admin'].includes(userRole)

  // Handle card navigation
  const handleNavigation = (path) => {
    navigate(path, { state: { role: userRole } })
  }

  // Floating particle for background
  const Particle = ({ style }) => (
    <div className="absolute rounded-full opacity-20 animate-float" style={style} />
  )

  // Decorative SVGs
  const HeartbeatLine = () => (
    <svg className="absolute inset-x-0 -bottom-2 h-24 w-full opacity-20" viewBox="0 0 600 120" preserveAspectRatio="none">
      <path
        d="M0 60 Q 50 40 100 60 T 200 60 L 230 60 240 30 255 90 270 45 285 75 300 60 350 60 T 450 60 L 470 60 480 30 495 95 510 40 525 80 540 60 T 600 60"
        fill="none"
        stroke="currentColor"
        className="text-teal-500 animate-heartbeat"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  const Stethoscope = () => (
    <svg viewBox="0 0 64 64" className="h-24 w-24 text-teal-500/80 animate-stetho">
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 6 v10 a10 10 0 0 0 20 0 V6"/>
        <path d="M30 26 a14 14 0 1 0 14 14 v-6"/>
        <circle cx="48" cy="34" r="6"/>
      </g>
    </svg>
  )

  const GraduationCap = () => (
    <svg viewBox="0 0 64 64" className="h-24 w-24 text-blue-600/80 animate-cap">
      <g fill="currentColor">
        <path d="M32 8L4 20l28 12 28-12-28-12z"/>
        <path d="M10 28v8c0 6.6 10.7 12 22 12s22-5.4 22-12v-8l-22 10-22-10z"/>
        <rect x="30.5" y="40" width="3" height="10" rx="1.5" className="fill-blue-500"/>
      </g>
    </svg>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-100 to-indigo-100 relative overflow-hidden">
      {/* Subtle grid backdrop */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%224%22 fill=%22%230e7490%22/%3E%3C/svg%3E')] bg-repeat bg-[length:100px_100px]"></div>

      {/* Floating particles */}
      <Particle style={{ top: '15%', left: '10%', width: '40px', height: '40px', backgroundColor: '#0e7490', animationDuration: '15s' }} />
      <Particle style={{ top: '55%', left: '5%', width: '20px', height: '20px', backgroundColor: '#0d9488', animationDuration: '12s', animationDelay: '1s' }} />
      <Particle style={{ top: '25%', right: '15%', width: '30px', height: '30px', backgroundColor: '#0369a1', animationDuration: '18s', animationDelay: '2s' }} />
      <Particle style={{ bottom: '15%', right: '10%', width: '25px', height: '25px', backgroundColor: '#1d4ed8', animationDuration: '14s', animationDelay: '3s' }} />

      {/* Animated waves */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-teal-200/40 to-transparent" />

      {/* Glow orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-teal-600 to-blue-700 bg-clip-text text-transparent drop-shadow-sm">Welcome to Vaidhya Narayan</span>
          </h1>
          <p className="text-gray-600 text-lg">Select a module to proceed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Medical Management Card */}
          <div className={`${cardBase} group`}>            
            {/* Decorative stethoscope + heartbeat */}
            <div className="absolute -top-6 -left-6 opacity-30">
              <Stethoscope />
            </div>
            <HeartbeatLine />

            {/* Soft gradient ring on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-200/0 via-transparent to-transparent group-hover:from-teal-200/30 transition-colors" />

            <div className="flex flex-col items-center text-center relative">
              <div className="bg-teal-50 p-4 rounded-2xl mb-4 shadow-inner ring-1 ring-teal-200/40">
                <FaHospital className="text-4xl text-teal-600 drop-shadow-sm" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Medical College Management</h2>
              <p className="text-gray-600 text-sm mb-4 max-w-md">
                Oversee student records, faculty, curriculum, and hospital training programs seamlessly.
              </p>
              <button onClick={() => handleNavigation('/college')} className={btnTeal}>
                Access Medical College Management
              </button>

              {/* Tiny pulse badge */}
              <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-teal-500 animate-ping" />
            </div>
          </div>

          {/* Vaidhya Narayan Admin Card */}
          {isAdmin && (
            <div className={`${cardBase} group`}>              
              {/* Decorative graduation cap for Admin (represents governance/academics) */}
              <div className="absolute -top-5 -right-4 opacity-25">
                <GraduationCap />
              </div>

              <div className="absolute top-4 right-4 bg-blue-100 text-blue-600 p-2 rounded-full shadow-sm">
                <FaUserShield className="text-xl" />
              </div>
              <div className="flex flex-col items-center text-center relative">
                <div className="bg-blue-50 p-4 rounded-2xl mb-4 shadow-inner ring-1 ring-blue-200/40">
                  <FaUserShield className="text-4xl text-blue-600 drop-shadow-sm" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Vaidhya Narayan Admin</h2>
                <p className="text-gray-600 text-sm mb-4 max-w-md">
                  Administer system settings, user roles, and advanced configurations.
                </p>
                <button
                  onClick={() => handleNavigation('/admin')}
                  className={`${btnBase} bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg`}
                >
                  Access Admin Portal
                </button>

                {/* Shimmer underline on hover */}
                <span className="mt-3 h-0.5 w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-shimmer" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        .animate-float { animation: float 10s ease-in-out infinite; }

        @keyframes heartbeat {
          0%, 100% { stroke-dashoffset: 0; }
          50% { stroke-dashoffset: 30; }
        }
        .animate-heartbeat { stroke-dasharray: 10 6; animation: heartbeat 2.5s ease-in-out infinite; }

        @keyframes stetho {
          0% { transform: rotate(-6deg) translateY(0); }
          50% { transform: rotate(6deg) translateY(-3px); }
          100% { transform: rotate(-6deg) translateY(0); }
        }
        .animate-stetho { animation: stetho 6s ease-in-out infinite; transform-origin: 32px 32px; }

        @keyframes capBob {
          0% { transform: translateY(0) rotate(-4deg); }
          50% { transform: translateY(-6px) rotate(4deg); }
          100% { transform: translateY(0) rotate(-4deg); }
        }
        .animate-cap { animation: capBob 7s ease-in-out infinite; transform-origin: 32px 20px; }

        @keyframes shimmer {
          0% { transform: translateX(-100%); opacity: .1; }
          50% { opacity: .4; }
          100% { transform: translateX(100%); opacity: .1; }
        }
        .animate-shimmer { position: relative; overflow: hidden; }
        .animate-shimmer::before {
          content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(59,130,246,.35), transparent); animation: shimmer 2.8s linear infinite; }
      `}</style>
    </div>
  )
}

export default LandingPage
