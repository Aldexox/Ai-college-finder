import React, { useEffect, useState } from 'react';
import { AuthForm } from '../components/AuthForm';
import { Sparkles, Brain, MessageSquare, Award, TrendingUp, Shield, CheckCircle, ChevronDown } from 'lucide-react';

interface LandingPageProps {
  onAuthSuccess: () => void;
}

const rotatingCards = [
  [
    { text: 'Your education shapes your future.', author: 'Nelson Mandela' },
    {
      text: 'Education is the most powerful weapon to change the world.',
      author: 'Nelson Mandela',
    },
    { text: 'Success is not final and failure is not fatal.', author: 'Winston Churchill' },
  ],
  [
    {
      text: 'The beautiful thing about learning is nobody can take it away from you.',
      author: 'B.B. King',
    },
    { text: "Dreams don't work unless you do.", author: 'John C. Maxwell' },
    { text: 'Small progress each day adds up to big results.', author: 'Satya Nani' },
  ],
  [
    { text: 'Choose a path that matches your strengths and your curiosity.', author: 'CollegeGuide' },
    { text: 'Good decisions are made with both data and vision.', author: 'CollegeGuide' },
    { text: 'Your first step can shape your entire career journey.', author: 'CollegeGuide' },
  ],
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Engineering Student at IIT Delhi',
    text: 'CollegeGuide helped me find the perfect college based on my marks and interests. The AI recommendations were spot-on!',
    image: '👩‍🎓',
    rating: 5,
  },
  {
    name: 'Arjun Kumar',
    role: 'Commerce Student at Delhi University',
    text: 'The chatbot answered all my questions about placements and fees. Highly recommended for college selection!',
    image: '👨‍🎓',
    rating: 5,
  },
  {
    name: 'Anjali Gupta',
    role: 'Medical Student at AIIMS Delhi',
    text: 'I compared multiple colleges easily and saved my favorites. Made my decision-making process so much simpler!',
    image: '👩‍⚕️',
    rating: 5,
  },
];

