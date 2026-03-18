/**
 * GDPR Anonymisation
 * Strips all PII from extracted document text before it reaches the Claude API.
 * Hungarian-specific patterns included.
 */
export function anonymiseText(text: string): string {
  let out = text

  // TAJ (social security number): 000-000-000
  out = out.replace(/\b\d{3}[-\s]?\d{3}[-\s]?\d{3}\b/g, '[TAJ-SZÁM TÖRÖLVE]')

  // Hungarian personal ID: two letters + 6 digits
  out = out.replace(/\b[A-ZÁÉÍÓÖŐÜŰ]{2}\d{6}\b/gi, '[SZEMÉLYI-SZÁM TÖRÖLVE]')

  // Hungarian tax ID: 10 digits starting with 8
  out = out.replace(/\b8\d{9}\b/g, '[ADÓAZONOSÍTÓ TÖRÖLVE]')

  // Passport: 2 letters + 6–7 digits
  out = out.replace(/\b[A-Z]{2}\d{6,7}\b/g, '[ÚTLEVÉLSZÁM TÖRÖLVE]')

  // Hungarian phone numbers
  out = out.replace(/(\+36|06)[\s\-]?\d{1,2}[\s\-]?\d{3}[\s\-]?\d{3,4}/g, '[TELEFON TÖRÖLVE]')
  out = out.replace(/\b\d{2,4}[\s\-]\d{3,4}[\s\-]\d{3,4}\b/g, '[TELEFON TÖRÖLVE]')

  // Email addresses
  out = out.replace(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/gi, '[EMAIL TÖRÖLVE]')

  // Street addresses
  const streetSuffixes = 'utca|út|tér|köz|sor|sétány|körút|sugárút|fasor|dűlő'
  const streetRegex = new RegExp(
    `[A-ZÁÉÍÓÖŐÜŰ][a-záéíóöőüű\\w]*\\s+(${streetSuffixes})\\s+\\d+[a-zA-Z/\\.]*`,
    'gi'
  )
  out = out.replace(streetRegex, '[CÍM TÖRÖLVE]')

  // Patient name lines
  const nameLabels = 'beteg neve|páciens neve|neve|páciens|beteg|patient name|name|név'
  const nameLineRegex = new RegExp(
    `(${nameLabels})[:\\s]+[A-ZÁÉÍÓÖŐÜŰ][a-záéíóöőüű]+(?:\\s+[A-ZÁÉÍÓÖŐÜŰ][a-záéíóöőüű]+)+`,
    'gi'
  )
  out = out.replace(nameLineRegex, (m, label) => `${label}: [NÉV TÖRÖLVE]`)

  // Registered address label
  out = out.replace(/(lakcím|állandó lakcím|lakóhely)[:\s]+[^\n]+/gi, '[LAKCÍM TÖRÖLVE]')

  return out
}
