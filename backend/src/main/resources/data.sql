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
(
  'Comprehensive Gold Full Body Checkup', 
  60, 
  63, 
  'Complete Hemogram (CBC - 24 parameters: Hemoglobin, RBC, WBC, Platelets, MCV, MCH, MCHC, Neutrophils, Lymphocytes)
Lipid Profile (8 parameters: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, TC/HDL Ratio)
Liver Function Test (11 parameters: SGOT/AST, SGPT/ALT, Bilirubin Total/Direct/Indirect, Total Protein, Albumin, Globulin, Alkaline Phosphatase)
Kidney Function Test (8 parameters: Serum Creatinine, Blood Urea Nitrogen, Uric Acid, Calcium, Electrolytes)
Thyroid Screening (TSH - Ultrasensitive)
Diabetes Profile (Fasting Blood Glucose & HbA1c Glycated Hemoglobin)
Urine Routine & Microscopic Examination (18 parameters)
Sample Type: Blood & Urine | Fasting Required: 10-12 Hours | Report Turnaround: Same Day',
  1099.0, 
  2999.0, 
  true
),
(
  'Diabetes Screening & Care Package', 
  28, 
  55, 
  'HbA1c (Glycated Hemoglobin - 3 Months Average Blood Sugar)
Fasting Blood Glucose (FBG)
Average Blood Glucose (Estimated from HbA1c)
Postprandial Blood Sugar (PPBS / Optional monitoring)
Urine Microalbumin & Creatinine Ratio (Early diabetic kidney screening)
Lipid Risk Assessment (Serum Triglycerides & Total Cholesterol)
Kidney Marker (Serum Creatinine & eGFR estimation)
Urine Glucose & Ketone Bodies
Sample Type: Blood & Urine | Fasting Required: 8-10 Hours | Report Turnaround: 6 Hours', 
  499.0, 
  1099.0, 
  true
),
(
  'Thyroid Care & Hormonal Profile', 
  4, 
  60, 
  'Total Triiodothyronine (T3)
Total Thyroxine (T4)
Ultrasensitive Thyroid Stimulating Hormone (TSH - 3rd Generation)
Free Thyroxine (FT4 - Active unbound thyroid hormone)
Assesses Hyperthyroidism, Hypothyroidism, and Unexplained Weight/Energy Changes
Sample Type: Blood Sample | Fasting Required: Not Mandatory (Morning Sample Preferred) | Report Turnaround: Same Day', 
  399.0, 
  999.0, 
  false
),
(
  'Bone Health & Vitamin D Profile', 
  12, 
  50, 
  'Vitamin D Total (25-Hydroxy Vitamin D / D2 & D3)
Vitamin B12 (Cyanocobalamin - Nerve & Energy health)
Serum Calcium (Total & Ionized estimation)
Serum Phosphorus / Inorganic Phosphate
Alkaline Phosphatase (ALP - Bone & Liver specific enzyme)
Serum Uric Acid (Joint pain and Gout assessment)
Complete Hemoglobin Check
Sample Type: Blood Sample | Fasting Required: Not Required | Report Turnaround: Same Day', 
  699.0, 1399.0, 
  false
),
(
  'Advanced Cardiac Risk Checkup', 
  45, 
  58, 
  'High-Sensitivity C-Reactive Protein (hs-CRP - Vascular inflammation marker)
Complete Lipid Panel (Total Cholesterol, Direct LDL, HDL, Triglycerides, Non-HDL, VLDL)
Cardiac Risk Ratio (TC/HDL & LDL/HDL Ratios)
Homocysteine (Heart & vascular clot risk marker)
Apolipoprotein A1 & Apolipoprotein B (Advanced plaque assessment)
HbA1c & Fasting Glucose (Diabetic-cardiac nexus check)
Electrolytes Panel (Sodium, Potassium, Chloride)
Sample Type: Blood Sample | Fasting Required: 12 Hours Strictly | Report Turnaround: Same Day', 
  1299.0, 
  3099.0, 
  true
);