const steps = [
  {
    step: 1,
    title: 'Complete Your Profile',
    description: 'Enter your marks, interests, and career goals to help us understand you better.',
    icon: '📝',
  },
  {
    step: 2,
    title: 'Get AI Recommendations',
    description: 'Our AI analyzes your profile and suggests colleges that match your profile perfectly.',
    icon: '🤖',
  },
  {
    step: 3,
    title: 'Chat with Bot',
    description: 'Ask anything about colleges - placements, fees, courses, campus life, and more.',
    icon: '💬',
  },
  {
    step: 4,
    title: 'Compare & Decide',
    description: 'Compare colleges side-by-side, save favorites, and make your final decision with confidence.',
    icon: '✨',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onAuthSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [activeSlides, setActiveSlides] = useState([0, 0, 0]);
  const [isAnimating, setIsAnimating] = useState([true, true, true]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIsAnimating([false, false, false]);

      window.setTimeout(() => {
        setActiveSlides((current) =>
          current.map((value, index) => (value + 1) % rotatingCards[index].length),
        );
        setIsAnimating([true, true, true]);
      }, 180);
    }, 3400);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-shell min-h-screen overflow-hidden text-slate-100">
      {/* Animated Background */}
      <div className="landing-aurora landing-aurora-one" />
      <div className="landing-aurora landing-aurora-two" />
      <div className="landing-grid" />
      <div className="animated-blob blob-1" />
      <div className="animated-blob blob-2" />

      {/* Floating Particles */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{ '--delay': `${i * 0.1}s` } as any} />
        ))}
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-400/10 px-4 py-2 mb-6 animate-fade-in">
              <Sparkles size={18} className="text-emerald-300" />
              <span className="text-sm font-semibold text-emerald-200">AI Powered Career Discovery</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6 animate-fade-in-delayed">
              Find Your Perfect College
            </h1>
            
            <p className="text-xl md:text-2xl text-emerald-100 mb-4 animate-fade-in-delayed-2">
              Personalized Recommendations Powered by AI
            </p>
            
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in-delayed-3">
              Get smart college matches based on your marks, interests, and career goals. Chat with our AI assistant for instant answers. Compare, save, and make informed decisions.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center mb-12 animate-fade-in-delayed-3">
              <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105">
                Start Your Journey Now
              </button>
              <button className="px-8 py-4 border-2 border-emerald-300/50 text-emerald-300 font-bold rounded-lg hover:bg-emerald-300/10 transition-all duration-300">
                Learn More
              </button>
            </div>

            <div className="flex justify-center gap-8 text-sm md:text-base text-slate-400 animate-fade-in-delayed">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-emerald-400" />
                <span>100+ Colleges</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-emerald-400" />
                <span>Free to Use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-emerald-400" />
                <span>AI Powered</span>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center animate-bounce">
            <ChevronDown size={32} className="text-emerald-400" />
          </div>
        </div>

        {/* Key Features Section */}
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text">
            Powerful Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Brain size={32} className="text-emerald-400" />,
                title: 'Smart AI Matching',
                description: 'Advanced algorithms match you with colleges based on your profile',
              },
              {
                icon: <MessageSquare size={32} className="text-blue-400" />,
                title: 'AI Chatbot',
                description: 'Get instant answers about placements, fees, courses & campus life',
              },
              {
                icon: <Award size={32} className="text-purple-400" />,
                title: 'Top Colleges',
                description: 'Access to 100+ top-ranked Indian colleges with complete data',
              },
              {
                icon: <TrendingUp size={32} className="text-pink-400" />,
                title: 'Compare & Analyze',
                description: 'Side-by-side college comparison with detailed analytics',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl border border-emerald-300/25 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 hover:border-emerald-300/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/30"
              >
                <div className="mb-4 p-3 rounded-lg bg-slate-800/50 group-hover:bg-slate-700/50 w-fit transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-2">{feature.title}</h3>
                <p className="text-slate-400 group-hover:text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </div>
                
                {/* Connecting Line */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-400/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-3xl border border-emerald-300/30 bg-slate-950/70 p-8 md:p-12 shadow-2xl backdrop-blur-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5" />
            
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '100+', label: 'Top Colleges', icon: '🎓' },
                { number: '50+', label: 'Courses', icon: '📚' },
                { number: '₹99L', label: 'Highest Package', icon: '💰' },
                { number: '99%', label: 'Placement Rate', icon: '📈' },
              ].map((stat, idx) => (
                <div key={idx} className="group">
                  <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">{stat.icon}</div>
                  <p className="text-3xl md:text-4xl font-bold text-emerald-400 mb-1">{stat.number}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rotating Insights Section */}
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text">
            Student Success Stories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rotatingCards.map((cardItems, idx) => {
              const activeItem = cardItems[activeSlides[idx]];

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-emerald-300/25 bg-slate-900/50 backdrop-blur-sm p-8 min-h-32 flex flex-col justify-center hover:border-emerald-300/50 hover:bg-slate-800/50 transition-all duration-300"
                >
                  <div className={isAnimating[idx] ? 'slide-content-enter' : 'slide-content-exit'}>
                    <p className="mb-4 text-lg italic text-slate-200">"{activeItem.text}"</p>
                    <p className="text-sm font-semibold text-emerald-300">— {activeItem.author}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text">
            What Students Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-emerald-300/25 bg-slate-900/50 backdrop-blur-sm p-8 hover:border-emerald-300/50 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-emerald-900/30"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <h3 className="font-bold text-slate-100">{testimonial.name}</h3>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                
                <p className="text-slate-300">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Form Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-3xl border border-emerald-300/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-8 md:p-12 shadow-2xl backdrop-blur-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5" />
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">Get Started Today</h2>
                <p className="text-slate-400">Join thousands of students finding their perfect college</p>
              </div>

              <div className="max-w-md mx-auto">
                <AuthForm isSignup={isSignup} onSuccess={onAuthSuccess} />

                <div className="mt-6 text-center">
                  <p className="text-slate-300">
                    {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                      onClick={() => setIsSignup(!isSignup)}
                      className="font-bold text-emerald-300 hover:text-emerald-200 transition-colors"
                    >
                      {isSignup ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="container mx-auto px-4 py-12 border-t border-slate-800/50 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-slate-100 mb-4">CollegeGuide</h3>
              <p className="text-slate-400 text-sm">AI-powered college recommendation platform for Indian students.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-100 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-emerald-300 cursor-pointer">Browse Colleges</li>
                <li className="hover:text-emerald-300 cursor-pointer">AI Chatbot</li>
                <li className="hover:text-emerald-300 cursor-pointer">Compare</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-100 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-emerald-300 cursor-pointer">About Us</li>
                <li className="hover:text-emerald-300 cursor-pointer">Blog</li>
                <li className="hover:text-emerald-300 cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-100 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-emerald-300 cursor-pointer">Privacy</li>
                <li className="hover:text-emerald-300 cursor-pointer">Terms</li>
                <li className="hover:text-emerald-300 cursor-pointer">Security</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">© 2024 CollegeGuide. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <span className="text-slate-400 hover:text-emerald-300 cursor-pointer">Twitter</span>
              <span className="text-slate-400 hover:text-emerald-300 cursor-pointer">LinkedIn</span>
              <span className="text-slate-400 hover:text-emerald-300 cursor-pointer">GitHub</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
