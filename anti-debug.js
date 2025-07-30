const AntiDebug = (() => {
    let isDevtoolsOpen = false;
    let intervalId = null;

    const defaultOptions = {
        onDevtoolsDetected: () => { alert('DevTools 탐지됨!'); window.location.reload(); },
        onBotDetected: () => { alert('자동화 접근 감지됨'); window.location.href = '/block'; },
        preventSourceView: false,
        logWarningInConsole: false,
        enableSizeCheck: false,
        devtoolsCheck: true,
        consoleCheck: true,
        intervalMs: 1000
    };

    function checkDevtools(cb) {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) cb();
    }

    function checkConsole(cb) {
        const dev = /./;
        dev.toString = function() { cb(); return ''; };
        console.log('%c', dev);
    }

    function checkBot(cb) {
        if (/bot|headless|phantom/i.test(navigator.userAgent) || navigator.webdriver) {
            cb();
        }
    }

    function checkResize(cb) {
        if (window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200) {
            cb();
        }
    }

    function blockSourceView() {
        window.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener('keydown', e => {
            if ((e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 'S')) || e.key === 'F12') {
                e.preventDefault();
            }
        });
    }

    function start(options = {}) {
        const cfg = { ...defaultOptions, ...options };

        if (cfg.preventSourceView) blockSourceView();
        if (cfg.logWarningInConsole) {
            console.warn('⚠️ AntiDebug 활성화됨 - 콘솔 접근 금지');
        }

        checkBot(() => { cfg.onBotDetected(); });

        intervalId = setInterval(() => {
            if (cfg.devtoolsCheck) {
                checkDevtools(() => {
                    if (!isDevtoolsOpen) {
                        isDevtoolsOpen = true;
                        cfg.onDevtoolsDetected();
                    }
                });
            }
            if (cfg.consoleCheck) {
                checkConsole(() => {
                    if (!isDevtoolsOpen) {
                        isDevtoolsOpen = true;
                        cfg.onDevtoolsDetected();
                    }
                });
            }
            if (cfg.enableSizeCheck) {
                checkResize(() => {
                    if (!isDevtoolsOpen) {
                        isDevtoolsOpen = true;
                        cfg.onDevtoolsDetected();
                    }
                });
            }
        }, cfg.intervalMs);
    }

    function stop() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        isDevtoolsOpen = false;
    }

    return { start, stop };
})();
