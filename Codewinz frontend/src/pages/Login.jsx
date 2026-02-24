import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Mail, Lock, Sparkles, Shield, Zap, ArrowRight } from 'lucide-react';
import Googlelogin from '../components/Googlelogin';
import axiosClient from '../../utils/axiosClient';
import AuthBackground from '../components/AuthBackground';
import AnimatedButton from '../components/AnimatedButton';
import FloatingCard from '../components/FloatingCard';
import AnimatedInput from '../components/AnimatedInput';
import { loginUser } from '../../authSlice';
import { gsap } from 'gsap';

// The validation schema is still Zod, which is a JS library
const signupSchema = z.object({
  emailId: z.string().email('Invalid EmailId'),
  password: z.string().min(8, 'Password Should Contain atleast 8 characters'),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mailerror, setMailerror] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const cardRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    setIsVisible(true);
    // GSAP animations
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }
    );
    gsap.fromTo(logoRef.current,
      { scale: 0.8, rotate: -8, opacity: 0 },
      { scale: 1, rotate: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.7)', delay: 0.2 }
    );
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 }
    );
    
    // Animate form fields
    const formElements = formRef.current?.querySelectorAll('.space-y-6 > *');
    if (formElements && formElements.length > 0) {
      gsap.fromTo(formElements,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', delay: 0.6 }
      );
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const handleMailLogin = async (e) => {
    e.preventDefault();
    const data = e.target[0].value;
    try {
      setTimer(60);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 0) {
            clearInterval(interval);
            return 0;
          } else {
            return prev - 1;
          }
        });
      }, 1000);

      const res = await axiosClient.post('/user/mailLogin', { emailId: data });
      console.log(res);
    } catch (err) {
      console.log(err);
      setMailerror(err.response.data.message);
    }
  };

  return (
    <>
      <AuthBackground />
      <div className="min-h-screen flex items-center justify-center p-4 font-sans text-white relative overflow-hidden">
        {/* Floating elements (monochrome particles) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-20 left-20 w-2 h-2 bg-zinc-700 rounded-full animate-pulse opacity-60" />
          <div className="absolute top-40 right-32 w-1 h-1 bg-zinc-800 rounded-full animate-ping opacity-40" />
          <div className="absolute bottom-32 left-40 w-3 h-3 bg-zinc-700 rounded-full animate-bounce opacity-30" />
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-zinc-800 rounded-full animate-pulse opacity-50" />
        </div>

        <div ref={cardRef} className="w-full max-w-md z-20 relative">
          <FloatingCard>
            <div className="p-10 space-y-8">
              {/* Header */}
              <div className="text-center space-y-6">
                <div ref={logoRef} className="relative inline-block">
                  <div className="absolute inset-0 bg-zinc-800 rounded-full blur-xl opacity-30 animate-pulse" />
                  <img
                    src="/logo.png"
                    className="h-32 object-cover relative z-10 hover:scale-110 transition-transform duration-500"
                    alt="CodeWinz Logo"
                  />
                </div>
                
                <div ref={titleRef} className="space-y-3">
                  
                  <h1 className="text-4xl font-black bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                    Welcome Back
                  </h1>
                  <p className="text-zinc-500 text-md leading-relaxed">
                    Continue your journey to coding excellence
                  </p>
                </div>
              </div>

              <div ref={formRef} className="space-y-6">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <AnimatedInput
                    type="email"
                    placeholder="Enter your email"
                    register={register('emailId')}
                    error={errors.emailId?.message}
                    icon={<Mail size={20} />}
                  />

                  <AnimatedInput
                    type="password"
                    placeholder="Enter your password"
                    register={register('password')}
                    error={errors.password?.message}
                    showPasswordToggle={true}
                    icon={<Lock size={20} />}
                  />

                  <AnimatedButton
                    type="submit"
                    loading={loading}
                    disabled={loading}
                    variant="primary"
                    size="lg"
                    className="w-full group"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </AnimatedButton>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center animate-pulse">
                      {error}
                    </div>
                  )}
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#0e0e11] text-zinc-500 rounded-full">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Logins */}
                <div className="flex justify-center items-center gap-4">
                  <Googlelogin />
                  
                  <button
                    disabled={loading}
                    onClick={() => document.getElementById('my_modal_3').showModal()}
                    className="group relative p-4 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-zinc-800/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Mail className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors duration-300 relative z-10" />
                  </button>

                  {/* Enhanced Modal */}
                  <dialog id="my_modal_3" className="modal">
                    <div className="modal-box bg-[#0e0e11] border border-zinc-800 rounded-3xl">
                      <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-zinc-500 hover:text-white"
                        onClick={() => document.getElementById('my_modal_3').close()}
                      >
                        ✕
                      </button>

                      <div className="space-y-6 pt-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">Magic Link Login</h3>
                          <p className="text-zinc-500">Enter your registered email to receive a login link</p>
                        </div>

                        <form onSubmit={handleMailLogin} className="space-y-4">
                          <AnimatedInput
                            label="Email Address"
                            type="email"
                            placeholder="Enter your registered email"
                            register={{ required: true }}
                            icon={<Mail size={20} />}
                          />
                          
                          {mailerror && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                              {mailerror}
                            </div>
                          )}
                          
                          <AnimatedButton
                            type="submit"
                            disabled={timer > 0}
                            variant="primary"
                            size="lg"
                            className="w-full"
                          >
                            {timer === 0 ? 'Send Magic Link' : `Resend in ${timer}s`}
                          </AnimatedButton>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </div>
              </div>              {/* Sign Up Link */}
              <div className="text-center space-y-4 pt-4">
                <p className="text-zinc-500">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/signup')}
                    className="text-white hover:underline font-semibold transition-colors duration-300"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          </FloatingCard>
        </div>
      </div>
    </>
  );
}

export default Login;
