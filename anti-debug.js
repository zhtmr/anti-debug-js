const AntiDebug = (() => {
    let isDevtoolsOpen = false;
    let intervalId = null;

    const defaultOptions = {
        onDevtoolsDetected: () => { alert('DevTools 감지됨!'); window.location.reload(); },
        onBotDetected: () => { alert('자동화 접근 감지됨'); window.location.href = '/block'; },
        preventSourceView: false,
        logWarningInConsole: false,
        enableSizeCheck: true,
        enableDevtoolsCheck: true,
        intervalMs: 1000
    };

    function checkWindowSize(callback) {
        const threshold = 160;
        try {
            if (window.outerWidth && window.outerHeight &&
                window.innerWidth && window.innerHeight) {
                const widthDiff = window.outerWidth - window.innerWidth;
                const heightDiff = window.outerHeight - window.innerHeight;

                if (widthDiff > threshold || heightDiff > threshold) {
                    callback();
                }
            }
        } catch (e) {
            // 에러 발생시 무시
        }
    }

    function checkDebugger(callback) {
        let devtools = false;

        try {
            const start = performance.now();
            (() => { debugger; })();
            const end = performance.now();

            if (end - start > 5) {
                devtools = true;
            }
        } catch (e) {
            devtools = true;
        }

        if (devtools) callback();
    }

    function checkConsoleAccess(callback) {
        try {
            let devtools = false;
            const element = new Image();

            Object.defineProperty(element, 'id', {
                get: function() {
                    devtools = true;
                    callback();
                    return 'devtools-detected';
                }
            });

            console.log(element);
            console.dir(element);

            setTimeout(() => {
                try {
                    delete element.id;
                } catch (e) {}
            }, 100);

        } catch (e) {
            callback();
        }
    }

    function checkFunctionToString(callback) {
        try {
            const reg = /./;
            reg.toString = callback;
            console.log('%c', reg);
        } catch (e) {
            callback();
        }
    }

    function detectKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+I (개발자도구)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+J (콘솔)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                return false;
            }

            // Ctrl+U (소스보기)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                return false;
            }

            // Ctrl+Shift+C (요소검사)
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                return false;
            }
        });
    }

    function checkBot(callback) {
        // 봇 감지 강화
        const botPatterns = [
            /bot/i, /spider/i, /crawl/i, /headless/i,
            /phantom/i, /selenium/i, /puppeteer/i, /playwright/i
        ];

        const userAgent = navigator.userAgent;
        const isBot = botPatterns.some(pattern => pattern.test(userAgent)) ||
            navigator.webdriver ||
            window.chrome?.webdriver ||
            window.callPhantom ||
            window._phantom ||
            window.__nightmare;

        if (isBot) {
            callback();
        }
    }

    function blockSourceView() {
        // 우클릭 차단
        document.addEventListener('contextmenu', e => {
            e.preventDefault();
            return false;
        });

        // 텍스트 선택 차단
        document.addEventListener('selectstart', e => {
            e.preventDefault();
            return false;
        });

        // 드래그 차단
        document.addEventListener('dragstart', e => {
            e.preventDefault();
            return false;
        });

        // 키보드 단축키 차단
        detectKeyboardShortcuts();
    }

    return {
        start: function(options = {}) {
            const config = { ...defaultOptions, ...options };

            if (config.preventSourceView) {
                blockSourceView();
            }

            if (config.logWarningInConsole) {
                console.warn('⚠️ AntiDebug 활성화됨 - 보안 모드 ON');
                console.clear(); // 콘솔 정리
            }

            // 봇 감지 (즉시 실행)
            checkBot(() => {
                if (config.onBotDetected) config.onBotDetected();
            });

            // 주기적 감지 시작
            if (intervalId) clearInterval(intervalId);

            intervalId = setInterval(() => {
                if (config.enableSizeCheck) {
                    checkWindowSize(() => {
                        if (!isDevtoolsOpen) {
                            isDevtoolsOpen = true;
                            if (config.onDevtoolsDetected) config.onDevtoolsDetected();
                        }
                    });
                }

                if (config.enableDevtoolsCheck) {
                    // 여러 방법 조합으로 감지 정확도 향상
                    checkDebugger(() => {
                        if (!isDevtoolsOpen) {
                            isDevtoolsOpen = true;
                            if (config.onDevtoolsDetected) config.onDevtoolsDetected();
                        }
                    });

                    checkConsoleAccess(() => {
                        if (!isDevtoolsOpen) {
                            isDevtoolsOpen = true;
                            if (config.onDevtoolsDetected) config.onDevtoolsDetected();
                        }
                    });

                    checkFunctionToString(() => {
                        if (!isDevtoolsOpen) {
                            isDevtoolsOpen = true;
                            if (config.onDevtoolsDetected) config.onDevtoolsDetected();
                        }
                    });
                }
            }, config.intervalMs);

            console.log('🛡️ AntiDebug 시작됨');
            return true;
        },

        stop: function() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            isDevtoolsOpen = false;
            console.log('🛡️ AntiDebug 중지됨');
        }
    };
})();
