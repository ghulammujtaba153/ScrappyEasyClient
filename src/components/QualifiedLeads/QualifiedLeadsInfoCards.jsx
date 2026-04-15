import React from 'react';

const QualifiedLeadsInfoCards = ({
    totalRecords,
    verifiedWhatsApp,
    calledCount,
    messagedCount
}) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Total Records</p>
                <p className="text-3xl font-bold text-[#0F792C]">{totalRecords}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <p className="text-sm text-gray-500">WhatsApp Verified</p>
                <p className="text-3xl font-bold text-green-600">{verifiedWhatsApp}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Called</p>
                <p className="text-3xl font-bold text-blue-600">{calledCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Messaged</p>
                <p className="text-3xl font-bold text-purple-600">{messagedCount}</p>
            </div>
        </div>
    );
};

export default QualifiedLeadsInfoCards;
