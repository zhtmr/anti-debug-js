/**
 * Anti-DevTools Module
 * 
 */

class AntiDevTools {
    constructor(options = {}) {
        this.options = {
            blockKeyboard: true,
            detectConsole: true,
            customContextMenu: false,
            warningMessage: 'Developer tools detected!',
            detectionInterval: 500,
            onDetect: null,
            ...options
        };
        
        this.devtools = {
            open: false,
            orientation: null
        };
        
        this.init();
    }

    init() {
        if (this.options.blockKeyboard) {
            this.blockKeyboardShortcuts();
        }
        
        if (this.options.detectConsole) {
            this.startConsoleDetection();
            this.overrideConsole();
        }
        
        if (this.options.customContextMenu) {
            this.setupCustomContextMenu();
        }
    }

    /**
     * 키보드 단축키 차단
     */
    blockKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // F12 차단
            if (e.key === 'F12') {
                e.preventDefault();
                this.onDevToolsAttempt('F12 키 차단됨');
                return false;
            }
            
            // Ctrl+Shift+I (개발자 도구)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                this.onDevToolsAttempt('Ctrl+Shift+I 차단됨');
                return false;
            }
            
            // Ctrl+Shift+J (콘솔)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                this.onDevToolsAttempt('Ctrl+Shift+J 차단됨');
                return false;
            }
            
            // Ctrl+U (소스보기)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                this.onDevToolsAttempt('소스보기 차단됨');
                return false;
            }
            
            // Ctrl+Shift+C (요소 검사)
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                this.onDevToolsAttempt('요소 검사 차단됨');
                return false;
            }
        });
    }

    /**
     * 콘솔 열림 감지
     */
    startConsoleDetection() {
        setInterval(() => {
            const heightDiff = window.outerHeight - window.innerHeight;
            const widthDiff = window.outerWidth - window.innerWidth;
            
            if (heightDiff > 200 || widthDiff > 200) {
                if (!this.devtools.open) {
                    this.devtools.open = true;
                    this.onDevToolsDetected();
                }
            } else {
                this.devtools.open = false;
            }
        }, this.options.detectionInterval);
    }

    /**
     * 콘솔 객체 오버라이드
     */
    overrideConsole() {
        const self = this;
        
        // console.log 감지
        Object.defineProperty(console, 'log', {
            get: function() {
                self.onDevToolsDetected();
                return function() {};
            }
        });
        
        // console.info 감지
        Object.defineProperty(console, 'info', {
            get: function() {
                self.onDevToolsDetected();
                return function() {};
            }
        });
        
        // console.warn 감지
        Object.defineProperty(console, 'warn', {
            get: function() {
                self.onDevToolsDetected();
                return function() {};
            }
        });
        
        // console.error 감지
        Object.defineProperty(console, 'error', {
            get: function() {
                self.onDevToolsDetected();
                return function() {};
            }
        });
    }

    /**
     * 커스텀 컨텍스트 메뉴 설정
     */
    setupCustomContextMenu() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showCustomContextMenu(e.pageX, e.pageY);
        });
        
        // 다른 곳 클릭 시 메뉴 숨김
        document.addEventListener('click', () => {
            this.hideCustomContextMenu();
        });
    }

    /**
     * 커스텀 컨텍스트 메뉴 표시
     */
    showCustomContextMenu(x, y) {
        this.hideCustomContextMenu(); // 기존 메뉴 제거
        
        const menu = document.createElement('div');
        menu.id = 'custom-context-menu';
        menu.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        
        const menuItems = [
            { text: '뒤로가기', action: () => history.back() },
            { text: '앞으로가기', action: () => history.forward() },
            { text: '새로고침', action: () => location.reload() },
            { text: '인쇄', action: () => window.print() }
        ];
        
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.textContent = item.text;
            menuItem.style.cssText = `
                padding: 8px 12px;
                cursor: pointer;
                border-bottom: 1px solid #eee;
            `;
            menuItem.addEventListener('mouseover', () => {
                menuItem.style.backgroundColor = '#f0f0f0';
            });
            menuItem.addEventListener('mouseout', () => {
                menuItem.style.backgroundColor = 'white';
            });
            menuItem.addEventListener('click', (e) => {
                e.stopPropagation();
                item.action();
                this.hideCustomContextMenu();
            });
            menu.appendChild(menuItem);
        });
        
        document.body.appendChild(menu);
    }

    /**
     * 커스텀 컨텍스트 메뉴 숨김
     */
    hideCustomContextMenu() {
        const existingMenu = document.getElementById('custom-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
    }

    /**
     * 개발자 도구 감지 시 호출되는 메서드
     */
    onDevToolsDetected() {
        console.clear();
        
        if (this.options.onDetect) {
            this.options.onDetect();
        } else {
            // 기본 동작: 페이지 내용 숨김
            document.body.innerHTML = `
                <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-family: Arial, sans-serif;
                    background: #f0f0f0;
                ">
                    <h1 style="color: #d32f2f;">${this.options.warningMessage}</h1>
                </div>
            `;
        }
    }

    /**
     * 개발자 도구 접근 시도 시 호출되는 메서드
     */
    onDevToolsAttempt(method) {
        if (this.options.onDetect) {
            this.options.onDetect(method);
        }
    }

    /**
     * 모듈 비활성화
     */
    disable() {
        // 이벤트 리스너 제거는 복잡하므로 페이지 리로드 권장
        location.reload();
    }
}

// ES6 모듈 export
export default AntiDevTools;

// CommonJS 지원
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AntiDevTools;
}

// 전역 변수로도 사용 가능
if (typeof window !== 'undefined') {
    window.AntiDevTools = AntiDevTools;
}
