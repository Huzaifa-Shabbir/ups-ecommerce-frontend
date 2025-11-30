import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, Users, Award, TrendingUp, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Electrify
              </span>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Electrify</h1>
          <p className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto">
            Your trusted partner for premium UPS systems and power backup solutions
          </p>
        </div>
      </div>

      {/* Company Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Electrify was founded with a vision to provide reliable, high-quality power backup solutions 
                to homes and businesses across the nation. We understand that uninterrupted power is not just 
                a convenience—it's a necessity in today's digital world.
              </p>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                With years of experience in the power solutions industry, we've built a reputation for 
                excellence, reliability, and customer satisfaction. Our team of expert technicians and 
                engineers work tirelessly to ensure you have access to the best UPS systems, batteries, 
                and power management solutions.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Today, Electrify stands as a leading provider of power backup solutions, serving thousands 
                of satisfied customers with cutting-edge technology and exceptional service.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-12 text-white">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">10+ Years</h3>
                    <p className="text-green-50">Of Excellence</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">10,000+</h3>
                    <p className="text-green-50">Happy Customers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">500+</h3>
                    <p className="text-green-50">Products Delivered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To empower homes and businesses with reliable, efficient, and sustainable power backup 
                solutions that ensure uninterrupted operations and peace of mind. We strive to be the 
                most trusted name in power solutions by delivering exceptional quality and service.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To become the leading provider of power backup solutions globally, recognized for innovation, 
                reliability, and customer-centric approach. We envision a future where power interruptions 
                are a thing of the past, thanks to our advanced technology and dedicated service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Reliability</h3>
              <p className="text-gray-700">
                We deliver products and services you can count on, every single time. Quality and 
                dependability are at the heart of everything we do.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-md p-8 hover:shadow-xl transition text-white">
              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Customer First</h3>
              <p className="text-gray-300">
                Your satisfaction is our priority. We listen, understand, and go above and beyond 
                to meet your power backup needs.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Excellence</h3>
              <p className="text-gray-700">
                We strive for excellence in every product, every service, and every interaction. 
                Good enough is never enough.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Electrify?</h2>
            <p className="text-xl text-gray-600">What sets us apart from the competition</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Premium Quality Products', desc: 'We source only the best UPS systems and components from trusted manufacturers.' },
              { title: 'Expert Installation & Service', desc: 'Our certified technicians ensure proper installation and maintenance.' },
              { title: 'Comprehensive Warranty', desc: 'All our products come with extensive warranty coverage for your peace of mind.' },
              { title: '24/7 Customer Support', desc: 'Round-the-clock support to address any queries or issues you may have.' },
              { title: 'Competitive Pricing', desc: 'Best value for money without compromising on quality.' },
              { title: 'Fast Delivery', desc: 'Quick and reliable delivery service to get your power solutions when you need them.' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-700">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-blue-50">We'd love to hear from you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Phone</h3>
              <a href="https://wa.me/923304325987" target="_blank" rel="noopener noreferrer" className="text-blue-50 hover:text-white transition">
                +92 330 4325987
              </a>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <a href="mailto:info@electrify.com" className="text-blue-50 hover:text-white transition">
                info@electrify.com
              </a>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Location</h3>
              <p className="text-blue-50">Serving Nationwide</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <a
              href="https://wa.me/923304325987"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition transform hover:scale-105"
            >
              Contact Us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Power Your Future?</h2>
            <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
              Explore our wide range of UPS systems and power solutions. Find the perfect backup 
              solution for your needs today.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition transform hover:scale-105"
            >
              Browse Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

