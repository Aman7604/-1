import React, { useEffect, useState } from 'react';
import { Recycle, Users, Leaf, ArrowRight, Star, Heart, Shirt, TrendingUp, Award, Shield, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onPageChange }) {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [imagesVisible, setImagesVisible] = useState(false);

  useEffect(() => {
    // Trigger brand name animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Trigger images animation after brand name
    const imagesTimer = setTimeout(() => {
      setImagesVisible(true);
    }, 800);

    return () => {
      clearTimeout(timer);
      clearTimeout(imagesTimer);
    };
  }, []);

  const bottomImages = [
    {
      src: 'https://images.pexels.com/photos/5698857/pexels-photo-5698857.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
      alt: 'Sustainable Fashion 1'
    },
    {
      src: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
      alt: 'Sustainable Fashion 2'
    },
    {
      src: 'https://images.pexels.com/photos/1619651/pexels-photo-1619651.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
      alt: 'Sustainable Fashion 3'
    },
    {
      src: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
      alt: 'Sustainable Fashion 4'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Animated Brand Name with Background */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <img
              src="https://images.pexels.com/photos/5698857/pexels-photo-5698857.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=2"
              alt="Sustainable Fashion Background"
              className="w-full h-full object-cover opacity-20 dark:opacity-10"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-gray-50/60 to-gray-50/90 dark:from-gray-900/80 dark:via-gray-900/60 dark:to-gray-900/90"></div>
            
            {/* Animated Particles */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-green-400 rounded-full animate-bounce opacity-40" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-70" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
        
        {/* Brand Name */}
        <div className="text-center">
          <h1 
            className={`relative z-10 text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent transition-all duration-1000 ease-out ${
              isVisible 
                ? 'opacity-100 transform translate-y-0 scale-100 rotate-0' 
                : 'opacity-0 transform translate-y-12 scale-75 rotate-3'
            }`}
            style={{ 
              fontFamily: 'Inter, system-ui, sans-serif',
              textShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
              filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.2))'
            }}
          >
            Rewear
          </h1>
          
          {/* Subtitle */}
          <p 
            className={`relative z-10 mt-4 text-xl font-medium text-gray-700 dark:text-gray-300 transition-all duration-1000 ease-out ${
              isVisible 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            Sustainable Fashion Revolution
          </p>
          
          {/* Decorative Elements */}
          <div 
            className={`relative z-10 mt-6 flex justify-center space-x-4 transition-all duration-1000 ease-out ${
              isVisible 
                ? 'opacity-100 transform translate-y-0' 
                : 'opacity-0 transform translate-y-8'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full">
                  <Leaf className="w-4 h-4" />
                  <span className="text-sm font-medium">Sustainable Fashion Revolution</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                  Fashion
                  <span className="text-blue-600 dark:text-blue-400 block mt-2">Reimagined</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  Transform your wardrobe sustainably. Join our vibrant community where fashion meets environmental consciousness. Swap, discover, and earn while making a positive impact.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onPageChange(user ? 'browse' : 'signup')}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center"
                >
                  <span>{user ? 'Explore Collection' : 'Start Your Journey'}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <button
                  onClick={() => onPageChange('browse')}
                  className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center"
                >
                  <Search className="w-4 h-4 mr-2" />
                  <span>Browse Items</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">2.5K+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">8.2K+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Items Exchanged</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">1.2T</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">CO₂ Saved</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative">
                <div className="overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <img
                    src="https://images.pexels.com/photos/5698857/pexels-photo-5698857.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2"
                    alt="Sustainable Fashion Community"
                    className="w-full h-[500px] object-cover"
                  />
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Eco-Friendly Impact</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Join the movement today</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">95%</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Waste Reduction</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">₹50K+</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Money Saved</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <Leaf className="w-12 h-12 text-white" />
              </div>
              
              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Recycle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">5000+</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Items Recycled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full mb-6">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">How It Works</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Simple. <span className="text-green-600 dark:text-green-400">Sustainable.</span> Smart.
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Three easy steps to transform your fashion experience and contribute to a more sustainable future
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-8 text-center rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-600">
              <div className="w-16 h-16 bg-purple-500 dark:bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shirt className="w-8 h-8 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 inline-block px-3 py-1 rounded-full text-sm mb-4">Step 1</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upload & Earn</h3>
              <p className="text-gray-600 dark:text-gray-300">
                List your pre-loved clothing with stunning photos. Earn points instantly and help others discover amazing pieces while decluttering your wardrobe.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 text-center rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-600">
              <div className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 inline-block px-3 py-1 rounded-full text-sm mb-4">Step 2</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Discover & Connect</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse curated collections from our community. Use smart filters to find exactly what you're looking for and connect with like-minded fashion enthusiasts.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-8 text-center rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-600">
              <div className="w-16 h-16 bg-green-500 dark:bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 inline-block px-3 py-1 rounded-full text-sm mb-4">Step 3</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Swap & Impact</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Exchange items using points or direct swaps. Every transaction reduces waste, saves resources, and contributes to a more sustainable fashion ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Global Impact</h2>
              <p className="text-gray-600 dark:text-gray-300">Making a difference, one swap at a time</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-600">
                <div className="w-12 h-12 bg-purple-500 dark:bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">2,500+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Members</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-600">
                <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">8,200+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Items Exchanged</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-600">
                <div className="w-12 h-12 bg-green-500 dark:bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">1.2T</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">CO₂ Reduced</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-600">
                <div className="w-12 h-12 bg-yellow-500 dark:bg-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">₹85K+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Money Saved</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-12 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600">
            <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Join the Revolution</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Transform
              <span className="text-green-600 dark:text-green-400 block mt-2">Your Wardrobe?</span>
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of fashion-forward individuals making a positive impact on the environment while discovering unique pieces and earning rewards.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onPageChange('signup')}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </button>
              <button
                onClick={() => onPageChange('upload')}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                List Your First Item
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Images Section */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Community</h2>
            <p className="text-gray-600 dark:text-gray-300">Discover amazing fashion finds from our sustainable community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bottomImages.map((image, index) => (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 ${
                  imagesVisible 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-8'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  animationDelay: `${index * 150}ms`
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300 text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-semibold">Sustainable Fashion</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}