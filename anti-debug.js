const AntiDebug = (() => {
    let isDevtoolsOpen = false;
    let intervalId = null;
    let detectionCount = 0; // 감지 횟수 카운터

    const defaultOptions = {
        onDevtoolsDetected: () => { alert('DevTools 감지됨!'); window.location.reload(); },
        onBotDetected: () => { alert('자동화 접근 감지됨'); window.location.href = '/block'; },
        preventSourceView: false,
        logWarningInConsole: false,
        enableSizeCheck: true,
        enableDebuggerCheck: false,
        enableConsoleCheck: false,
        intervalMs: 1000,
        sizeThreshold: 250,
        debuggerThreshold: 100,
        requiredDetections: 3          // 3번 연속 감지시에만 경고
    };

    // 창 크기 감지
    function checkWindowSize(callback, threshold) {
        try {
            // undefined 체크 추가
            if (!window.outerWidth || !window.outerHeight ||
                !window.innerWidth || !window.innerHeight) {
                return false;
            }

            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;

            // 디버깅 로그 (개발시에만 사용)
            // console.log(`Size check: W:${widthDiff}, H:${heightDiff}, Threshold:${threshold}`);

            // 두 조건 모두 만족해야 감지
            if (widthDiff > threshold && heightDiff > threshold) {
                return true;
            }

            // 또는 한쪽이 매우 큰 경우만 감지
            if (widthDiff > threshold * 2 || heightDiff > threshold * 2) {
                return true;
            }

            return false;

        } catch (e) {
            return false;
        }
    }

    // debugger 감지 (선택적)
    function checkDebugger(callback, threshold) {
        try {
            const start = performance.now();
            (() => { debugger; })();
            const end = performance.now();

            const diff = end - start;
            // console.log(`Debugger check: ${diff}ms, Threshold: ${threshold}ms`);

            if (diff > threshold) {
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    // console 접근 감지 (선택적)
    function checkConsoleAccess(callback) {
        try {
            let detected = false;
            const element = new Image();

            Object.defineProperty(element, 'id', {
                get: function() {
                    detected = true;
                    return 'detected';
                }
            });

            // 짧은 시간 동안만 체크
            console.dir(element);

            setTimeout(() => {
                try { delete element.id; } catch (e) {}
            }, 50);

            return detected;
        } catch (e) {
            return false;
        }
    }

    function checkBot(callback) {
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

        // 키보드 단축키 차단
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
            if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
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

    return {
        start: function(options = {}) {
            const config = { ...defaultOptions, ...options };

            if (config.preventSourceView) {
                blockSourceView();
            }

            if (config.logWarningInConsole) {
                console.warn('⚠️ AntiDebug 활성화됨');
            }

            // 봇 감지 (즉시 실행)
            checkBot(() => {
                if (config.onBotDetected) config.onBotDetected();
            });

            // 초기 기준값 설정 (첫 5초간은 감지 안함)
            let initialDelay = 5000;
            let startTime = Date.now();

            // 주기적 감지 시작
            if (intervalId) clearInterval(intervalId);

            intervalId = setInterval(() => {
                // 초기 지연 시간 체크
                if (Date.now() - startTime < initialDelay) {
                    return;
                }

                let currentDetections = 0;

                // 창 크기 감지 (가장 안정적)
                if (config.enableSizeCheck) {
                    if (checkWindowSize(null, config.sizeThreshold)) {
                        currentDetections++;
                    }
                }

                // debugger 감지 (선택적)
                if (config.enableDebuggerCheck) {
                    if (checkDebugger(null, config.debuggerThreshold)) {
                        currentDetections++;
                    }
                }

                // console 감지 (선택적)
                if (config.enableConsoleCheck) {
                    if (checkConsoleAccess()) {
                        currentDetections++;
                    }
                }

                // 연속 감지 카운터
                if (currentDetections > 0) {
                    detectionCount++;
                    console.log(`🔍 감지 횟수: ${detectionCount}/${config.requiredDetections}`);
                } else {
                    detectionCount = 0; // 감지되지 않으면 카운터 리셋
                }

                // 필요한 횟수만큼 연속 감지시에만 경고
                if (detectionCount >= config.requiredDetections && !isDevtoolsOpen) {
                    isDevtoolsOpen = true;
                    if (config.onDevtoolsDetected) {
                        config.onDevtoolsDetected();
                    }
                }
            }, config.intervalMs);

            console.log('🛡️ 개선된 AntiDebug 시작됨');
            console.log(`📊 설정: 크기임계값=${config.sizeThreshold}px, 필요감지횟수=${config.requiredDetections}회`);
            return true;
        },

        stop: function() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            isDevtoolsOpen = false;
            detectionCount = 0;
            console.log('🛡️ AntiDebug 중지됨');
        }
    };
})();
