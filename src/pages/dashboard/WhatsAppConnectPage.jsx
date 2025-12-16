import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin, message } from 'antd';
import { BsWhatsapp } from 'react-icons/bs';
import { BASE_URL } from '../../config/URL';

const WhatsAppConnectPage = () => {
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [testNumber, setTestNumber] = useState('');

  // Environment variables
  const FB_APP_ID = import.meta.env.VITE_FB_APP_ID;
  const META_CONFIG_ID = import.meta.env.VITE_META_CONFIG_ID;

  useEffect(() => {
    checkConnectionStatus();
    loadFacebookSDK();
  }, []);

  const loadFacebookSDK = () => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v20.0'
      });
    };

    // Load SDK script
    (function (d, s, id) {
      if (d.getElementById(id)) return;
      const js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      d.getElementsByTagName(s)[0].parentNode.insertBefore(js, d.getElementsByTagName(s)[0]);
    }(document, 'script', 'facebook-jssdk'));
  };

  const checkConnectionStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/api/whatsapp/account/connected`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success && res.data.connected) {
        setIsConnected(true);
        setAccountInfo(res.data.data);
      }
    } catch (error) {
      console.error("Error checking status:", error);
    } finally {
      setLoading(false);
    }
  };

  const launchEmbeddedSignup = () => {
    if (!window.FB) {
      message.error("Facebook SDK not loaded yet.");
      return;
    }

    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const code = response.authResponse.code;
          const token = localStorage.getItem('token');

          if (code) {
            // Redirect to backend callback
            window.location.href = `${BASE_URL}/api/whatsapp/account/callback?code=${code}&state=${token}`;
          } else {
            message.error("No code received from Meta.");
          }
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      },
      {
        config_id: META_CONFIG_ID,
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          setup: {
            business_vertical: "OTHER"
          }
        }
      }
    );
  };

  const sendTestMessage = async () => {
    if (!testNumber) {
      message.warning('Please enter a phone number');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(`${BASE_URL}/api/whatsapp/account/send`,
        {
          to: testNumber,
          templateName: 'hello_world'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        message.success('Test message sent successfully!');
      }
    } catch (err) {
      console.error('Send message error:', err);
      message.error(err.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Business Integration</h1>
        <p className="text-gray-600">Connect your WhatsApp Business API using Meta Embedded Signup.</p>
      </div>

      {!isConnected ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <BsWhatsapp className="text-5xl text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connect WhatsApp Business</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Launch the Meta setup wizard to select your WABA and phone number seamlessly.
          </p>
          <button
            onClick={launchEmbeddedSignup}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <BsWhatsapp /> Connect with Facebook
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl">
                <BsWhatsapp />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900">Connected</h3>
                <p className="text-green-700">
                  Number: <strong>{accountInfo?.displayPhoneNumber}</strong>
                </p>
                <p className="text-xs text-green-600">WABA ID: {accountInfo?.wabaId}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Test Message</h2>
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Phone Number</label>
              <input
                type="text"
                placeholder="e.g. 15551234567"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                value={testNumber}
                onChange={(e) => setTestNumber(e.target.value)}
              />
              <button
                onClick={sendTestMessage}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Send Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppConnectPage;
