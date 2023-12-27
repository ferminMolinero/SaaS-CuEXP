import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: {
      //Company form
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    description: {
      //Company form
      type: String,
      max: 500,
    },
    promoters: [
      //Company form
      {
        name: String,
        percentage: Number,
      },
    ],
    yearOfCreation: Number, //Company form
    yearOfAnalysis: Number, //Company form
    taxes: {
      //Tax form
      ivaBuys: Number,
      ivaServices: Number,
      ivaGeneral: Number,
      ivaSales: Number,
      societyTax: Number,
    },
    socialSecurity: {
      //Tax form
      mediumAut: Number,
      growthRate: Number,
      employee: Number,
    },
    customerCreditDays: Number, //Credit Days
    suppliersBuyersCreditDays: Number, //Credit Days
    suppliersServicesCreditDays: Number, //Credit Days
    operativeBox: Number, //Credit Days
    nonCurrentAssets: Array, //Assets form
    nonCurrentInvestments: Array, //Investments form
    customerSegmentCNS: [{ description: String, percentage: Number }], //CNS1
    customerSegmentCNP: [{ description: String, percentage: Number }],
    serviciesCategories: [
      { description: String, percentage: Number, rate: Number, growth: Number }, //CNS1
    ],
    productsCategories: [
      { description: String, percentage: Number, rate: Number, growth: Number },
    ],
    cns1: {
      //CNS1
      salesFirstEx: Number,
      anualGrowth: Number,
      MonthDistribution: Array,
    },
    cnp1: {
      salesFirstEx: Number,
      anualGrowth: Number,
      MonthDistribution: Array,
    },
    cmv1: [
      {
        product: String,
        resources: Number,
        handLabour: Number,
        directSupplies: Number,
        packaging: Number,
        transportation: Number,
        initialStock: { units: Number, valuePerUnit: Number, month: Number },
      },
    ],
    cmv2: [
      {
        product: String,
        components: { name: String, price: Number, anualGrowth: Number },
      },
    ],
    supplies: [
      {
        description: String,
        taxRate: Number,
        pricePerPayment: Number,
        numberOfPayments: Number,
        startMonth: Number,
        annualRate: Number,
      },
    ],
    members: [
      {
        name: String,
        position: String,
        monthlyCost: Number,
        numberOfPayments: Number,
        startedMonth: Number,
        anualGrowth: Number,
      },
    ],
    loans: [
      {
        entityName: String,
        quantity: Number,
        startedMonth: Number,
        openingCommision: Number,
        studyCost: Number,
        interesRate: Number,
        duration: Number,
      },
    ],
    insurances: [
      {
        entityName: String,
        type: String,
        quantity: Number,
        startedMonth: Number,
        endMonth: Number,
        interesType: Number,
        type: Number,
      },
    ],
    resourcesAndSubsides: {
      partners: [
        {
          socialCapital: Number,
          money: Number,
          dividend: Number,
        },
      ],
      subsides: [
        {
          entity: String,
          quantity: Number,
        },
      ],
    },
    initialBalance: {
      totalPassive: Number,
      totalActive: Number,
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", CompanySchema);
export default Company;
