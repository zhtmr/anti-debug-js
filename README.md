# AntiDebug JS (by zhtmr) [![Auto Build](https://github.com/zhtmr/anti-debug-js/actions/workflows/build.yml/badge.svg)](https://github.com/zhtmr/anti-debug-js/actions/workflows/build.yml)

## 사용법

```html
<script src="https://cdn.jsdelivr.net/gh/zhtmr/anti-debug-js@latest/anti-debug.min.js"></script>

<script>
    AntiDebug.start({
        preventSourceView: true,
        enableSizeCheck: true,
        intervalMs: 2000,
        onDevtoolsDetected: () => {
            alert('🚨 개발자 도구가 감지되었습니다!');
            window.location.reload();
        }
    });

    console.log('AntiDebug 활성화 완료!');
</script>
````

- preventSourceView: Ctrl+U / F12 / 우클릭 메뉴 방지
- logWarningInConsole: 콘솔 경고 메시지 출력
- enableSizeCheck: 창 크기 변화 기반 DevTools 감지
- onDevtoolsDetected, onBotDetected: 사용자 정의 콜백
- intervalMs: 체크 주기 (기본 1000ms)
