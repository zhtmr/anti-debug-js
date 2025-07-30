# AntiDebug JS (by zhtmr) [![Auto Build](https://github.com/zhtmr/anti-debug-js/actions/workflows/build.yml/badge.svg)](https://github.com/zhtmr/anti-debug-js/actions/workflows/build.yml)

## 사용법

```html
<script src="https://cdn.jsdelivr.net/gh/zhtmr/anti-debug-js/anti-debug.min.js"></script>

<script>
AntiDebug.start({
    preventSourceView: true,      // 우클릭/키보드 차단
    logWarningInConsole: true,    // 콘솔에 경고 출력
    enableSizeCheck: true,        // 창 크기 체크
    devtoolsCheck: true,          // DevTools 감지 (기본값)
    consoleCheck: true,           // 콘솔 감지 (기본값)
    onDevtoolsDetected: () => alert('보안 경고: DevTools 열림!')
});
</script>
````

- preventSourceView: Ctrl+U / F12 / 우클릭 메뉴 방지
- logWarningInConsole: 콘솔 경고 메시지 출력
- enableSizeCheck: 창 크기 변화 기반 DevTools 감지
- onDevtoolsDetected, onBotDetected: 사용자 정의 콜백
- intervalMs: 체크 주기 (기본 1000ms)
