import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Layout, Typography, theme } from 'antd';
import { MdBarChart, MdEmail, MdContacts, MdCheckCircle } from 'react-icons/md';

import EmailAccountsPage from './EmailAccountsPage.jsx';
import ContactsPage from './ContactsPage.jsx';
import CampaignsPage from './CampaignsPage.jsx';
import CampaignBuilderPage from './CampaignBuilderPage.jsx';
import CampaignStatsPage from './CampaignStatsPage.jsx';
import VerifyMailsPage from './VerifyMailsPage.jsx';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const ColdMailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  // Hide tab bar on builder / stats pages
  const hideTabs = /\/(new|edit|stats)/.test(location.pathname) || /\/campaigns\/[^/]+\/(stats|edit)/.test(location.pathname) || location.pathname.includes('/campaigns/new');

  const base = '/dashboard/cold-mail';
  const getActiveTab = () => {
    if (location.pathname === base || location.pathname === `${base}/`) return 'campaigns';
    if (location.pathname.startsWith(`${base}/accounts`)) return 'accounts';
    if (location.pathname.startsWith(`${base}/contacts`)) return 'contacts';
    if (location.pathname.startsWith(`${base}/verify`)) return 'verify';
    return 'campaigns';
  };

  const handleTabChange = (key) => {
    if (key === 'campaigns') navigate(base);
    else navigate(`${base}/${key}`);
  };

  const items = [
    { key: 'campaigns', label: <span><MdBarChart style={{ marginRight: 8 }} />Campaigns</span> },
    { key: 'accounts', label: <span><MdEmail style={{ marginRight: 8 }} />Email Accounts</span> },
    { key: 'contacts', label: <span><MdContacts style={{ marginRight: 8 }} />Contacts</span> },
    { key: 'verify', label: <span><MdCheckCircle style={{ marginRight: 8 }} />Verify Mails</span> },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
      <div style={{ background: 'linear-gradient(135deg, #0F792C 0%, #065f20 100%)', padding: '24px 32px', color: '#fff' }}>
        <Title level={2} style={{ margin: 0, color: '#fff', fontWeight: 800 }}>✉️ Cold Mail</Title>
        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
          Connect email accounts · Manage contacts · Build multi-step sequences · Track opens & clicks
        </Text>
      </div>

      {!hideTabs && (
        <div style={{ background: '#fff', padding: '0 32px', borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
          <Tabs 
            activeKey={getActiveTab()} 
            onChange={handleTabChange} 
            items={items} 
            size="large"
            tabBarStyle={{ marginBottom: 0 }}
          />
        </div>
      )}

      <Content style={{ padding: '24px 32px' }}>
        <Routes>
          <Route index element={<CampaignsPage />} />
          <Route path="accounts" element={<EmailAccountsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="verify" element={<VerifyMailsPage />} />
          <Route path="campaigns/new" element={<CampaignBuilderPage />} />
          <Route path="campaigns/:id/edit" element={<CampaignBuilderPage />} />
          <Route path="campaigns/:id/stats" element={<CampaignStatsPage />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default ColdMailPage;