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
