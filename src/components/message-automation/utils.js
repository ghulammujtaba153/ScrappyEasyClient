/**
 * Helper to check if campaign uses qualified leads
 */
export const isQualifiedLeadsCampaign = (record) => {
    return record?.qualifiedLeadsId && record.qualifiedLeadsId.entries?.length > 0;
};

/**
 * Get recipients list - either from qualified leads or legacy numbers
 */
export const getRecipients = (record) => {
    if (isQualifiedLeadsCampaign(record)) {
        return record.qualifiedLeadsId.entries
            .filter(entry => entry.leadId?.phone) // Only entries with phone numbers
            .map(entry => ({
                _id: entry._id,
                number: entry.leadId.phone,
                businessName: entry.leadId.title || 'Unknown',
                city: entry.leadId.city || '',
                status: entry.messageStatus || 'not-sent',
                sentAt: entry.lastMessagedAt,
                attempts: entry.messageAttempts || 0,
                notes: entry.messageNotes,
                isQualifiedLead: true
            }));
    }
    // Legacy numbers array
    return (record?.numbers || []).map(n => ({
        ...n,
        businessName: null,
        isQualifiedLead: false
    }));
};

/**
 * Calculate Stats - supports both qualified leads and legacy numbers
 */
export const getStats = (record) => {
    const recipients = getRecipients(record);
    if (!recipients.length) return { total: 0, sent: 0, pending: 0, failed: 0 };

    const total = recipients.length;
    const sent = recipients.filter(r => r.status === 'sent' || r.status === 'delivered' || r.status === 'read').length;
    const failed = recipients.filter(r => r.status === 'failed').length;
    const pending = recipients.filter(r => r.status === 'pending' || r.status === 'not-sent').length;
    return { total, sent, failed, pending };
};
