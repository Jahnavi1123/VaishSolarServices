import fs from 'node:fs';
import path from 'node:path';

const rootDirectory = process.cwd();
const assetsDirectory = path.join(rootDirectory, 'Assests');
const sourceDirectories = [
  path.join(assetsDirectory, 'Project 1 April to 31 March 2027 VSS'),
  path.join(assetsDirectory, 'vaish solar pictures new'),
];
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// Keep the public gallery focused on verified solar installations. Source files
// are retained locally, but only GPS-stamped project evidence is published.
const excludedImageNamePattern = /\bbill\b/i;
const verifiedInstallationImageNamePattern = /ByGPSMapCamera/i;
const excludedProjectDirectoryPattern = /(?:^|[/\\])DDN J P Sharma 4 KW 1 Ph_Done(?:[/\\]|$)/i;
const excludedImageSources = new Set([
  // Food and drink
  'Assests/vaish solar pictures new/10 KW 3 Ph Arun Kumar Walia_Done/IMG_20250124_223619687.jpg',
  'Assests/vaish solar pictures new/2KW_24volt@Uttarkhasi_Done/IMG_20220720_202615.jpg',
  'Assests/vaish solar pictures new/2KW_24volt@Uttarkhasi_Done/IMG_20220720_215548.jpg',
  'Assests/vaish solar pictures new/2KW_24volt@Uttarkhasi_Done/IMG_20220721_110754.jpg',
  'Assests/vaish solar pictures new/2KW_24volt@Uttarkhasi_Done/IMG_20220721_143147.jpg',
  'Assests/vaish solar pictures new/2KW_24volt@Uttarkhasi_Done/IMG_20220721_215251.jpg',
  'Assests/vaish solar pictures new/2KW_24volt@Uttarkhasi_Done/IMG_20220721_215301.jpg',
  'Assests/vaish solar pictures new/2KW_24volt@Uttarkhasi_Done/IMG_20220721_215311.jpg',
  'Assests/vaish solar pictures new/DDN Mr Tanuj Bajaj 3 KW Done/IMG_20241015_134935918.jpg',
  'Assests/vaish solar pictures new/Done_3 KW Bimla Chandrabani/IMG_20250307_192518117.jpg',

  // Pointing hands and hand-held close-ups
  'Assests/Project 1 April to 31 March 2027 VSS/Gaurav Quotation/Done _Ajay Kumar Bhist 4 KW/IMG_20260711_154427364.jpg',
  'Assests/Project 1 April to 31 March 2027 VSS/Gaurav Quotation/Done _Ajay Kumar Bhist 4 KW/IMG_20260711_161533821.jpg',
  'Assests/vaish solar pictures new/DDN 4 KW Santosh Nakra SBI bank Done/IMG_20241007_082428957.jpg',
  'Assests/vaish solar pictures new/DDN 4 KW Santosh Nakra SBI bank Done/IMG_20241007_082434064.jpg',
  'Assests/vaish solar pictures new/DDN 4.32 KW ON grid Mrs Saroj Sahi Shartradhara Road_Done/20221218_103747.jpg',
  'Assests/vaish solar pictures new/DDN 4.32 KW ON grid Mrs Saroj Sahi Shartradhara Road_Done/20221218_104017.jpg',
  'Assests/vaish solar pictures new/DDN 4.32 KW ON grid Mrs Saroj Sahi Shartradhara Road_Done/20221218_111926.jpg',
  'Assests/vaish solar pictures new/DDN 4.32 KW ON grid Mrs Saroj Sahi Shartradhara Road_Done/20221218_182652.jpg',
  'Assests/vaish solar pictures new/DDN Meharban Singh Rawat 5 KW 3 Ph Done/IMG_20241218_115302334.jpg',
  'Assests/vaish solar pictures new/DDN Tehseen Ahmand 4 KW _ Done/IMG_20240515_170031847.jpg',

  // Bills, receipts, certificates, and other paperwork
  'Assests/vaish solar pictures new/2KW_24VoltWithSolarACHotnCold@Dehradun_Done/IMG_20211113_105329.jpg',
  'Assests/vaish solar pictures new/2KW_24VoltWithSolarACHotnCold@Dehradun_Done/IMG_20211113_105340.jpg',
  'Assests/vaish solar pictures new/2KW_24VoltWithSolarACHotnCold@Dehradun_Done/IMG_20211113_105404.jpg',
  'Assests/vaish solar pictures new/2KW_24VoltWithSolarACHotnCold@Dehradun_Done/IMG_20211113_105437.jpg',
  'Assests/vaish solar pictures new/2KW_24VoltWithSolarACHotnCold@Dehradun_Done/IMG_20211113_105453.jpg',
  'Assests/vaish solar pictures new/2KW_24VoltWithSolarACHotnCold@Dehradun_Done/IMG_20211113_105505.jpg',
  'Assests/vaish solar pictures new/2KW_24VoltWithSolarACHotnCold@Dehradun_Done/IMG_20211113_105517.jpg',
  'Assests/vaish solar pictures new/2KW_24VoltWithSolarACHotnCold@Dehradun_Done/IMG_20211113_105530.jpg',
  'Assests/vaish solar pictures new/2KW_24VoltWithSolarACHotnCold@Dehradun_Done/IMG_20211113_105540.jpg',
  'Assests/vaish solar pictures new/2KW_24VoltWithSolarACHotnCold@Dehradun_Done/IMG_20211113_105548.jpg',
  'Assests/vaish solar pictures new/DDN 4.32 KW ON grid Mrs Saroj Sahi Shartradhara Road_Done/20230214_083636.jpg',
  'Assests/vaish solar pictures new/DDN 4.32 KW ON grid Mrs Saroj Sahi Shartradhara Road_Done/20230214_083640.jpg',
  'Assests/vaish solar pictures new/DDN Ajabpur 4 KWi 10 March 2024_SH SURESH PANDEY_Done/IMG_20240420_180906257.jpg',
  'Assests/vaish solar pictures new/DDN Laxman Chowk 4 KW Kela Devi 10 May 24 Done/IMG_20241219_133237545_HDR.jpg',
  'Assests/vaish solar pictures new/DDN Laxman Chowk 4 KW Kela Devi 10 May 24 Done/IMG_20241219_165508851.jpg',
  'Assests/vaish solar pictures new/DDN Laxman Chowk 4 KW Kela Devi 10 May 24 Done/IMG_20241219_165620198.jpg',
  'Assests/vaish solar pictures new/DDN Manoj Arora 4 KW 5 Ph 1 Done 4 KW with 5 KW 1 ph invertor/IMG_20241021_162459601_HDR.jpg',
  'Assests/vaish solar pictures new/DDN Manoj Arora 4 KW 5 Ph 1 Done 4 KW with 5 KW 1 ph invertor/IMG_20241022_124714259.jpg',
  'Assests/vaish solar pictures new/DDN Mokampur 3 KW Mrs Aradhna Kurreti 8 March 2024_Done/IMG_20240602_160332107_HDR.jpg',
  'Assests/vaish solar pictures new/DDN Mokampur 3 KW Mrs Aradhna Kurreti 8 March 2024_Done/IMG_20240602_160351659_HDR.jpg',
  'Assests/vaish solar pictures new/DDN Mr Tanuj Bajaj 3 KW Done/IMG_20241014_141835385.jpg',
  'Assests/vaish solar pictures new/DDN Mr Tanuj Bajaj 3 KW Done/IMG_20241014_141839560.jpg',
  'Assests/vaish solar pictures new/DDN Mr Tanuj Bajaj 3 KW Done/IMG_20241014_141849276.jpg',
  'Assests/vaish solar pictures new/DDN balbir Road Smt Usha Aswal28 Oct 2023_Done/20231029_123543.jpg',
  'Assests/vaish solar pictures new/DDN balbir Road Smt Usha Aswal28 Oct 2023_Done/Plant Picture Smt Usha Aswal.jpg',
  'Assests/vaish solar pictures new/DDN balbir Road Smt Usha Aswal28 Oct 2023_Done/Plant Picture Smt Usha Aswal.png',
  'Assests/vaish solar pictures new/Done_3 KW Bimla Chandrabani/IMG_20250308_123531861.jpg',
  'Assests/vaish solar pictures new/Done_3 KW Bimla Chandrabani/IMG_20250308_123540497.jpg',

  // GPS-stamped images that do not show panels, equipment, or installation work
  'Assests/vaish solar pictures new/DDN J P Sharma 4 KW 1 Ph_Done/20240603_22711PMByGPSMapCamera.jpg',
  'Assests/vaish solar pictures new/DDN J P Sharma 4 KW 1 Ph_Done/20240603_23307pmByGPSMapCamera.jpg',
  'Assests/vaish solar pictures new/DDN J P Sharma 4 KW 1 Ph_Done/DDN Gytri 4 KW Done/20240603_22711PMByGPSMapCamera.jpg',
  'Assests/vaish solar pictures new/DDN Kalam Singh Bhandari 4 KW Done/20241215_44637PMByGPSMapCamera.jpg',
  'Assests/vaish solar pictures new/DDN Kalam Singh Bhandari 4 KW Done/20241215_44739PMByGPSMapCamera.jpg',
  'Assests/vaish solar pictures new/DDN Mokampur 3 KW Mrs Aradhna Kurreti 8 March 2024_Done/20240602_42328PMByGPSMapCamera.jpg',
  'Assests/vaish solar pictures new/DDN Mr Tanuj Bajaj 3 KW Done/20241019_123353PMByGPSMapCamera.jpg',
  'Assests/vaish solar pictures new/DDN Mr Tanuj Bajaj 3 KW Done/20241019_123406PMByGPSMapCamera.jpg',
  'Assests/vaish solar pictures new/DDN Mr Tanuj Bajaj 3 KW Done/20241019_123414PMByGPSMapCamera.jpg',
  'Assests/vaish solar pictures new/DDN Mr Tanuj Bajaj 3 KW Done/20241019_123418PMByGPSMapCamera.jpg',
  'Assests/vaish solar pictures new/DDN RAJSHEKHAR BAHUGUNA 4 KW Done/20240905_64126PMByGPSMapCamera.jpg',
  'Assests/vaish solar pictures new/DDN RAJSHEKHAR BAHUGUNA 4 KW Done/20240905_64129PMByGPSMapCamera.jpg',
  'Assests/vaish solar pictures new/DDN Tehseen Ahmand 4 KW _ Done/20240516_94241AMByGPSMapCamera.jpg',
  'Assests/vaish solar pictures new/DDN col Amit Danwal_Done/5 KW 3 PH Amit Dangwal/20240627_53658pmByGPSMapCamera.jpg',
]);

