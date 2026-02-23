import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Code, Trophy, Users, Target, ChevronRight, Cpu, Database, Lock, MessageSquare, Terminal, GitBranch, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ModernBackground from '../components/ModernBackground';
import ScrollReveal from '../components/ScrollReveal';
import InteractiveCard from '../components/InteractiveCard';
import ParallaxSection from '../components/ParallaxSection';
import FloatingElements from '../components/FloatingElements';
import { gsap } from 'gsap';

function Homepage() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const heroElements = heroRef.current?.children;
    if (heroElements) {
      gsap.fromTo(heroElements,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out' }
      );
    }

    const featureItems = featuresRef.current?.querySelectorAll('.grid > *');
    if (featureItems && featureItems.length > 0) {
      gsap.fromTo(featureItems,
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.08, ease: 'power2.out', delay: 0.4 }
      );
    }
  }, []);

  const displayUserName = user?.firstName || 'Coder';

  const coreFeatures = [
    {
      icon: Code,
      title: 'Monaco Editor Integration',
      description: 'Write solutions in a premium browser editor featuring autocomplete, bracket matching, and standard themes.',
      color: 'border-slate-800'
    },
    {
      icon: Users,
      title: 'Real-Time Collaboration',
      description: 'Open collaborative rooms instantly. Write code, see cursor positions, and debug synchronously with team members.',
      color: 'border-slate-800'
    },
    {
      icon: Trophy,
      title: 'Coding Contests',
      description: 'Create and participate in custom timing contests. Climb scoreboard dashboards with instant execution results.',
      color: 'border-slate-800'
    },
    {
      icon: Terminal,
      title: 'Judge0 Execution',
      description: 'Compile solutions in C++, Java, or JavaScript on a high-availability code execution engine.',
      color: 'border-slate-800'
    },
    {
      icon: MessageSquare,
      title: 'Community Chat',
      description: 'Discuss algorithmic problems, share optimizations, and converse in the general lobby chatroom.',
      color: 'border-slate-800'
    },
    {
      icon: Cpu,
      title: 'AI Companion Assistant',
      description: 'Receive helpful hints, approach overviews, and time-complexity optimization recommendations on demand.',
      color: 'border-slate-800'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#060608] font-sans text-gray-200 relative overflow-hidden">
      <ModernBackground />
      <FloatingElements />
      <Navbar />

      <div className="relative z-10 flex flex-col flex-grow">
        
        {/* Main Hero Section */}
        <section className="relative pt-32 pb-24 px-6 min-h-[90vh] flex items-center">
          <ParallaxSection speed={0.2} className="w-full">
            <div ref={heroRef} className="max-w-5xl mx-auto text-center">
              
              <ScrollReveal direction="up" delay={200}>
                <div className="inline-flex items-center px-4 py-1.5 bg-[#141417] rounded-full border border-[#222226] mb-8 backdrop-blur-md">
                  <span className="text-xs font-semibold text-gray-400">
                    Collaborative Competitive Programming Arena
                  </span>
                </div>
              </ScrollReveal>
              
              <ScrollReveal direction="up" delay={300}>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                  Welcome back, <span className="text-gray-300 font-bold block mt-2 text-3xl md:text-5xl bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">{displayUserName}</span>
                </h1>
              </ScrollReveal>
              
              <ScrollReveal direction="up" delay={400}>
                <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                  Solve data structures & algorithms problems, create coding contests, chat with the community, and edit code collaboratively in real-time.
                </p>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={500}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <InteractiveCard glowColor="rgba(255, 255, 255, 0.15)">
                    <button
                      onClick={() => navigate('/Homepage/problems')}
                      className="group px-8 py-4 bg-white hover:bg-gray-100 text-black rounded-xl font-semibold text-base transition-all duration-300 flex items-center space-x-2"
                    >
                      <span>Explore DSA Problems</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </InteractiveCard>
                  
                  <InteractiveCard glowColor="rgba(255, 255, 255, 0.1)">
                    <button
                      onClick={() => navigate('/contests')}
                      className="group px-8 py-4 bg-[#141417] hover:bg-[#1c1c22] border border-[#222226] hover:border-[#33333b] text-white rounded-xl font-semibold text-base transition-all duration-300 flex items-center space-x-2"
                    >
                      <span>Join Live Contests</span>
                    </button>
                  </InteractiveCard>
                </div>
              </ScrollReveal>

            </div>
          </ParallaxSection>
        </section>

        {/* Features Showcase Section */}
        <section className="relative py-24 px-6 border-t border-[#141418] bg-[#09090b]/40 backdrop-blur-md">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal direction="up" delay={100}>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Core Engineering Capabilities
                </h2>
                <p className="text-base text-gray-400 max-w-2xl mx-auto">
                  A minimal, professional playground containing everything needed to review concepts, practice for interviews, and sync code with friends.
                </p>
              </div>
            </ScrollReveal>

            <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreFeatures.map((feature, index) => (
                <ScrollReveal key={feature.title} direction="scale" delay={index * 100}>
                  <InteractiveCard glowColor="rgba(255, 255, 255, 0.08)" className="h-full">
                    <div className="group p-8 bg-[#101012]/80 rounded-2xl border border-[#1e1e24] hover:border-[#32323c] transition-all duration-500 h-full flex flex-col">
                      <div className="w-12 h-12 bg-[#18181c] rounded-xl flex items-center justify-center mb-6 border border-[#26262e] group-hover:scale-105 transition-transform duration-300">
                        <feature.icon className="w-5 h-5 text-gray-300" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed flex-grow">
                        {feature.description}
                      </p>
                    </div>
                  </InteractiveCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Workspaces Section */}
        <section className="relative py-24 px-6 border-t border-[#141418]">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              
              <ScrollReveal direction="left" delay={200}>
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-white leading-tight">
                    Real-Time Synchronization Workspace
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Stuck on an algorithmic optimization? Generate a shared workspace link and invite your friends. You can code simultaneously with live remote cursors, active collaborator tags, and built-in chat synchronization.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>Preserves local cursor position and undo stack</span>
                    </li>
                    <li className="flex items-center space-x-3 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>Auto-saves editor state incrementally to DB</span>
                    </li>
                    <li className="flex items-center space-x-3 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>Synchronizes C++, Java, and JavaScript selections</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => navigate('/communitychat')}
                    className="inline-flex items-center text-sm font-semibold text-white hover:text-gray-300 group pt-2 transition-colors"
                  >
                    <span>Visit Community Chatroom</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={300}>
                <div className="bg-[#101012] border border-[#1e1e24] p-8 rounded-2xl shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-700 to-gray-500"></div>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1c1c22]">
                    <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-700"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-700"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-700"></div>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">collaborative_session.cpp</span>
                  </div>
                  <pre className="font-mono text-xs text-gray-400 space-y-1.5 overflow-x-auto select-none leading-relaxed">
                    <div><span className="text-gray-600">01</span> <span className="text-gray-500">#include</span> <span className="text-zinc-300">&lt;iostream&gt;</span></div>
                    <div><span className="text-gray-600">02</span> <span className="text-zinc-400">int</span> <span className="text-white font-medium">main</span>() &#123;</div>
                    <div><span className="text-gray-600">03</span>     <span className="text-gray-600">// Collaborators typing:</span></div>
                    <div><span className="text-gray-600">04</span>     std::cout &lt;&lt; <span className="text-zinc-300">"Code together!"</span>;</div>
                    <div><span className="text-gray-600">05</span>     <span className="text-zinc-400">return</span> <span className="text-zinc-300">0</span>;</div>
                    <div><span className="text-gray-600">06</span> &#125;</div>
                  </pre>
                  
                  {/* Cursor Indicator Simulation */}
                  <div className="absolute bottom-6 right-8 bg-[#1e1e24] border border-[#2e2e38] text-[10px] text-gray-300 px-2 py-0.5 rounded flex items-center space-x-1 shadow-md animate-pulse">
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                    <span>Alex is typing...</span>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}

export default Homepage;