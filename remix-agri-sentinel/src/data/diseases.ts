import Papa from 'papaparse';
import { DiseaseRecord, DiseaseMatch, WeatherData } from '../types';

export const RAW_CSV_DATA = `crop,disease_id,disease_name,pathogen_type,pathogen_scientific_name,temp_min,temp_max,humidity_min,rainfall_req,risk_level,verified_treatment,preventive_action,uniprot_id,target_protein_name
Soybean,SOY_RUST_01,Asian Soybean Rust,Fungal,Phakopsora pachyrhizi,18,28,75,high,Critical High,Azoxystrobin 23% SC @ 1 ml/L OR Hexaconazole 5% EC @ 2 ml/L,Maintain 30cm row spacing for airflow; destroy crop residues post-harvest; avoid late evening overhead irrigation,P0C170,Sterol 14-alpha demethylase (CYP51)
Rice,RICE_BLAST_02,Rice Blast Disease,Fungal,Magnaporthe oryzae,20,30,80,moderate,Critical High,Tricyclazole 75% WP @ 0.6g/L OR Isoprothiolane 40% EC @ 1.5 ml/L,Use resistant cultivars (CO-47/IR-64); balance nitrogen fertilizer dosing; avoid standing water stagnant overload,Q91732,Avr-Piz-t Effector & Chitin Synthase 1
Potato,POTATO_BLIGHT_03,Potato Late Blight,Fungal,Phytophthora infestans,10,24,85,high,Critical High,Mancozeb 75% WP @ 2g/L OR Cymoxanil + Mancozeb @ 2g/L,Perform earthing up properly; eliminate volunteer potato plants; remove infected foliage before tuber harvest,P00720,Dihydropteroate Synthase (DHPS)
Cotton,COTTON_BLIGHT_04,Bacterial Leaf Blight,Bacterial,Xanthomonas citri pv. malvacearum,25,35,70,moderate,High,Copper Oxychloride 50% WP @ 2.5g/L + Streptocycline @ 0.1g/L,Use acid-delinted seed; crop rotation with sorghum or maize; destroy infected field debris,P0A900,Type III Secretion System ATPase
Tomato,TOMATO_BLIGHT_05,Early Blight,Fungal,Alternaria solani,22,32,70,moderate,High,Chlorothalonil 75% WP @ 2g/L OR Difenoconazole 25% EC @ 0.5 ml/L,Mulch soil to prevent rain splash; stake plants; prune lower leaves touching wet soil,Q96530,Beta-tubulin Subunit
Wheat,WHEAT_RUST_06,Leaf Rust (Brown Rust),Fungal,Puccinia triticina,15,25,65,moderate,High,Propiconazole 25% EC @ 1 ml/L OR Tebuconazole 25.9% EC @ 1.5 ml/L,Sow early in recommended window; eradicate wild barberry host plants; monitor windward field borders,P0A7Y8,Elongation Factor Tu
Maize,MAIZE_BLIGHT_07,Turcicum Leaf Blight,Fungal,Exserohilum turcicum,18,27,75,high,Moderate,Mancozeb 75% WP @ 2.5g/L OR Zineb 75% WP @ 2g/L,Intercrop with cowpea; incorporate deep plowing; spray at first appearance of lesions,P10384,Glyceraldehyde-3-phosphate dehydrogenase
Sugarcane,SUGAR_ROT_08,Red Rot of Sugarcane,Fungal,Colletotrichum falcatum,26,38,80,high,Critical High,Carbendazim 50% WP @ 1g/L seed set treatment OR Trichoderma viride @ 5g/L,Use disease-free setts from nursery; roguing of infected clumps; avoid ratoon cropping in infected fields,Q84W51,Polyketide Synthase PKS1
Groundnut,GROUNDNUT_TIKKA_09,Tikka Leaf Spot,Fungal,Cercospora arachidicola,24,32,75,moderate,Moderate,Tebuconazole 50% + Trifloxystrobin 25% WG @ 0.7g/L,Deep turning of crop residue; crop rotation with cereals; seed treatment with Trichoderma viride @ 4g/kg,P29468,Transketolase Target Protein`;

const STORAGE_KEY = 'agri_sentinel_custom_csv_db';

