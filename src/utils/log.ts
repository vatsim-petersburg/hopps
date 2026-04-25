type Level = 'error' | 'warning' | 'info' | 'debug';

const hoppsLog = (level: Level, ...msg: any[]) => {
    if(level === 'debug' && process.env.HOPPS_DEBUG !== 'true') return;

    const sections = {
        time: new Date().toISOString(),
        component: 'hopps',
        level,
        msg: msg.map(String).join(' '),
    };

    const message = Object.entries(sections).map(([key, value]) => `${key}=${value}`).join(' ');

    switch (level) {
        case 'error':
            return console.error(message);
        case 'warning':
            return console.warn(message);
        case 'info':
            return console.info(message);
        case 'debug':
            return console.debug(message);
    }
};

export const log = Object.assign(hoppsLog.bind(null,'info'), {
    error: hoppsLog.bind(null, 'error'),
    warning: hoppsLog.bind(null,'warning'),
    info: hoppsLog.bind(null,'info'),
    debug: hoppsLog.bind(null,'debug'),
})