function listDirectories(directory) {
  const results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const fullPath = path.join(directory, entry.name);
    results.push(fullPath, ...listDirectories(fullPath));
  }
  return results;
}

function getMediaFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => ({ entry, extension: path.extname(entry.name).toLowerCase() }))
    .filter(({ entry, extension }) => !entry.name.startsWith('.') && imageExtensions.has(extension) && !excludedImageNamePattern.test(entry.name))
    .sort(({ entry: first }, { entry: second }) => first.name.localeCompare(second.name, undefined, { numeric: true }))
    .map(({ entry }) => {
      const src = path.relative(rootDirectory, path.join(directory, entry.name)).split(path.sep).join('/');
      return { src, kind: 'image', name: entry.name };
    })
    .filter(({ src, name }) => verifiedInstallationImageNamePattern.test(name) && !excludedImageSources.has(src));
}

function formatTitle(folderName) {
  return folderName
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\bDone\b/gi, '')
    .trim();
}

function findSystemSize(source) {
  const match = source.match(/(\d+(?:\.\d+)?)\s*k(?:w|wi)(?![a-z])/i);
  return match ? `${match[1]} kW` : 'Size not listed';
}

function findLocation(source) {
  const normalized = source.toLowerCase();
  if (normalized.includes('bareilly')) return 'Bareilly, Uttar Pradesh';
  if (normalized.includes('uttarkhasi') || normalized.includes('uttarkashi')) return 'Uttarkashi, Uttarakhand';
  if (normalized.includes('pori garwal') || normalized.includes('pauri garhwal')) return 'Pauri Garhwal, Uttarakhand';
  if (normalized.includes('kashipur')) return 'Kashipur, Uttarakhand';
  if (normalized.includes('suddhowala')) return 'Suddhowala, Dehradun';
  if (/(\bddn\b|dehradun|ajabpur|shartradhara|balbir road|laxman chowk|mokampur|kalidas|chanderbani)/i.test(source)) return 'Dehradun, Uttarakhand';
  return 'Location not listed';
}

