import React, { useState, useEffect } from 'react';
import { Modal, Spin, Tag, Empty, List, Avatar, Typography, Button, message, Alert } from 'antd';
import { 
  MdSettingsInputComponent, MdAnalytics, MdAdsClick, MdLayers, MdExtension, 
  MdLightbulb, MdTrendingUp, MdWarning, MdMail, MdSupportAgent, MdPayments, MdSecurity,
  MdBarChart, MdStorefront, MdCampaign, MdOutlineFontDownload, MdPublic, MdComputer,
  MdSpeed, MdAdsClick as MdAds, MdShare, MdMap, MdCode, MdLanguage
} from 'react-icons/md';
import { FaHeadset, FaFontAwesomeFlag, FaWordpress, FaShopify, FaWix, FaFacebook, FaTwitter, FaTiktok, FaSnapchat, FaStripe, FaPaypal, FaHubspot, FaMailchimp } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';

const { Title, Text, Paragraph } = Typography;

const ICON_MAP = {
  wordpress: <FaWordpress className="text-[#21759b]" />,
  shopify: <FaShopify className="text-[#95bf47]" />,
  wix: <FaWix className="text-black" />,
  squarespace: <MdLayers className="text-black" />,
  magento: <MdStorefront className="text-[#ee672f]" />,
  vtex: <MdStorefront className="text-[#e31c58]" />,
  ga: <MdAnalytics className="text-[#e37400]" />,
  gtm: <MdAnalytics className="text-[#246FDB]" />,
  facebook: <FaFacebook className="text-[#1877f2]" />,
  twitter: <FaTwitter className="text-black" />,
  tiktok: <FaTiktok className="text-black" />,
  snapchat: <FaSnapchat className="text-[#fffc00]" />,
  nextjs: <MdCode className="text-black" />,
  react: <MdCode className="text-[#61dafb]" />,
  vue: <MdCode className="text-[#4fc08d]" />,
  jquery: <MdCode className="text-[#0769ad]" />,
  tailwind: <MdCode className="text-[#06b6d4]" />,
  bootstrap: <MdCode className="text-[#7952b3]" />,
  elementor: <MdLayers className="text-[#922247]" />,
  klaviyo: <MdMail className="text-[#26ffad]" />,
  hubspot: <FaHubspot className="text-[#ff7a59]" />,
  mailchimp: <FaMailchimp className="text-[#ffe01b]" />,
  activecampaign: <MdCampaign className="text-[#356ae6]" />,
  intercom: <MdSupportAgent className="text-[#0057ff]" />,
  zendesk: <MdSupportAgent className="text-[#03363d]" />,
  crisp: <FaHeadset className="text-[#1972f5]" />,
  tawkto: <FaHeadset className="text-[#03a84e]" />,
  stripe: <FaStripe className="text-[#635bff]" />,
  paypal: <FaPaypal className="text-[#003087]" />,
  cloudflare: <MdSecurity className="text-[#f38020]" />,
  hotjar: <MdBarChart className="text-[#ff1c5e]" />,
  clarity: <MdBarChart className="text-[#0078d4]" />,
  googleads: <MdAds className="text-[#4285F4]" />,
  alpinejs: <MdCode className="text-[#77C1D2]" />,
  googlefonts: <MdOutlineFontDownload className="text-[#4285F4]" />,
  fontawesome: <FaFontAwesomeFlag className="text-[#337ab7]" />,
  googlemaps: <MdMap className="text-[#4285F4]" />,
  swiper: <MdLayers className="text-[#6332F6]" />,
  axios: <MdCode className="text-[#5A29E4]" />,
  aos: <MdSpeed className="text-[#00d1b2]" />,
  performance: <MdSpeed className="text-[#00d1b2]" />,
  opengraph: <MdShare className="text-[#3b5998]" />,
  unpkg: <MdPublic className="text-[#333]" />,
  apache: <MdComputer className="text-[#D22128]" />,
  nginx: <MdComputer className="text-[#009639]" />
};

