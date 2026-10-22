export interface CompanyProfile {
  name: string;
  contactNo: string;
  buildingNo: string;
  premisesName: string;
  locality: string;
  state: string;
  stateCode: string;
  pinCode: string;
  gstin: string;
  fullAddress: string;
  email: string;
}

export const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  name: 'Pyrosafe Solutions Pvt Ltd',
  contactNo: '9136406255',
  buildingNo: 'PLOT NO 149',
  premisesName: 'PRESS SITE',
  locality: 'INDUSTRIAL AREA PHASE 1',
  state: 'Chandigarh',
  stateCode: '04',
  pinCode: '160002',
  gstin: '04AAQCP8028G1Z7',
  fullAddress: 'PLOT NO 149, PRESS SITE, INDUSTRIAL AREA PHASE 1, Chandigarh - 160002',
  email: 'pyrosafesolutions2026@gmail.com'
};

const STORAGE_KEY = 'pyrosafe_company_profile_v2';

export const getCompanyProfile = (): CompanyProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COMPANY_PROFILE));
      return DEFAULT_COMPANY_PROFILE;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_COMPANY_PROFILE, ...parsed };
  } catch {
    return DEFAULT_COMPANY_PROFILE;
  }
};

export const saveCompanyProfile = (profile: Partial<CompanyProfile>): CompanyProfile => {
  const current = getCompanyProfile();
  const updated = { ...current, ...profile };
  
  // Keep fullAddress synchronized if individual parts changed
  updated.fullAddress = `${updated.buildingNo}, ${updated.premisesName}, ${updated.locality}, ${updated.state} - ${updated.pinCode}`;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('pyrosafe_profile_updated', { detail: updated }));
  return updated;
};
