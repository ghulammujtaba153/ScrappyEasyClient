import React from 'react';
import { Button } from 'antd';
import {
  MdShare,
  MdWeb,
  MdAnalytics,
  MdLocationOn,
  MdStar,
  MdDownload,
  MdDescription,
  MdCloudUpload,
  MdCopyAll,
  MdGroupAdd,
} from 'react-icons/md';
import { BsWhatsapp } from 'react-icons/bs';

export default function OperationDetailToolbar({
  record,
  filteredData,
  isAuthorized,
  onLockFeature,
  onExtractAllSocials,
  extractingAllSocial,
  onOpenCarousel,
  onAnalyzeAds,
  analyzingAds,
  onRecommendCities,
  loadingRecommendations,
  onExtractCities,
  extractingCities,
  onSaveQualified,
  onExportCsv,
  onExportXls,
  onImportCsv,
  onRemoveDuplicates,
  duplicatesLoading,
  onExportTeam,
  onVerifyAll,
  verifyingAll,
}) {
  const websiteCount = filteredData.filter((item) => item.website).length;

  const requireAuth = (feature, action) => {
    if (!isAuthorized) {
      onLockFeature(feature);
      return;
    }
    action();
  };

  return (
    <>
      <div className="pt-6 border-t border-gray-100">
        <h2 className="text-sm uppercase tracking-[0.24em] text-gray-500 font-semibold mb-3">Features</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="default"
            icon={<MdShare />}
            onClick={onExtractAllSocials}
            loading={extractingAllSocial}
            disabled={extractingAllSocial || !record || websiteCount === 0}
            className="rounded-xl h-10 px-4 font-bold border-gray-200"
          >
            Extract Emails and Socials
          </Button>
          <Button
            icon={<MdWeb />}
            onClick={() => requireAuth('Bumble/Tinder for Websites', onOpenCarousel)}
            disabled={websiteCount === 0}
            className="rounded-xl h-10 px-4 font-bold border-gray-200"
          >
            Bumble/Tinder for Websites
          </Button>
          <Button
            icon={<MdAnalytics />}
            onClick={onAnalyzeAds}
            loading={analyzingAds}
            disabled={analyzingAds || !record || websiteCount === 0}
            className="rounded-xl h-10 px-4 font-bold border-blue-200 text-blue-600 hover:border-blue-500 hover:text-blue-700"
          >
            Websites running ads
          </Button>
          <Button
            type="primary"
            icon={<MdLocationOn />}
            onClick={onRecommendCities}
            loading={loadingRecommendations}
            disabled={loadingRecommendations || !record}
            className="bg-[#0F792C] hover:bg-[#0a5a20] border-none rounded-xl h-10 px-4 font-bold"
          >
            Recommend Nearby Location
          </Button>
          <Button
            type="default"
            icon={<MdLocationOn />}
            onClick={onExtractCities}
            loading={extractingCities}
            disabled={extractingCities || !record}
            className="rounded-xl h-10 px-4 font-bold border-gray-200"
          >
            Extract Cities
          </Button>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-50">
        <h2 className="text-sm uppercase tracking-[0.24em] text-gray-500 font-semibold mb-3">Basic</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            icon={<MdStar />}
            onClick={() => requireAuth('Save Qualified Leads', onSaveQualified)}
            disabled={filteredData.length === 0}
            className="text-amber-600 border-amber-500 hover:bg-amber-50 rounded-xl h-10 px-4 font-bold"
          >
            Save to Qualified Leads
          </Button>
          <div className="w-px h-6 bg-gray-200 mx-1 hidden lg:block" />
          <Button icon={<MdDownload />} onClick={onExportCsv} disabled={filteredData.length === 0} className="rounded-xl h-10 px-4 font-bold border-gray-200">
            CSV
          </Button>
          <Button icon={<MdDescription />} onClick={onExportXls} disabled={filteredData.length === 0} className="rounded-xl h-10 px-4 font-bold border-gray-200">
            XLS
          </Button>
          <Button icon={<MdCloudUpload />} onClick={onImportCsv} className="rounded-xl h-10 px-4 bg-primary text-white border-none font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            Import CSV
          </Button>
          <Button
            icon={<MdCopyAll />}
            onClick={onRemoveDuplicates}
            loading={duplicatesLoading}
            disabled={!record || duplicatesLoading}
            className="rounded-xl h-10 px-4 font-bold border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            Remove Duplicates
          </Button>
          <Button
            icon={<MdGroupAdd />}
            onClick={() => requireAuth('Export to Team', onExportTeam)}
            disabled={filteredData.length === 0}
            className="rounded-xl h-10 px-4 font-bold border-primary text-primary hover:bg-primary/5"
          >
            Export to Team
          </Button>
          <div className="flex-grow" />
          <Button
            className="bg-[#0F792C] hover:bg-[#0a5a20] text-white border-none rounded-xl h-10 px-6 font-black shadow-lg shadow-green-100/40"
            type="primary"
            icon={<BsWhatsapp />}
            onClick={onVerifyAll}
            loading={verifyingAll}
            disabled={verifyingAll || filteredData.length === 0}
          >
            WhatsApp Verification ({filteredData.length})
          </Button>
        </div>
      </div>
    </>
  );
}