const CATEGORY_ICONS = {
  'CMS': <MdLayers className="text-blue-500" />,
  'E-commerce': <MdExtension className="text-green-500" />,
  'Analytics': <MdAnalytics className="text-orange-500" />,
  'Marketing': <MdAdsClick className="text-red-500" />,
  'Advertising': <MdAds className="text-blue-600" />,
  'Email Marketing': <MdMail className="text-blue-400" />,
  'CRM': <MdTrendingUp className="text-orange-400" />,
  'Customer Support': <MdSupportAgent className="text-purple-500" />,
  'Payments': <MdPayments className="text-emerald-500" />,
  'Security': <MdSecurity className="text-slate-500" />,
  'Framework': <MdSettingsInputComponent className="text-purple-500" />,
  'JavaScript frameworks': <MdSettingsInputComponent className="text-purple-600" />,
  'Library': <MdSettingsInputComponent className="text-blue-400" />,
  'JavaScript libraries': <MdSettingsInputComponent className="text-blue-500" />,
  'CSS Framework': <MdSettingsInputComponent className="text-cyan-500" />,
  'UI frameworks': <MdCode className="text-cyan-600" />,
  'Page Builder': <MdExtension className="text-pink-500" />,
  'Tag managers': <MdSettingsInputComponent className="text-blue-500" />,
  'CDN': <MdSecurity className="text-orange-500" />,
  'Font scripts': <MdOutlineFontDownload className="text-gray-600" />,
  'Maps': <MdMap className="text-green-600" />,
  'Performance': <MdSpeed className="text-yellow-600" />,
  'Miscellaneous': <MdExtension className="text-gray-400" />,
  'Web servers': <MdComputer className="text-slate-600" />
};

const StackAnalysisModal = ({ visible, onCancel, url, leadName, token }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (visible && url) {
      analyzeWebsite();
    } else {
      setData(null);
    }
  }, [visible, url]);

  const analyzeWebsite = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/stack-analysis/analyze`, 
        { url }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setData(res.data.data);
      } else {
        message.error(res.data.error || 'Failed to analyze stack');
      }
    } catch (error) {
      console.error('Stack analysis error:', error);
      message.error('An error occurred while analyzing the website stack');
    } finally {
      setLoading(false);
    }
  };

  const groupedTech = data?.technologies?.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category].push(tech);
    return acc;
  }, {}) || {};

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <MdSettingsInputComponent className="text-primary text-xl" />
          <span>Intelligent Stack Analysis: {leadName}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>Close</Button>,
        <Button key="retry" type="primary" loading={loading} onClick={analyzeWebsite}>Re-scan Website</Button>
      ]}
      width={750}
      centered
      className="stack-modal"
    >
      {loading ? (
        <div className="py-20 text-center">
          <Spin size="large" tip="Analyzing deep infrastructure and marketing layers..." />
          <p className="mt-4 text-gray-400 italic text-sm">"Checking CRM, Support, Payments and conversion tools..."</p>
        </div>
      ) : data ? (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          
          {/* OUTREACH OPPORTUNITIES SECTION */}
          {data.opportunities && data.opportunities.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-amber-500 p-1.5 rounded-lg">
                  <MdLightbulb className="text-white text-lg" />
                </div>
                <Title level={5} className="!mb-0 !text-amber-800 uppercase tracking-widest text-[11px] font-black">
                  Strategic Outreach Opportunities
                </Title>
              </div>
              <div className="space-y-3">
                {data.opportunities.map((opp, i) => (
                  <div key={i} className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-amber-200/50 flex gap-3 group hover:border-amber-400 transition-all">
                    <div className="mt-1">
                      {opp.impact === 'Critical' ? <MdWarning className="text-red-500 text-xl" /> : <MdTrendingUp className="text-amber-500 text-xl" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Text strong className="text-gray-800">{opp.tool}</Text>
                        <Tag color={opp.impact === 'Critical' ? 'error' : 'warning'} className="rounded-full text-[10px] uppercase font-bold border-none px-2 py-0">
                          {opp.impact} Impact
                        </Tag>
                      </div>
                      <Paragraph className="!mb-0 text-gray-600 text-sm leading-relaxed">
                        {opp.message}
                      </Paragraph>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INSTALLED TECHNOLOGIES SECTION */}
          <div>
            <div className="flex items-center gap-2 mb-4 ml-1">
              <MdLayers className="text-gray-400 text-lg" />
              <Title level={5} className="!mb-0 !text-gray-500 uppercase tracking-widest text-[11px] font-black">
                Detected Infrastructure ({data.total})
              </Title>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(groupedTech).length > 0 ? (
                Object.entries(groupedTech).map(([category, techs]) => (
                  <div key={category} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      {CATEGORY_ICONS[category] || <MdExtension />}
                      <Text strong className="text-gray-400 uppercase tracking-wider text-[10px] font-bold">
                        {category}
                      </Text>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {techs.map((tech) => (
                        <div 
                          key={tech.name} 
                          className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-default"
                        >
                          <span className="text-lg flex items-center">
                            {ICON_MAP[tech.icon] || <MdExtension className="text-gray-400" />}
                          </span>
                          <Text className="font-semibold text-gray-700 text-xs">{tech.name}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2">
                  <Empty description="No known technologies detected." className="py-10" />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Empty description="Could not load tech stack data." />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}} />
    </Modal>
  );
};

export default StackAnalysisModal;
