-- ============================================================================
-- MASTER SQL SEED SCRIPT FOR LAB_PACKAGES (ALL 62 PACKAGES & SINGLE TESTS)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS lab_packages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    test_count INT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    original_price DOUBLE PRECISION,
    description TEXT,
    details_json TEXT,
    category_tags VARCHAR(500),
    fasting_required BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_lab_packages_category_tags_gin 
ON lab_packages USING gin (category_tags gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_lab_packages_price ON lab_packages (price);
CREATE INDEX IF NOT EXISTS idx_lab_packages_name ON lab_packages (name);

-- ============================================================================
-- INSERT ALL 62 PACKAGES & SINGLE TESTS
-- ============================================================================
INSERT INTO lab_packages (
    name, 
    test_count, 
    price, 
    original_price, 
    description, 
    fasting_required, 
    category_tags, 
    details_json
)
VALUES 
-- =========================================================================
-- 1. FULL BODY HEALTH PACKAGES (10 PACKAGES)
-- =========================================================================
(
    'Basic health check up',
    62,
    999.0,
    2500.0,
    'Lipid Advanced (10 parameters: Total Cholesterol, HDL Cholesterol - Direct, LDL Cholesterol - Direct, LDL / HDL Ratio, NON-HDL Cholesterol, TC/ HDL Cholesterol Ratio, Triglycerides, VLDL Cholesterol, HDL / LDL Ratio, TRIG / HDL Ratio)
Liver Extended (12 parameters: Alkaline Phosphatase, Bilirubin - Direct, Bilirubin - Total, Bilirubin - Indirect, Gamma Glutamyl Transferase, Protein - Total, Serum Albumin, Serum Globulin, SGOT [AST], SGPT [ALT], Serum Albumin / Globulin Ratio, SGOT / SGPT Ratio)
Kidney Advanced (7 parameters: BUN/Creatinine Ratio, Blood Urea Nitrogen [BUN], Calcium, Serum Creatinine, Uric Acid, Urea [Calculated], Urea / SR. Creatinine Ratio)
Thyroid Advanced (3 parameters: Total Triiodothyronine [T3], Total Thyroxine [T4], Ultrasensitive TSH [UTSH])
Diabetes Profile (2 parameters: Average Blood Glucose [ABG], HbA1c)
Complete Hemogram (28 parameters: Lymphocytes, Monocytes, Neutrophils, Basophils, Eosinophils, Hemoglobin, Immature Granulocytes, Total Leucocytes Count [WBC], MCH, MCHC, MCV, MPV, Platelet Count, Total RBC, RDW-CV, RDW-SD, PCV)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours of Fasting is Essential | Report Turnaround: Same Day',
    true,
    'FullBody',
    '{"profiles":["Lipid Advanced (10)","Liver Extended (12)","Kidney Advanced (7)","Thyroid Advanced (3)","Diabetes Profile (2)","CBC (28)"]}'
),
(
    'Aarogyam full body checkup with vitamins',
    95,
    1499.0,
    2999.0,
    'Thyroid Advanced (3 parameters: TSH - Ultrasensitive, Total Thyroxine [T4], Total Triiodothyronine [T3])
Lipid Advanced+ (10 parameters: Total Cholesterol, Triglycerides, HDL Cholesterol - Direct, HDL / LDL Ratio, LDL Cholesterol - Direct, LDL / HDL Ratio, Non-HDL Cholesterol, TC / HDL Cholesterol Ratio, Trig / HDL Ratio, VLDL Cholesterol)
Liver Extended (12 parameters: Bilirubin - Total, SGOT / SGPT Ratio, Aspartate Aminotransferase [SGOT], Alanine Transaminase [SGPT], Alkaline Phosphatase, Bilirubin - Direct, Bilirubin [Indirect], Serum Albumin/Globulin Ratio, Protein - Total, Albumin - Serum, Serum Globulin, Gamma Glutamyl Transferase [GGT])
Kidney Advanced (7 parameters: BUN / Sr. Creatinine Ratio, Blood Urea Nitrogen [BUN], Creatinine - Serum, Urea / Sr. Creatinine Ratio, Urea [Calculated], Calcium, Uric Acid)
Iron Deficiency Profile (4 parameters: Iron, % Transferrin Saturation, Total Iron Binding Capacity [TIBC], Unsat. Iron-Binding Capacity [UIBC])
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose [ABG])
Vitamins Profile (2 parameters: 25-OH Vitamin D [Total], Vitamin B-12)
Electrolytes (2 parameters: Sodium, Chloride)
Complete Hemogram (28 parameters: Hemoglobin, Total WBC, RBC Count, Platelets, MCV, MCH, MCHC, RDW, ESR, Differential Count)
Cardiac Risk Marker (1 parameter: High Sensitivity C-Reactive Protein [hs-CRP])
Complete Urine Analysis (24 parameters: Specific Gravity, Appearance, Bacteria, Urinary Bilirubin, Urine Blood, Urobilinogen, Bile Pigment, Bile Salt, Casts, Colour, Crystals, Epithelial Cells, Urinary Glucose, Urine Ketone, Leucocyte Esterase, Urinary Leucocytes, Mucus, Nitrite, pH, Urinary Protein, Red Blood Cells, Volume)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours Essential | Report Turnaround: Same Day',
    true,
    'FullBody',
    '{"profiles":["Thyroid Advanced (3)","Lipid Advanced+ (10)","Liver Extended (12)","Kidney Advanced (7)","Iron Deficiency Profile (4)","Diabetes Profile (2)","Vitamins Profile (2)","Electrolytes (2)","CBC (28)","High Sensitivity C-Reactive Protein (1)","Complete Urine Analysis (24)"]}'
),
(
    'Aarogyam Full Body checkup with cardiac care',
    76,
    1999.0,
    3740.0,
    'Thyroid Profile (3 parameters: Total T3, Total T4, Ultrasensitive TSH [UTSH])
Lipid Profile (10 parameters: Total Cholesterol, HDL Direct, LDL Direct, LDL/HDL Ratio, Non-HDL Cholesterol, TC/HDL Ratio, Triglycerides, VLDL, HDL/LDL Ratio, TRIG/HDL Ratio)
Liver Profile (12 parameters: Alkaline Phosphatase, Bilirubin Direct, Bilirubin Total, Bilirubin Indirect, GGT, Total Protein, Albumin, Globulin, SGOT, SGPT, A/G Ratio, SGOT/SGPT Ratio)
Kidney Profile (7 parameters: BUN/Creatinine Ratio, BUN, Calcium, Serum Creatinine, Uric Acid, Urea, Urea/Creatinine Ratio)
Iron Deficiency Profile (4 parameters: Iron, % Transferrin Saturation, TIBC, UIBC)
Cardiac Risk Markers (5 parameters: Lipoprotein - A, Apolipoprotein - A1, Apolipoprotein - B, Apo B/Apo A1 Ratio, High Sensitivity C-reactive Protein [hs-CRP])
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose [ABG])
Vitamin Profile (2 parameters: 25-OH Vitamin D Total, Vitamin B12)
Serum Electrolytes (2 parameters: Sodium, Chloride)
Testosterone (1 parameter: Total Testosterone)
Complete Hemogram (28 parameters: CBC 28 Parameters)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours Essential | Report Turnaround: Same Day',
    true,
    'FullBody',
    '{"profiles":["Thyroid Profile (3)","Lipid Profile (10)","Liver Profile (12)","Kidney Profile (7)","Iron Deficiency Profile (4)","Cardiac Risk Markers (5)","Diabetes Profile (2)","Vitamin Profile (2)","Serum Electrolytes Profile (2)","Testosterone","CBC (28)"]}'
),
(
    'Advance premium full body checkup Essential Markers',
    142,
    4399.0,
    7805.0,
    'Thyroid Profile (3 parameters: Total T3, Total T4, Ultrasensitive TSH)
Lipid Profile (10 parameters: Total Cholesterol, HDL Direct, LDL Direct, LDL/HDL Ratio, Non-HDL, TC/HDL Ratio, Triglycerides, VLDL, HDL/LDL Ratio, TRIG/HDL Ratio)
Liver Profile (12 parameters: Bilirubin Total, Direct, Indirect, SGOT, SGPT, Total Protein, Albumin, Globulin, GGT, Alkaline Phosphatase, A/G Ratio, SGOT/SGPT Ratio)
Kidney Profile (7 parameters: BUN/Creatinine Ratio, BUN, Calcium, Serum Creatinine, Uric Acid, Urea, Urea/Creatinine Ratio)
Iron Deficiency Profile (4 parameters: Iron, % Transferrin Saturation, TIBC, UIBC)
Serum Electrolytes (2 parameters: Sodium, Chloride)
Complete Urine Analysis (24 parameters: Routine & Microscopic Urine Examination)
Diabetes Profile (2 parameters: Fasting Sugar, HbA1c, ABG)
Complete Hemogram (28 parameters: CBC 28 Vital Parameters)
Vitamin Profile (2 parameters: 25-OH Vitamin D Total, Vitamin B12)
Cardiac Risk Markers (4 parameters: hs-CRP, Homocysteine, Lp(a), Apo B/A1)
Pancreas Profile (2 parameters: Serum Amylase, Serum Lipase)
Microalbuminuria (3 parameters: Urine Microalbumin, Urine Creatinine, Albumin/Creatinine Ratio)
Arthritis Profile (2 parameters: Rheumatoid Factor, Anti-CCP)
Elements 22 [Toxic & Nutrients] (22 parameters: Aluminium, Arsenic, Barium, Cadmium, Caesium, Mercury, Lead, Tin, Bismuth, Beryllium, Antimony, Strontium, Thallium, Uranium, Cobalt, Chromium, Molybdenum, Silver, Vanadium, Selenium, Nickel, Manganese)
Additional Essential Tests (15 parameters: Testosterone, Fructosamine, Magnesium, Phosphorous, Zinc)
Sample Type: Blood & Urine | Fasting: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'FullBody',
    '{"profiles":["Thyroid Profile (3)","Lipid Profile (10)","Liver Profile (12)","Kidney Profile (7)","Iron Deficiency Profile (4)","Serum Electrolytes (2)","Complete Urine Analysis (24)","Diabetes Profile (2)","CBC (28)","Vitamin Profile (2)","Cardiac Risk Markers (4)","Pancreas Profile (2)","Microalbuminuria (3)","Arthritis Profile (2)","Elements 22 [Toxic & Nutrients] (22)","Additional Essential Tests"]}'
),
(
    'Comprehensive basic full body checkup with vitamin',
    83,
    1299.0,
    2999.0,
    'Thyroid Basic (1 parameter: Ultrasensitive TSH)
Lipid Advanced+ (10 parameters: Total Cholesterol, HDL Direct, LDL Direct, LDL/HDL Ratio, Non-HDL, TC/HDL Ratio, Triglycerides, VLDL, HDL/LDL Ratio, TRIG/HDL Ratio)
Liver Advanced (11 parameters: Bilirubin Total, Bilirubin Direct, Bilirubin Indirect, SGOT, SGPT, SGOT/SGPT Ratio, Total Protein, Albumin, Globulin, A/G Ratio, Alkaline Phosphatase)
Kidney Basic (5 parameters: Serum Creatinine, Blood Urea Nitrogen, Uric Acid, Calcium, BUN/Creatinine Ratio)
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose [ABG])
Vitamins Profile (2 parameters: 25-OH Vitamin D Total, Vitamin B12)
Complete Hemogram (28 parameters: CBC Complete Count)
Complete Urine Analysis (24 parameters: Routine & Microscopic Urine Profile)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'FullBody',
    '{"profiles":["Thyroid Basic (1)","Lipid Advanced+ (10)","Liver Advanced (11)","Kidney Basic (5)","Diabetes Profile (2)","Vitamins Profile (2)","CBC (28)","Complete Urine Analysis (24)"]}'
),
(
    'Comprehensive bronze Full Body checkup with cardiac & vitamins',
    122,
    1899.0,
    5999.0,
    'Iron Deficiency Profile (4 parameters: Total Iron Binding Capacity, % Transferrin Saturation, Iron, UIBC)
Liver Profile (12 parameters: Bilirubin Total, Direct, Indirect, SGOT, SGPT, Total Protein, Albumin, Globulin, GGT, Alkaline Phosphatase, Ratios)
Complete Hemogram (28 parameters: CBC 28 Parameters)
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose)
Cardiac Risk Markers (5 parameters: hs-CRP, Lipoprotein - A, Apo A1, Apo B, Apo B/A1 Ratio)
Kidney Profile (7 parameters: Serum Creatinine, BUN, Calcium, Uric Acid, Calculated Urea, Ratios)
Toxic Elements (22 parameters: Aluminium, Arsenic, Barium, Cadmium, Lead, Mercury, Selenium, Nickel, Zinc, Copper, etc.)
Serum Electrolytes (2 parameters: Sodium, Chloride)
Lipid Profile (10 parameters: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Ratios)
Vitamin Profile (2 parameters: 25-OH Vitamin D Total, Vitamin B12)
Cancer Markers (1 parameter: Carcino Embryonic Antigen [CEA])
Thyroid Profile (3 parameters: Total T3, Total T4, UTSH)
Complete Urine Analysis (24 parameters: Complete Urine Examination)
Sample Type: Blood & Urine | Fasting: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'FullBody',
    '{"profiles":["Iron Deficiency Profile (4)","Liver Profile (12)","CBC (28)","Diabetes Profile (2)","Cardiac Risk Markers (5)","Kidney Profile (7)","Toxic Elements (22)","Serum Electrolytes Profile (2)","Lipid Profile (10)","Vitamin Profile (2)","Cancer Markers (1)","Thyroid Profile (3)","Complete Urine Analysis (24)"]}'
),
(
    'Comprehensive plus full body checkup with Vitamins',
    101,
    1799.0,
    3999.0,
    'Thyroid Profile (3 parameters: Total T3, Total T4, Ultrasensitive TSH)
Liver Profile (12 parameters: Total Bilirubin, Direct, Indirect, SGOT, SGPT, Total Protein, Albumin, Globulin, GGT, Alkaline Phosphatase, Ratios)
Advanced Kidney Profile (11 parameters: BUN, Creatinine, Calcium, Uric Acid, Urea, Electrolytes, Ratios)
Lipid Profile (10 parameters: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Non-HDL, Ratios)
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose)
Iron Deficiency Profile (4 parameters: Iron, TIBC, UIBC, % Transferrin Saturation)
Cardiac Risk Markers (5 parameters: hs-CRP, Lp(a), Apo A1, Apo B, Apo B/A1 Ratio)
Vitamins Profile (2 parameters: Vitamin D Total, Vitamin B12)
Complete Hemogram (28 parameters: CBC 28 Parameters)
Complete Urine Analysis (24 parameters: Physical, Chemical & Microscopic Urine Examination)
Sample Type: Blood & Urine | Fasting: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'FullBody',
    '{"profiles":["Thyroid Profile (3)","Liver Profile (12)","Advanced Kidney Profile (11)","Lipid Profile (10)","Diabetes Profile (2)","Iron Deficiency Profile (4)","Cardiac Risk Markers (5)","Vitamins Profile (2)","CBC (28)","Complete Urine Analysis (24)"]}'
),
(
    'EXECUTIVE FULL BODY CHECKUP',
    128,
    2399.0,
    3999.0,
    'Diabetes Profile (4 parameters: Fasting Sugar, HbA1c, ABG, Urinary Microalbumin)
Vitamin Profile (2 parameters: 25-OH Vitamin D Total, Vitamin B12)
Metabolic & Arthritis (3 parameters: ESR, Serum Magnesium, Phosphorous)
Elements (1 parameter: Serum Zinc)
Complete Hemogram (30 parameters: CBC with Red Cell Indices & Platelet Distribution)
Liver Profile (12 parameters: Total Bilirubin, Direct, Indirect, SGOT, SGPT, Total Protein, Albumin, Globulin, GGT, Alkaline Phosphatase, Ratios)
Serum Electrolytes (3 parameters: Sodium, Potassium, Chloride)
Toxic Elements (22 parameters: Aluminium, Arsenic, Barium, Cadmium, Caesium, Mercury, Lead, Tin, Bismuth, Beryllium, Antimony, Strontium, Thallium, Uranium, Cobalt, Chromium, Molybdenum, Silver, Vanadium, Selenium, Nickel, Manganese)
Iron Deficiency Profile (4 parameters: Iron, TIBC, UIBC, Transferrin Saturation)
Renal Profile (10 parameters: BUN, Creatinine, Uric Acid, Calcium, Urea, BUN/Creatinine Ratio, Urea/Creatinine Ratio, Electrolytes)
Lipid Profile (10 parameters: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Non-HDL, Ratios)
Thyroid Profile (3 parameters: Total T3, Total T4, UTSH)
Complete Urine Analysis (24 parameters: Physical, Chemical & Microscopic Urine Tests)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'FullBody',
    '{"profiles":["Diabetes Profile (4)","Vitamin Profile (2)","Other Counts / ESR (1)","Metabolic Magnesium (1)","Arthritis Phosphorous (1)","Elements Zinc (1)","Complete Urine Analysis (24)","Complete Hemogram (30)","Liver Profile (12)","Electrolytes (3)","Toxic Elements (22)","Iron Deficiency Profile (4)","Renal Profile (10)","Lipid Profile (10)","Thyroid Profile (3)"]}'
),
(
    'Premium full body checkup',
    109,
    3249.0,
    5799.0,
    'Thyroid Advanced (3 parameters: Total T3, Total T4, UTSH)
Lipid Advanced+ (10 parameters: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Ratios)
Liver Extended (12 parameters: Total Bilirubin, Direct, Indirect, SGOT, SGPT, GGT, Alkaline Phosphatase, Total Protein, Albumin, Globulin, Ratios)
Kidney Advanced (7 parameters: BUN, Creatinine, Calcium, Uric Acid, Calculated Urea, Ratios)
Iron Deficiency Profile (4 parameters: Iron, TIBC, UIBC, % Transferrin Saturation)
Cardiac Risk Markers (5 parameters: hs-CRP, Lp(a), Apo A1, Apo B, Apo B/A1 Ratio)
Diabetes Profile (2 parameters: HbA1c, ABG)
Vitamins Profile (2 parameters: 25-OH Vitamin D Total, Vitamin B12)
Serum Electrolytes (2 parameters: Sodium, Chloride)
Pancreas Profile (2 parameters: Serum Amylase, Serum Lipase)
Complete Hemogram (28 parameters: CBC Complete Count)
Arthritis / RF (1 parameter: Rheumatoid Factor)
Additional Vital Markers (7 parameters: Phosphorous, Fructosamine, Magnesium, Ferritin, Folate)
Complete Urine Analysis (24 parameters: Urine Examination)
Sample Type: Blood & Urine | Fasting: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'FullBody',
    '{"profiles":["Thyroid Advanced (3)","Lipid Advanced+ (10)","Liver Extended (12)","Kidney Advanced (7)","Iron Deficiency Profile (4)","Cardiac Risk Markers (5)","Diabetes Profile (2)","Vitamins Profile (2)","Electrolytes (2)","Pancreas Profile (2)","CBC (28)","Arthritis / RF (1)","Additional Vital Markers","Complete Urine Analysis (24)"]}'
),
(
    'Wellness 360 full body checkup with vitamin',
    106,
    1750.0,
    2999.0,
    'Thyroid Profile (3 parameters: Total T3, Total T4, Ultrasensitive TSH)
Lipid Profile (10 parameters: Total Cholesterol, HDL Direct, LDL Direct, LDL/HDL Ratio, Non-HDL, TC/HDL Ratio, Triglycerides, VLDL, HDL/LDL Ratio, TRIG/HDL Ratio)
Liver Profile (12 parameters: Bilirubin Total, Direct, Indirect, SGOT, SGPT, Total Protein, Albumin, Globulin, GGT, Alkaline Phosphatase, A/G Ratio, SGOT/SGPT Ratio)
Kidney Profile (7 parameters: Serum Creatinine, BUN, Calcium, Uric Acid, Calculated Urea, BUN/Creatinine Ratio, Urea/Creatinine Ratio)
Iron Deficiency Profile (5 parameters: Iron, TIBC, UIBC, % Transferrin Saturation, Ferritin)
Cardiac Risk Markers (5 parameters: hs-CRP, Lipoprotein - A, Apo A1, Apo B, Apo B/A1 Ratio)
Vitamin Profile (3 parameters: 25-OH Vitamin D Total, Vitamin B12, Folic Acid)
Diabetes Profile (3 parameters: Fasting Blood Sugar, HbA1c, ABG)
Serum Electrolytes (2 parameters: Sodium, Chloride)
Other Counts (2 parameters: ESR, Serum Magnesium)
Complete Hemogram (28 parameters: CBC Complete)
Complete Urine Analysis (24 parameters: Complete Urine Examination)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'FullBody',
    '{"profiles":["Thyroid Profile (3)","Lipid Profile (10)","Liver Profile (12)","Kidney Profile (7)","Iron Deficiency Profile (5)","Cardiac Risk Markers (5)","Vitamin Profile (3)","Diabetes Profile (3)","Elements (2)","Electrolytes (2)","ESR (1)","Magnesium (1)","CBC (28)","Complete Urine Analysis (24)"]}'
),

