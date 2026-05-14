import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, 'src/locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const newKeys = {
  emergency: 'Emergency',
  status: 'Status',
  help: 'Help',
  liveAlerts: 'Live Alerts',
  assignedTasks: 'Assigned Tasks',
  disasterMap: 'Disaster Map',
  resources: 'Resources',
  dashboard: 'Dashboard'
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.nav) data.nav = {};
  
  let translated = { ...newKeys };
  if (file === 'hi.json') {
     translated = { emergency: 'आपातकाल', status: 'स्थिति', help: 'मदद', liveAlerts: 'लाइव अलर्ट', assignedTasks: 'कार्य', disasterMap: 'आपदा मानचित्र', resources: 'संसाधन', dashboard: 'डैशबोर्ड' };
  } else if (file === 'ta.json') {
     translated = { emergency: 'அவசரம்', status: 'நிலை', help: 'உதவி', liveAlerts: 'நேரலை விழிப்பூட்டல்கள்', assignedTasks: 'பணிகள்', disasterMap: 'பேரிடர் வரைபடம்', resources: 'வளங்கள்', dashboard: 'டாஷ்போர்டு' };
  } else if (file === 'ml.json') {
     translated = { emergency: 'അടിയന്തരാവസ്ഥ', status: 'നില', help: 'സഹായം', liveAlerts: 'തത്സമയ അലേർട്ടുകൾ', assignedTasks: 'ചുമതലകൾ', disasterMap: 'ദുരന്ത ഭൂപടം', resources: 'വിഭവങ്ങൾ', dashboard: 'ഡാഷ്ബോർഡ്' };
  } else if (file === 'te.json') {
     translated = { emergency: 'అత్యవసర', status: 'స్థితి', help: 'సహాయం', liveAlerts: 'ప్రత్యక్ష హెచ్చరికలు', assignedTasks: 'పనులు', disasterMap: 'విపత్తు మ్యాప్', resources: 'వనరులు', dashboard: 'డాష్బోర్డ్' };
  }

  for (const [key, val] of Object.entries(translated)) {
    data.nav[key] = val;
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});
console.log("Translations injected perfectly");
