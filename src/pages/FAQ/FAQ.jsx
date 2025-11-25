import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, HelpCircle, ArrowLeft } from 'lucide-react';
import TopBar from '../../components/Layout/TopBar';

const FAQ = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = React.useState(null);

  const faqs = [
    {
      question: "What is a UPS system?",
      answer: "A UPS (Uninterruptible Power Supply) is an electrical device that provides emergency power to a load when the input power source fails. It provides instant protection from input power interruptions by supplying energy stored in batteries."
    },
    {
      question: "How long does a UPS battery last?",
      answer: "UPS batteries typically last between 3-5 years, depending on usage, environmental conditions, and the number of discharge cycles. Regular maintenance and proper charging can extend battery life."
    },
    {
      question: "What is the difference between online and offline UPS?",
      answer: "Online UPS continuously powers the load from the battery while the inverter converts DC to AC. Offline UPS switches to battery power only when the main power fails. Online UPS provides better protection but is more expensive."
    },
    {
      question: "How do I choose the right UPS for my needs?",
      answer: "Consider factors like: the total power consumption of devices you need to protect, required backup time, type of equipment (sensitive electronics need online UPS), and budget. Our team can help you select the perfect UPS system."
    },
    {
      question: "Do you offer installation services?",
      answer: "Yes, we provide professional installation services by certified technicians. Installation ensures proper setup, optimal performance, and warranty coverage. Contact us to schedule an installation appointment."
    },
    {
      question: "What warranty do your products come with?",
      answer: "Most of our UPS systems come with a manufacturer's warranty ranging from 1-3 years. Extended warranty options are also available. Please check individual product pages or contact us for specific warranty details."
    },
    {
      question: "How do I maintain my UPS system?",
      answer: "Regular maintenance includes: keeping the unit clean and dust-free, ensuring proper ventilation, checking battery voltage periodically, and scheduling professional maintenance annually. Follow the manufacturer's guidelines for best results."
    },
    {
      question: "Can I use a UPS for my entire home?",
      answer: "For whole-home backup, you would need a very large and expensive UPS system. Typically, UPS systems are used for specific critical devices like computers, servers, or medical equipment. For home backup, consider an inverter system instead."
    },
    {
      question: "What should I do if my UPS is not working?",
      answer: "First, check if the UPS is properly plugged in and the battery is charged. Check for any error indicators. If the problem persists, contact our support team. Do not attempt to repair the unit yourself as it may void the warranty."
    },
    {
      question: "Do you provide technical support?",
      answer: "Yes, we offer 24/7 technical support for all our customers. You can reach us via WhatsApp, phone, or email. Our expert technicians are available to help with any questions or issues you may have."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
              <p className="text-gray-600 mt-2">Find answers to common questions about our products and services</p>
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 pt-0">
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 p-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white">
          <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
          <p className="text-green-50 mb-4">Our support team is here to help you 24/7</p>
          <a
            href="https://wa.me/923304325987"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

