import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import TopBar from '../../components/Layout/TopBar';

const Warranty = () => {
  const navigate = useNavigate();

  const warrantyTypes = [
    {
      title: "Standard Warranty",
      duration: "1-2 Years",
      coverage: [
        "Manufacturing defects",
        "Component failures",
        "Battery replacement (if defective)",
        "Free repair or replacement"
      ],
      icon: <Shield className="w-8 h-8" />
    },
    {
      title: "Extended Warranty",
      duration: "3-5 Years",
      coverage: [
        "All standard warranty benefits",
        "Priority technical support",
        "Annual maintenance check",
        "Extended battery warranty",
        "On-site service (where available)"
      ],
      icon: <Shield className="w-8 h-8" />
    },
    {
      title: "Premium Warranty",
      duration: "5+ Years",
      coverage: [
        "All extended warranty benefits",
        "24/7 dedicated support",
        "Quarterly maintenance visits",
        "Free battery replacement",
        "Guaranteed response time",
        "Replacement unit during repairs"
      ],
      icon: <Shield className="w-8 h-8" />
    }
  ];

  const warrantyTerms = [
    {
      title: "What's Covered",
      items: [
        "Manufacturing defects in materials and workmanship",
        "Component failures under normal use",
        "Battery defects (subject to terms)",
        "Software and firmware issues",
        "Replacement parts and labor"
      ],
      icon: <CheckCircle className="w-6 h-6 text-green-600" />
    },
    {
      title: "What's Not Covered",
      items: [
        "Damage from misuse, abuse, or accidents",
        "Unauthorized repairs or modifications",
        "Damage from power surges or lightning (unless surge protection was used)",
        "Normal wear and tear of consumable parts",
        "Damage from environmental factors (water, fire, etc.)",
        "Loss of data or software"
      ],
      icon: <AlertCircle className="w-6 h-6 text-red-600" />
    },
    {
      title: "Warranty Process",
      items: [
        "Contact our support team with your purchase details",
        "Provide proof of purchase and warranty documentation",
        "Our team will assess the issue and provide guidance",
        "If covered, we'll arrange repair or replacement",
        "Service typically completed within 5-7 business days"
      ],
      icon: <Clock className="w-6 h-6 text-blue-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Warranty Information</h1>
              <p className="text-gray-600 mt-2">Comprehensive warranty coverage for your peace of mind</p>
            </div>
          </div>
        </div>

        {/* Warranty Types */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Warranty Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {warrantyTypes.map((warranty, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg text-white">
                    {warranty.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{warranty.title}</h3>
                    <p className="text-sm text-gray-600">{warranty.duration}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {warranty.coverage.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Warranty Terms */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Warranty Terms & Conditions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {warrantyTerms.map((term, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  {term.icon}
                  <h3 className="font-bold text-lg text-gray-900">{term.title}</h3>
                </div>
                <ul className="space-y-3">
                  {term.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Important Notes */}
        <section className="mb-12">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <h3 className="font-bold text-lg text-gray-900 mb-3">Important Notes</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Warranty period starts from the date of purchase</li>
              <li>• Keep your purchase receipt and warranty card safe</li>
              <li>• Register your product online for faster warranty processing</li>
              <li>• Warranty is non-transferable and applies only to the original purchaser</li>
              <li>• Some products may have specific warranty terms - check product documentation</li>
            </ul>
          </div>
        </section>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Need Warranty Support?</h3>
          <p className="text-green-50 mb-6">Our team is ready to assist you with any warranty-related questions</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/923304325987"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
            >
              Contact Support
            </a>
            <button
              onClick={() => navigate('/faq')}
              className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              View FAQs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Warranty;

