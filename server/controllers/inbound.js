import Company from "../models/Company.js";
import User from "../models/User.js";

//Onteiene la compañía desde mondodb
export const getCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);
    res.status(200).json(company);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateCompanyBasic = async (req, res) => {
  try {
    const { values, company } = req.body;
    const companyDoc = await Company.findById(company);
    if (companyDoc) {
      companyDoc.name = values.name;
      companyDoc.description = values.description;
      companyDoc.promoters = values.promoters;
      companyDoc.yearOfCreation = values.yearOfCreation;
      companyDoc.yearOfAnalysis = values.yearOfAnalysis;
    } else {
      throw "La compañía del estado no existe en la base de datos";
    }
    const savedCompany = await companyDoc.save();
    res.status(200).json(savedCompany);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateCNS1 = async (req, res) => {
  try {
    const { values, company } = req.body;
    const companyDoc = await Company.findById(company);
    if (companyDoc) {
      companyDoc.customerSegmentCNS = values.customerSegmentCNS;
      companyDoc.cns1.salesFirstEx = values.salesFirstEx;
      companyDoc.cns1.anualGrowth = values.anualGrowth;
      companyDoc.serviciesCategories = values.serviciesCategories;
    } else {
      throw "La compañía del estado no existe en la base de datos";
    }
    const savedCompany = await companyDoc.save();
    res.status(200).json(savedCompany);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const updateCompanyTaxes = async (req, res) => {
  try {
    const { values, company } = req.body;
    const companyDoc = await Company.findById(company);
    if (companyDoc) {
      companyDoc.taxes.ivaBuys = values.ivaBuys;
      companyDoc.taxes.ivaServices = values.ivaServices;
      companyDoc.taxes.ivaGeneral = values.ivaGeneral;
      companyDoc.taxes.ivaSales = values.ivaSales;
      companyDoc.taxes.societyTax = values.societyTax;
      companyDoc.socialSecurity.mediumAut = values.mediumAut;
      companyDoc.socialSecurity.growthRate = values.growthRate;
      companyDoc.socialSecurity.employee = values.employee;
    } else {
      throw "La compañía del estado no existe en la base de datos";
    }
    const savedCompany = await companyDoc.save();
    res.status(200).json(savedCompany);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateCompanyCreditDays = async (req, res) => {
  try {
    const { values, company } = req.body;
    const companyDoc = await Company.findById(company);
    if (companyDoc) {
      companyDoc.customerCreditDays = values.customerCreditDays;
      companyDoc.suppliersBuyersCreditDays = values.suppliersBuyersCreditDays;
      companyDoc.suppliersServicesCreditDays =
        values.suppliersServicesCreditDays;
      companyDoc.operativeBox = values.operativeBox;
    } else {
      throw "La compañía del estado no existe en la base de datos";
    }
    const savedCompany = await companyDoc.save();
    res.status(200).json(savedCompany);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateCompanyAssets = async (req, res) => {
  try {
    const { values, company } = req.body;
    const companyDoc = await Company.findById(company);
    if (companyDoc) {
      companyDoc.nonCurrentAssets = values.assets;
    } else {
      throw "La compañía del estado no existe en la base de datos";
    }
    const savedCompany = await companyDoc.save();
    res.status(200).json(savedCompany);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateCompanyInvestments = async (req, res) => {
  try {
    const { values, company } = req.body;
    const companyDoc = await Company.findById(company);
    if (companyDoc) {
      companyDoc.nonCurrentInvestments = values.investments;
    } else {
      throw "La compañía del estado no existe en la base de datos";
    }
    const savedCompany = await companyDoc.save();
    res.status(200).json(savedCompany);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//Actualiza los datos básicos de la compañía. Solo se llama si existe la compañía
export const createCompanyBasic = async (req, res) => {
  try {
    const { name, description, promoters, yearOfCreation, yearOfAnalysis } =
      req.body;
    const companyDoc = new Company({
      name,
      description,
      promoters,
      yearOfCreation,
      yearOfAnalysis,
    });
    const savedCompany = await companyDoc.save();
    res.status(200).json(savedCompany);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateUserCompanies = async (req, res) => {
  try {
    //Las compañías ya las tengo en el state, asi que no debería hacer falta buscarlas
    const { savedCompany, user } = req.body;
    if (user.companies.indexOf(savedCompany._id) == -1)
      user.companies.push(savedCompany._id);
    const userToUpdate = await User.findById(user._id);
    userToUpdate.overwrite(user);
    const savedUserCompany = await userToUpdate.save();
    res.status(200).json(savedUserCompany);
  } catch (e) {
    res.status(404).json({ message: error.message });
  }
};

export const updateCompanySupplies = async (req, res) => {
  try {
    const { values, company } = req.body;
    const companyDoc = await Company.findById(company);
    if (companyDoc) {
      companyDoc.supplies = values.supplies;
    } else {
      throw "La compañía del estado no existe en la base de datos";
    }
    const savedCompany = await companyDoc.save();
    res.status(200).json(savedCompany);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateCompanyMembers = async (req, res) => {
  try {
    const { values, company } = req.body;
    const companyDoc = await Company.findById(company);
    if (companyDoc) {
      companyDoc.members = values.members;
    } else {
      throw "La compañía del estado no existe en la base de datos";
    }
    const savedCompany = await companyDoc.save();
    res.status(200).json(savedCompany);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
