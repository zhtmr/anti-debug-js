[![](https://data.jsdelivr.com/v1/package/gh/zhtmr/anti-debug-js/badge)](https://www.jsdelivr.com/package/gh/zhtmr/anti-debug-js)
[![Auto Build](https://github.com/zhtmr/anti-debug-js/actions/workflows/build.yml/badge.svg)](https://github.com/zhtmr/anti-debug-js/actions/workflows/build.yml)

# AntiDebug JS

## 사용법

```html
<script src="https://cdn.jsdelivr.net/gh/zhtmr/anti-debug-js@latest/anti-debug.min.js"></script>

<script type="module">
        import AntiDevTools from './anti-devtools.js';
        
        // 기본 설정으로 초기화
        const antiDevTools = new AntiDevTools({
            blockKeyboard: true,
            detectConsole: true,   // consol.* 사용 시 false 로 수정
            customContextMenu: true,
            warningMessage: '개발자 도구가 감지되었습니다!',
            detectionInterval: 500,
            onDetect: (method) => {
                console.log('개발자 도구 접근 시도:', method);
                // 커스텀 동작을 여기에 추가할 수 있습니다
            }
        });
</script>

<!-- 모듈을 지원하지 않는 브라우저용 대체 -->
<script nomodule>
        // anti-devtools.js를 직접 로드한 경우
        const antiDevTools = new AntiDevTools({
            blockKeyboard: true,
            detectConsole: true,
            customContextMenu: true
        });
</script>
````
