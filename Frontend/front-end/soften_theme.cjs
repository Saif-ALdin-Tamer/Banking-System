const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'src', 'components'),
  path.join(__dirname, 'src', 'pages')
];

const replacements = [
  { from: /#5b52ff/g, to: '#8b5cf6' },
  { from: /#4a43e0/g, to: '#7c3aed' },
  { from: /#00d4aa/g, to: '#2dd4bf' },
  { from: /#00b896/g, to: '#14b8a6' },
  { from: /bg-slate-50/g, to: 'bg-[#f8f9fa]' },
  { from: /shadow-xl shadow-slate-200\/50/g, to: 'shadow-lg shadow-slate-200/40' },
  { from: /text-slate-900/g, to: 'text-slate-700' },
  { from: /text-slate-800/g, to: 'text-slate-600' },
  { from: /border-slate-100/g, to: 'border-white' },
  { from: /bg-white(?!\/)/g, to: 'bg-white/80 backdrop-blur-xl' },
  { from: /bg-slate-100/g, to: 'bg-slate-50' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { from, to } of replacements) {
        content = content.replace(from, to);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  }
}

directories.forEach(processDirectory);
console.log('Theme softening complete!');
