import { http, HttpResponse } from 'msw';
import { ENV } from '../../apis/env';

const baseURL = ENV.baseUrl;

const MAEIL_MAIL_ANSWERS: Record<
  string,
  {
    title: string;
    answer: string;
    myAnswer: string;
  }
> = {
  '1': {
    title: '클로저란 무엇인가요?',
    answer: `
      <h2>클로저</h2>

      <p>
        <strong>클로저</strong>는 함수가 선언될 때의 스코프를 기억하여,
        함수가 생성된 이후에도 그 스코프에 접근할 수 있는 기능을 말합니다.
        비유하자면, 함수가 자신이 생성된 환경을 '기억'하는 것이라고 할 수 있습니다.
      </p>

      <p>
        클로저는 자바스크립트의 <strong>함수가 일급 객체라는 특성</strong>과
        <strong>렉시컬 스코프</strong>의 조합으로 만들어집니다.
      </p>

      <h3>클로저 예시 코드</h3>

      <pre><code class="language-javascript">function outerFunction(outerVariable) {
  return function innerFunction(innerVariable) {
    console.log('Outer Variable: ' + outerVariable);
    console.log('Inner Variable: ' + innerVariable);
  };
}

const newFunction = outerFunction('outside');
newFunction('inside');</code></pre>

      <p>
        여기서 <code>innerFunction</code>은 <code>outerFunction</code>의 내부에 정의되어 있습니다.
        <code>innerFunction</code>은 자신이 생성된 스코프, 즉 <code>outerFunction</code>의
        스코프를 기억하고, <code>outerFunction</code>의 호출이 완료된 이후에도 그 스코프에 접근할 수 있습니다.
      </p>

      <h2>클로저는 언제 활용하나요?</h2>

      <p>
        클로저는 변수와 함수의 접근 범위를 제어하고 특정 데이터와 상태를 유지하기 위해 자주 활용됩니다.
      </p>

      <h3>첫째, 데이터 은닉에 활용됩니다.</h3>
      <p>
        클로저는 외부에서 접근할 수 없는 비공개 변수와 함수를 만들 수 있습니다.
        이를 통해 데이터를 은닉하여 외부 접근을 막고, 데이터 무결성을 유지할 수 있습니다.
      </p>

      <h3>둘째, 비동기 작업에 활용됩니다.</h3>
      <p>
        클로저는 비동기 작업에서 이전의 실행 컨텍스트를 유지해야 할 때 유용합니다.
      </p>

      <pre><code class="language-js">function createLogger(name) {
  return function() {
    console.log(\`Logger: \${name}\`);
  };
}

const logger = createLogger('MyApp');
setTimeout(logger, 1000);</code></pre>

      <p>
        위의 예시에서 클로저가 <code>name</code> 변수(<code>'MyApp'</code>)를 저장하여
        1초 후에도 해당 값이 유지되어 출력됩니다.
      </p>

      <h3>셋째, 모듈 패턴을 구현하는 데 활용됩니다.</h3>
      <p>
        모듈 패턴은 특정 기능을 캡슐화하고, 외부에 공개하고자 하는 부분만 선택적으로 노출하여
        코드의 응집력을 높이고, 유지보수성을 향상시키는 패턴입니다.
      </p>

      <h2>📚 추가 학습 자료</h2>

      <ul>
        <li>
          <a href="https://www.youtube.com/watch?v=WbVVKY9CDP0" target="_blank" rel="noopener noreferrer">
            [얄팍한 코딩사전] 클로저(Closure) - 죽은 함수의 망령
          </a>
        </li>
      </ul>
    `,
    myAnswer:
      '서버에서 받아오는 데이터와 화면 내부 상태의 책임이 다르기 때문에 분리해야 한다고 답변했습니다.',
  },
};

const getMaeilMailAnswer = (contentId: string) => {
  return (
    MAEIL_MAIL_ANSWERS[contentId] ?? {
      title: `매일메일 ${contentId}번 문제`,
      answer: `
        <h2>모범 답안</h2>
        <p>문제에서 요구하는 핵심 개념을 먼저 정의하고, 실제 코드나 협업 상황에서 왜 필요한지 설명합니다.</p>
        <h3>답변 구성</h3>
        <ul>
          <li>개념을 한 문장으로 요약합니다.</li>
          <li>장점과 주의할 점을 함께 설명합니다.</li>
          <li>실무에서 적용할 수 있는 예시를 덧붙입니다.</li>
        </ul>
      `,
      myAnswer:
        '핵심 개념을 설명하고, 장점과 실무 적용 예시를 함께 작성했습니다.',
    }
  );
};

export const maeilMailHandlers = [
  http.get(`${baseURL}/maeil-mail/:contentId/answer`, ({ params }) => {
    const { contentId } = params;
    const maeilMailAnswer = getMaeilMailAnswer(String(contentId));

    return HttpResponse.json({
      title: maeilMailAnswer.title,
      answer: maeilMailAnswer.answer,
    });
  }),

  http.get(`${baseURL}/maeil-mail/:contentId/answer/me`, ({ params }) => {
    const { contentId } = params;
    const maeilMailAnswer = getMaeilMailAnswer(String(contentId));

    return HttpResponse.json({
      answer: maeilMailAnswer.myAnswer,
    });
  }),
];
