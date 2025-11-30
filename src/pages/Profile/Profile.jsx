import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Save, Edit2, X, Loader2, CheckCircle, AlertCircle, MapPin, Plus, Trash2, Shield, Settings } from 'lucide-react';
import { getCustomerById, updateCustomer, getAddressesByCustomer, createAddress, updateAddress, deactivateAddress } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import TopBar from '../../components/Layout/TopBar';

const Profile = () => {
  const navigate = useNavigate();
  const { user, accessToken, setUser } = useAuth();
  const { showSuccess, showError } = useSnackbar();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phone_Number: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    city: '',
    country: '',
    detail: ''
  });
  const [addressErrors, setAddressErrors] = useState({});
  const [addressSaving, setAddressSaving] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!user?.user_id && !user?.user_Id) return;

    setAddressesLoading(true);
    try {
      const userId = user.user_id || user.user_Id;
      const data = await getAddressesByCustomer(userId, accessToken);
      const addressesData = Array.isArray(data) ? data : (data.addresses || []);
      setAddresses(addressesData.filter(addr => addr.status !== false));
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    } finally {
      setAddressesLoading(false);
    }
  }, [user, accessToken]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!user?.user_id && !user?.user_Id) {
        setError('User not found. Please login again.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const userId = user.user_id || user.user_Id;
        const data = await getCustomerById(userId, accessToken);
        setCustomerData(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          username: data.username || '',
          phone_Number: data.phone_Number || ''
        });
      } catch (err) {
        console.error('Failed to fetch customer data', err);
        setError(err.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
    fetchAddresses();
  }, [user, accessToken, fetchAddresses]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.phone_Number) {
      errors.phone_Number = 'Phone number is required';
    } else {
      const phoneStr = String(formData.phone_Number);
      if (!/^\d+$/.test(phoneStr)) {
        errors.phone_Number = 'Phone number must contain only digits';
      } else if (phoneStr.length !== 11 && phoneStr.length !== 12) {
        errors.phone_Number = 'Phone number must be 11 digits (e.g., 03304325987) or 12 digits (e.g., 923304325987)';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setSuccess(false);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const userId = user.user_id || user.user_Id;
      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        phone_Number: parseInt(formData.phone_Number, 10)
      };

      const result = await updateCustomer(userId, updateData, accessToken);
      
      if (result.customer) {
        const updatedUser = {
          ...user,
          name: result.customer.name,
          email: result.customer.email,
          username: result.customer.username,
          phone_Number: result.customer.phone_Number
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setCustomerData(result.customer || result);
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update customer', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (customerData) {
      setFormData({
        name: customerData.name || '',
        email: customerData.email || '',
        username: customerData.username || '',
        phone_Number: customerData.phone_Number || ''
      });
    }
    setValidationErrors({});
    setIsEditing(false);
    setError(null);
    setSuccess(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Address management functions
  const validateAddressForm = () => {
    const errors = {};
    if (!addressForm.city.trim()) errors.city = 'City is required';
    if (!addressForm.country.trim()) errors.country = 'Country is required';
    if (!addressForm.detail.trim()) errors.detail = 'Address detail is required';
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
    if (addressErrors[name]) {
      setAddressErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddAddress = () => {
    setAddressForm({ city: '', country: '', detail: '' });
    setAddressErrors({});
    setIsAddingAddress(true);
    setEditingAddressId(null);
  };

  const handleEditAddress = (address) => {
    setAddressForm({
      city: address.city || '',
      country: address.country || '',
      detail: address.detail || ''
    });
    setAddressErrors({});
    setEditingAddressId(address.address_id);
    setIsAddingAddress(false);
  };

  const handleCancelAddress = () => {
    setAddressForm({ city: '', country: '', detail: '' });
    setAddressErrors({});
    setIsAddingAddress(false);
    setEditingAddressId(null);
  };

  const handleSaveAddress = async () => {
    if (!validateAddressForm()) return;

    setAddressSaving(true);
    setError(null);

    try {
      const userId = user.user_id || user.user_Id;
      
      if (editingAddressId) {
        await updateAddress(editingAddressId, {
          user_id: userId,
          city: addressForm.city.trim(),
          country: addressForm.country.trim(),
          detail: addressForm.detail.trim()
        }, accessToken);
      } else {
        await createAddress({
          user_id: userId,
          city: addressForm.city.trim(),
          country: addressForm.country.trim(),
          detail: addressForm.detail.trim()
        }, accessToken);
      }

      await fetchAddresses();
      handleCancelAddress();
      showSuccess(editingAddressId ? 'Address updated successfully!' : 'Address added successfully!');
    } catch (err) {
      console.error('Failed to save address', err);
      showError(err.message || 'Failed to save address. Please try again.');
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to deactivate this address?')) {
      return;
    }

    try {
      console.log('Attempting to deactivate address:', addressId, 'Type:', typeof addressId);
      await deactivateAddress(addressId, accessToken);
      await fetchAddresses();
      showSuccess('Address deactivated successfully!');
    } catch (err) {
      console.error('Failed to deactivate address', err);
      console.error('Address ID:', addressId, 'Type:', typeof addressId);
      showError(err.message || 'Failed to deactivate address. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <TopBar brandVariant="dashboard" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !customerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <TopBar brandVariant="dashboard" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-1">Error Loading Profile</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <TopBar brandVariant="dashboard" />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">My Profile</h1>
              <p className="text-green-50 text-lg">Manage your account information and addresses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
            <div>
              <p className="text-green-800 font-semibold">Success!</p>
              <p className="text-green-700 text-sm">Your changes have been saved successfully.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
            <div>
              <p className="text-red-800 font-semibold">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">
                      {isEditing ? 'Edit Profile' : 'Account Information'}
                    </h2>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition backdrop-blur-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                {isEditing ? (
                  <form className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="inline w-4 h-4 mr-1" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                          validationErrors.name ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {validationErrors.name && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="inline w-4 h-4 mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                          validationErrors.email ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Enter your email"
                      />
                      {validationErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="inline w-4 h-4 mr-1" />
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                          validationErrors.username ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Enter your username"
                      />
                      {validationErrors.username && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="inline w-4 h-4 mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone_Number"
                        value={formData.phone_Number}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                          validationErrors.phone_Number ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {validationErrors.phone_Number && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.phone_Number}</p>
                      )}
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-5 h-5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">Full Name</p>
                        <p className="text-xl font-bold text-gray-900">{customerData?.name || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">Email Address</p>
                        <p className="text-xl font-bold text-gray-900">{customerData?.email || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <User className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">Username</p>
                        <p className="text-xl font-bold text-gray-900">{customerData?.username || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <Phone className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-500 mb-1">Phone Number</p>
                        <p className="text-xl font-bold text-gray-900">{customerData?.phone_Number || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Account Stats */}
          <div className="space-y-6">
            {/* Account Status Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Account Status</h3>
              </div>
              {customerData?.is_active !== undefined && (
                <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-semibold">
                    {customerData.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Member Since</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(customerData?.created_at)}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/change-password')}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition flex items-center space-x-3"
                >
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Change Password</span>
                </button>
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition flex items-center space-x-3"
                >
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">View Orders</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">My Addresses</h2>
                  <span className="text-green-100 text-sm">({addresses.length})</span>
                </div>
                {!isAddingAddress && !editingAddressId && (
                  <button
                    onClick={handleAddAddress}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition backdrop-blur-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Address</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {/* Add/Edit Address Form */}
              {(isAddingAddress || editingAddressId) && (
                <div className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {editingAddressId ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                          addressErrors.city ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Enter city"
                      />
                      {addressErrors.city && (
                        <p className="mt-1 text-sm text-red-600">{addressErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                          addressErrors.country ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Enter country"
                      />
                      {addressErrors.country && (
                        <p className="mt-1 text-sm text-red-600">{addressErrors.country}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Address Detail</label>
                      <textarea
                        name="detail"
                        value={addressForm.detail}
                        onChange={handleAddressChange}
                        rows="3"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none ${
                          addressErrors.detail ? 'border-red-300' : 'border-gray-200'
                        }`}
                        placeholder="Enter street address, house number, etc."
                      />
                      {addressErrors.detail && (
                        <p className="mt-1 text-sm text-red-600">{addressErrors.detail}</p>
                      )}
                    </div>

                    <div className="md:col-span-2 flex space-x-4 pt-2">
                      <button
                        onClick={handleSaveAddress}
                        disabled={addressSaving}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {addressSaving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            <span>Save Address</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelAddress}
                        disabled={addressSaving}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-5 h-5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses List */}
              {addressesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                  <span className="ml-3 text-gray-600">Loading addresses...</span>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-2 font-semibold">No addresses saved</p>
                  <p className="text-gray-500 text-sm mb-4">Click "Add Address" to add your first address</p>
                  {!isAddingAddress && (
                    <button
                      onClick={handleAddAddress}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      Add Your First Address
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.address_id}
                      className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-green-300 transition group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <MapPin className="w-5 h-5 text-green-600" />
                          </div>
                          <h3 className="font-bold text-gray-900">Address #{address.address_id}</h3>
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Edit address"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.address_id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-gray-700">
                        <p className="font-semibold text-lg">{address.detail}</p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.country}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