-- =========================================================================
-- 2. DEMOGRAPHIC PACKAGES (MEN, WOMEN, SENIORS) (6 PACKAGES)
-- =========================================================================
(
    'Senior citizens male',
    127,
    2749.0,
    5000.0,
    'Thyroid Profile (3 parameters: Total Thyroxine [T4], Total Triiodothyronine [T3], Ultrasensitive TSH [UTSH])
Lipid Profile (10 parameters: Total Cholesterol, HDL Cholesterol - Direct, LDL Cholesterol - Direct, LDL / HDL Ratio, NON-HDL Cholesterol, TC/ HDL Cholesterol Ratio, Triglycerides, VLDL Cholesterol, HDL / LDL Ratio, TRIG / HDL Ratio)
Liver Profile (12 parameters: Alkaline Phosphatase, Bilirubin - Direct, Bilirubin - Total, Bilirubin - Indirect, Gamma Glutamyl Transferase, Protein - Total, Serum Albumin, Serum Globulin, SGOT [AST], SGPT [ALT], Serum Albumin / Globulin Ratio, SGOT / SGPT Ratio)
Kidney Profile (7 parameters: BUN / Creatinine Ratio, Blood Urea Nitrogen [BUN], Calcium, Serum Creatinine, Uric Acid, Urea [Calculated], Urea / SR. Creatinine Ratio)
Iron Deficiency Profile (5 parameters: Total Iron Binding Capacity [TIBC], % Transferrin Saturation, Iron, Unsat. Iron-binding Capacity [UIBC], Ferritin)
Serum Electrolytes (2 parameters: Sodium, Chloride)
Diabetes Profile (3 parameters: Fasting Blood Sugar [Glucose], HbA1c, Average Blood Glucose [ABG])
Complete Hemogram (28 parameters: CBC Complete Count)
Vitamin Profile (2 parameters: 25-OH Vitamin D [Total], Vitamin B12)
Cardiac Risk Markers (5 parameters: Lipoprotein - A, Apolipoprotein - A1, Apolipoprotein - B, Apo B/Apo A1 Ratio, High Sensitivity C-reactive Protein [hs-CRP])
Pancreas Profile (2 parameters: Serum Amylase, Serum Lipase)
Cancer Markers (2 parameters: Carcino Embryonic Antigen [CEA], Prostate Specific Antigen [PSA])
Elements 22 [Toxic & Nutrients] (22 parameters: Aluminium, Arsenic, Barium, Cadmium, Caesium, Mercury, Lead, Tin, Bismuth, Beryllium, Antimony, Strontium, Thallium, Uranium, Cobalt, Chromium, Molybdenum, Silver, Vanadium, Selenium, Nickel, Manganese)
Complete Urine Analysis (24 parameters: Specific Gravity, Urinary Bilirubin, Urine Blood, Urobilinogen, Urinary Glucose, Urine Ketone, Urinary Leucocytes, Nitrite, pH, Urinary Protein, Appearance, Colour, Microalbumin, Volume, Bile Salt, Epithelial Cells, Casts, Crystals, Bacteria, Red Blood Cells)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours Essential | Report Turnaround: Same Day',
    true,
    'SeniorCtznMale',
    '{"profiles":["Thyroid Profile (3)","Lipid Profile (10)","Liver Profile (12)","Kidney Profile (7)","Iron Deficiency Profile (5)","Serum Electrolytes (2)","Diabetes Profile (3)","CBC (28)","Vitamin Profile (2)","Cardiac Risk Markers (5)","Pancreas Profile (2)","Cancer Markers [PSA, CEA] (2)","Elements 22 [Toxic & Nutrients] (22)","Complete Urine Analysis (24)"]}'
),
(
    'Senior citizens female',
    127,
    2749.0,
    5000.0,
    'Thyroid Profile (3 parameters: Total Thyroxine [T4], Total Triiodothyronine [T3], Ultrasensitive TSH [UTSH])
Lipid Profile (10 parameters: Total Cholesterol, HDL Cholesterol - Direct, LDL Cholesterol - Direct, LDL / HDL Ratio, NON-HDL Cholesterol, TC/ HDL Cholesterol Ratio, Triglycerides, VLDL Cholesterol, HDL / LDL Ratio, TRIG / HDL Ratio)
Liver Profile (12 parameters: Alkaline Phosphatase, Bilirubin - Direct, Bilirubin - Total, Bilirubin - Indirect, Gamma Glutamyl Transferase, Protein - Total, Serum Albumin, Serum Globulin, SGOT [AST], SGPT [ALT], Serum Albumin / Globulin Ratio, SGOT / SGPT Ratio)
Kidney Profile (7 parameters: BUN / Creatinine Ratio, Blood Urea Nitrogen [BUN], Calcium, Serum Creatinine, Uric Acid, Urea [Calculated], Urea / SR. Creatinine Ratio)
Iron Deficiency Profile (5 parameters: Total Iron Binding Capacity [TIBC], % Transferrin Saturation, Iron, Unsat. Iron-binding Capacity [UIBC], Ferritin)
Serum Electrolytes (2 parameters: Sodium, Chloride)
Diabetes Profile (3 parameters: Fasting Blood Sugar [Glucose], HbA1c, Average Blood Glucose [ABG])
Complete Hemogram (28 parameters: CBC Complete Count)
Vitamin Profile (2 parameters: 25-OH Vitamin D [Total], Vitamin B12)
Cardiac Risk Markers (5 parameters: Lipoprotein - A, Apolipoprotein - A1, Apolipoprotein - B, Apo B/Apo A1 Ratio, High Sensitivity C-reactive Protein [hs-CRP])
Pancreas Profile (2 parameters: Serum Amylase, Serum Lipase)
Cancer Markers (2 parameters: Ca-125, Carcino Embryonic Antigen [CEA])
Elements 22 [Toxic & Nutrients] (22 parameters: Aluminium, Arsenic, Barium, Cadmium, Caesium, Mercury, Lead, Tin, Bismuth, Beryllium, Antimony, Strontium, Thallium, Uranium, Cobalt, Chromium, Molybdenum, Silver, Vanadium, Selenium, Nickel, Manganese)
Complete Urine Analysis (24 parameters: Specific Gravity, Urinary Bilirubin, Urine Blood, Urobilinogen, Urinary Glucose, Urine Ketone, Urinary Leucocytes, Nitrite, pH, Urinary Protein, Appearance, Colour, Microalbumin, Volume, Bile Salt, Epithelial Cells, Casts, Crystals, Bacteria, Red Blood Cells)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours Essential | Report Turnaround: Same Day',
    true,
    'SeniorCtznFemale',
    '{"profiles":["Thyroid Profile (3)","Lipid Profile (10)","Liver Profile (12)","Kidney Profile (7)","Iron Deficiency Profile (5)","Serum Electrolytes (2)","Diabetes Profile (3)","CBC (28)","Vitamin Profile (2)","Cardiac Risk Markers (5)","Pancreas Profile (2)","Cancer Markers [CA-125, CEA] (2)","Elements 22 [Toxic & Nutrients] (22)","Complete Urine Analysis (24)"]}'
),
(
    'Men master checkup with cancer with hormone Panel',
    116,
    2599.0,
    4230.0,
    'Thyroid Advanced (3 parameters: Total Thyroxine [T4], Total Triiodothyronine [T3], Ultrasensitive TSH [UTSH])
Lipid Advanced (10 parameters: Total Cholesterol, HDL Cholesterol - Direct, LDL Cholesterol - Direct, LDL/HDL Ratio, Non-HDL Cholesterol, TC/HDL Cholesterol Ratio, Triglycerides, VLDL Cholesterol, HDL/LDL Ratio, TRIG/HDL Ratio)
Liver Extended (12 parameters: Alkaline Phosphatase, Bilirubin - Direct, Bilirubin - Total, Bilirubin - Indirect, Gamma Glutamyl Transferase, Protein - Total, Serum Albumin, Serum Globulin, SGOT [AST], SGPT [ALT], Serum Albumin/Globulin Ratio, SGOT/SGPT Ratio)
Kidney Advanced (7 parameters: BUN/Serum Creatinine Ratio, Blood Urea Nitrogen, Calcium, Serum Creatinine, Uric Acid, Urea [Calculated], Urea / SR. Creatinine Ratio)
Iron Deficiency Profile (4 parameters: Total Iron Binding Capacity [TIBC], % Transferrin Saturation, Iron, Unsat. Iron-binding Capacity [UIBC])
Cardiac Risk Markers (4 parameters: Lipoprotein - A, Apolipoprotein - A1, Apolipoprotein - B, Apo B/Apo A1 Ratio)
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose [ABG])
Vitamins Profile (2 parameters: 25-OH Vitamin D [Total], Vitamin B12)
Pancreas Profile (2 parameters: Amylase, Lipase)
Serum Electrolytes (2 parameters: Sodium, Chloride)
Elements 22 [Toxic & Nutrients] (22 parameters: Aluminium, Arsenic, Barium, Cadmium, Caesium, Mercury, Lead, Tin, Bismuth, Beryllium, Antimony, Strontium, Thallium, Uranium, Cobalt, Chromium, Molybdenum, Silver, Vanadium, Selenium, Nickel, Manganese)
Hormone & Cancer Panel (4 parameters: Folate, Prostate Specific Antigen [PSA], Testosterone, High Sensitivity C-Reactive Protein [hs-CRP])
Complete Hemogram (28 parameters: CBC 28 Vital Parameters)
Complete Urine Analysis (14 parameters: Appearance, Colour, Leucocyte Esterase, Volume, Urinary Bilirubin, Urine Blood, Urobilinogen, Urinary Glucose, Urine Ketone, Urinary Leucocytes, Nitrite, pH, Urinary Protein, Specific Gravity)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'Men',
    '{"profiles":["Thyroid Advanced (3)","Lipid Advanced (10)","Liver Extended (12)","Kidney Advanced (7)","Iron Deficiency Profile (4)","Cardiac Risk Markers (4)","Diabetes Profile (2)","Vitamins Profile (2)","Pancreas Profile (2)","Serum Electrolytes (2)","Elements 22 [Toxic & Nutrients] (22)","Folate","Prostate Specific Antigen (PSA)","Testosterone","High Sensitivity C-Reactive Protein (hs-CRP)","CBC (28)","Complete Urine Analysis (14)"]}'
),
(
    'Women master check with basic Cancer screening',
    124,
    2599.0,
    3599.0,
    'Thyroid Profile (3 parameters: Ultrasensitive TSH [UTSH], Total Thyroxine [T4], Total Triiodothyronine [T3])
Lipid Profile (10 parameters: Total Cholesterol, HDL Cholesterol - Direct, LDL Cholesterol - Direct, LDL / HDL Ratio, NON-HDL Cholesterol, TC / HDL Cholesterol Ratio, Triglycerides, VLDL Cholesterol, HDL / LDL Ratio, TRIG / HDL Ratio)
Liver Profile (12 parameters: Alkaline Phosphatase, Bilirubin - Direct, Bilirubin - Total, Bilirubin - Indirect, Gamma Glutamyl Transferase, Protein - Total, Serum Albumin, Serum Globulin, SGOT [AST], SGPT [ALT], Serum Albumin / Globulin Ratio, SGOT / SGPT Ratio)
Kidney Profile (7 parameters: BUN / Creatinine Ratio, Blood Urea Nitrogen [BUN], Calcium, Serum Creatinine, Uric Acid, Urea [Calculated], Urea / SR. Creatinine Ratio)
Iron Deficiency Profile (4 parameters: Total Iron Binding Capacity [TIBC], % Transferrin Saturation, Iron, Unsat. Iron-binding Capacity)
Serum Electrolytes (2 parameters: Sodium, Chloride)
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose [ABG])
Complete Hemogram (28 parameters: CBC - Hemoglobin, Total WBC, RBC, Platelet Counts & Indices)
Vitamin Profile (2 parameters: Vitamin D Total, Vitamin B12)
Elements 22 [Toxic & Nutrients] (22 parameters: Aluminium, Arsenic, Barium, Cadmium, Caesium, Mercury, Lead, Tin, Bismuth, Beryllium, Antimony, Strontium, Thallium, Uranium, Cobalt, Chromium, Molybdenum, Silver, Vanadium, Selenium, Nickel, Manganese)
Pancreas Profile (2 parameters: Serum Amylase, Serum Lipase)
Cardiac Risk Markers (5 parameters: Lipoprotein - A, Apolipoprotein - A1, Apolipoprotein - B, Apo B/Apo A1 Ratio, High Sensitivity C-Reactive Protein [hs-CRP])
Cancer Marker (1 parameter: Carcino Embryonic Antigen [CEA])
Complete Urine Analysis (24 parameters: Specific Gravity, Urinary Bilirubin, Urine Blood, Urobilinogen, Urinary Glucose, Urine Ketone, Urinary Leucocytes, Nitrite, pH, Urinary Protein, Appearance, Colour, Leukocyte Esterase, Volume, Bile Salt, Casts, Crystals, Bacteria, Red Blood Cells)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'Women',
    '{"profiles":["Thyroid Profile (3)","Lipid Profile (10)","Liver Profile (12)","Kidney Profile (7)","Iron Deficiency Profile (4)","Serum Electrolytes (2)","Diabetes Profile (2)","CBC (28)","Vitamin Profile (2)","Elements 22 [Toxic & Nutrients] (22)","Pancreas Profile (2)","Cardiac Risk Markers (5)","Cancer Marker [CEA] (1)","Complete Urine Analysis (24)"]}'
),
(
    'Women advance Profile with hormones and arthritis screening',
    82,
    2595.0,
    3999.0,
    'Hormone Panel (4 parameters: Follicle Stimulating Hormone [FSH], Luteinising Hormone [LH], Prolactin [PRL], Estradiol/Oestrogen [E2])
Arthritis Profile (2 parameters: Anti-CCP [ACCP], Anti-Nuclear Antibodies [ANA])
Cardiac Risk Markers (5 parameters: hs-CRP, Lipoprotein - A, Apo A1, Apo B, Apo B/A1 Ratio)
Vitamin & Nutrient Profile (3 parameters: Folate, 25-OH Vitamin D Total, Vitamin B12)
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose)
Lipid Profile (10 parameters: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Non-HDL, Ratios)
Liver Profile (12 parameters: Total Bilirubin, Direct, Indirect, SGOT, SGPT, Total Protein, Albumin, Globulin, GGT, Alkaline Phosphatase, Ratios)
Kidney Profile (7 parameters: BUN, Creatinine, Calcium, Uric Acid, Calculated Urea, Ratios)
Iron Deficiency Profile (4 parameters: Iron, TIBC, UIBC, % Transferrin Saturation)
Thyroid Profile (3 parameters: Total T3, Total T4, UTSH)
Complete Hemogram (28 parameters: CBC 28 Vital Parameters)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'Women',
    '{"profiles":["Hormone Panel (4)","Arthritis Profile (2)","Cardiac Risk Markers (5)","Vitamin Profile (3)","Diabetes Profile (2)","Lipid Profile (10)","Liver Profile (12)","Kidney Profile (7)","Iron Deficiency Profile (4)","Thyroid Profile (3)","CBC (28)"]}'
),
(
    'Women Premium checkup with vitamin cardiac cancer and arthritis screening',
    111,
    2999.0,
    5000.0,
    'Hormone & Infertility (4 parameters: Estradiol [E2], FSH, LH, Prolactin)
Cancer Profile (2 parameters: CA-125 [Ovarian], Carcino Embryonic Antigen [CEA])
Arthritis & Autoimmunity (2 parameters: Anti-CCP, Anti-Nuclear Antibodies [ANA])
Cardiac Risk Markers (6 parameters: hs-CRP, Lp(a), Apo A1, Apo B, Apo B/A1 Ratio, Homocysteine)
Vitamin Profile (3 parameters: Vitamin D Total, Vitamin B12, Folate)
Metabolic Minerals (2 parameters: Serum Magnesium, Serum Phosphorous)
Lipid Profile (10 parameters: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Non-HDL, Ratios)
Liver Profile (12 parameters: Total Bilirubin, Direct, Indirect, SGOT, SGPT, Total Protein, Albumin, Globulin, GGT, Alkaline Phosphatase, Ratios)
Kidney Profile (7 parameters: BUN, Creatinine, Calcium, Uric Acid, Calculated Urea, Ratios)
Iron Deficiency Profile (4 parameters: Iron, TIBC, UIBC, % Transferrin Saturation)
Thyroid Advanced (3 parameters: Total T3, Total T4, UTSH)
Diabetes Profile (2 parameters: HbA1c, ABG)
Serum Electrolytes (2 parameters: Sodium, Chloride)
Complete Hemogram (28 parameters: CBC Complete)
Complete Urine Analysis (24 parameters: Physical, Chemical & Microscopic Urine Examination)
Sample Type: Blood & Urine | Fasting: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'Women',
    '{"profiles":["Hormone Profile (4)","Cancer Profile (2)","Arthritis Profile (2)","Cardiac Risk Markers (6)","Vitamins Profile (3)","Metabolic Minerals (2)","Lipid Profile (10)","Liver Profile (12)","Kidney Profile (7)","Iron Deficiency Profile (4)","Thyroid Advanced (3)","Diabetes Profile (2)","Serum Electrolytes (2)","CBC (28)","Complete Urine Analysis (24)"]}'
),

