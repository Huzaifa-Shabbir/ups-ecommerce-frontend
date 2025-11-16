import { Calendar, Clock, Shield, CheckCircle, Wrench } from 'lucide-react';

const ServiceDetailModal = ({ service, onClose, onBookService }) => {
  if (!service) return null;

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Service Visual */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl h-96 flex flex-col items-center justify-center text-white p-8">
            <Wrench className="w-32 h-32 mb-6" />
            <h3 className="text-2xl font-bold text-center">{service.service_name || 'Service'}</h3>
            {service.description && (
              <p className="text-green-50 text-center mt-2 line-clamp-3">{service.description}</p>
            )}
          </div>
        </div>

        {/* Service Details */}
        <div className="space-y-6">
          {/* Service Name */}
          <h2 className="text-3xl font-bold text-gray-900">
            {service.service_name || 'Service'}
          </h2>

          {/* Price */}
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-bold text-green-600">
              ₹{service.price ? service.price.toLocaleString() : '0'}
            </span>
          </div>

          {/* Description */}
          {service.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Service Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          )}

          {/* Duration (if available) */}
          {service.duration && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <span className="text-sm font-semibold text-gray-900 block">Duration</span>
                  <span className="text-sm text-gray-600">{service.duration}</span>
                </div>
              </div>
            </div>
          )}

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
              <span>Professional Service Guaranteed</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span>Expert Technicians</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetailModal;