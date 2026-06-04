import React from 'react';
import { Modal, Button, Tag, Tooltip } from 'antd';
import { MdLocationOn, MdContentCopy } from 'react-icons/md';

export default function OperationRecommendCitiesModal({
  open,
  onClose,
  recommendedCities,
  onCopyLocation,
}) {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <MdLocationOn className="text-blue-600 text-xl" />
          <span>Recommended Cities to Explore</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[<Button key="close" onClick={onClose}>Close</Button>]}
      width={600}
    >
      <p className="text-gray-600 mb-4">
        Based on your current data locations, here are 5 nearby cities you should consider searching for more leads:
      </p>
      <div className="space-y-3">
        {recommendedCities.map((city, index) => (
          <div
            key={city.id || index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors"
          >
            <div className="flex-1">
              <div className="font-semibold text-gray-800">
                {index + 1}. {city.city}
              </div>
              <div className="text-sm text-gray-600">
                {city.admin_name && `${city.admin_name}, `}
                {city.country}
              </div>
              {city.population && (
                <div className="text-xs text-gray-500">Population: {city.population.toLocaleString()}</div>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Tag color="green">{city.distance_km} km away</Tag>
                <Tooltip title="Copy operation + location">
                  <Button
                    type="text"
                    size="small"
                    icon={<MdContentCopy />}
                    onClick={() => onCopyLocation(city)}
                    className="text-gray-500 hover:text-primary hover:bg-white"
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Search for businesses in these cities using the same keywords to expand your reach!
        </p>
      </div>
    </Modal>
  );
}