-- =========================================================================
-- 3. PCOD & HORMONAL HEALTH (3 PACKAGES)
-- =========================================================================
(
    'JAANCH - PCOD BASIC',
    71,
    2700.0,
    5880.0,
    'Hormone & Infertility (7 parameters: Estradiol [E2], FSH, LH, Free Testosterone, Total Testosterone, Prolactin [PRL], 17-OH Progesterone)
Adrenal & Metabolic (3 parameters: DHEA - Sulphate [DHEAS], Fasting Insulin, HOMA Insulin Resistance Index)
Quantitative Insulin Sensitivity (1 parameter: QUICKI Index)
Lipid Profile (10 parameters: Total Cholesterol, HDL Direct, LDL Direct, LDL/HDL Ratio, Non-HDL, TC/HDL Ratio, Triglycerides, VLDL, HDL/LDL Ratio, TRIG/HDL Ratio)
Liver Profile (12 parameters: Total Bilirubin, Direct, Indirect, SGOT, SGPT, Total Protein, Albumin, Globulin, GGT, Alkaline Phosphatase, Ratios)
Kidney & Uric Acid (4 parameters: Serum Creatinine, Blood Urea Nitrogen, BUN/Creatinine Ratio, Uric Acid)
Diabetes Profile (3 parameters: Fasting Blood Sugar, HbA1c, Average Blood Sugar)
Thyroid (1 parameter: Ultrasensitive TSH [UTSH])
Complete Hemogram (28 parameters: CBC 28 Parameters)
Sample Type: Blood Sample | Fasting: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'PCODCheck',
    '{"profiles":["Hormones & Infertility (7)","Metabolic & Insulin (3)","Insulin Sensitivity (1)","Lipid Profile (10)","Liver Profile (12)","Kidney & Uric Acid (4)","Diabetes Profile (3)","Thyroid UTSH (1)","CBC (28)"]}'
),
(
    'JAANCH - PCOD (MINI)',
    52,
    1599.0,
    2599.0,
    'Hormone Panel (6 parameters: Estradiol [E2], FSH, LH, Free Testosterone, Fasting Insulin, Prolactin [PRL])
Insulin Resistance Indices (2 parameters: HOMA Insulin Resistance Index, Quantitative Insulin Sensitivity Index)
Lipid Profile (10 parameters: Total Cholesterol, HDL Direct, LDL Direct, LDL/HDL Ratio, Non-HDL, TC/HDL Ratio, Triglycerides, VLDL, HDL/LDL Ratio, TRIG/HDL Ratio)
Diabetes Profile (3 parameters: Fasting Blood Glucose, HbA1c, Average Blood Sugar)
Thyroid (1 parameter: Ultrasensitive TSH [UTSH])
Complete Hemogram (28 parameters: CBC 28 Parameters)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'PCODCheck',
    '{"profiles":["Hormone Panel (6)","Insulin Resistance Indices (2)","Lipid Profile (10)","Diabetes Profile (3)","Thyroid UTSH (1)","CBC (28)"]}'
),
(
    'JAANCH FEMALE HORMONE SCREENING',
    7,
    1099.0,
    1499.0,
    'Infertility Markers (2 parameters: DHEA - Sulphate [DHEAS], Prolactin [PRL])
Pregnancy Marker (1 parameter: Estradiol/Oestrogen [E2])
Thyroid (1 parameter: TSH - Ultrasensitive)
Hormone Ratios (3 parameters: LH/FSH Ratio, Follicle Stimulating Hormone [FSH], Luteinising Hormone [LH])
Sample Type: Blood Sample | Fasting: Not Required | Report Turnaround: Same Day',
    false,
    'PCODCheck',
    '{"profiles":["Infertility (2)","Pregnancy (1)","Thyroid (1)","Hormones (3)"]}'
),

