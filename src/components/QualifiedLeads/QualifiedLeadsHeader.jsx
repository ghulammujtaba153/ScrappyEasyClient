import React from 'react';
import { Button, Space } from 'antd';
import { MdArrowBack, MdStar, MdRefresh, MdDownload, MdPhone } from 'react-icons/md';
import { BsWhatsapp } from 'react-icons/bs';

const QualifiedLeadsHeader = ({
    leadData,
    tableDataLength,
    loading,
    leadsWithPhoneCount,
    onBack,
    onRefresh,
    onExportCSV,
    onCreateColdCallCampaign,
    onCreateMessageCampaign,
    filteredDataLength,
    onShowDialer
}) => {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <Button
                    icon={<MdArrowBack />}
                    onClick={onBack}
                    className="mb-2"
                >
                    Back to Qualified Leads
                </Button>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <MdStar className="text-yellow-500" />
                    {leadData?.name || 'Qualified Lead Details'}
                </h1>
                {leadData && (
                    <p className="text-gray-600">
                        {leadData.totalRecords || tableDataLength || 0} records • Created {leadData.createdAt ? new Date(leadData.createdAt).toLocaleString() : 'N/A'}
                    </p>
                )}
            </div>

            <Space wrap>
                <Button
                    icon={<MdRefresh />}
                    onClick={onRefresh}
                    loading={loading}
                >
                    Refresh
                </Button>
                <Button
                    icon={<MdDownload />}
                    onClick={onExportCSV}
                    disabled={!filteredDataLength}
                >
                    Export CSV
                </Button>
                <Button
                    icon={<MdPhone />}
                    onClick={onShowDialer}
                    className="bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
                >
                    Show Dialer
                </Button>
                <Button
                    type="primary"
                    icon={<MdPhone />}
                    onClick={onCreateColdCallCampaign}
                    disabled={leadsWithPhoneCount === 0}
                    className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                >
                    Create Cold Call Campaign
                </Button>
                <Button
                    type="primary"
                    icon={<BsWhatsapp />}
                    onClick={onCreateMessageCampaign}
                    disabled={leadsWithPhoneCount === 0}
                    className="bg-[#0F792C] hover:bg-[#0a5a20] border-[#0F792C]"
                >
                    Create Message Campaign
                </Button>
            </Space>
        </div>
    );
};

export default QualifiedLeadsHeader;
