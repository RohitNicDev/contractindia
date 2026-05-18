export const SERVICES_HIERARCHY = [
  {
    id: "consultingservice",
    name: "Consulting Service",
    subServices: [
      {
        id: "epcconsultancy",
        name: "EPC Consultancy",
      },
      {
        id: "projectmanagement",
        name: "Project Management Consultancy",
      },
      {
        id: "architectural",
        name: "Architectural Services",
      },
      {
        id: "mepdesign",
        name: "MEP Design Consultancy",
      },
      {
        id: "hvacdesign",
        name: "HVAC Design Consultancy",
      },
      {
        id: "electricaldesign",
        name: "Electrical Design Consultancy",
      },
      {
        id: "firefightingdesign",
        name: "Fire Fighting Design Consultancy",
      },
      {
        id: "plumbingdesign",
        name: "Plumbing Design Consultancy",
      },
      {
        id: "waterwastewater",
        name: "Water & Waste Water Design Consultancy",
      },
    ],
  },

  /* --------------------------------------------------- */
  /* CONTRACTOR SERVICES */
  /* --------------------------------------------------- */

  {
    id: "contractorservice",
    name: "Contractor Service",
    subServices: [
      {
        id: "epc",
        name: "EPC Contractor",
      },
      {
        id: "building",
        name: "Building Contractor",
      },
      {
        id: "road",
        name: "Road Contractor",
      },

      {
        id: "heavyfabrication",
        name: "Heavy Fabrication Contractor",
        children: [
          {
            id: "heavyfabrication",
            name: "Heavy Fabrication Contractor",
          },
          {
            id: "doorwindow",
            name: "Door & Window Contractor",
          },
        ],
      },

      {
        id: "mepcontractor",
        name: "MEP Contractor",
        children: [
          {
            id: "electrical",
            name: "Electrical Contractor",
          },
          {
            id: "hvac",
            name: "HVAC Contractor",
          },
          {
            id: "firefighting",
            name: "Fire Fighting Contractor",
          },
          {
            id: "plumbing",
            name: "Plumbing Contractor",
          },
          {
            id: "STP",
            name: "STP / WTP / ETP Contractor",
          },
          {
            id: "ELV",
            name: "ELV Contractor",
          },
          {
            id: "Medical",
            name: "Medical Supply Contractor",
          },
          {
            id: "MedicalGas",
            name: "Medical Gas Contractor",
          },
          {
            id: "FireAlarm",
            name: "Fire Alarm Contractor",
          },
          {
            id: "water",
            name: "Water & Waste Water Contractor",
          },
        ],
      },

      {
        id: "facadecontractor",
        name: "Facade Contractor",
        children: [
          {
            id: "glassfacade",
            name: "Glass Facade Contractor",
          },
          {
            id: "acpfacade",
            name: "ACP Facade Contractor",
          },
          {
            id: "stonefacade",
            name: "Stone Facade Contractor",
          },
          {
            id: "GrcFacade",
            name: "GRC Facade Contractor",
          },
        ],
      },

      {
        id: "bridge",
        name: "Bridge Contractor",
      },

      {
        id: "civil",
        name: "Civil Contractor",
      },

      {
        id: "landscapecontractor",
        name: "Landscape Contractor",
        children: [
          {
            id: "hardscape",
            name: "Hard Scape Contractor",
          },
          {
            id: "softscape",
            name: "Soft Scape / Horticulture Contractor",
          },
        ],
      },
    ],
  },

  /* --------------------------------------------------- */
  /* TENDER SERVICES */
  /* --------------------------------------------------- */

  {
    id: "tenderservices",
    name: "Tender Services",
    subServices: [
      {
        id: "governmenttenders",
        name: "Government Tenders",
        children: [
          {
            id: "centralgov",
            name: "Central Govt. Tenders",
          },
          {
            id: "stategov",
            name: "State Govt. Tenders",
          },
        ],
      },

      {
        id: "privatetenders",
        name: "Private Tenders",
        children: [
          {
            id: "individualtenders",
            name: "Individual Tenders",
          },
          {
            id: "builderstenders",
            name: "Builders Tenders",
          },
          {
            id: "contractortenders",
            name: "Contractor Tenders",
          },
        ],
      },
    ],
  },

  /* --------------------------------------------------- */
  /* ASSETS MANAGEMENT */
  /* --------------------------------------------------- */

  {
    id: "assetsmanagement",
    name: "Assets Management",
    subServices: [
      {
        id: "buildingmanagement",
        name: "Building Management Services",
      },
      {
        id: "securityservices",
        name: "Security Services",
      },
      {
        id: "hniassets",
        name: "HNI Assets Management",
      },
      {
        id: "societymanagement",
        name: "Society Management",
      },
      {
        id: "renovationassets",
        name: "Renovation of Assets",
      },
    ],
  },

  /* --------------------------------------------------- */
  /* LEGAL CONTRACTS */
  /* --------------------------------------------------- */

  {
    id: "legalcontracts",
    name: "Legal Contracts",
    subServices: [
      {
        id: "disputeredressal",
        name: "Dispute Redressal Services",
      },
      {
        id: "legaldrafting",
        name: "Legal Contract Drafting Services",
      },
    ],
  },

  /* --------------------------------------------------- */
  /* MARKETING MANAGEMENT */
  /* --------------------------------------------------- */

  {
    id: "marketingmanagement",
    name: "Marketing Management",
    subServices: [
      {
        id: "marketingmanagement",
        name: "Marketing Management",
      },
    ],
  },

  /* --------------------------------------------------- */
  /* MATERIAL SUPPLIER */
  /* --------------------------------------------------- */

  {
    id: "materialsupplier",
    name: "Material Supplier",
    subServices: [
      {
        id: "cementtrades",
        name: "Cement Supplier",
      },
      {
        id: "aluminiumtrades",
        name: "Aluminium Supplier",
      },
      {
        id: "woodentilestrade",
        name: "Wooden Tiles Supplier",
      },
      {
        id: "paintstrade",
        name: "Paint Supplier",
      },
    ],
  },

  /* --------------------------------------------------- */
  /* MATERIAL MANUFACTURE */
  /* --------------------------------------------------- */

  {
    id: "materialmanufacture",
    name: "Material Manufacture",
    subServices: [
      {
        id: "cementmanufacture",
        name: "Cement Manufacture",
      },
      {
        id: "tilesmanufacture",
        name: "Tiles Manufacture",
      },
      {
        id: "paintmanufacture",
        name: "Paint Manufacture",
      },
    ],
  },

  /* --------------------------------------------------- */
  /* CONSTRUCTION AUDIT */
  /* --------------------------------------------------- */

  {
    id: "constructionaudit",
    name: "Construction Audit",
    subServices: [
      {
        id: "constructionaudit",
        name: "Construction Audit",
      },
      {
        id: "qualityverification",
        name: "Verification of Quality",
      },
      {
        id: "boqpreparation",
        name: "BOQ Preparation",
      },
      {
        id: "siteaudit",
        name: "Site Construction Audit",
      },
    ],
  },
];