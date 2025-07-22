const languageToTailwindColorKey: { [key: string]: string } = {
    'JavaScript': 'js',
    'TypeScript': 'ts',
    'Java': 'java',
    'Python': 'py',
    'C#': 'csharp',
    'PHP': 'php',
    'HTML': 'html',
    'CSS': 'css',
    'Ruby': 'ruby',
    'Go': 'go',
    'Swift': 'swift',
    'Kotlin': 'kotlin',
    'Rust': 'rust',
    'Scala': 'scala',
    'Perl': 'perl',
    'HCL': 'hcl',
    'Shell': 'shell',
    'Dart': 'dart',
    'Lua': 'lua',
    'R': 'r',
};

export function getLanguageColorClass(languageName: string | null | undefined): string {
    if (!languageName) {
        return 'text-gray-500';
    }
    const key = languageToTailwindColorKey[languageName];
    if (key) {
        return `text-language-${key}`;
    }
    return 'text-gray-500';
}

export function getLanguageHexColor(languageName: string | null | undefined): string {
    if (!languageName) {
        return '#6B7280';
    }
    const key = languageToTailwindColorKey[languageName];
    const hexColors: { [key: string]: string } = {
        'js': '#f1e05a',
        'ts': '#2b7489',
        'java': '#b07219',
        'py': '#3572A5',
        'csharp': '#178600',
        'php': '#4F5D95',
        'html': '#e34c26',
        'css': '#563d7c',
        'ruby': '#701516',
        'go': '#00ADD8',
        'swift': '#fdab3e',
        'kotlin': '#A97BFF',
        'rust': '#dea584',
        'scala': '#c22d40',
        'perl': '#0298c3',
        'hcl': '#844FBA',
        'shell': '#89e051',
        'dart': '#00B4AB',
        'lua': '#000080',
        'r': '#198CE7',
    };
    return key && hexColors[key] ? hexColors[key] : '#6B7280';
}