const fs = require('fs');
const axios = require('axios');

async function getTopContributors(owner, repo) {
    const { data } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`);
    return data.slice(0, 10).map(contributor => ({
        login: contributor.login,
        contributions: contributor.contributions
    }));
}

async function updateReadme(owner, repo) {
    const contributors = await getTopContributors(owner, repo);
    const readme = fs.readFileSync('README.md', 'utf8');
    const updatedReadme = readme.replace(/## Top Contributors\n\n([^#]+)/, `## Top Contributors\n\n${contributors.map(contributor => `1. [${contributor.login}](https://github.com/${contributor.login}) - ${contributor.contributions} commits`).join('\n')}\n`);
    fs.writeFileSync('README.md', updatedReadme);
}

updateReadme('AndrewGrizhenkov', 'copilot-metrics-viewer');