function findSystemType(source, systemSize) {
  const normalized = source.toLowerCase();
  if (/off[\s_-]*grid|24volt|solarac|hotncold/.test(normalized)) return 'Off-Grid Solar';
  if (/on[\s_-]*grid/.test(normalized)) return 'On-Grid Solar';
  if (/industry|industrial/.test(normalized) || Number.parseFloat(systemSize) >= 10) return 'Commercial / Industrial Solar';
  return 'Residential Rooftop Solar';
}

const projects = sourceDirectories
  .flatMap((directory) => listDirectories(directory))
  // Exclude the requested project and any of its nested folders from the public gallery.
  .filter((directory) => !excludedProjectDirectoryPattern.test(directory))
  .map((directory) => {
    const media = getMediaFiles(directory);
    if (!media.length) return null;

    const relativeDirectory = path.relative(assetsDirectory, directory).split(path.sep).join('/');
    const folderName = path.basename(directory);
    const systemSize = findSystemSize(relativeDirectory);

    return {
      id: `project-${Buffer.from(relativeDirectory).toString('base64url').toLowerCase()}`,
      title: formatTitle(folderName),
      sourceFolder: relativeDirectory,
      systemSize,
      location: findLocation(relativeDirectory),
      systemType: findSystemType(relativeDirectory, systemSize),
      photos: media.filter((item) => item.kind === 'image').length,
      media,
    };
  })
  .filter(Boolean)
  .sort((first, second) => first.title.localeCompare(second.title, undefined, { numeric: true }));

const output = `/* Generated by generate-project-gallery-data.mjs. Run \`node generate-project-gallery-data.mjs\` after adding project media. */\nwindow.VAISH_PROJECT_GALLERY = ${JSON.stringify(projects, null, 2)};\n`;
fs.writeFileSync(path.join(rootDirectory, 'project-gallery-data.js'), output, 'utf8');

const photoCount = projects.reduce((total, project) => total + project.photos, 0);
console.log(`Generated ${projects.length} projects with ${photoCount} photos.`);
