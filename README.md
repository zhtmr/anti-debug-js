# AntiDebug JS (by zhtmr)

## 사용법

```html
<script src="https://cdn.jsdelivr.net/gh/zhtmr/anti-debug-js/anti-debug.min.js"></script>

<script>
  // 스크립트 로드 확인 후 실행
  if (typeof AntiDebug !== 'undefined') {
    console.log('AntiDebug 로드 성공');
    AntiDebug.start({
      preventSourceView: true,
      logWarningInConsole: true,
      enableSizeCheck: true,
      onDevtoolsDetected: () => alert('보안 경고: DevTools 열림!')
    });
  } else {
    console.log('AntiDebug 로드 실패');
  }
</script>
````

- preventSourceView: Ctrl+U / F12 / 우클릭 메뉴 방지
- logWarningInConsole: 콘솔 경고 메시지 출력
- enableSizeCheck: 창 크기 변화 기반 DevTools 감지
- onDevtoolsDetected, onBotDetected: 사용자 정의 콜백
- intervalMs: 체크 주기 (기본 1000ms)
