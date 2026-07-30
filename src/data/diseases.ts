import { CropDisease } from '../types';

export const FALLBACK_DISEASES: CropDisease[] = [
  {
    disease_id: 'D001',
    crop_name: 'Tomato',
    disease_name: 'Early Blight',
    symptoms: 'Dark concentric spots on lower leaves yellow halo leaf drops',
    pathogen_type: 'Fungal',
    alphafold_pdb_id: 'P00321',
    target_protein: 'Dihydrofolate Reductase',
    approved_chemical: 'Mancozeb 75% WP',
    verified_treatment: 'Mancozeb 75% WP spray twice at 10-day interval',
    organic_remedy: 'Neem oil 5% solution + Trichoderma viride spray',
    recommended_dosage: '2.5g per liter of water',
    risk_level: 'High',
  },
  {
    disease_id: 'D002',
    crop_name: 'Rice',
    disease_name: 'Bacterial Leaf Blight',
    symptoms: 'Water-soaked lesions on leaf margins turning yellow-white wilting',
    pathogen_type: 'Bacterial',
    alphafold_pdb_id: 'P11832',
    target_protein: 'Bacterial Gyrase Subunit A',
    approved_chemical: 'Streptocycline',
    verified_treatment: 'Streptocycline 6g + Copper Oxychloride 500g in 500L water',
    organic_remedy: 'Pseudomonas fluorescens 10g/L seed treatment',
    recommended_dosage: '0.1g Streptocycline per liter',
    risk_level: 'Critical',
  },
  {
    disease_id: 'D003',
    crop_name: 'Potato',
    disease_name: 'Late Blight',
    symptoms: 'Dark water-soaked patches on leaves white fungal growth underneath stem rot',
    pathogen_type: 'Fungal',
    alphafold_pdb_id: 'P05423',
    target_protein: 'Cytochrome b Complex',
    approved_chemical: 'Metalaxyl + Mancozeb',
    verified_treatment: 'Metalaxyl 8% + Mancozeb 64% WP',
    organic_remedy: 'Garlic extract 10% + Copper hydroxide',
    recommended_dosage: '2g per liter of water',
    risk_level: 'Critical',
  },
  {
    disease_id: 'D004',
    crop_name: 'Cotton',
    disease_name: 'Fusarium Wilt',
    symptoms: 'Yellowing of leaf veins drooping vascular discoloration stunting',
    pathogen_type: 'Fungal',
    alphafold_pdb_id: 'Q01234',
    target_protein: 'Chitin Synthase II',
    approved_chemical: 'Carbendazim 50% WP',
    verified_treatment: 'Carbendazim 50% WP drenching around root zone',
    organic_remedy: 'Trichoderma harzianum 2.5kg/ha soil application',
    recommended_dosage: '1g per liter of water',
    risk_level: 'High',
  },
  {
    disease_id: 'D005',
    crop_name: 'Corn/Maize',
    disease_name: 'Common Rust',
    symptoms: 'Small brown circular powdery pustules on both leaf surfaces',
    pathogen_type: 'Fungal',
    alphafold_pdb_id: 'P43210',
    target_protein: 'Sterol 14a-demethylase',
    approved_chemical: 'Propiconazole 25% EC',
    verified_treatment: 'Propiconazole 25% EC at first sign of pustules',
    organic_remedy: 'Sour buttermilk spray 1:10 dilution',
    recommended_dosage: '1ml per liter of water',
    risk_level: 'Medium',
  },
  {
    disease_id: 'D006',
    crop_name: 'Wheat',
    disease_name: 'Powdery Mildew',
    symptoms: 'White greyish powdery spots on upper leaf surfaces leaf curling',
    pathogen_type: 'Fungal',
    alphafold_pdb_id: 'P98765',
    target_protein: '14a-Demethylase CYP51',
    approved_chemical: 'Tebuconazole 250 EC',
    verified_treatment: 'Tebuconazole 250 EC foliar spray',
    organic_remedy: 'Sulfur 80% WDG powder dust',
    recommended_dosage: '1.5ml per liter of water',
    risk_level: 'Medium',
  },
  {
    disease_id: 'D007',
    crop_name: 'Grape',
    disease_name: 'Downy Mildew',
    symptoms: 'Yellowish oily spots on leaf tops white cottony mold on underside',
    pathogen_type: 'Oomycete',
    alphafold_pdb_id: 'P23456',
    target_protein: 'Mitochondrial Complex III',
    approved_chemical: 'Copper Oxychloride 50% WP',
    verified_treatment: 'Copper Oxychloride 50% WP foliar spray',
    organic_remedy: 'Bordeaux mixture 1% spray',
    recommended_dosage: '3g per liter of water',
    risk_level: 'High',
  },
  {
    disease_id: 'D008',
    crop_name: 'Chilli/Pepper',
    disease_name: 'Anthracnose / Fruit Rot',
    symptoms: 'Sunken circular dark lesions on fruit yellowing foliage shoot dieback',
    pathogen_type: 'Fungal',
    alphafold_pdb_id: 'P87654',
    target_protein: 'Tubulin Beta Chain',
    approved_chemical: 'Azoxystrobin 23% SC',
    verified_treatment: 'Azoxystrobin 23% SC spray at flowering and fruiting',
    organic_remedy: 'Cow urine + Asafoetida fermented solution',
    recommended_dosage: '1ml per liter of water',
    risk_level: 'High',
  },
];

