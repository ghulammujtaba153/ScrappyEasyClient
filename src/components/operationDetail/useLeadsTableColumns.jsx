import { useMemo } from 'react';
import { Button, Space, Tag, Spin, Tooltip } from 'antd';
import {
  MdOpenInNew,
  MdCheckCircle,
  MdClose,
  MdSettingsInputComponent,
  MdEmail,
  MdShare,
  MdAnalytics,
  MdEdit,
  MdDelete,
  MdFavorite,
  MdFavoriteBorder,
} from 'react-icons/md';
import {
  BsWhatsapp,
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsTwitterX,
  BsYoutube,
  BsTiktok,
} from 'react-icons/bs';
import ScreenshotViewer from '../dashboard/ScreenshotViewer';

export function useLeadsTableColumns(deps) {
  const {
    currentPage,
    pageSize,
    screenshotData,
    extractingSocial,
    extractSocialsForLead,
    extractAllSocials,
    extractingAllSocial,
    isAuthorized,
    setLockedFeature,
    setIsLockedModalOpen,
    setSelectedLeadForStack,
    setIsStackModalOpen,
    formatPhoneNumber,
    whatsappStatus,
    handleVerifyPhoneClick,
    verifyingPhone,
    whatsappInitialized,
    handleVerifyAllClick,
    verifyingAll,
    adsAnalysisResults,
    handleAnalyzeAllClick,
    analyzingAds,
    toggleFavorite,
    handleEditClick,
    handleDeleteClick,
  } = deps;

  return useMemo(
    () => [
      {
        title: '#',
        width: 60,
        render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      },
      {
        title: 'Business Name',
        dataIndex: 'title',
        key: 'title',
        width: 260,
        sorter: (a, b) => (a.title || '').localeCompare(b.title || ''),
      },
      {
        title: 'Rating',
        dataIndex: 'rating',
        key: 'rating',
        width: 140,
        render: (rating) => rating ? (
          <Tag color="green">⭐ {rating}</Tag>
        ) : '-',
        sorter: (a, b) => (parseFloat(a.rating) || 0) - (parseFloat(b.rating) || 0),
      },
      {
        title: 'Reviews',
        dataIndex: 'reviews',
        key: 'reviews',
        width: 140,
        sorter: (a, b) => (parseInt(a.reviews) || 0) - (parseInt(b.reviews) || 0),
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        width: 150,
        render: (phone) => phone || '-',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        width: 250,
        ellipsis: true,
        render: (address) => address || '-',
      },
      {
        title: 'City/Location',
        key: 'city',
        width: 150,
        render: (_, record) => {
          if (record.city) {
            return <Tag color="green">{record.city}</Tag>;
          }
          return <span className="text-gray-400">-</span>;
        },
      },
      {
        title: 'Website',
        dataIndex: 'website',
        key: 'website',
        width: 200,
        render: (website, record) => website ? (
          <Space orientation="vertical" size={2}>
            <a href={website} target="_blank" rel="noopener noreferrer" className="text-[#0F792C] hover:text-[#0a5a20] whitespace-nowrap">
              <MdOpenInNew className="inline" /> Link
            </a>
            <div className="flex items-center gap-2">
              {(record.screenshotUrl || screenshotData[record.key]) && (
                <ScreenshotViewer url={record.screenshotUrl || screenshotData[record.key]} title={record.title} />
              )}
              {/* <Button
                size="small"
                type="text"
                icon={<MdCameraAlt className="text-blue-500" />}
                onClick={() => handleCapture(website, record.key)}
                loading={queue.some(i => i.key === record.key && (i.status === 'pending' || i.status === 'processing'))}
                className="flex items-center gap-1 hover:bg-blue-50 transition-colors"
              >
                {(record.screenshotUrl || screenshotData[record.key]) ? 'Recapture' : 'Capture'}
              </Button> */}
            </div>
          </Space>
        ) : '-',
      },
      {
        title: 'Tech Stack',
        key: 'techStack',
        width: 130,
        render: (_, record) => record.website ? (
          <Button
            size="small"
            icon={<MdSettingsInputComponent className="text-purple-500" />}
            onClick={() => {
              if (!isAuthorized) { setLockedFeature('Tech Stack Analysis'); setIsLockedModalOpen(true); return; }
              setSelectedLeadForStack(record);
              setIsStackModalOpen(true);
            }}
            className="hover:border-purple-500 hover:text-purple-500 transition-colors flex items-center gap-1"
          >
            Analyze
          </Button>
        ) : <Tag color="default">N/A</Tag>,
      },
      {
        title: 'Google Maps',
        dataIndex: 'googleMapsLink',
        key: 'googleMapsLink',
        width: 120,
        render: (link) => link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#0F792C] hover:text-[#0a5a20]">
            <MdOpenInNew className="inline" /> View
          </a>
        ) : '-',
      },
      {
        title: (
          <div className="flex items-center justify-between group">
            <span>Email</span>
            <Tooltip title="Verify Visible List">
              <Button
                type="text"
                size="small"
                icon={<MdEmail className="text-primary group-hover:scale-110 transition-transform" />}
                onClick={extractAllSocials}
                loading={extractingAllSocial}
                className="p-0 h-6 w-6 flex items-center justify-center hover:bg-primary/10 rounded-full"
              />
            </Tooltip>
          </div>
        ),
        dataIndex: 'emails',
        key: 'emails',
        width: 180,
        render: (emails, record) => {
          if (!record.website) return <Tag color="default">N/A</Tag>;

          const isExtracting = extractingSocial[record.leadId];

          if (isExtracting) {
            return <Spin size="small" />;
          }

          if (emails && emails.length > 0) {
            return (
              <div className="flex flex-col gap-1">
                {emails.map((e, idx) => (
                  <Tooltip key={idx} title={`Click to email ${e}`}>
                    <a href={`mailto:${e}`} className="text-blue-500 hover:underline text-xs truncate max-w-[150px] flex items-center gap-1">
                      <MdEmail size={10} /> {e}
                    </a>
                  </Tooltip>
                ))}
              </div>
            );
          }

          if (emails && Array.isArray(emails) && emails.length === 0) {
            return <Tag color="error">Not Found</Tag>;
          }

          return (
            <Button
              size="small"
              icon={<MdEmail />}
              onClick={() => extractSocialsForLead(record.leadId, record.website)}
              className="hover:border-primary hover:text-primary transition-colors"
            >
              Extract
            </Button>
          );
        }
      },
      {
        title: (
          <div className="flex items-center justify-between group">
            <span>Social Media</span>
            <Tooltip title="Batch Extract Socials">
              <Button
                type="text"
                size="small"
                icon={<MdShare className="text-primary group-hover:scale-110 transition-transform" />}
                onClick={extractAllSocials}
                loading={extractingAllSocial}
                className="p-0 h-6 w-6 flex items-center justify-center hover:bg-primary/10 rounded-full"
              />
            </Tooltip>
          </div>
        ),
        dataIndex: 'socialMedia',
        key: 'socialMedia',
        width: 200,
        render: (socialMedia, record) => {
          if (!record.website) return <Tag color="default">N/A</Tag>;

          const isExtracting = extractingSocial[record.leadId];
          if (isExtracting) return <Spin size="small" />;

          const platforms = {
            facebook: { icon: <BsFacebook className="text-[#1877F2]" />, label: 'Facebook' },
            instagram: { icon: <BsInstagram className="text-[#E4405F]" />, label: 'Instagram' },
            linkedin: { icon: <BsLinkedin className="text-[#0A66C2]" />, label: 'LinkedIn' },
            twitter: { icon: <BsTwitterX className="text-black" />, label: 'X/Twitter' },
            youtube: { icon: <BsYoutube className="text-[#FF0000]" />, label: 'YouTube' },
            tiktok: { icon: <BsTiktok className="text-black" />, label: 'TikTok' },
          };

          if (socialMedia && typeof socialMedia === 'object') {
            const found = Object.entries(socialMedia).filter(([, url]) => url);
            if (found.length > 0) {
              return (
                <div className="flex flex-wrap gap-2">
                  {found.map(([platform, url]) => (
                    <Tooltip key={platform} title={`${platforms[platform]?.label}: ${url}`}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl hover:scale-125 hover:-translate-y-0.5 transition-all inline-flex p-1 bg-gray-50 rounded-lg hover:shadow-sm"
                      >
                        {platforms[platform]?.icon}
                      </a>
                    </Tooltip>
                  ))}
                </div>
              );
            }
            return <Tag color="error" className="rounded-full border-none px-3 bg-red-50 text-red-500 font-medium">Not Found</Tag>;
          }

          return (
            <Button
              size="small"
              icon={<MdShare />}
              onClick={() => extractSocialsForLead(record.leadId, record.website)}
              className="hover:border-primary hover:text-primary transition-colors rounded-lg"
            >
              Extract
            </Button>
          );
        }
      },
      {
        title: 'Status',
        key: 'whatsappProcessed',
        width: 120,
        render: (_, record) => {
          const isProcessed = record.whatsappStatus && record.whatsappStatus !== 'not-checked';
          return isProcessed ? (
            <Tag color="green" className="flex items-center gap-1 w-fit rounded-full px-3">
              <MdCheckCircle /> Processed
            </Tag>
          ) : (
            <Tag color="orange" className="rounded-full px-3">Pending</Tag>
          );
        },
      },
      {
        title: (
          <div className="flex items-center justify-between group">
            <span>WhatsApp</span>
            <Tooltip title="Verify Visible List">
              <Button
                type="text"
                size="small"
                icon={<BsWhatsapp className="text-[#0F792C] group-hover:scale-110 transition-transform" />}
                onClick={handleVerifyAllClick}
                loading={verifyingAll}
                className="p-0 h-6 w-6 flex items-center justify-center hover:bg-green-50 rounded-full"
              />
            </Tooltip>
          </div>
        ),
        key: 'whatsapp',
        width: 140,
        render: (_, record) => {
          const phone = record.phone;
          if (!phone) return <Tag color="default">N/A</Tag>;

          const formattedPhone = formatPhoneNumber(phone);
          if (!formattedPhone) return <Tag color="default">Invalid</Tag>;

          const status = record.whatsappStatus || whatsappStatus[formattedPhone];
          const isVerifying = verifyingPhone === formattedPhone;

          if (isVerifying) {
            return <Spin size="small" />;
          }

          if (status === 'verified') {
            return (
              <Space>
                <Tag color="success" icon={<MdCheckCircle />}>Verified</Tag>
              </Space>
            );
          }

          if (status === 'not-verified') {
            return (
              <Space>
                <Tag color="error" icon={<MdClose />}>No WhatsApp</Tag>
              </Space>
            );
          }

          return (
            <Button
              size="small"
              icon={<BsWhatsapp />}
              onClick={() => handleVerifyPhoneClick(phone, record.leadId)}
              disabled={!whatsappInitialized}
              title={!whatsappInitialized ? 'Connect WhatsApp first' : 'Verify this number'}
            >
              Check
            </Button>
          );
        },
      },
      {
        title: 'Scraped Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 140,
        render: (date) => new Date(date).toLocaleDateString(),
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      },
      {
        title: (
          <div className="flex items-center justify-between group">
            <span>Website Ads</span>
            <Tooltip title="Analyze websites for ads">
              <Button
                type="text"
                size="small"
                icon={<MdAnalytics className="text-blue-500 group-hover:scale-110 transition-transform" />}
                onClick={handleAnalyzeAllClick}
                loading={analyzingAds}
                className="p-0 h-6 w-6 flex items-center justify-center hover:bg-blue-50 rounded-full"
              />
            </Tooltip>
          </div>
        ),
        key: 'addsRunning',
        width: 140,
        render: (_, record) => {
          if (!record.website) {
            return <Tag color="default">N/A</Tag>;
          }

          // Check analysis results first, then fall back to record data
          const adStatus = adsAnalysisResults[record.leadId] || record.addsRunning;

          if (adStatus === 'running') {
            return <Tag color="green" className="rounded-full">🎯 Running Ads</Tag>;
          } else if (adStatus === 'not-running') {
            return <Tag color="gray" className="rounded-full">No Ads</Tag>;
          } else if (adStatus === 'not-available') {
            return <Tag color="orange" className="rounded-full">Unavailable</Tag>;
          }

          return <Tag color="default" className="rounded-full">Not Analyzed</Tag>;
        },
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 190,
        fixed: 'right',
        render: (_, lead) => (
          <Space>
            <Tooltip title={lead.favorite ? 'Remove from favorites' : 'Add to favorites'}>
              <Button
                type="text"
                icon={lead.favorite ? <MdFavorite style={{ color: '#ef4444' }} className="text-lg" /> : <MdFavoriteBorder className="text-gray-400 text-lg" />}
                onClick={() => toggleFavorite(lead.leadId, lead.itemIndex, !lead.favorite)}
                className="hover:bg-red-50"
              />
            </Tooltip>

            {/**
             * LinkedIn founder/member automation temporarily disabled.
             * Uncomment to restore the action button.
             *
             * <Tooltip title="LinkedIn founder/member automation">
             *   <Button
             *     type="text"
             *     icon={<BsLinkedin className="text-[#0A66C2] text-lg" />}
             *     onClick={() => {
             *       setSelectedLeadForLinkedIn(lead);
             *       setIsLinkedInModalOpen(true);
             *     }}
             *     className="hover:bg-blue-50"
             *     disabled={!lead.website}
             *   />
             * </Tooltip>
             */}

            <Button
              type="text"
              icon={<MdEdit className="text-blue-500 text-lg" />}
              onClick={() => handleEditClick(lead)}
              className="hover:bg-blue-50"
            />
            <Button
              type="text"
              icon={<MdDelete className="text-red-500 text-lg" />}
              onClick={() => handleDeleteClick(lead)}
              className="hover:bg-red-50"
            />
          </Space>
        ),
      },
    ],
    [
      currentPage,
      pageSize,
      screenshotData,
      extractingSocial,
      extractSocialsForLead,
      extractAllSocials,
      extractingAllSocial,
      isAuthorized,
      setLockedFeature,
      setIsLockedModalOpen,
      setSelectedLeadForStack,
      setIsStackModalOpen,
      formatPhoneNumber,
      whatsappStatus,
    handleVerifyPhoneClick,
    verifyingPhone,
    whatsappInitialized,
    handleVerifyAllClick,
    verifyingAll,
      adsAnalysisResults,
      handleAnalyzeAllClick,
      analyzingAds,
      toggleFavorite,
      handleEditClick,
      handleDeleteClick,
    ],
  );
}
