export const services = ['Blog Articles','Research Summaries','Plagiarism Detection','Research Article Plagiarism Detection','Website Copywriting','LinkedIn Content','Video Script Writing','Presentations & Infographics','Educational Content'];
export function validateEnquiry(input = {}) {
  const data = {};
  for (const key of ['name','email','organization','service','audience','message']) data[key] = typeof input[key] === 'string' ? input[key].trim() : '';
  data.email = data.email.toLowerCase();
  const errors = [];
  if (data.name.length < 2 || data.name.length > 100) errors.push('Name must contain 2–100 characters.');
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Enter a valid email address.');
  if (data.organization.length > 160) errors.push('Organization must be under 160 characters.');
  if (!services.includes(data.service)) errors.push('Choose a listed service.');
  if (!['Scientist','Doctor','Investor','Business Leader','Student','Public'].includes(data.audience)) errors.push('Choose a target audience.');
  if (data.message.length < 20 || data.message.length > 3000) errors.push('Project brief must contain 20–3000 characters.');
  if (input.consent !== true) errors.push('Consent is required to respond to your enquiry.');
  data.consent = input.consent === true;
  data.confidential = input.confidential === true;
  return { data, errors };
}