-- =========================================================================
-- 4. KIDNEY & RENAL HEALTH (3 PACKAGES)
-- =========================================================================
(
    'Kidney Function Test (KFT)',
    7,
    500.0,
    900.0,
    'Renal Function Profile (7 parameters: BUN / Sr. Creatinine Ratio, Blood Urea Nitrogen [BUN], Calcium, Creatinine - Serum, Urea / Sr. Creatinine Ratio, Urea [Calculated], Uric Acid)
Sample Type: Blood Sample | Fasting: Overnight Fasting Recommended | Report Turnaround: Same Day',
    true,
    'Kidney',
    '{"profiles":["Renal Function Profile (7)"]}'
),
(
    'KIDNEY PROFILE WITH ELECTROLYTES',
    10,
    650.0,
    1300.0,
    'Serum Electrolytes (3 parameters: Chloride, Potassium, Sodium)
Renal Function Profile (7 parameters: BUN / Sr. Creatinine Ratio, Blood Urea Nitrogen [BUN], Calcium, Creatinine - Serum, Urea / Sr. Creatinine Ratio, Urea [Calculated], Uric Acid)
Sample Type: Blood Sample | Fasting: 10-12 Hours Essential | Report Turnaround: Same Day',
    true,
    'Kidney',
    '{"profiles":["Electrolytes (3)","Renal (7)"]}'
),
(
    'KIDNEY HEALTH CHECK UP',
    32,
    1399.0,
    1899.0,
    'Diabetes Glucose (2 parameters: Fasting Blood Sugar, Postprandial Blood Sugar [PPBS])
Complete Urine Analysis (24 parameters: Specific Gravity, Appearance, Bacteria, Urinary Bilirubin, Urine Blood, Urobilinogen, Bile Pigment, Bile Salt, Casts, Colour, Crystals, Epithelial Cells, Urinary Glucose, Urine Ketone, Leucocyte Esterase, Pus Cells, Mucus, Nitrite, pH, Urinary Protein, Red Blood Cells, Volume, Yeast)
Serum Electrolytes (3 parameters: Chloride, Potassium, Sodium)
Renal Function (3 parameters: BUN / Sr. Creatinine Ratio, Blood Urea Nitrogen [BUN], Creatinine - Serum)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'Kidney',
    '{"profiles":["Diabetes (2)","Complete Urine Analysis (24)","Electrolytes (3)","Renal (3)"]}'
),

-- =========================================================================
-- 5. BONE & JOINT PAIN HEALTH (3 PACKAGES)
-- =========================================================================
(
    'JAANCH BONE AND MUSCLE HEALTH',
    40,
    1700.0,
    2500.0,
    'Vitamin D Profile (3 parameters: 25-OH Vitamin D Total, Vitamin D2, Vitamin D3)
Serum Albumin-Globulin Ratio (4 parameters: Albumin/Globulin Ratio, Protein - Total, Albumin - Serum, Serum Globulin)
Bone Minerals (3 parameters: Phosphorous, Magnesium, Calcium)
Parathyroid & Muscle Enzymes (3 parameters: Intact Parathyroid Hormone [PTH], Creatine Phosphokinase [CPK Muscle/Brain], Myoglobin)
Complete Hemogram (28 parameters: CBC 28 Parameters)
Sample Type: Blood Sample | Fasting: 10-12 Hours Essential | Report Turnaround: Same Day',
    true,
    'JoinPain',
    '{"profiles":["Vitamin D Profile (3)","Serum Albumin-Globulin Ratio (4)","Bone Minerals (3)","Parathyroid & Muscle (3)","CBC (28)"]}'
),
(
    'BONE PROFILE - ADVANCED',
    13,
    2699.0,
    3999.0,
    'Renal & Parathyroid (3 parameters: Calcium, Intact Parathyroid Hormone [PTH], Uric Acid)
Metabolic Minerals (1 parameter: Magnesium)
Arthritis & Autoimmunity (4 parameters: Phosphorous, Rheumatoid Factor [RF], Anti-CCP [ACCP], Anti-Nuclear Antibodies [ANA])
Essential Trace Elements (2 parameters: Serum Copper, Serum Zinc)
Vitamin Profile (2 parameters: 25-OH Vitamin D Total, Vitamin B-12)
Liver Enzyme (1 parameter: Alkaline Phosphatase)
Sample Type: Blood Sample | Fasting: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'JoinPain',
    '{"profiles":["Renal & Parathyroid (3)","Metabolic (1)","Arthritis (4)","Elements (2)","Vitamin (2)","Liver (1)"]}'
),
(
    'BONE PROFILE - BASIC',
    6,
    1999.0,
    2999.0,
    'Renal & Parathyroid (2 parameters: Calcium, Intact Parathyroid Hormone [PTH])
Vitamin (1 parameter: 25-OH Vitamin D [Total])
Arthritis (1 parameter: Phosphorous)
Elements (1 parameter: Serum Zinc)
Liver (1 parameter: Alkaline Phosphatase)
Sample Type: Blood Sample | Fasting: Not Required | Report Turnaround: Same Day',
    false,
    'JoinPain',
    '{"profiles":["Renal (2)","Vitamin (1)","Arthritis (1)","Elements (1)","Liver (1)"]}'
),

