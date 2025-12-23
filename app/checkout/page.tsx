'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface CheckoutFormData {
  fullName: string;
  email: string;
  region: string;
  adultChannels: boolean;
}

const planLabels: Record<string, string> = {
  plan_3m: '3 Months',
  plan_6m: '6 Months',
  plan_12m: '1 Year',
};

const legacyPlanMap: Record<string, string> = {
  '3m': 'plan_3m',
  '6m': 'plan_6m',
  '1y': 'plan_12m',
};

const COUNTRY_OPTIONS: string[] = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Republic of the Congo', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const rawPlan = searchParams?.get('plan') || 'plan_3m';
  const plan = legacyPlanMap[rawPlan] || rawPlan;

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    region: '',
    adultChannels: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.region.trim()) {
      setError('Region/Country is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      console.log('🔵 [CHECKOUT PAGE] Sending request with plan:', plan);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          plan,
        }),
      });

      console.log('🔵 [CHECKOUT PAGE] Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [CHECKOUT PAGE] API error:', response.status, errorData);
        setError(errorData.error || 'Checkout failed. Please try again.');
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('✅ [CHECKOUT PAGE] Response data:', data);
      
      if (!data.success) {
        console.error('❌ [CHECKOUT PAGE] Success flag is false');
        setError(data.error || 'Order creation failed');
        setLoading(false);
        return;
      }

      if (!data.paymentUrl) {
        console.error('❌ [CHECKOUT PAGE] No paymentUrl in response');
        setError('Payment URL not available. Please contact support.');
        setLoading(false);
        return;
      }

      console.log('✅ [CHECKOUT PAGE] Redirecting to:', data.paymentUrl);
      window.location.href = data.paymentUrl;
      
    } catch (err) {
      console.error('❌ [CHECKOUT PAGE] Exception:', err);
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-navy mb-2">Secure Checkout</h1>
        <p className="text-sm text-gray-600 mb-6">
          {planLabels[plan] || planLabels.plan_3m} Plan
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-navy mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              placeholder="john@example.com"
              required
            />
          </div>

          {/* Region */}
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-navy mb-2">
              Region / Country *
            </label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
              required
            >
              <option value="">Select your country...</option>
              {COUNTRY_OPTIONS.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* Adult Channels Toggle */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="adultChannels"
                name="adultChannels"
                checked={formData.adultChannels}
                onChange={handleChange}
                className="h-4 w-4 text-teal rounded"
              />
              <label htmlFor="adultChannels" className="ml-3 text-sm text-navy">
                Include Adult Channels
              </label>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {formData.adultChannels
                ? '✓ Adult channels will be included in your subscription'
                : 'Adult channels will be excluded from your subscription'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              ❌ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal text-white font-semibold py-3 rounded-md hover:bg-teal/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span>⏳</span> Processing...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                Continue to Payment
              </>
            )}
          </button>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 pt-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Secure crypto payment powered by NOWPayments
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
