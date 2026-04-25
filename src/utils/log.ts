type Level = 'error' | 'warning' | 'info' | 'debug';

const hoppsLog = (level: Level, ...msg: string[]) => {
    if(level === 'debug' && process.env.HOPPS_DEBUG !== 'true') return;

    const sections = {
        time: new Date().toISOString(),
        component: 'hopps',
        level,
        msg: msg.join(' '),
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

export const log = Object.assign(hoppsLog.bind('info'), {
    error: hoppsLog.bind('error'),
    warning: hoppsLog.bind('warning'),
    info: hoppsLog.bind('info'),
    debug: hoppsLog.bind('debug'),
})