-- =========================================================================
-- 6. CANCER SCREENING & TUMOR MARKERS (7 PACKAGES & TESTS)
-- =========================================================================
(
    'JAANCH CANCER SCREENING MALE ADVANCED',
    35,
    2000.0,
    2599.0,
    'Male Cancer Markers (5 parameters: CA 19.9 [Pancreatic/GI], Carcino Embryonic Antigen [CEA - Colon/GI], Free PSA, % Free PSA, Total Prostate Specific Antigen [PSA])
Oncology & Germ Cell Markers (2 parameters: Alpha Feto Protein [AFP], Beta HCG)
Complete Hemogram (28 parameters: CBC 28 Parameters)
Sample Type: Blood Sample | Fasting: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'Cancer',
    '{"profiles":["Cancer Markers (5)","Oncology Markers (2)","Complete Hemogram (28)"]}'
),
(
    'JAANCH CANCER SCREENING MALE BASIC',
    3,
    999.0,
    1499.0,
    'Male Cancer Tumor Markers (3 parameters: CA 19.9 [GI/Pancreatic], Carcino Embryonic Antigen [CEA], Prostate Specific Antigen [PSA])
Sample Type: Blood Sample | Fasting: Not Essential | Report Turnaround: Same Day',
    false,
    'Cancer',
    '{"profiles":["Cancer Markers (3)"]}'
),
(
    'JAANCH CANCER SCREENING FEMALE BASIC',
    6,
    1699.0,
    2499.0,
    'Female Cancer Markers (4 parameters: CA-125 [Ovarian], CA 15.3 [Breast], CA 19.9 [GI/Pancreatic], Carcino Embryonic Antigen [CEA])
Oncology & Pregnancy Markers (2 parameters: Alpha Feto Protein [AFP], Beta HCG)
Sample Type: Blood Sample | Fasting: Not Essential | Report Turnaround: Same Day',
    false,
    'Cancer',
    '{"profiles":["Cancer Markers (4)","Oncology Markers (2)"]}'
),
(
    'JAANCH CANCER SCREENING FEMALE ADVANCED',
    37,
    2800.0,
    4999.0,
    'Tumor Markers (3 parameters: CA 15.3 [Breast], CA 19.9 [GI], Carcino Embryonic Antigen [CEA])
Ovarian Risk Panel (4 parameters: CA-125, Human Epididymis Protein 4 [HE4], ROMA Premenopausal, ROMA Postmenopausal)
Oncology Biomarkers (2 parameters: Alpha Feto Protein [AFP], Beta HCG)
Complete Hemogram (28 parameters: CBC 28 Parameters)
Sample Type: Blood Sample | Fasting: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'Cancer',
    '{"profiles":["Cancer Markers (3)","Ovarian Risk ROMA/HE4 (4)","Biomarkers (2)","Complete Hemogram (28)"]}'
),
(
    'PROSTATE SPECIFIC ANTIGEN (PSA)',
    1,
    500.0,
    800.0,
    'Prostate Screening (1 parameter: Total Prostate Specific Antigen [PSA])
Sample Type: Blood Sample | Fasting: Not Required | Report Turnaround: Same Day',
    false,
    'Cancer',
    '{"profiles":["Prostate Specific Antigen (PSA)"]}'
),
(
    'CARCINO EMBRYONIC ANTIGEN (CEA)',
    1,
    600.0,
    900.0,
    'Gastrointestinal Tumor Marker (1 parameter: Carcino Embryonic Antigen [CEA])
Sample Type: Blood Sample | Fasting: Not Required | Report Turnaround: Same Day',
    false,
    'Cancer',
    '{"profiles":["Carcino Embryonic Antigen (CEA)"]}'
),
(
    'CA-125',
    1,
    650.0,
    1399.0,
    'Ovarian Tumor Marker (1 parameter: Cancer Antigen 125 [CA-125])
Sample Type: Blood Sample | Fasting: Not Required | Report Turnaround: Same Day',
    false,
    'Cancer',
    '{"profiles":["Cancer Antigen 125 (CA-125)"]}'
),

-- =========================================================================
-- 7. DIABETES CARE & BLOOD SUGAR (7 PACKAGES & TESTS)
-- =========================================================================
(
    'HbA1c with Graph',
    1,
    350.0,
    350.0,
    'Diabetes Screening (1 parameter: Glycated Hemoglobin [HbA1c] with Estimated Average Glucose Graph)
Sample Type: Blood Sample | Fasting: Not Required | Report Turnaround: Same Day',
    false,
    'Diabetic',
    '{"profiles":["HbA1c with Graph"]}'
),
(
    'FASTING BLOOD SUGAR(GLUCOSE)',
    1,
    80.0,
    80.0,
    'Blood Glucose (1 parameter: Fasting Blood Sugar [Glucose])
Sample Type: Blood Sample | Fasting Required: 8-10 Hours Overnight Fasting Essential | Report Turnaround: Same Day',
    true,
    'Diabetic',
    '{"profiles":["Fasting Blood Sugar"]}'
),
(
    'POSTPRANDIAL BLOOD SUGAR(GLUCOSE)',
    1,
    90.0,
    90.0,
    'Blood Glucose (1 parameter: Postprandial Blood Sugar [PPBS])
Sample Type: Blood Sample | Timing: Exactly 2 Hours After Meal | Report Turnaround: Same Day',
    false,
    'Diabetic',
    '{"profiles":["Postprandial Blood Sugar"]}'
),
(
    'JAANCH DIABETIC PROFILE - BASIC',
    54,
    1299.0,
    2350.0,
    'Diabetes Profile (4 parameters: Fasting Blood Sugar [Glucose], Urinary Microalbumin, HbA1c, Average Blood Glucose [ABG])
Complete Hemogram (30 parameters: CBC with ESR & Red Cell Indices)
Serum Electrolytes (3 parameters: Chloride, Potassium, Sodium)
Renal Function (7 parameters: BUN / Sr. Creatinine Ratio, Blood Urea Nitrogen [BUN], Calcium, Creatinine - Serum, Urea / Sr. Creatinine Ratio, Urea [Calculated], Uric Acid)
Lipid Profile (10 parameters: Total Cholesterol, HDL Direct, HDL/LDL Ratio, LDL Direct, LDL/HDL Ratio, Non-HDL, TC/HDL Ratio, Trig/HDL Ratio, Triglycerides, VLDL)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'Diabetic',
    '{"profiles":["Diabetes (4)","Complete Hemogram (30)","Electrolytes (3)","Renal (7)","Lipid (10)"]}'
),
(
    'JAANCH DIABETIC PROFILE - ADVANCED',
    68,
    2700.0,
    5290.0,
    'Diabetes Advanced Panel (8 parameters: Fasting Blood Sugar, C-Peptide, Fructosamine, Fasting Insulin, Urinary Microalbumin, HbA1c, Average Blood Glucose, Blood Ketone [D3HB])
Pancreatic Enzymes (2 parameters: Serum Lipase, Serum Amylase)
Cardiac Biomarkers (2 parameters: NT-proBNP, Troponin-I Heart Attack Risk)
Complete Hemogram (30 parameters: Complete Hemogram with Indices)
Serum Electrolytes (3 parameters: Chloride, Potassium, Sodium)
Renal Function (7 parameters: BUN/Creatinine Ratio, BUN, Calcium, Serum Creatinine, Urea, Uric Acid, Ratios)
Lipid Profile (10 parameters: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Non-HDL, Ratios)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'Diabetic',
    '{"profiles":["Diabetes (8)","Pancreatic (2)","Cardiac (2)","Complete Hemogram (30)","Electrolytes (3)","Renal (7)","Lipid (10)"]}'
),
(
    'INSULIN - FASTING',
    1,
    450.0,
    450.0,
    'Endocrine Insulin (1 parameter: Fasting Serum Insulin)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours Fasting Essential | Report Turnaround: Same Day',
    true,
    'Diabetic',
    '{"profiles":["Fasting Insulin"]}'
),
(
    'HOMA INSULIN RESISTANCE INDEX',
    1,
    550.0,
    550.0,
    'Insulin Resistance Assessment (1 parameter: HOMA Insulin Resistance Index [HOMA-IR])
Sample Type: Blood Sample | Fasting Required: 10-12 Hours Fasting Essential | Report Turnaround: Same Day',
    true,
    'Diabetic',
    '{"profiles":["HOMA Insulin Resistance Index"]}'
),

-- =========================================================================
-- 8. GASTRIC & GUT HEALTH (3 PACKAGES & TESTS)
-- =========================================================================
(
    'MONSOON GASTRO INFECTION PANEL',
    35,
    1299.0,
    1599.0,
    'Viral Hepatitis Infection (2 parameters: Hepatitis A Virus Antibody IgM [HAVM] Rapid, Hepatitis E Virus Antibody IgM [HEVM] Rapid)
Fever Serology (2 parameters: Typhoid - IgG, Typhoid - IgM)
Liver Enzymes (3 parameters: SGOT / SGPT Ratio, Aspartate Aminotransferase [SGOT], Alanine Transaminase [SGPT])
Complete Hemogram (28 parameters: CBC 28 Parameters)
Sample Type: Blood Sample | Fasting: Not Essential | Report Turnaround: Same Day',
    false,
    'GastricCheck',
    '{"profiles":["Infection (2)","Fever (2)","Liver (3)","Complete Hemogram (28)"]}'
),
(
    'GASTRIN',
    1,
    799.0,
    999.0,
    'Gastric Hormone (1 parameter: Serum Gastrin Level)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours Fasting Essential | Report Turnaround: Same Day',
    true,
    'GastricCheck',
    '{"profiles":["Serum Gastrin"]}'
),
(
    'GASTRO / GUT HEALTH PANEL',
    52,
    999.0,
    1299.0,
    'Pancreatic Enzymes (2 parameters: Serum Lipase, Serum Amylase)
Liver Extended Profile (12 parameters: Alkaline Phosphatase, Bilirubin Direct, Bilirubin Indirect, Bilirubin Total, GGT, SGOT/SGPT Ratio, A/G Ratio, Total Protein, Serum Albumin, Serum Globulin, SGOT, SGPT)
Complete Hemogram (28 parameters: CBC 28 Parameters)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'GastricCheck',
    '{"profiles":["Pancreatic (2)","Liver Extended (12)","Complete Hemogram (28)"]}'
),

-- =========================================================================
-- 9. HEART CARE & CARDIAC RISK (8 PACKAGES & TESTS)
-- =========================================================================
(
    'TROPONIN I HEART ATTACK RISK',
    1,
    700.0,
    1905.0,
    'Emergency Cardiac Biomarker (1 parameter: High Sensitivity Troponin I [hsTnI - ACTNI])
Sample Type: Blood Sample | Fasting: Not Required | Report Turnaround: 4-6 Hours',
    false,
    'HeartCare',
    '{"profiles":["Troponin I Heart Attack Risk"]}'
),
(
    'Jaanch Heart Advanced package',
    56,
    1899.0,
    2999.0,
    'Cardiac Risk Markers (6 parameters: High Sensitivity C-Reactive Protein [hs-CRP], Lipoprotein [a], Apo B / Apo A1 Ratio, Apolipoprotein A1, Apolipoprotein B, Homocysteine)
Lipid Profile (10 parameters: Total Cholesterol, HDL Cholesterol - Direct, LDL Cholesterol - Direct, LDL/HDL Ratio, Non-HDL Cholesterol, TC/HDL Cholesterol Ratio, Triglycerides, VLDL Cholesterol, HDL/LDL Ratio, Trig/HDL Ratio)
Troponin I Heart Attack Risk (1 parameter: hsTnI [ACTNI])
Kidney Profile (7 parameters: BUN/Serum Creatinine Ratio, Blood Urea Nitrogen, Calcium, Serum Creatinine, Uric Acid, Urea [Calculated], Urea / Serum Creatinine Ratio)
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose [ABG])
Serum Electrolytes (2 parameters: Chloride, Sodium)
Complete Hemogram (28 parameters: CBC 28 Parameters)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'HeartCare',
    '{"profiles":["Cardiac Risk Markers (6)","Lipid Profile (10)","Troponin I Heart Attack Risk","Kidney Profile (7)","Diabetes Profile (2)","Serum Electrolytes (2)","CBC (28)"]}'
),
(
    'Jaanch Heart Screening',
    16,
    899.0,
    1200.0,
    'Cardiac Risk Markers (6 parameters: High Sensitivity C-Reactive Protein [hs-CRP], Lipoprotein [a], Apo B/Apo A1 Ratio, Apolipoprotein - A1, Apolipoprotein - B, Homocysteine)
Lipid Profile (10 parameters: Total Cholesterol, HDL Cholesterol - Direct, LDL Cholesterol - Direct, LDL/HDL Ratio, Non-HDL Cholesterol, TC/HDL Cholesterol Ratio, Triglycerides, VLDL Cholesterol, HDL/LDL Ratio, TRIG/HDL Ratio)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'HeartCare',
    '{"profiles":["Cardiac Risk Markers (6)","Lipid Profile (10)"]}'
),
(
    'Jaanch Heart Comprehensive heart care',
    71,
    2599.0,
    4599.0,
    'Cardiac Risk Markers (7 parameters: High Sensitivity C-Reactive Protein [hs-CRP], Lipoprotein [a], Apo B / Apo A1 Ratio, Apolipoprotein A1, Apolipoprotein B, Lp-PLA2, Homocysteine)
Advanced Cardiac Biomarkers (3 parameters: Troponin I Heart Attack Risk [ACTN1], Creatine Phosphokinase [CPK], NT-proBNP)
Lipid Profile (10 parameters: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Non-HDL, Ratios)
Kidney Profile (7 parameters: BUN, Creatinine, Calcium, Uric Acid, Calculated Urea, Ratios)
Liver Profile (12 parameters: Total Bilirubin, Direct, Indirect, SGOT, SGPT, Total Protein, Albumin, Globulin, GGT, Alkaline Phosphatase, Ratios)
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose)
Serum Electrolytes (2 parameters: Chloride, Sodium)
Complete Hemogram (28 parameters: CBC 28 Parameters)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'HeartCare',
    '{"profiles":["Cardiac Risk Markers (7)","Advanced Biomarkers (3)","Lipid Profile (10)","Kidney Profile (7)","Liver Profile (12)","Diabetes (2)","Electrolytes (2)","CBC (28)"]}'
),
(
    'Aarogyam C Pro with Heart Attack Risk Package',
    72,
    1899.0,
    3999.0,
    'Cardiac Biomarkers (2 parameters: Troponin I Heart Attack Risk Test, High Sensitivity C-Reactive Protein [hs-CRP])
Lipid Advanced (10 parameters: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Non-HDL, Ratios)
Liver Extended (12 parameters: Bilirubin Total, Direct, Indirect, SGOT, SGPT, GGT, Alkaline Phosphatase, Total Protein, Albumin, Globulin, Ratios)
Kidney Advanced (7 parameters: BUN, Creatinine, Calcium, Uric Acid, Urea, Ratios)
Iron Deficiency Profile (4 parameters: Total Iron Binding Capacity, % Transferrin Saturation, Iron, UIBC)
Thyroid Advanced (3 parameters: Total T3, Total T4, UTSH)
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose)
Serum Electrolytes (2 parameters: Sodium, Chloride)
Vitamin Profile (2 parameters: 25-OH Vitamin D Total, Vitamin B12)
Complete Hemogram (28 parameters: CBC 28 Parameters)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'HeartCare',
    '{"profiles":["Cardiac Biomarkers (2)","Lipid Advanced (10)","Liver Extended (12)","Kidney Advanced (7)","Iron Profile (4)","Thyroid Advanced (3)","Diabetes (2)","Electrolytes (2)","Vitamins (2)","CBC (28)"]}'
),
(
    'CARDIAC PACKAGE 1',
    65,
    1599.0,
    1935.0,
    'Lipid Profile (10 parameters: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Non-HDL, Ratios)
Diabetes Profile (2 parameters: Fasting Blood Sugar, Postprandial Blood Sugar)
Renal Function (1 parameter: Serum Creatinine)
Complete Hemogram (28 parameters: CBC 28 Parameters)
Complete Urine Analysis (24 parameters: Complete Urine Examination)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'HeartCare',
    '{"profiles":["Lipid Profile (10)","Diabetes (2)","Renal (1)","CBC (28)","Complete Urine Analysis (24)"]}'
),
(
    'CARDIAC RISK MARKERS (5 Parameters)',
    5,
    799.0,
    1499.0,
    'Cardiac Risk Markers (5 parameters: Lipoprotein [a], Apolipoprotein - A1, Apolipoprotein - B, High Sensitivity C-Reactive Protein [hs-CRP], Apo B / Apo A1 Ratio)
Sample Type: Blood Sample | Fasting: 10-12 Hours Essential | Report Turnaround: Same Day',
    true,
    'HeartCare',
    '{"profiles":["Cardiac Risk Markers (5)"]}'
),
(
    'Cardiac Risk Markers (6 Parameters)',
    6,
    1299.0,
    2000.0,
    'Cardiac Risk Markers (6 parameters: Homocysteine, High Sensitivity C-Reactive Protein [hs-CRP], Lipoprotein [a], Apo B / Apo A1 Ratio, Apolipoprotein - A1, Apolipoprotein - B)
Sample Type: Blood Sample | Fasting: 10-12 Hours Essential | Report Turnaround: Same Day',
    true,
    'HeartCare',
    '{"profiles":["Cardiac Risk Markers (6)"]}'
),

-- =========================================================================
-- 10. LUNGS, SMOKERS & POLLUTION IMPACT (6 PACKAGES)
-- =========================================================================
(
    'SMOKERS PANEL - BASIC',
    8,
    1999.0,
    2450.0,
    'Cardiac Risk Markers (5 parameters: High Sensitivity C-Reactive Protein [hs-CRP], Lipoprotein [a], Apo B / Apo A1 Ratio, Apolipoprotein - A1, Apolipoprotein - B)
Drug Screen (1 parameter: Nicotine Metabolites [Cotinine])
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose [ABG])
Sample Type: Blood & Urine | Fasting: Not Required | Report Turnaround: Same Day',
    false,
    'Lungs',
    '{"profiles":["Cardiac Risk Markers (5)","Drugs (1)","Diabetes (2)"]}'
),
(
    'SMOKERS PANEL - ADVANCED',
    50,
    2599.0,
    3630.0,
    'Diabetes Profile (3 parameters: Fasting Blood Sugar, HbA1c, Average Blood Glucose)
Vitamin (1 parameter: 25-OH Vitamin D [Total])
Cardiac Risk Markers (5 parameters: hs-CRP, Lipoprotein [a], Apo B / Apo A1 Ratio, Apolipoprotein - A1, Apolipoprotein - B)
Drug Screen (1 parameter: Nicotine Metabolites)
Lipid Profile (10 parameters: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Non-HDL, Ratios)
Complete Hemogram (30 parameters: Mentzer Index, RDWI, CBC 28 Parameters)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'Lungs',
    '{"profiles":["Diabetes (3)","Vitamin (1)","Cardiac Risk Markers (5)","Drugs (1)","Lipid (10)","Complete Hemogram (30)"]}'
),
(
    'JAANCH SMOKING IMPACT PACKAGE',
    72,
    1599.0,
    2499.0,
    'Cancer Marker (1 parameter: Carcino Embryonic Antigen [CEA])
Vitamin & Iron (3 parameters: 25-OH Vitamin D Total, Vitamin B-12, Serum Ferritin)
Inflammatory & Joint Markers (2 parameters: Erythrocyte Sedimentation Rate [ESR], Rheumatoid Factor [RF])
Cardiac Risk Markers (5 parameters: hs-CRP, Lp(a), Apo B/A1, Apo A1, Apo B)
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose)
Complete Hemogram (30 parameters: Mentzer Index, RDWI, CBC 28 Parameters)
Liver Profile (12 parameters: Bilirubin Total, Direct, Indirect, SGOT, SGPT, Total Protein, Albumin, Globulin, GGT, Alkaline Phosphatase, Ratios)
Renal Profile (7 parameters: BUN, Creatinine, Calcium, Uric Acid, Urea, Ratios)
Lipid Profile (10 parameters: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Non-HDL, Ratios)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'Lungs',
    '{"profiles":["Cancer (1)","Vitamins & Iron (3)","Inflammatory (2)","Cardiac (5)","Diabetes (2)","CBC (30)","Liver (12)","Renal (7)","Lipid (10)"]}'
),
(
    'POLLUTION INFLAMMATION PROFILE',
    3,
    700.0,
    850.0,
    'Cardiac & Inflammatory Markers (2 parameters: C-Reactive Protein [CRP], Erythrocyte Sedimentation Rate [ESR])
Allergy Screening (1 parameter: Total IgE)
Sample Type: Blood Sample | Fasting: Not Required | Report Turnaround: Same Day',
    false,
    'Lungs',
    '{"profiles":["Inflammatory (2)","Allergy (1)"]}'
),
(
    'POLLUTION IMPACT - BASIC',
    53,
    1399.0,
    2599.0,
    'Vitamin (1 parameter: 25-OH Vitamin D [Total])
Inflammatory & Allergy (2 parameters: Erythrocyte Sedimentation Rate [ESR], Total IgE)
Cardiac Risk Marker (1 parameter: High Sensitivity C-Reactive Protein [hs-CRP])
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose)
Complete Hemogram (30 parameters: Mentzer Index, RDWI, CBC 28 Parameters)
Renal Profile (7 parameters: BUN, Creatinine, Calcium, Uric Acid, Urea, Ratios)
Lipid Profile (10 parameters: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Non-HDL, Ratios)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'Lungs',
    '{"profiles":["Vitamin (1)","Inflammatory & Allergy (2)","Cardiac (1)","Diabetes (2)","CBC (30)","Renal (7)","Lipid (10)"]}'
),
(
    'POLLUTION IMPACT - ADVANCED',
    96,
    2000.0,
    3499.0,
    'Allergy Marker (1 parameter: Total IgE)
Toxic & Nutrient Elements (22 parameters: Aluminium, Arsenic, Barium, Cadmium, Caesium, Mercury, Lead, Tin, Bismuth, Beryllium, Antimony, Strontium, Thallium, Uranium, Cobalt, Chromium, Molybdenum, Silver, Vanadium, Selenium, Nickel, Manganese)
Complete Hemogram & ESR (29 parameters: CBC 28 Parameters, ESR)
Diabetic Screen (2 parameters: HbA1c, Average Blood Glucose)
Lipid Profile (10 parameters: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Non-HDL, Ratios)
Liver Profile (12 parameters: Bilirubin Total, Direct, Indirect, SGOT, SGPT, GGT, Total Protein, Albumin, Globulin, Alkaline Phosphatase, Ratios)
Kidney Profile (7 parameters: BUN, Creatinine, Calcium, Uric Acid, Calculated Urea, Ratios)
Iron Deficiency Profile (4 parameters: Total Iron Binding Capacity, Serum Iron, % Transferrin Saturation, UIBC)
Cardiac Risk Markers (5 parameters: Lipoprotein [a], Apolipoprotein - A1, Apolipoprotein - B, hs-CRP, Apo B/Apo A1 Ratio)
Vitamin Profile (2 parameters: Vitamin B12, 25-OH Vitamin D Total)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
    true,
    'Lungs',
    '{"profiles":["Allergy (1)","Elements 22 (22)","CBC & ESR (29)","Diabetes (2)","Lipid (10)","Liver (12)","Kidney (7)","Iron Profile (4)","Cardiac (5)","Vitamins (2)"]}'
),

-- =========================================================================
-- 11. THYROID CARE & AUTOIMMUNITY (4 PACKAGES & TESTS)
-- =========================================================================
(
    'Thyroid Profile (Total T3, Total T4, UTSH)',
    3,
    299.0,
    700.0,
    'Thyroid Profile (3 parameters: Total Triiodothyronine [T3], Total Thyroxine [T4], Ultrasensitive TSH [UTSH])
Sample Type: Blood Sample | Fasting: Overnight Fasting Recommended | Report Turnaround: Same Day',
    false,
    'Thyroid',
    '{"profiles":["Thyroid Profile (3)"]}'
),
(
    'JAANCH THYROID PROFILE - BASIC',
    5,
    585.0,
    1000.0,
    'Thyroid Profile (5 parameters: Total Triiodothyronine [T3], Total Thyroxine [T4], Free Triiodothyronine [FT3], Free Thyroxine [FT4], Ultrasensitive TSH [UTSH])
Sample Type: Blood Sample | Fasting: Overnight Fasting Recommended | Report Turnaround: Same Day',
    false,
    'Thyroid',
    '{"profiles":["Thyroid Profile (5)"]}'
),
(
    'JAANCH THYROID PROFILE - ADVANCED',
    8,
    1799.0,
    2995.0,
    'Thyroid Hormones & Antibodies (6 parameters: Total T3, Total T4, Free T3, Free T4, Ultrasensitive TSH, Anti-TPO Antibody [Anti-Thyroid Peroxidase])
Autoimmune Thyroid Disorders (1 parameter: TSH Receptor Antibodies [TRAB])
Autoimmunity Marker (1 parameter: Anti Thyroglobulin Antibody [ATG])
Sample Type: Blood Sample | Fasting: Not Required | Report Turnaround: Same Day',
    false,
    'Thyroid',
    '{"profiles":["Thyroid (6)","Autoimmune Disorders (1)","Autoimmunity (1)"]}'
),
(
    'JAANCH AUTOIMMUNE THYROID SCREENING PANEL',
    6,
    1599.0,
    2499.0,
    'Thyroid Hormones & Anti-TPO (4 parameters: Total Triiodothyronine [T3], Total Thyroxine [T4], TSH - Ultrasensitive, Anti-TPO Antibody [Anti-Thyroid Peroxidase])
Autoimmune Receptor (1 parameter: TSH Receptor Antibodies [TRAB])
Autoimmunity Antibody (1 parameter: Anti Thyroglobulin Antibody [ATG])
Sample Type: Blood Sample | Fasting: Not Required | Report Turnaround: Same Day',
    false,
    'Thyroid',
    '{"profiles":["Thyroid Routine (4)","Autoimmune (2)"]}'
),

-- =========================================================================
-- 12. VITAMINS & NUTRITION (2 PACKAGES & COMBOS)
-- =========================================================================
(
    'VITAMIN D TOTAL AND B12 COMBO',
    2,
    899.0,
    1700.0,
    'Essential Vitamins Combo (2 parameters: 25-OH Vitamin D [Total], Vitamin B-12 [Cyanocobalamin])
Sample Type: Blood Sample | Fasting: Not Required | Report Turnaround: Same Day',
    false,
    'Vitamins',
    '{"profiles":["Vitamin D & B12 Combo (2)"]}'
),
(
    'COMPLETE VITAMINS PROFILE',
    14,
    2999.0,
    5770.0,
    'Fat Soluble Vitamins (6 parameters: Vitamin A, Vitamin E, Vitamin K, Vitamin D Total, Vitamin D2, Vitamin D3)
Water Soluble B-Complex Vitamins (8 parameters: Vitamin B-12, Vitamin B1/Thiamin, Vitamin B2/Riboflavin, Vitamin B3/Nicotinic Acid, Vitamin B5/Pantothenic Acid, Vitamin B6/Pyridoxal-5-Phosphate, Vitamin B7/Biotin, Vitamin B9/Folic Acid)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours Essential | Report Turnaround: Same Day',
    true,
    'Vitamins',
    '{"profiles":["Complete Vitamins (14)"]}'
),
-- =========================================================================
-- 13. LIVER TESTS & PACKAGES (EXACT SPECIFICATIONS)
-- =========================================================================
(
    'LIVER KIDNEY MICROSOMES',
    1,
    699.0,
    999.0,
    'Liver Autoantibody (1 parameter: Liver Kidney Microsome Type 1 [LKM-1] Antibody)
Sample Type: Blood Sample | Fasting: Not Required | Report Turnaround: Same Day',
    false,
    'Liver',
    '{"profiles":["Liver Kidney Microsomes (LKM-1)"]}'
),
(
    'LIVER FUNCTION TESTS',
    12,
    499.0,
    900.0,
    'Liver (12 parameters: Alkaline Phosphatase, Bilirubin - Direct, Bilirubin [Indirect], Bilirubin - Total, Gamma Glutamyl Transferase [GGT], SGOT / SGPT Ratio, Serum Alb/Globulin Ratio, Protein - Total, Albumin - Serum, Serum Globulin, Aspartate Aminotransferase [SGOT], Alanine Transaminase [SGPT])
Sample Type: Blood Sample | Fasting: Overnight Fasting Recommended | Report Turnaround: Same Day',
    true,
    'Liver',
    '{"profiles":["Liver (12 Tests)"]}'
),
(
    'JAANCH FATTY LIVER SCREENING PACKAGE',
    29,
    1599.0,
    1899.0,
    'Diabetes (3 parameters: Fasting Blood Sugar [Glucose], HbA1c, Average Blood Glucose [ABG])
Liver (14 parameters: Gamma Glutamyl Transferase [GGT], Serum Alb/Globulin Ratio, Protein - Total, Albumin - Serum, Serum Globulin, Bilirubin - Direct, Bilirubin [Indirect], Bilirubin - Total, Alkaline Phosphatase, FIB-4, SGOT / SGPT Ratio, Platelet Count, Aspartate Aminotransferase [SGOT], Alanine Transaminase [SGPT])
Infection (2 parameters: Hepatitis B Surface Antigen [HBsAg] Rapid Test, Hepatitis C Antibody [HCVAb] Rapid Test)
Lipid (10 parameters: Total Cholesterol, HDL Cholesterol - Direct, HDL / LDL Ratio, LDL Cholesterol - Direct, LDL / HDL Ratio, Non-HDL Cholesterol, TC/ HDL Cholesterol Ratio, Trig / HDL Ratio, Triglycerides, VLDL Cholesterol)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours Essential | Report Turnaround: Same Day',
    true,
    'Liver',
    '{"profiles":["Diabetes (3 Tests)","Liver (14 Tests)","Infection (2 Tests)","Lipid (10 Tests)"]}'
)

ON CONFLICT (name) DO UPDATE 
SET test_count = EXCLUDED.test_count,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    description = EXCLUDED.description,
    fasting_required = EXCLUDED.fasting_required,
    category_tags = EXCLUDED.category_tags,
    details_json = EXCLUDED.details_json;

-- 2. Home Basic Packages Table Setup & Seed Data (Endpoint: /api/home-basic-pkgs)
CREATE TABLE IF NOT EXISTS home_basic_packages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    test_count INT NOT NULL,
    discount_percentage INT,
    parameters_summary TEXT,
    price DOUBLE PRECISION NOT NULL,
    original_price DOUBLE PRECISION,
    fasting_required BOOLEAN DEFAULT FALSE
);

-- Delete old rows to ensure fresh detailed entries load cleanly
DELETE FROM home_basic_packages;

INSERT INTO home_basic_packages (name, test_count, discount_percentage, parameters_summary, price, original_price, fasting_required)
VALUES 
-- Slide 1: Basic Health Check Up
(
  'Basic health checkup', 
  62, 
  60, 
  'Lipid Advanced (10 parameters: Total Cholesterol, HDL Cholesterol - Direct, LDL Cholesterol - Direct, LDL / HDL Ratio, NON-HDL Cholesterol, TC/ HDL Cholesterol Ratio, Triglycerides, VLDL Cholesterol, HDL / LDL Ratio, TRIG / HDL Ratio)
Liver Extended (12 parameters: Alkaline Phosphatase, Bilirubin - Direct, Bilirubin - Total, Bilirubin - Indirect, Gamma Glutamyl Transferase, Protein - Total, Serum Albumin, Serum Globulin, SGOT [AST], SGPT [ALT], Serum Albumin / Globulin Ratio, SGOT / SGPT Ratio)
Kidney Advanced (7 parameters: BUN/Creatinine Ratio, Blood Urea Nitrogen [BUN], Calcium, Serum Creatinine, Uric Acid, Urea [Calculated], Urea / SR. Creatinine Ratio)
Thyroid Advanced (3 parameters: Total Triiodothyronine [T3], Total Thyroxine [T4], Ultrasensitive TSH [UTSH])
Diabetes Profile (2 parameters: Average Blood Glucose [ABG], HbA1c)
Complete Hemogram (CBC - 28 parameters)
Sample Type: Blood Sample | Fasting Required: 10-12 Hours of Fasting is Essential | Report Turnaround: Same Day', 
  999.0, 
  2500.0, 
  true
),

-- Slide 2: Aarogyam Full Body Checkup with Vitamins (Comprehensive)


(
  'Aarogyam full body checkup with Vitamins', 
  95, 
  50, 
  'Thyroid Advanced (3 parameters: TSH - Ultrasensitive, Total Thyroxine [T4], Total Triiodothyronine [T3])
Lipid Advanced+ (10 parameters: Total Cholesterol, Triglycerides, HDL Cholesterol - Direct, HDL / LDL Ratio, LDL Cholesterol - Direct, LDL / HDL Ratio, Non-HDL Cholesterol, TC / HDL Cholesterol Ratio, Trig / HDL Ratio, VLDL Cholesterol)
Liver Extended (12 parameters: Bilirubin - Total, SGOT / SGPT Ratio, Aspartate Aminotransferase [SGOT], Alanine Transaminase [SGPT], Alkaline Phosphatase, Bilirubin - Direct, Bilirubin [Indirect], Serum Albumin/Globulin Ratio, Protein - Total, Albumin - Serum, Serum Globulin, Gamma Glutamyl Transferase [GGT])
Kidney Advanced (7 parameters: BUN / Sr. Creatinine Ratio, Blood Urea Nitrogen [BUN], Creatinine - Serum, Urea / Sr. Creatinine Ratio, Urea [Calculated], Calcium, Uric Acid)
Iron Deficiency Profile (4 parameters: Iron, % Transferrin Saturation, Total Iron Binding Capacity [TIBC], Unsat. Iron-Binding Capacity [UIBC])
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose [ABG])
Vitamins Profile (2 parameters: 25-OH Vitamin D [Total], Vitamin B-12)
Electrolytes (2 parameters: Sodium, Chloride)
Complete Hemogram (CBC - 28 parameters)
Cardiac Risk Marker (1 parameter: High Sensitivity C-Reactive Protein [hs-CRP])
Complete Urine Analysis (24 parameters: Specific Gravity, Appearance, Bacteria, Urinary Bilirubin, Urine Blood, Urobilinogen, Bile Pigment, Bile Salt, Casts, Colour, Crystals, Epithelial Cells, Urinary Glucose, Urine Ketone, Leucocyte Esterase, Urinary Leucocytes [Pus Cells], Mucus, Nitrite, Parasite, pH, Urinary Protein, Red Blood Cells, Volume, Yeast)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours Essential | Report Turnaround: Same Day', 
  1499.0, 
  2999.0, 
  true
),

