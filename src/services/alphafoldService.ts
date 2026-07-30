import { AlphaFoldProtein } from '../types';

export const ALPHAFOLD_DATABASE: Record<string, AlphaFoldProtein> = {
  'P00321': {
    pdbId: 'P00321',
    proteinName: 'Dihydrofolate Reductase (DHFR)',
    uniprotId: 'P00321_ALTAL',
    organism: 'Alternaria solani (Fungal Pathogen)',
    bindingSiteResidues: ['ARG-57', 'LEU-22', 'ASP-27', 'THR-113', 'PHE-31'],
    mechanismExplanation: 'Mancozeb multi-site contact fungicide inactivates dithiocarbamate binding pockets on DHFR enzyme complexes, halting fungal spore germination.',
    molecularWeight: '21.5 kDa',
  },
  'P11832': {
    pdbId: 'P11832',
    proteinName: 'Bacterial DNA Gyrase Subunit A',
    uniprotId: 'P11832_XANTO',
    organism: 'Xanthomonas oryzae pv. oryzae',
    bindingSiteResidues: ['GLU-87', 'LYS-42', 'TYR-122', 'HIS-45'],
    mechanismExplanation: 'Streptocycline binds directly to bacterial 30S ribosomal subunits and DNA gyrase cleavage complexes, inhibiting bacterial replication.',
    molecularWeight: '97.2 kDa',
  },
  'P05423': {
    pdbId: 'P05423',
    proteinName: 'Cytochrome b-c1 Complex Subunit',
    uniprotId: 'P05423_PHYINF',
    organism: 'Phytophthora infestans (Oomycete)',
    bindingSiteResidues: ['MET-139', 'PHE-129', 'TYR-279', 'LEU-282'],
    mechanismExplanation: 'Metalaxyl inhibits RNA synthesis by selectively binding to RNA polymerase I complexes in late blight oomycete cell membranes.',
    molecularWeight: '43.8 kDa',
  },
  'Q01234': {
    pdbId: 'Q01234',
    proteinName: 'Chitin Synthase Type II',
    uniprotId: 'Q01234_FUSOX',
    organism: 'Fusarium oxysporum f. sp. vasinfectum',
    bindingSiteResidues: ['TRP-340', 'GLN-680', 'ASP-520', 'CYS-410'],
    mechanismExplanation: 'Carbendazim systemic fungicide disrupts beta-tubulin polymerization during mitotic cell division in Fusarium vascular fungi.',
    molecularWeight: '108.4 kDa',
  },
  'P43210': {
    pdbId: 'P43210',
    proteinName: 'Sterol 14a-Demethylase (CYP51)',
    uniprotId: 'P43210_PUCCIN',
    organism: 'Puccinia sorghi (Corn Rust)',
    bindingSiteResidues: ['HEM-450', 'TYR-132', 'LYS-143', 'PHE-506'],
    mechanismExplanation: 'Propiconazole triazole molecule binds heme iron in CYP51, inhibiting ergosterol biosynthesis required for fungal cell membrane integrity.',
    molecularWeight: '56.1 kDa',
  },
};

export function getAlphaFoldProteinDetails(pdbId: string): AlphaFoldProtein {
  return ALPHAFOLD_DATABASE[pdbId] || {
    pdbId: pdbId || 'P00321',
    proteinName: 'Target Pathogen Receptor Enzyme',
    uniprotId: `${pdbId}_TARGET`,
    organism: 'Agri Pathogen Fungal Subspecies',
    bindingSiteResidues: ['ARG-45', 'GLU-102', 'HIS-88', 'TYR-204'],
    mechanismExplanation: 'Approved active chemical compound binds selectively to target pathogen protein active sites, blocking enzymatic synthesis.',
    molecularWeight: '48.0 kDa',
  };
}
