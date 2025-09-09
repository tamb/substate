import fs from 'fs';
import { join } from 'path';

const rootDir = process.cwd();

function checkThatIntegrationDependenciesMatch(integrationDependency, rootDependency, integrationDir) {
    const integrationPackageJson = JSON.parse(fs.readFileSync(join(integrationDir, 'package.json'), 'utf8'));
    const rootPackageJson = JSON.parse(fs.readFileSync(join(rootDir, 'package.json'), 'utf8'));

    const integrationDependencies = integrationPackageJson.dependencies;
    const rootDependencies = rootPackageJson.peerDependencies;

    const integrationVersion = integrationDependencies[integrationDependency];
    const rootVersion = rootDependencies[rootDependency];

    if (integrationVersion === rootVersion) {
        const output = {
            matches: true,
            sign: '✅',
            integrationDependency,
            integrationVersion: integrationVersion.toString(),
            rootDependency,
            rootVersion: rootVersion.toString()
        };
        return output;
    }

    const output = {
        matches: false,
        sign: '❌',
        integrationDependency,
        integrationVersion: integrationVersion.toString(),
        rootDependency,
        rootVersion: rootVersion.toString()
    };
    return output;
}
console.log('🔍 Checking dependency match...\n');

const headers = [
    "matches",
    'sign',
    'integrationDependency',
    'integrationVersion',
    'rootDependency',
    'rootVersion'
];
const reactMatch = checkThatIntegrationDependenciesMatch('react', 'react', 'integration-tests/react-vite');
const preactMatch = checkThatIntegrationDependenciesMatch('preact', 'preact', 'integration-tests/preact-vite');

const allMatches = [reactMatch, preactMatch];


console.table(allMatches, headers);
if (allMatches.some(match => !match.matches)) {
    console.error('😡 Some dependencies do not match...');
    process.exit(1);
}

console.log('🏆 All dependencies match');