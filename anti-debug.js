const AntiDebug = (() => {
    let isActive = false;
    let manualDetectionMode = false;

    const defaultOptions = {
        preventSourceView: true,        // 키보드/마우스 차단
        preventConsoleAccess: false,    // console.log 차단 (선택적)
        showWarningMessage: true,       // 차단시 경고 메시지
        enableManualDetection: false,   // 수동 감지 모드 (사용자가 직접 신고)
        strictMode: false,              // 엄격 모드 (모든 상호작용 차단)

        // 자동 감지 관련 (모두 기본 비활성화)
        enableSizeCheck: false,         // ❌ 창 크기 자동 감지 비활성화
        enableDebuggerCheck: false,     // ❌ debugger 자동 감지 비활성화
        enableConsoleCheck: false,      // ❌ console 자동 감지 비활성화

        onBlocked: () => {
            console.log('🚫 개발자 도구 접근이 차단되었습니다.');
        }
    };

    // 키보드 차단 (가장 효과적이고 안전함)
    function setupKeyboardBlocking(showWarning) {
        document.addEventListener('keydown', function(e) {
            let blocked = false;
            let action = '';

            // F12 (개발자 도구)
            if (e.key === 'F12') {
                blocked = true;
                action = '개발자 도구 (F12)';
            }

            // Ctrl+Shift+I (개발자 도구)
            else if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                blocked = true;
                action = '개발자 도구 (Ctrl+Shift+I)';
            }

            // Ctrl+Shift+J (콘솔)
            else if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                blocked = true;
                action = '콘솔 (Ctrl+Shift+J)';
            }

            // Ctrl+U (소스 보기)
            else if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
                blocked = true;
                action = '소스 보기 (Ctrl+U)';
            }

            // Ctrl+Shift+C (요소 검사)
            else if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                blocked = true;
                action = '요소 검사 (Ctrl+Shift+C)';
            }

            // Ctrl+Shift+K (Firefox 콘솔)
            else if (e.ctrlKey && e.shiftKey && e.key === 'K') {
                blocked = true;
                action = '콘솔 (Ctrl+Shift+K)';
            }

            if (blocked) {
                e.preventDefault();
                e.stopPropagation();

                if (showWarning) {
                    console.warn(`🚫 ${action} 접근이 차단되었습니다.`);
                }

                return false;
            }
        });
    }

    // 마우스 우클릭 차단
    function setupMouseBlocking(showWarning) {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();

            if (showWarning) {
                console.warn('🚫 우클릭 메뉴가 차단되었습니다.');
            }

            return false;
        });
    }

    // 텍스트 선택 차단 (선택적)
    function setupSelectionBlocking() {
        document.addEventListener('selectstart', e => {
            e.preventDefault();
            return false;
        });

        document.addEventListener('dragstart', e => {
            e.preventDefault();
            return false;
        });

        // CSS로도 선택 차단
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
            }
            input, textarea {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Console 접근 차단 (선택적, 주의해서 사용)
    function setupConsoleBlocking() {
        // console 메서드들을 무력화
        const consoleMethods = ['log', 'warn', 'error', 'info', 'debug', 'trace', 'dir', 'group', 'groupCollapsed', 'groupEnd', 'clear'];

        consoleMethods.forEach(method => {
            const original = console[method];
            console[method] = function() {
                // 무시하거나 경고 표시
                if (method === 'warn' || method === 'error') {
                    original.apply(console, ['🚫 Console 접근이 제한되었습니다.']);
                }
            };
        });
    }

    // 수동 감지 모드 (사용자가 의심스러운 활동 신고)
    function setupManualDetection() {
        // 페이지에 신고 버튼 추가
        const reportButton = document.createElement('button');
        reportButton.innerHTML = '🚨 의심스러운 활동 신고';
        reportButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 10px;
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        `;

        reportButton.onclick = () => {
            const reason = prompt('의심스러운 활동을 발견하셨나요?\n신고 사유를 입력해주세요:');
            if (reason) {
                alert(`신고가 접수되었습니다: ${reason}`);
                console.log(`🚨 사용자 신고: ${reason}`);
                // 여기서 서버로 신고 내용 전송 가능
            }
        };

        document.body.appendChild(reportButton);
    }

    return {
        start: function(options = {}) {
            const config = { ...defaultOptions, ...options };

            if (isActive) {
                console.warn('⚠️ AntiDebug가 이미 실행중입니다.');
                return false;
            }

            isActive = true;

            // 키보드 차단 설정
            if (config.preventSourceView) {
                setupKeyboardBlocking(config.showWarningMessage);
                setupMouseBlocking(config.showWarningMessage);
                console.log('🛡️ 키보드/마우스 차단 활성화됨');
            }

            // 엄격 모드
            if (config.strictMode) {
                setupSelectionBlocking();
                console.log('🔒 엄격 모드 활성화됨 (텍스트 선택 차단)');
            }

            // Console 차단 (주의해서 사용)
            if (config.preventConsoleAccess) {
                setupConsoleBlocking();
                console.log('🚫 Console 접근 차단 활성화됨');
            }

            // 수동 감지 모드
            if (config.enableManualDetection) {
                setupManualDetection();
                console.log('📋 수동 신고 모드 활성화됨');
            }

            // ✅ 자동 감지는 모두 비활성화됨 (false positive 방지)
            if (config.enableSizeCheck || config.enableDebuggerCheck || config.enableConsoleCheck) {
                console.warn('⚠️ 자동 감지 기능은 false positive 때문에 비활성화되었습니다.');
                console.warn('⚠️ 키보드/마우스 차단만 사용하는 것을 권장합니다.');
            }

            console.log('✅ AntiDebug 활성화 완료 (False Positive 방지 모드)');
            console.log('🛡️ 개발자 도구 키보드 단축키가 차단되었습니다.');
            console.log('🛡️ 우클릭 메뉴가 차단되었습니다.');

            return true;
        },

        stop: function() {
            isActive = false;
            console.log('🛡️ AntiDebug 중지됨');

            // 페이지 새로고침으로 모든 이벤트 리스너 제거
            if (confirm('AntiDebug를 완전히 중지하려면 페이지를 새로고침해야 합니다. 새로고침하시겠습니까?')) {
                window.location.reload();
            }
        },

        // 상태 확인
        isActive: function() {
            return isActive;
        }
    };
})();
