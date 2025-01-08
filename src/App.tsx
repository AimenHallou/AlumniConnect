import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Network, Briefcase, Users, Globe2, ArrowRight, ChevronRight } from 'lucide-react';
import OnboardingForm from './components/OnboardingForm';
import Feed from './pages/Feed';
import Directory from './pages/Directory';
import Messages from './pages/Messages';

function LogoSlider() {
  const logos = [
    { name: 'Meta', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png' },
    { name: 'NVIDIA', url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg' },
    { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Apple', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Airbnb', url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg' },
    { name: 'Tesla', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png' },
    { name: 'Starbucks', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png' },
    { name: 'Nike', url: 'https://cdn.freebiesupply.com/logos/large/2x/nike-4-logo-png-transparent.png' },
    { name: 'Samsung', url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  ];

  return (
    <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-white py-8">
      <div className="overflow-hidden">
        <div className="flex animate-slider">
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="min-w-[160px] h-16 mx-4 flex items-center justify-center transition-all duration-300"
            >
              <img
                src={logo.url}
                alt={`${logo.name} logo`}
                className="max-w-[120px] max-h-[32px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/feed" element={<Feed />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/home" element={<Navigate to="/feed" replace />} />
        <Route path="/" element={
          <div className="min-h-screen bg-white">
            {showOnboarding && <OnboardingForm onClose={() => setShowOnboarding(false)} />}
            
            {/* Hero Section */}
            <header className="bg-gradient-to-r from-green-800 to-green-900 text-white">
              <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Network className="h-8 w-8" />
                  <span className="text-xl font-bold">Alumni Connect</span>
                </div>
                <div className="hidden md:flex space-x-6">
                  <a href="#about" className="hover:text-green-200">About</a>
                  <button 
                    onClick={() => setShowOnboarding(true)}
                    className="bg-white text-green-800 px-4 py-2 rounded-lg font-semibold hover:bg-green-100 transition"
                  >
                    Join Network
                  </button>
                </div>
              </nav>

              <div className="container mx-auto px-6 py-24">
                <div className="max-w-3xl">
                  <h1 className="text-5xl font-bold mb-6">Connect, Grow, and Succeed with Marshall's Alumni Network</h1>
                  <p className="text-xl mb-8">Empowering the Herd to thrive together in a connected community.</p>
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => setShowOnboarding(true)}
                      className="bg-white text-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-green-100 transition flex items-center"
                    >
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                    <button className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>

              <LogoSlider />
            </header>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-50">
              <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-16">Why Join Our Network?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                    <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                      <Briefcase className="h-6 w-6 text-green-800" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Professional Growth</h3>
                    <p className="text-gray-600">Build industry connections and expand your network.</p>
                  </div>
                  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                    <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                      <Users className="h-6 w-6 text-green-800" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Alumni Collaboration</h3>
                    <p className="text-gray-600">Collaborate with peers to grow businesses or share opportunities.</p>
                  </div>
                  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                    <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                      <Globe2 className="h-6 w-6 text-green-800" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Global Network</h3>
                    <p className="text-gray-600">Join a worldwide community of Marshall graduates making an impact.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-800 to-green-900 text-white">
              <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-8">Ready to Join Our Growing Network?</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto">Connect with fellow alumni, find opportunities, and help shape the future of Marshall graduates.</p>
                <button 
                  onClick={() => setShowOnboarding(true)}
                  className="bg-white text-green-800 px-8 py-4 rounded-lg font-semibold hover:bg-green-100 transition inline-flex items-center"
                >
                  Join Network <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                  <div>
                    <div className="flex items-center space-x-2 mb-6">
                      <Network className="h-6 w-6" />
                      <span className="font-bold">Alumni Connect</span>
                    </div>
                    <p className="text-gray-400">Connecting and empowering Marshall graduates worldwide.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#" className="hover:text-white">About Us</a></li>
                      <li><a href="#" className="hover:text-white">Events</a></li>
                      <li><a href="#" className="hover:text-white">Mentorship</a></li>
                      <li><a href="#" className="hover:text-white">Careers</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Resources</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li><a href="#" className="hover:text-white">Alumni Directory</a></li>
                      <li><a href="#" className="hover:text-white">News & Updates</a></li>
                      <li><a href="#" className="hover:text-white">Support</a></li>
                      <li><a href="#" className="hover:text-white">FAQs</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Contact</h4>
                    <ul className="space-y-2 text-gray-400">
                      <li>Jack Feuer</li>
                      <li>Huntington, WV 25755</li>
                      <li>jack@globol.app</li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                  <p>&copy; {new Date().getFullYear()} Marshall Alumni Connect. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;