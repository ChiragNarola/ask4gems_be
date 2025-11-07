const fs = require('fs');
const path = require('path');

const env = process.argv[2] || 'development';
console.log(`Environment used for build: ${env}`);

//#region Build version
const baseVersion = "1.1";
const baseDate = new Date(Date.UTC(2000, 0, 1));
const currentDate = new Date();
const msPerDay = 24 * 60 * 60 * 1000;
const build = Math.floor((currentDate.getTime() - baseDate.getTime()) / msPerDay);
const secondsSinceMidnight =
	currentDate.getUTCHours() * 3600 +
	currentDate.getUTCMinutes() * 60 +
	currentDate.getUTCSeconds();
const revision = Math.floor(secondsSinceMidnight / 2);
const version = `${baseVersion}.${build}.${revision}`;
console.log(`✅ Build version generated: ${version}`);
//#endregion

//#region prepare .env file with content from environment specific .env.<environment> file
const envFile = `.env.${env}`;
const targetEnvFilePath = path.resolve(__dirname, '.env');

if (!fs.existsSync(envFile)) {
	console.error(`❌ Could not find .env.${env} file`);
	process.exit(1);
}

let content = fs.readFileSync(envFile, 'utf-8');
content += `\nBUILD_VERSION=${version}`;
content += `\nBUILD_DATE=${currentDate.toISOString()}`;
fs.writeFileSync(targetEnvFilePath, content);

console.log(`✅ .env file generated for environment: ${env}`);
//#endregion
