import { Calendar, Clock, Shield, CheckCircle, Wrench, Star } from 'lucide-react';

const ServiceDetailModal = ({ service, onClose, onBookService }) => {
  if (!service) return null;

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Service Visual */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl h-96 flex flex-col items-center justify-center text-white p-8">
            <Wrench className="w-32 h-32 mb-6" />
            <h3 className="text-2xl font-bold text-center">Professional Service</h3>
            <p className="text-green-50 text-center mt-2">Expert technicians at your doorstep</p>
          </div>
          
          {/* Service Features */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-700">Certified Technicians</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-700">30-Day Service Warranty</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-700">Genuine Parts Used</span>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="space-y-6">
          {/* Service Type Badge */}
          <span className="inline-block text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
            Professional Service
          </span>

          {/* Service Name */}
          <h2 className="text-3xl font-bold text-gray-900">
            {service.service_name || 'Professional Service'}
          </h2>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-gray-600">(4.9) 89 bookings</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-bold text-green-600">
              ₹{service.price ? service.price.toLocaleString() : '0'}
            </span>
            <span className="text-sm text-gray-600">+ taxes</span>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Service Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {service.description || 'Professional service with expert technicians. We provide comprehensive maintenance, repair, and installation services for all types of UPS systems and power backup solutions.'}
            </p>
          </div>

          {/* Service Includes */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">What's Included</h3>
            <div className="space-y-2">
              {[
                'Complete system diagnosis',
                'Parts replacement (if needed)',
                'Performance testing',
                'Safety inspection',
                'Clean up after service',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Duration & Availability */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">Duration</span>
              </div>
              <p className="text-gray-600">2-3 hours</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">Availability</span>
              </div>
              <p className="text-gray-600">7 days a week</p>
            </div>
          </div>

          {/* Booking Section */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Time Slot
              </label>
              <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>9:00 AM - 12:00 PM</option>
                <option>12:00 PM - 3:00 PM</option>
                <option>3:00 PM - 6:00 PM</option>
              </select>
            </div>
          </div>

          {/* Book Button */}
          <button
            onClick={onBookService}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Book Service</span>
          </button>

          {/* Service Guarantee */}
          <div className="bg-green-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-sm text-green-700">
              <Shield className="w-4 h-4" />
              <span>30-Day Service Warranty</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span>100% Satisfaction Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-8 border-t pt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
        <div className="space-y-4">
          {[
            { name: 'Rajesh Kumar', rating: 5, comment: 'Excellent service! The technician was professional and completed the work efficiently.' },
            { name: 'Priya Sharma', rating: 5, comment: 'Very satisfied with the service. My UPS is working perfectly now.' },
            { name: 'Amit Patel', rating: 4, comment: 'Good service at reasonable price. Would recommend.' }
          ].map((review, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{review.name}</span>
                <div className="flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServiceDetailModal;