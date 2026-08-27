-- 1. Regular Lab Packages Table Setup & Seed Data
CREATE TABLE IF NOT EXISTS lab_packages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    test_count INT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    original_price DOUBLE PRECISION,
    description VARCHAR(2000),
    details_json TEXT,
    fasting_required BOOLEAN DEFAULT FALSE
);

INSERT INTO lab_packages (
    name, 
    test_count, 
    price, 
    original_price, 
    description, 
    fasting_required, 
    details_json
)
VALUES 
(
    'Aarogyam A Pro - Package',
    12,
    999.0,
    1999.0,
    'Thyroid Basic (1): TSH - Ultrasensitive
Lipid Basic (2): Total Cholesterol, Triglycerides
Liver Basic (4): Alanine transaminase (SGPT), Aspartate aminotransferase (SGOT), Bilirubin - total, SGOT / SGPT ratio
Kidney Basic (5): Bun / sr.creatinine ratio, Blood urea nitrogen (BUN), Creatinine - serum, Urea / sr.creatinine ratio, Urea (calculated)
10-12 hrs fasting is essential | *Valid till a limited period',
    true,
    '{"profiles": ["Thyroid Basic (1)", "Lipid Basic (2)", "Liver Basic (4)", "Kidney Basic (5)"]}'
),
(
    'Aarogyam A With UTSH',
    41,
    1499.0,
    3499.0,
    'Thyroid Profile (3): Total Thyroxine (T4), Total Triiodothyronine (T3), Ultrasensitive TSH
Lipid Profile (10): Total Cholesterol, HDL Cholesterol Direct, LDL Cholesterol - Direct, LDL/HDL Ratio, NON-HDL Cholesterol, TC/HDL Cholesterol Ratio, Triglycerides, VLDL Cholesterol, HDL / LDL Ratio, TRIG / HDL Ratio
Liver Profile (12): Alkaline Phosphatase, Bilirubin - Direct, Bilirubin - Total, Bilirubin - Indirect, Gamma Glutamyl Transferase, Protein - Total, Serum Albumin, Serum Globulin, SGOT (AST), SGPT (ALT), Serum Albumin / Globulin Ratio, SGOT / SGPT Ratio
Kidney Profile (7): BUN / Creatinine Ratio, Blood Urea Nitrogen, Calcium, Serum Creatinine, Uric Acid, Urea (Calculated), Urea / SR. Creatinine Ratio
Iron Deficiency Profile (4): Total Iron Binding Capacity, % Transferrin Saturation, Iron-binding Capacity, Serum Iron
Cardiac Risk Markers (4): Lipoprotein - A, Apolipoprotein - B, Apo B / Apo A1 Ratio, High-Sensitivity C-Reactive Protein (hs-CRP)
10-12 hrs fasting is essential | *Valid till a limited period',
    true,
    '{"profiles": ["Thyroid Profile (3)", "Lipid Profile (10)", "Liver Profile (12)", "Kidney Profile (7)", "Iron Deficiency Profile (4)", "Cardiac Risk Markers (4)"]}'
)
ON CONFLICT (name) DO UPDATE 
SET 
    test_count = EXCLUDED.test_count,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    description = EXCLUDED.description,
    fasting_required = EXCLUDED.fasting_required,
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

-- Slide 2: Senior Citizen Male
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

-- Slide 3: Senior Citizen Female
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

-- Slide 4: Aarogyam Full Body Checkup with Vitamins (Comprehensive)
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