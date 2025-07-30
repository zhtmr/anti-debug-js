# AntiDebug JS (by zhtmr)

## 사용법

```html
<script src="https://cdn.jsdelivr.net/gh/zhtmr/anti-debug-js@main/antiDebug.min.js" async crossorigin="anonymous"></script>
<script>
  AntiDebug.start({
    preventSourceView: true,
    logWarningInConsole: true,
    enableSizeCheck: true,
    onDevtoolsDetected: () => alert('보안 경고: DevTools 열림!')
  });
</script>
````

- preventSourceView: Ctrl+U / F12 / 우클릭 메뉴 방지
- logWarningInConsole: 콘솔 경고 메시지 출력
- enableSizeCheck: 창 크기 변화 기반 DevTools 감지
- onDevtoolsDetected, onBotDetected: 사용자 정의 콜백
- intervalMs: 체크 주기 (기본 1000ms)
