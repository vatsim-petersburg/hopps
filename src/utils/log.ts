const LEVELS = ['error', 'warn', 'info', 'debug'] as const;
type Level = typeof LEVELS[number];

const hoppsLog = (level: Level, ...msg: any[]) => {
    if(!LEVELS.includes(level)) return;
    if(level === 'debug' && process.env.HOPPS_DEBUG !== 'true') return;

    const sections = {
        time: new Date().toISOString(),
        component: 'hopps',
        level,
        msg: msg.map(String).join(' '),
    };

    const message = Object.entries(sections).map(([key, value]) => `${key}=${value}`).join(' ');

    return console[level](message);
};

export const log = Object.assign(hoppsLog.bind(null, 'info'), {
    error: hoppsLog.bind(null, 'error'),
    warn: hoppsLog.bind(null, 'warn'),
    info: hoppsLog.bind(null, 'info'),
    debug: hoppsLog.bind(null, 'debug'),
});