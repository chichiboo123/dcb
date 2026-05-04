export const COUNTRIES = [
  ['AF','Afghanistan'],['AL','Albania'],['DZ','Algeria'],['AD','Andorra'],['AO','Angola'],['AR','Argentina'],['AM','Armenia'],['AU','Australia'],['AT','Austria'],['AZ','Azerbaijan'],
  ['BH','Bahrain'],['BD','Bangladesh'],['BY','Belarus'],['BE','Belgium'],['BZ','Belize'],['BJ','Benin'],['BO','Bolivia'],['BA','Bosnia and Herzegovina'],['BW','Botswana'],['BR','Brazil'],
  ['BN','Brunei'],['BG','Bulgaria'],['KH','Cambodia'],['CM','Cameroon'],['CA','Canada'],['CL','Chile'],['CN','China'],['CO','Colombia'],['CR','Costa Rica'],['HR','Croatia'],
  ['CU','Cuba'],['CY','Cyprus'],['CZ','Czechia'],['DK','Denmark'],['DO','Dominican Republic'],['EC','Ecuador'],['EG','Egypt'],['SV','El Salvador'],['EE','Estonia'],['ET','Ethiopia'],
  ['FI','Finland'],['FR','France'],['GE','Georgia'],['DE','Germany'],['GH','Ghana'],['GR','Greece'],['GT','Guatemala'],['HN','Honduras'],['HK','Hong Kong'],['HU','Hungary'],
  ['IS','Iceland'],['IN','India'],['ID','Indonesia'],['IR','Iran'],['IQ','Iraq'],['IE','Ireland'],['IL','Israel'],['IT','Italy'],['JM','Jamaica'],['JP','Japan'],
  ['JO','Jordan'],['KZ','Kazakhstan'],['KE','Kenya'],['KW','Kuwait'],['KG','Kyrgyzstan'],['LA','Laos'],['LV','Latvia'],['LB','Lebanon'],['LY','Libya'],['LT','Lithuania'],
  ['LU','Luxembourg'],['MO','Macao'],['MK','North Macedonia'],['MG','Madagascar'],['MY','Malaysia'],['MV','Maldives'],['MT','Malta'],['MX','Mexico'],['MD','Moldova'],['MN','Mongolia'],
  ['ME','Montenegro'],['MA','Morocco'],['MM','Myanmar'],['NP','Nepal'],['NL','Netherlands'],['NZ','New Zealand'],['NI','Nicaragua'],['NG','Nigeria'],['NO','Norway'],['OM','Oman'],
  ['PK','Pakistan'],['PA','Panama'],['PY','Paraguay'],['PE','Peru'],['PH','Philippines'],['PL','Poland'],['PT','Portugal'],['QA','Qatar'],['RO','Romania'],['RU','Russia'],
  ['SA','Saudi Arabia'],['RS','Serbia'],['SG','Singapore'],['SK','Slovakia'],['SI','Slovenia'],['ZA','South Africa'],['KR','Republic of Korea'],['ES','Spain'],['LK','Sri Lanka'],['SE','Sweden'],
  ['CH','Switzerland'],['TW','Taiwan'],['TJ','Tajikistan'],['TZ','Tanzania'],['TH','Thailand'],['TN','Tunisia'],['TR','Türkiye'],['UG','Uganda'],['UA','Ukraine'],['AE','United Arab Emirates'],
  ['GB','United Kingdom'],['US','United States'],['UY','Uruguay'],['UZ','Uzbekistan'],['VE','Venezuela'],['VN','Vietnam'],['YE','Yemen'],['ZM','Zambia'],['ZW','Zimbabwe']
].map(([code,name])=>({code,name}));

export function codeToFlag(code=''){const cc=code.trim().toUpperCase();if(!/^[A-Z]{2}$/.test(cc)) return '🏳️';return String.fromCodePoint(...cc.split('').map(c=>127397+c.charCodeAt(0)));}
export function getFlagImageUrl(code=''){const cc=code.trim().toLowerCase();if(!/^[a-z]{2}$/.test(cc)) return '';return `https://flagcdn.com/w40/${cc}.png`;}
export function findCountry(query=''){const q=query.trim().toLowerCase();if(!q) return null;return COUNTRIES.find(c=>c.code.toLowerCase()===q)||COUNTRIES.find(c=>c.name.toLowerCase()===q)||COUNTRIES.find(c=>`${c.code} - ${c.name}`.toLowerCase()===q)||COUNTRIES.find(c=>c.name.toLowerCase().includes(q));}