-- Slide 3: Senior Citizen Male
(
  'Senior Citizens Male', 
  127, 
  45, 
  'Thyroid Profile (3 parameters: Total Thyroxine [T4], Total Triiodothyronine [T3], Ultrasensitive TSH [UTSH])
Lipid Profile (10 parameters: Total Cholesterol, HDL Cholesterol - Direct, LDL Cholesterol - Direct, LDL / HDL Ratio, NON-HDL Cholesterol, TC/ HDL Cholesterol Ratio, Triglycerides, VLDL Cholesterol, HDL / LDL Ratio, TRIG / HDL Ratio)
Liver Profile (12 parameters: Alkaline Phosphatase, Bilirubin - Direct, Bilirubin - Total, Bilirubin - Indirect, Gamma Glutamyl Transferase, Protein - Total, Serum Albumin, Serum Globulin, SGOT [AST], SGPT [ALT], Serum Albumin / Globulin Ratio, SGOT / SGPT Ratio)
Kidney Profile (7 parameters: BUN / Creatinine Ratio, Blood Urea Nitrogen [BUN], Calcium, Serum Creatinine, Uric Acid, Urea [Calculated], Urea / SR. Creatinine Ratio)
Iron Deficiency Profile (5 parameters: Total Iron Binding Capacity [TIBC], % Transferrin Saturation, Iron, Unsat. Iron-binding Capacity [UIBC], Ferritin)
Serum Electrolytes (2 parameters: Sodium, Chloride)
Diabetes Profile (3 parameters: Fasting Blood Sugar [Glucose], HbA1c, Average Blood Glucose [ABG])
Complete Hemogram (CBC - 28 parameters)
Vitamin Profile (2 parameters: 25-OH Vitamin D [Total], Vitamin B12)
Cardiac Risk Markers (5 parameters: Lipoprotein - A, Apolipoprotein - A1, Apolipoprotein - B, Apo B/Apo A1 Ratio, High Sensitivity C-reactive Protein [hs-CRP])
Pancreas Profile (2 parameters: Serum Amylase, Serum Lipase)
Cancer Markers (2 parameters: Carcino Embryonic Antigen [CEA], Prostate Specific Antigen [PSA])
Elements 22 [Toxic & Nutrients] (22 parameters: Aluminium, Arsenic, Barium, Cadmium, Caesium, Mercury, Lead, Tin, Bismuth, Beryllium, Antimony, Strontium, Thallium, Uranium, Cobalt, Chromium, Molybdenum, Silver, Vanadium, Selenium, Nickel, Manganese)
Complete Urine Analysis (24 parameters: Specific Gravity, Urinary Bilirubin, Urine Blood, Urobilinogen, Urinary Glucose, Urine Ketone, Urinary Leucocytes, Nitrite, pH, Urinary Protein, Appearance, Colour, Microalbumin, Volume, Bile Salt, Bile Pigment, Epithelial Cells, Casts, Crystals, Bacteria, Red Blood Cells, Yeast, Parasite, Mucus)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours Essential | Report Turnaround: Same Day', 
  2749.0, 
  5000.0, 
  true
),

-- Slide 4: Senior Citizen Female
(
  'Senior Citizens Female', 
  127, 
  45, 
  'Thyroid Profile (3 parameters: Total Thyroxine [T4], Total Triiodothyronine [T3], Ultrasensitive TSH [UTSH])
Lipid Profile (10 parameters: Total Cholesterol, HDL Cholesterol - Direct, LDL Cholesterol - Direct, LDL / HDL Ratio, NON-HDL Cholesterol, TC/ HDL Cholesterol Ratio, Triglycerides, VLDL Cholesterol, HDL / LDL Ratio, TRIG / HDL Ratio)
Liver Profile (12 parameters: Alkaline Phosphatase, Bilirubin - Direct, Bilirubin - Total, Bilirubin - Indirect, Gamma Glutamyl Transferase, Protein - Total, Serum Albumin, Serum Globulin, SGOT [AST], SGPT [ALT], Serum Albumin / Globulin Ratio, SGOT / SGPT Ratio)
Kidney Profile (7 parameters: BUN / Creatinine Ratio, Blood Urea Nitrogen [BUN], Calcium, Serum Creatinine, Uric Acid, Urea [Calculated], Urea / SR. Creatinine Ratio)
Iron Deficiency Profile (5 parameters: Total Iron Binding Capacity [TIBC], % Transferrin Saturation, Iron, Unsat. Iron-binding Capacity [UIBC], Ferritin)
Serum Electrolytes (2 parameters: Sodium, Chloride)
Diabetes Profile (3 parameters: Fasting Blood Sugar [Glucose], HbA1c, Average Blood Glucose [ABG])
Complete Hemogram (CBC - 28 parameters)
Vitamin Profile (2 parameters: 25-OH Vitamin D [Total], Vitamin B12)
Cardiac Risk Markers (5 parameters: Lipoprotein - A, Apolipoprotein - A1, Apolipoprotein - B, Apo B/Apo A1 Ratio, High Sensitivity C-reactive Protein [hs-CRP])
Pancreas Profile (2 parameters: Serum Amylase, Serum Lipase)
Cancer Markers (2 parameters: Ca-125, Carcino Embryonic Antigen [CEA])
Elements 22 [Toxic & Nutrients] (22 parameters: Aluminium, Arsenic, Barium, Cadmium, Caesium, Mercury, Lead, Tin, Bismuth, Beryllium, Antimony, Strontium, Thallium, Uranium, Cobalt, Chromium, Molybdenum, Silver, Vanadium, Selenium, Nickel, Manganese)
Complete Urine Analysis (24 parameters: Specific Gravity, Urinary Bilirubin, Urine Blood, Urobilinogen, Urinary Glucose, Urine Ketone, Urinary Leucocytes, Nitrite, pH, Urinary Protein, Appearance, Colour, Microalbumin, Volume, Bile Salt, Bile Pigment, Epithelial Cells, Casts, Crystals, Bacteria, Red Blood Cells, Yeast, Parasite, Mucus)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours Essential | Report Turnaround: Same Day', 
  2749.0, 
  5000.0, 
  true
),

-- Slide 5: Women Master Check with Basic Cancer Screening
(
  'Women master checkup with basic Cancer Screening', 
  124, 
  28, 
  'Thyroid Profile (3 parameters: Ultrasensitive TSH [UTSH], Total Thyroxine [T4], Total Triiodothyronine [T3])
Lipid Profile (10 parameters: Total Cholesterol, HDL Cholesterol - Direct, LDL Cholesterol - Direct, LDL / HDL Ratio, NON-HDL Cholesterol, TC / HDL Cholesterol Ratio, Triglycerides, VLDL Cholesterol, HDL / LDL Ratio, TRIG / HDL Ratio)
Liver Profile (12 parameters: Alkaline Phosphatase, Bilirubin - Direct, Bilirubin - Total, Bilirubin - Indirect, Gamma Glutamyl Transferase, Protein - Total, Serum Albumin, Serum Globulin, SGOT [AST], SGPT [ALT], Serum Albumin / Globulin Ratio, SGOT / SGPT Ratio)
Kidney Profile (7 parameters: BUN / Creatinine Ratio, Blood Urea Nitrogen [BUN], Calcium, Serum Creatinine, Uric Acid, Urea [Calculated], Urea / SR. Creatinine Ratio)
Iron Deficiency Profile (4 parameters: Total Iron Binding Capacity [TIBC], % Transferrin Saturation, Iron, Unsat. Iron-binding Capacity)
Serum Electrolytes (2 parameters: Sodium, Chloride)
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose [ABG])
Complete Hemogram (CBC - 28 parameters)
Vitamin Profile (2 parameters: Vitamin D Total, Vitamin B12)
Elements 22 [Toxic & Nutrients] (22 parameters: Aluminium, Arsenic, Barium, Cadmium, Caesium, Mercury, Lead, Tin, Bismuth, Beryllium, Antimony, Strontium, Thallium, Uranium, Cobalt, Chromium, Molybdenum, Silver, Vanadium, Selenium, Nickel, Manganese)
Pancreas Profile (2 parameters: Serum Amylase, Serum Lipase)
Cardiac Risk Markers (5 parameters: Lipoprotein - A, Apolipoprotein - A1, Apolipoprotein - B, Apo B/Apo A1 Ratio, High Sensitivity C-Reactive Protein [hs-CRP])
Cancer Marker (1 parameter: Carcino Embryonic Antigen [CEA])
Complete Urine Analysis (24 parameters: Specific Gravity, Urinary Bilirubin, Urine Blood, Urobilinogen, Urinary Glucose, Urine Ketone, Urinary Leucocytes, Nitrite, pH, Urinary Protein, Appearance, Colour, Leukocyte Esterase, Volume, Bile Salt, Bile Pigment, Epithelial Cells, Casts, Crystals, Bacteria, Red Blood Cells, Yeast, Parasite, Mucus)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours | Report Turnaround: Same Day', 
  2599.0, 
  3599.0, 
  true
),

-- Slide 6: Men Master Checkup with Cancer with Hormone Panel
(
  'Men master checkup with Cancer with Hormone Panel', 
  116, 
  39, 
  'Thyroid Advanced (3 parameters: Total Thyroxine [T4], Total Triiodothyronine [T3], Ultrasensitive TSH [UTSH])
Lipid Advanced (10 parameters: Total Cholesterol, HDL Cholesterol - Direct, LDL Cholesterol - Direct, LDL/HDL Ratio, Non-HDL Cholesterol, TC/HDL Cholesterol Ratio, Triglycerides, VLDL Cholesterol, HDL/LDL Ratio, TRIG/HDL Ratio)
Liver Extended (12 parameters: Alkaline Phosphatase, Bilirubin - Direct, Bilirubin - Total, Bilirubin - Indirect, Gamma Glutamyl Transferase, Protein - Total, Serum Albumin, Serum Globulin, SGOT [AST], SGPT [ALT], Serum Albumin/Globulin Ratio, SGOT/SGPT Ratio)
Kidney Advanced (7 parameters: BUN/Serum Creatinine Ratio, Blood Urea Nitrogen, Calcium, Serum Creatinine, Uric Acid, Urea [Calculated], Urea / SR. Creatinine Ratio)
Iron Deficiency Profile (4 parameters: Total Iron Binding Capacity [TIBC], % Transferrin Saturation, Iron, Unsat. Iron-binding Capacity [UIBC])
Cardiac Risk Markers (4 parameters: Lipoprotein - A, Apolipoprotein - A1, Apolipoprotein - B, Apo B/Apo A1 Ratio)
Diabetes Profile (2 parameters: HbA1c, Average Blood Glucose [ABG])
Vitamins Profile (2 parameters: 25-OH Vitamin D [Total], Vitamin B12)
Pancreas Profile (2 parameters: Amylase, Lipase)
Serum Electrolytes (2 parameters: Sodium, Chloride)
Elements 22 [Toxic & Nutrients] (22 parameters: Aluminium, Arsenic, Barium, Cadmium, Caesium, Mercury, Lead, Tin, Bismuth, Beryllium, Antimony, Strontium, Thallium, Uranium, Cobalt, Chromium, Molybdenum, Silver, Vanadium, Selenium, Nickel, Manganese)
Hormone & Cancer Panel (4 parameters: Folate, Prostate Specific Antigen [PSA], Testosterone, High Sensitivity C-Reactive Protein [hs-CRP])
Complete Hemogram (CBC - 28 parameters)
Complete Urine Analysis (14 parameters: Appearance, Colour, Leucocyte Esterase, Volume, Urinary Bilirubin, Urine Blood, Urobilinogen, Urinary Glucose, Urine Ketone, Urinary Leucocytes [Pus Cells], Nitrite, pH, Urinary Protein, Specific Gravity)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours | Report Turnaround: Same Day', 
  2599.0, 
  4230.0, 
  true
);