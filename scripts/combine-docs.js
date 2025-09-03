import { exec } from 'child_process';

const files = [
    'documentation/_header.md',
    'documentation/_toc.md',
    'documentation/_features.md',
    'documentation/_installation.md',
    'documentation/_quick-start.md',
    'documentation/_tagged-states.md',
    'documentation/_usage-examples.md',
    'documentation/_sync.md',
    'documentation/_api.md',
    'documentation/_memory-management.md',
    'documentation/_performance-benchmarks.md',
    'documentation/_performance-comparison-benchmarks.md',
    'documentation/_why-choose-substate.md',
    'documentation/_typescript-definitions.md',
    'documentation/_migration-guide.md',
    'documentation/_development.md',
    'documentation/_contributing.md',
    'documentation/_license.md',
];
const OUTPUT_FILE = 'README.md';

const command = `cat ${files.join(' ')} > ${OUTPUT_FILE}`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing command: ${error}`);
        return;
    }
    if (stderr) {
        console.error(`Standard Error: ${stderr}`);
        return;
    }
    console.log(`Successfully combined Markdown files into README.md.`);
});
