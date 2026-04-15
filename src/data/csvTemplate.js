export const CSV_TEMPLATE_HEADERS = [
  "title",
  "rating",
  "reviews",
  "phone",
  "address",
  "city",
  "website",
  "googleMapsLink"
];

export const CSV_DUMMY_DATA = [
  {
    title: "Example Business 1",
    rating: "4.8",
    reviews: "150",
    phone: "+1 123 456 7890",
    address: "123 Broadway, New York, NY 10001",
    city: "New York",
    website: "https://example.com",
    googleMapsLink: "https://maps.google.com/?q=New+York"
  },
  {
    title: "Example Business 2",
    rating: "4.2",
    reviews: "85",
    phone: "+44 20 7123 4567",
    address: "456 Regent St, London, UK",
    city: "London",
    website: "https://example.co.uk",
    googleMapsLink: "https://maps.google.com/?q=London"
  },
  {
    title: "Example Business 3",
    rating: "4.5",
    reviews: "230",
    phone: "+971 4 123 4567",
    address: "Downtown Dubai, UAE",
    city: "Dubai",
    website: "https://example.ae",
    googleMapsLink: "https://maps.google.com/?q=Dubai"
  }
];

export const downloadCSVTemplate = () => {
  const content = [
    CSV_TEMPLATE_HEADERS.join(","),
    ...CSV_DUMMY_DATA.map(row => 
      CSV_TEMPLATE_HEADERS.map(header => `"${(row[header] || "").toString().replace(/"/g, '""')}"`).join(",")
    )
  ].join("\n");

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "operation_import_template.csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
