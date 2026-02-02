export const MBA_COMMON_FRESHER_ROLES = [
  "Management Trainee",
  "Business Executive",
  "Relationship Officer",
  "Analyst (Junior level)",
  "Operations Executive",
];

export const MBA_SPECIALIZATIONS = [
  {
    key: "marketing",
    label: "MBA in Marketing",
    interviewLine:
      "Marketing focuses on understanding customer needs and creating value for the business.",
    jobRoles: [
      "Marketing Executive",
      "Sales Executive",
      "Brand Manager",
      "Digital Marketing Analyst",
      "Business Development Executive",
    ],
    focusAreas: [
      "Consumer behavior",
      "Market research",
      "Sales & distribution",
      "Digital marketing",
      "Branding & advertising",
    ],
  },
  {
    key: "finance",
    label: "MBA in Finance",
    interviewLine:
      "Finance focuses on managing money efficiently and supporting business growth.",
    jobRoles: [
      "Financial Analyst",
      "Banking Executive",
      "Investment Analyst",
      "Accounts Manager",
      "Relationship Manager",
    ],
    focusAreas: [
      "Financial planning",
      "Investment analysis",
      "Budgeting & costing",
      "Risk management",
      "Corporate finance",
    ],
  },
  {
    key: "hr",
    label: "MBA in Human Resource (HR)",
    interviewLine:
      "HR focuses on managing people and improving organizational performance.",
    jobRoles: [
      "HR Executive",
      "Talent Acquisition Executive",
      "HR Generalist",
      "Training & Development Officer",
      "Payroll Executive",
    ],
    focusAreas: [
      "Recruitment & selection",
      "Employee relations",
      "Performance management",
      "Training & development",
      "Organizational behavior",
    ],
  },
  {
    key: "operations",
    label: "MBA in Operations / Supply Chain",
    interviewLine:
      "Operations focuses on improving efficiency and reducing operational costs.",
    jobRoles: [
      "Operations Manager",
      "Supply Chain Analyst",
      "Production Planner",
      "Quality Analyst",
      "Logistics Manager",
    ],
    focusAreas: [
      "Process optimization",
      "Supply chain management",
      "Quality control",
      "Inventory management",
      "Project management",
    ],
  },
  {
    key: "business-analytics",
    label: "MBA in Business Analytics / IT",
    interviewLine: "Business Analytics focuses on data-driven decision-making.",
    jobRoles: [
      "Business Analyst",
      "Data Analyst",
      "MIS Executive",
      "Product Analyst",
      "Operations Analyst",
    ],
    focusAreas: [
      "Data analysis",
      "Business intelligence",
      "Decision support systems",
      "Excel, SQL, Power BI",
      "Predictive analysis",
    ],
  },
];

export const getMbaSpecialization = (key) =>
  MBA_SPECIALIZATIONS.find((s) => s.key === key) || MBA_SPECIALIZATIONS[0];

export const getMbaJobRoleSuggestions = (key) => {
  const spec = getMbaSpecialization(key);
  return [...MBA_COMMON_FRESHER_ROLES, ...(spec?.jobRoles || [])];
};

export const getMbaFocusAreas = (key) => {
  const spec = getMbaSpecialization(key);
  return spec?.focusAreas || [];
};
