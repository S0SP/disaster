const fs = require('fs');
const path = require('path');

const directories = ['app', 'components'];

const replacements = [
    { regex: /\bbg-bg-primary\b/g, replacement: 'bg-background' },
    { regex: /\bbg-bg-deep\b/g, replacement: 'bg-background' },
    { regex: /\bbg-bg-elevated\b/g, replacement: 'bg-card' },
    { regex: /\bbg-bg-surface\b/g, replacement: 'bg-muted' },
    { regex: /\btext-text-primary\b/g, replacement: 'text-foreground' },
    { regex: /\btext-text-inverse\b/g, replacement: 'text-foreground' },
    { regex: /\btext-text-secondary\b/g, replacement: 'text-muted-foreground' },
    { regex: /\btext-text-tertiary\b/g, replacement: 'text-muted-foreground\/70' },
    { regex: /\bbg-accent\b/g, replacement: 'bg-primary' },
    { regex: /\btext-accent\b/g, replacement: 'text-primary' },
    { regex: /\border-border-accent\b/g, replacement: 'border-primary\/30' },
    { regex: /\bborder-border-hover\b/g, replacement: 'border-border hover:border-primary\/50' },
    { regex: /\bborder-border\b/g, replacement: 'border-border' },
    { regex: /\bfont-serif\b/g, replacement: '' }
];

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            replacements.forEach(({ regex, replacement }) => {
                content = content.replace(regex, replacement);
            });

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

directories.forEach(dir => processDirectory(path.join(__dirname, dir)));
console.log('Refactor complete.');