let activeDataset: CropDisease[] = [...FALLBACK_DISEASES];

export async function fetchDiseasesDataset(): Promise<CropDisease[]> {
  try {
    const res = await fetch('/api/agri/diseases');
    if (res.ok) {
      const csvText = await res.text();
      const lines = csvText.trim().split('\n');
      if (lines.length > 1) {
        const parsed: CropDisease[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',');
          if (cols.length >= 11) {
            parsed.push({
              disease_id: cols[0]?.trim() || `D00${i}`,
              crop_name: cols[1]?.trim() || 'General',
              disease_name: cols[2]?.trim() || 'Unknown Disease',
              symptoms: cols[3]?.trim() || '',
              pathogen_type: (cols[4]?.trim() as any) || 'Fungal',
              alphafold_pdb_id: cols[5]?.trim() || 'P00321',
              target_protein: cols[6]?.trim() || 'Target Protein',
              approved_chemical: cols[7]?.trim() || 'Approved Chemical',
              verified_treatment: cols[8]?.trim() || 'Verified Protocol',
              organic_remedy: cols[9]?.trim() || 'Organic Remedy',
              recommended_dosage: cols[10]?.trim() || 'As directed',
              risk_level: (cols[11]?.trim() as any) || 'Medium',
            });
          }
        }
        if (parsed.length > 0) {
          activeDataset = parsed;
        }
      }
    }
  } catch (e) {
    console.warn('[CSV Dataset] Using offline fallback dataset');
  }
  return activeDataset;
}

export function updateCustomDataset(customDiseases: CropDisease[]) {
  activeDataset = customDiseases;
}

export function findBestMatchingDisease(cropName: string, symptomsInput: string): CropDisease {
  const cropLower = cropName.toLowerCase();
  const symptomsLower = symptomsInput.toLowerCase();

  // Filter dataset by target crop first
  const cropMatches = activeDataset.filter(
    (d) =>
      d.crop_name.toLowerCase().includes(cropLower) ||
      cropLower.includes(d.crop_name.toLowerCase())
  );
  
  const candidates = cropMatches.length > 0 ? cropMatches : activeDataset;

  let bestDisease: CropDisease | null = null;
  let maxScore = 0;

  const keywords = ['spot', 'blight', 'rot', 'wilt', 'rust', 'mildew', 'yellow', 'lesion', 'mold', 'fungal', 'bacterial', 'pustule', 'curl', 'dark', 'droop', 'water'];

  for (const d of candidates) {
    let score = 0;
    const diseaseSymptoms = d.symptoms.toLowerCase();

    // Check exact keyword matches
    for (const kw of keywords) {
      if (symptomsLower.includes(kw) && diseaseSymptoms.includes(kw)) {
        score += 3;
      }
    }

    if (d.crop_name.toLowerCase() === cropLower) {
      score += 2;
    }

    if (score > maxScore) {
      maxScore = score;
      bestDisease = d;
    }
  }

  // If input is gibberish or zero matching keywords, fallback to crop default rather than random mismatch
  if (maxScore < 2 || !bestDisease) {
    return candidates[0] || activeDataset[0];
  }

  return bestDisease;
}
