import React, { useState } from 'react';
import { X } from 'lucide-react';
import { signup, login } from '../services/api'; // Import login for token update
import { useAuth } from '../contexts/AuthContext';

const ContactInfoForm = ({ onClose, onContinue, userId }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState(''); // Added address field
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const { setToken } = useAuth(); // Use AuthContext to update token

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!terms) {
      setError('You must agree to the Terms & Services');
      return;
    }

    // Validate inputs
    if (!firstName.trim() || !lastName.trim()) {
      setError('First Name and Last Name are required');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('A valid email address is required');
      return;
    }

    const payload = {
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      password: 'password123', // Default password for consistency
      contactInfo: {
        phone: phoneNumber.trim() || '', // Optional phone
        address: address.trim() || '', // Optional address
      },
    };
    console.log('Signup payload:', JSON.stringify(payload, null, 2)); // Log payload for debugging

    try {
      let response;
      const existingUserResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: 'password123' }),
      });

      if (existingUserResponse.ok) {
        // User exists, proceed to payment with existing user ID without updating premium status
        const userData = await existingUserResponse.json();
        localStorage.setItem('token', userData.token); // Store token
        setToken(userData.token); // Update AuthContext

        onContinue(userData.user.id); // Proceed to payment with existing user ID
      } else {
        // User doesn’t exist, create new user
        response = await signup(payload);
        localStorage.setItem('token', response.token); // Store token
        setToken(response.token); // Update AuthContext

        onContinue(response.user._id); // Proceed to payment with new user ID
      }
    } catch (err) {
      // Parse the error response for specific messages
      if (err.message.includes('{')) {
        try {
          const errorData = JSON.parse(err.message);
          setError(errorData.message || 'Signup failed');
        } catch (parseError) {
          setError('Signup failed due to an unknown error');
        }
      } else {
        setError(err.message || 'Server error during signup');
      }
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-3xl shadow-lg relative max-w-md w-full mx-4">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-semibold text-[#0B0757] mb-4">Contact Information</h2>
        
        <p className="text-center text-gray-600 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-gray-700 text-sm">First Name</label>
              <input 
                type="text" 
                placeholder="First Name" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0B0757]"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-gray-700 text-sm">Last Name</label>
              <input 
                type="text" 
                placeholder="Last Name" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0B0757]"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-sm">Email</label>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0B0757]"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-sm">Phone Number</label>
            <input 
              type="tel" 
              placeholder="000-000-0000" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0B0757]"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-sm">Address</label>
            <input 
              type="text" 
              placeholder="Address (Optional)" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0B0757]"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="w-4 h-4 text-[#0B0757] border-gray-200 rounded focus:ring-[#0B0757]"
            />
            <label className="text-gray-700 text-sm">Use this information when contacting providers & clinics.</label>
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="w-4 h-4 text-[#0B0757] border-gray-200 rounded focus:ring-[#0B0757]"
            />
            <label className="text-gray-700 text-sm">By joining, you agree to our Terms & Services.</label>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex justify-between gap-4 mt-4">
            <button
              onClick={onClose}
              className="w-full py-3 bg-white text-[#0B0757] rounded-full border border-[#0B0757] font-medium text-base hover:bg-gray-100"
            >
              Back
            </button>
            <button
              type="submit"
              className="w-full py-3 bg-[#0B0757] text-white rounded-full font-medium text-base hover:bg-[#1a237e]"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactInfoForm;