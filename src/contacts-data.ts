export const contactStatuses = [
  "Active",
  "In Progress",
  "Converted",
  "Cold",
  "Not Interested",
] as const;
export type ContactStatus = (typeof contactStatuses)[number];
export interface DirectoryContact {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  phone: string;
  stage: string;
  status: ContactStatus;
  assignedTo: string;
  city?: string;
  source?: string;
}
// The repeated names and email address are intentional: they appear in Figma.
export const designContacts: DirectoryContact[] = [
  ["John Doe", "Broker", "Active"],
  ["Ananya Verma", "Buyer", "In Progress"],
  ["Ravi Kapoor", "Developer", "Cold"],
  ["Emily Mehra", "Buyer", "Converted"],
  ["John Doe", "Seller", "Not Interested"],
  ["Ananya Verma", "Buyer", "Active"],
  ["Ravi Kapoor", "Investor", "Active"],
  ["Emily Mehra", "Broker", "Active"],
].map(([name, role, status], index) => ({
  id: `figma-${index}`,
  name,
  role,
  status: status as ContactStatus,
  email: "john@urbanrealty.com",
  company: "Urban Realty",
  phone: "+91 9411521487",
  stage: "Negotiation",
  assignedTo: "Jessica Chen",
}));
export const filterGroups = [
  { key: "status", title: "Status", options: [...contactStatuses] },
  {
    key: "role",
    title: "Role",
    options: ["Buyer", "Seller", "Investor", "Broker"],
  },
  {
    key: "assignedTo",
    title: "Assigned To",
    options: ["Jessica", "Mohit", "Arjun", "Emily"],
  },
  {
    key: "city",
    title: "City",
    options: ["Bengaluru", "Pune", "Mumbai", "Hyderbad", "Delhi"],
  },
  {
    key: "source",
    title: "Lead Source",
    options: [
      "Website Form",
      "Referral",
      "Facebook Ads",
      "Walk-In",
      "Email Campaign",
    ],
  },
] as const;
export type FilterKey = (typeof filterGroups)[number]["key"];
export type ContactFilters = Record<FilterKey, string[]>;
export const emptyFilters = (): ContactFilters => ({
  status: [],
  role: [],
  assignedTo: [],
  city: [],
  source: [],
});
export const statusClass = (status: ContactStatus) =>
  status.toLowerCase().replaceAll(" ", "-");
