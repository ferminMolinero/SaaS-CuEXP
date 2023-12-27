import express from "express";
import {
  getCompany,
  createCompanyBasic,
  updateCompanyBasic,
  updateUserCompanies,
  updateCompanyTaxes,
  updateCompanyAssets,
  updateCompanyCreditDays,
  updateCompanyInvestments,
  updateCNS1,
  updateCompanySupplies,
  updateCompanyMembers,
} from "../controllers/inbound.js";

const router = express.Router();

router.post("/updateCompanyBasic", updateCompanyBasic);
router.post("/updateCompanyTaxes", updateCompanyTaxes);
router.post("/updateCompanyAssets", updateCompanyAssets);
router.post("/updateCompanySupplies", updateCompanySupplies);
router.post("/updateCompanyMembers", updateCompanyMembers);
router.post("/updateCompanyInvestments", updateCompanyInvestments);
router.post("/updateUserCompanies", updateUserCompanies);
router.post("/updateCNS1", updateCNS1);
router.post("/updateCompanyCreditDays", updateCompanyCreditDays);
router.get("/getCompany/:id", getCompany);
router.post("/createCompanyBasic", createCompanyBasic);

export default router;
