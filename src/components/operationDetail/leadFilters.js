/** Apply operation detail filters to flattened lead rows */
export function filterLeads(flattenedData, filters) {
  if (!flattenedData.length) return [];

  let filtered = [...flattenedData];

  if (filters.locationSearch) {
    const lowerSearch = filters.locationSearch.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        (item.city && item.city.toLowerCase().includes(lowerSearch)) ||
        (item.address && item.address.toLowerCase().includes(lowerSearch)) ||
        (item.title && item.title.toLowerCase().includes(lowerSearch))
    );
  }

  if (filters.countries.length > 0) {
    filtered = filtered.filter((item) =>
      filters.countries.some((country) => {
        const lowerCountry = country.toLowerCase();
        return (
          item.searchString?.toLowerCase().includes(lowerCountry) ||
          item.address?.toLowerCase().includes(lowerCountry)
        );
      })
    );
  }

  if (filters.states.length > 0) {
    filtered = filtered.filter((item) =>
      filters.states.some((state) => {
        const lowerState = state.toLowerCase();
        return (
          item.searchString?.toLowerCase().includes(lowerState) ||
          item.address?.toLowerCase().includes(lowerState)
        );
      })
    );
  }

  if (filters.cities.length > 0) {
    filtered = filtered.filter((item) =>
      filters.cities.some((city) => {
        const lowerCity = city.toLowerCase();
        return (
          item.searchString?.toLowerCase().includes(lowerCity) ||
          item.address?.toLowerCase().includes(lowerCity)
        );
      })
    );
  }

  if (filters.whatsappStatus) {
    filtered = filtered.filter((item) => {
      const status = item.whatsappStatus;
      if (filters.whatsappStatus === 'verified') return status === 'verified';
      if (filters.whatsappStatus === 'not-verified') return status === 'not-verified';
      if (filters.whatsappStatus === 'not-checked') {
        return !status || status === 'not-checked' || status === '';
      }
      return true;
    });
  }

  if (filters.ratingMin != null) {
    filtered = filtered.filter((item) => {
      const rating = parseFloat(item.rating);
      return !Number.isNaN(rating) && rating >= filters.ratingMin;
    });
  }

  if (filters.ratingMax != null) {
    filtered = filtered.filter((item) => {
      const rating = parseFloat(item.rating);
      return !Number.isNaN(rating) && rating <= filters.ratingMax;
    });
  }

  if (filters.reviewsMin != null) {
    filtered = filtered.filter((item) => {
      const reviews = parseInt(item.reviews, 10);
      return !Number.isNaN(reviews) && reviews >= filters.reviewsMin;
    });
  }

  if (filters.reviewsMax != null) {
    filtered = filtered.filter((item) => {
      const reviews = parseInt(item.reviews, 10);
      return !Number.isNaN(reviews) && reviews <= filters.reviewsMax;
    });
  }

  if (filters.hasWebsite) {
    filtered = filtered.filter((item) => {
      const hasWebsite = item.website && item.website.trim() !== '';
      return filters.hasWebsite === 'yes' ? hasWebsite : !hasWebsite;
    });
  }

  if (filters.hasPhone) {
    filtered = filtered.filter((item) => {
      const hasPhone = item.phone && item.phone.trim() !== '';
      return filters.hasPhone === 'yes' ? hasPhone : !hasPhone;
    });
  }

  if (filters.hasEmail) {
    filtered = filtered.filter((item) => {
      const hasEmail = item.emails && item.emails.length > 0;
      return filters.hasEmail === 'yes' ? hasEmail : !hasEmail;
    });
  }

  if (filters.addsRunning) {
    filtered = filtered.filter((item) => {
      const adStatus = item.addsRunning;
      if (filters.addsRunning === 'running') return adStatus === 'running';
      if (filters.addsRunning === 'not-running') return adStatus === 'not-running';
      if (filters.addsRunning === 'not-available') return adStatus === 'not-available';
      return true;
    });
  }

  if (filters.hasSocials) {
    filtered = filtered.filter((item) => {
      const hasSocials = item.socialMedia && Object.values(item.socialMedia).some((url) => url);
      return filters.hasSocials === 'yes' ? hasSocials : !hasSocials;
    });
  }

  if (filters.favorite) {
    filtered = filtered.filter((item) => {
      const isFavorite = !!item.favorite;
      return filters.favorite === 'yes' ? isFavorite : !isFavorite;
    });
  }

  return filtered;
}

export function computeVerificationStats(flattenedData) {
  const phonesWithNumbers = flattenedData.filter((item) => item.phone);
  let verified = 0;
  let notVerified = 0;
  let notChecked = 0;

  phonesWithNumbers.forEach((item) => {
    const status = item.whatsappStatus;
    if (status === 'verified') verified++;
    else if (status === 'not-verified') notVerified++;
    else notChecked++;
  });

  const allLeads = flattenedData.length;
  const withPhone = phonesWithNumbers.length;

  return {
    allLeads,
    withPhone,
    withoutPhone: Math.max(0, allLeads - withPhone),
    verified,
    notVerified,
    notChecked,
  };
}

export function hasActiveFilters(filters) {
  return !!(
    filters.locationSearch ||
    filters.whatsappStatus ||
    filters.ratingMin !== null ||
    filters.ratingMax !== null ||
    filters.reviewsMin !== null ||
    filters.reviewsMax !== null ||
    filters.hasWebsite ||
    filters.hasPhone ||
    filters.hasEmail ||
    filters.hasSocials ||
    filters.addsRunning ||
    filters.favorite
  );
}
