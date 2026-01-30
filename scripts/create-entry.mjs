import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

async function main() {
  console.log('--- Create New Content Entry ---');

  // 1. Collection Type
  let type = '';
  while (!['writing', 'notes', 'work'].includes(type)) {
    const input = await ask('Collection type (writing/notes/work): ');
    type = input.trim().toLowerCase();
  }

  // 2. Title
  let title = '';
  while (!title) {
    title = (await ask('Title: ')).trim();
  }

  // 3. Description (required for all now)
  let description = '';
  while (!description) {
    description = (await ask('Description: ')).trim();
  }

  // 4. Tags
  const tagsInput = await ask('Tags (comma separated, optional): ');
  const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

  // 5. Extra fields based on type
  let extraFrontmatter = '';
  if (type === 'work') {
    const link = await ask('Project Link (optional): ');
    if (link.trim()) {
      extraFrontmatter += `link: "${link.trim()}"\n`;
    }
  }

  // Generate Slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const contentDir = path.join(PROJECT_ROOT, 'src', 'content', type);
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  const filePath = path.join(contentDir, `${slug}.md`);

  if (fs.existsSync(filePath)) {
    console.error(`\nError: File already exists at ${filePath}`);
    rl.close();
    process.exit(1);
  }

  const fileContent = `---\ntitle: "${title}"\ndescription: "${description}"\npubDate: ${date}\ntags: [${tags.map(t => `"${t}"`).join(', ')}]\n${extraFrontmatter}---\n\nWrite your content here...\n`;

  fs.writeFileSync(filePath, fileContent);

  console.log(`\nSuccess! Created new ${type} entry:`);
  console.log(filePath);
  
  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
  process.exit(1);
});
