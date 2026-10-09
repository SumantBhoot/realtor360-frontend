export interface Property {
  id: string;
  name: string;
  type: string;
  units: number;
  price: string;
  leads: number;
  views: number;
  status: string;
  image: string;
}
export const properties: Property[] = [
  {
    id: "maplewood",
    name: "Maplewood House",
    type: "House",
    units: 12,
    price: "Rs.85L",
    leads: 35,
    views: 125,
    status: "8/12 Occupied",
    image: "property-maplewood",
  },
  {
    id: "serenity",
    name: "Serenity Villa",
    type: "Villa",
    units: 9300,
    price: "Rs.2.8Cr",
    leads: 40,
    views: 930,
    status: "Available",
    image: "property-serenity",
  },
  {
    id: "rosehill",
    name: "Rosehill Cottage",
    type: "House",
    units: 25,
    price: "Rs.1.1Cr",
    leads: 15,
    views: 355,
    status: "Available",
    image: "property-rosehill",
  },
  {
    id: "skyline",
    name: "Skyline Edge",
    type: "Apartment",
    units: 17,
    price: "Rs.75L",
    leads: 11,
    views: 425,
    status: "Sold Out",
    image: "property-skyline",
  },
];
export interface Contact {
  name: string;
  location: string;
  image: string;
  email?: string;
}
export const contacts: Contact[] = [
  { name: "John Doe", location: "New York", image: "contact-john" },
  {
    name: "Jessica Chen",
    location: "California, LA",
    image: "contact-jessica",
    email: "jessica.chen@email.com",
  },
  { name: "Evan Chris", location: "New York", image: "contact-evan" },
  { name: "Jack B.", location: "Ohio, Columbus", image: "contact-jack" },
  { name: "Emily Paris", location: "California, LA", image: "contact-emily" },
];
export const reminders = [
  { title: "Follow-Ups", description: "15 leads need to be followed up." },
  {
    title: "Submit Final Offer- Villa Deal",
    description: "Finalize and send offer documents.",
  },
  {
    title: "Review Contract with Legal",
    description: "Ensure attorney reviews apartment deal contract today.",
  },
  {
    title: "Call Jessica Chen – Follow-up",
    description: "Discuss her feedback after site visit to Angel Plaza.",
  },
];
export const schedule = [
  {
    title: "Visit Client- Angel Plaza",
    description: "Sector 45, Gurugram, Haryana",
    category: "visit",
    day: 10,
  },
  {
    title: "Visit Client – Site Walkthrough",
    description: "Whitefield Road, Bengaluru, Karnataka",
    category: "visit",
    day: 10,
  },
  {
    title: "Follow Up – Jessica Chen",
    description: "jessica.chen@email.com",
    category: "followup",
    day: 14,
  },
  {
    title: "Follow Up – Roger Bouchard",
    description: "roger.bouchard@clientmail.com",
    category: "followup",
    day: 14,
  },
  {
    title: "Submit Final Offer – Villa Deal",
    description: "Finalize and send offer documents.",
    category: "offer",
    day: 11,
  },
  {
    title: "Submit Internal Review – Apartment PricingFinal Offer – Villa Deal",
    description: "Update CRM with latest market rates.",
    category: "offer",
    day: 11,
  },
];
export const developments = [
  { name: "Angel Plaza", color: "#D4AF37", count: 3 },
  { name: "Angel Garden", color: "#EEDFAF", count: 1 },
  { name: "None", color: "#F6EFD7", count: 14 },
];
export const stages = [
  "Interested",
  "Site Visit Done",
  "Unit Shortlisted",
  "Contracts Signed",
  "Offer Initiated",
  "Offer Accepted",
];
