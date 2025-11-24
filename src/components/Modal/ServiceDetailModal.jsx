import { useState, useEffect } from 'react';
import { Calendar, Clock, Shield, CheckCircle, Wrench, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { getSlots, createServiceRequest } from '../../services/api';

const ServiceDetailModal = ({ service, onClose, onBookService }) => {
  const { user, accessToken } = useAuth();
  const { showSuccess, showError } = useSnackbar();
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({
    request_date: '',
    slot_id: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const data = await getSlots(accessToken);
        setSlots(data);
      } catch (err) {
        console.error('Failed to load slots', err);
        setError('Failed to load available slots');
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [accessToken]);

  if (!service) return null;

  const MAX_DESCRIPTION_LENGTH = 150;
  const description = service.description || '';
  const shouldTruncate = description.length > MAX_DESCRIPTION_LENGTH;
  const displayDescription = shouldTruncate && !isDescriptionExpanded 
    ? description.substring(0, MAX_DESCRIPTION_LENGTH) 
    : description;

  // Calculate end time by adding service duration to slot time
  // Default duration is 2 hours if not specified
  const calculateEndTime = (slotTime, durationHours = 2) => {
    if (!slotTime) return '';
    
    // Parse slot time (e.g., "6 pm", "8 pm", "10 am")
    const timeMatch = slotTime.match(/(\d+)\s*(am|pm)/i);
    if (!timeMatch) return slotTime;
    
    let hours = parseInt(timeMatch[1], 10);
    const period = timeMatch[2].toLowerCase();
    
    // Convert to 24-hour format
    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    
    // Add duration
    const endHours = hours + durationHours;
    
    // Convert back to 12-hour format
    let endHour = endHours % 24;
    const endPeriod = endHour >= 12 ? 'pm' : 'am';
    if (endHour > 12) endHour -= 12;
    if (endHour === 0) endHour = 12;
    
    return `${slotTime} - ${endHour} ${endPeriod}`;
  };

  // Extract duration from service (could be "2 hours", "2h", "2", etc.)
  const getDurationHours = () => {
    if (!service.duration) return 2; // Default 2 hours
    
    const durationStr = String(service.duration).toLowerCase();
    const match = durationStr.match(/(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
    return 2;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      showError('Please login to book a service');
      return;
    }

    if (!formData.request_date || !formData.slot_id) {
      showError('Please select a date and time slot');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Format date as DD-MM-YYYY
      const dateObj = new Date(formData.request_date);
      const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;

      // Get user ID - API expects user_Id (capital I)
      const userId = user.user_Id || user.user_id;
      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }

      const requestData = {
        user_Id: userId,
        slot_id: parseInt(formData.slot_id, 10),
        request_date: formattedDate,
        service_id: service.service_id || service.id,
        description: formData.description || 'Service request'
      };

      console.log('Submitting service request:', requestData);
      const result = await createServiceRequest(requestData, accessToken);
      
      showSuccess('Service booking request submitted successfully!');
      setTimeout(() => {
        if (onBookService) {
          onBookService(result);
        }
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to create service request', err);
      showError(err.message || 'Failed to book service. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  const durationHours = getDurationHours();

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
              Rs.{service.price ? service.price.toLocaleString() : '0'}
            </span>
          </div>

          {/* Description */}
          {service.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Service Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {displayDescription}
                {shouldTruncate && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="ml-2 text-green-600 hover:text-green-700 font-semibold underline"
                  >
                    {isDescriptionExpanded ? '...less' : '...more'}
                  </button>
                )}
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

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-green-700 font-medium">Service request submitted successfully!</p>
                  <p className="text-xs text-green-600 mt-1">Redirecting...</p>
                </div>
              </div>
            )}

            {/* Date Picker */}
            <div>
              <label htmlFor="request_date" className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Request Date
              </label>
              <input
                id="request_date"
                type="date"
                name="request_date"
                value={formData.request_date}
                onChange={handleChange}
                min={today}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            {/* Slot Selection */}
            <div>
              <label htmlFor="slot_id" className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Time Slot
              </label>
              {loadingSlots ? (
                <div className="flex items-center space-x-2 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                  <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                  <span className="text-sm text-gray-600">Loading slots...</span>
                </div>
              ) : slots.length === 0 ? (
                <p className="text-sm text-gray-500 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                  No slots available
                </p>
              ) : (
                <select
                  id="slot_id"
                  name="slot_id"
                  value={formData.slot_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                >
                  <option value="">Select a time slot</option>
                  {slots.map((slot) => (
                    <option key={slot.slot_id} value={slot.slot_id}>
                      {calculateEndTime(slot.slot_time, durationHours)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Describe your service requirements..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || success || !user}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Request Submitted!</span>
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  <span>{user ? 'Book Service' : 'Login to Book'}</span>
                </>
              )}
            </button>
          </form>

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