export function getRawCsvContent(): string {
  if (typeof window !== 'undefined') {
    const customCsv = localStorage.getItem(STORAGE_KEY);
    if (customCsv) return customCsv;
  }
  return RAW_CSV_DATA.trim();
}

export function saveCustomCsvContent(csvString: string): boolean {
  try {
    const parsed = Papa.parse<any>(csvString.trim(), { header: true, skipEmptyLines: true });
    if (!parsed.data || parsed.data.length === 0) return false;
    
    // Validate essential columns
    const first = parsed.data[0];
    if (!first.crop || !first.disease_name) return false;

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, csvString.trim());
    }
    return true;
  } catch {
    return false;
  }
}

export function resetCustomCsvContent(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function parseCsvToRecords(csvText: string): DiseaseRecord[] {
  const parsed = Papa.parse<any>(csvText.trim(), { header: true, skipEmptyLines: true });
  return parsed.data.map((row, idx) => ({
    crop: row.crop || 'Unknown Crop',
    disease_id: row.disease_id || `CUSTOM_${idx + 1}`,
    disease_name: row.disease_name || 'Custom Pathogen',
    pathogen_type: (row.pathogen_type as any) || 'Fungal',
    pathogen_scientific_name: row.pathogen_scientific_name || 'Unknown Species',
    temp_min: parseFloat(row.temp_min) || 15,
    temp_max: parseFloat(row.temp_max) || 35,
    humidity_min: parseFloat(row.humidity_min) || 70,
    rainfall_req: (row.rainfall_req as any) || 'moderate',
    risk_level: (row.risk_level as any) || 'High',
    verified_treatment: row.verified_treatment || 'Standard Recommended Fungicide/Bactericide',
    preventive_action: row.preventive_action || 'Maintain recommended row spacing and drainage',
    uniprot_id: row.uniprot_id || 'P0C170',
    target_protein_name: row.target_protein_name || 'Target Metabolic Enzyme',
  }));
}

export function getDiseaseDatabase(): DiseaseRecord[] {
  const csvText = getRawCsvContent();
  return parseCsvToRecords(csvText);
}

/**
 * Deterministic Weather Matcher (Data Acquisition Layer)
 * Evaluates hyper-local weather conditions against the CSV thresholds.
 */
export function matchCropDisease(crop: string, weather: WeatherData): DiseaseMatch {
  const db = getDiseaseDatabase();
  const cropDiseases = db.filter(d => d.crop.toLowerCase() === crop.toLowerCase());

  // Fallback to Soybean or first entry if crop not found
  const disease = cropDiseases.length > 0 ? cropDiseases[0] : db[0];

  const tempMatch = weather.temperature >= disease.temp_min && weather.temperature <= disease.temp_max;
  const humidityMatch = weather.humidity >= disease.humidity_min;
  const rainfallMatch = disease.rainfall_req === 'high' ? weather.rainfall > 2 : weather.rainfall >= 0;

  let matchScore = 20; // baseline
  if (tempMatch) matchScore += 35;
  if (humidityMatch) matchScore += 35;
  if (rainfallMatch) matchScore += 10;

  let riskSeverity: DiseaseMatch['riskSeverity'] = 'Low Risk';
  let riskDescription = '';

  if (matchScore >= 80) {
    riskSeverity = disease.risk_level;
    riskDescription = `HIGH RISK OUTBREAK DETECTED: Temperature (${weather.temperature}°C) and Relative Humidity (${weather.humidity}%) meet the environmental vulnerability window for ${disease.disease_name}.`;
  } else if (matchScore >= 50) {
    riskSeverity = 'Moderate';
    riskDescription = `MODERATE THREAT: Weather conditions are approaching threshold limits for ${disease.disease_name}. Close field surveillance advised.`;
  } else {
    riskSeverity = 'Low Risk';
    riskDescription = `LOW OUTBREAK RISK: Current climate (${weather.temperature}°C, ${weather.humidity}% RH) is unfavorable for pathogen proliferation. Maintain routine preventive protocols.`;
  }

  return {
    disease,
    matchScore,
    tempMatch,
    humidityMatch,
    rainfallMatch,
    riskSeverity,
    riskDescription,
  };
}
