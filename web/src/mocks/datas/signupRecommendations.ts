import type { GetSignupRecommendationsResponse } from '@/apis/signupSource/signupSource.api';

// 2026-11-22 BigQuery 기준: 매일메일 제외, 4주 100통·읽은 사람 10명 이상, 읽음률 순위와 읽은 사람 수 순위의 평균 순서
export const SIGNUP_RECOMMENDATIONS: GetSignupRecommendationsResponse = {
  categories: [
    '경제/재테크',
    '트렌드/라이프',
    '문화/예술',
    '취미/자기개발',
    '시사/사회',
    'IT/테크',
    '지역/여행',
    '과학/환경',
    '리빙/인테리어',
    'AI',
    '비즈/산업',
  ],
  newsletters: [
    {
      newsletterId: 53,
      name: '주말토리',
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQWkWXYOTVTuNozAgg2K-ubLJFBV30iao_fw&s',
      description:
        '이번 주말에 뭐 하지? 금요일마다 즐거운 놀 거리를 메일로 받아보세요!',
      subscribeUrl:
        'https://page.stibee.com/subscriptions/78183?ref=blog.stibee.com',
      category: '지역/여행',
      subscriberCount: 351,
      arrivalDays: '매주 금요일',
    },
    {
      newsletterId: 48,
      name: '까탈로그',
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWyt5ihmaMYdVj4G1U5YkNksNF8MwiRX31ng&s',
      description:
        '어떤 제품이 새로 나왔는지, 어떤 물건을 사면 행복해지는지. 에디터들이 까탈스럽게 골라 메일로 배달해드립니다. 디에디트 채널에 업로드 되는 영상과 리뷰, 신제품 소식을 한 번에 감상하세요.',
      subscribeUrl: 'https://the-edit.co.kr/newsletter',
      category: '트렌드/라이프',
      subscriberCount: 372,
      arrivalDays: '매주 금요일',
    },
    {
      newsletterId: 2,
      name: '캐릿',
      imageUrl:
        'https://yt3.googleusercontent.com/7MOP4i_mWejSgr2wZ_jf1wm4mpgF6_VQwRzUo80TqRNN3ODx4CWo-t4X6Mvgan2Rm15Sd7Tk3Q=s900-c-k-c0x00ffffff-no-rj',
      description:
        'Z세대를 위한 트렌드 브리핑 뉴스레터. MZ세대가 주목하는 라이프스타일과 콘텐츠를 소개합니다.',
      subscribeUrl: 'https://www.careet.net/Subscribe',
      category: '트렌드/라이프',
      subscriberCount: 467,
      arrivalDays: '매주 화요일',
    },
    {
      newsletterId: 1,
      name: '뉴닉',
      imageUrl:
        'https://play-lh.googleusercontent.com/drCmRhBNsVZpcsHPOCXizlZW-_7hzo0v--3V85NAea5UZ2BvdXwW5wDEWBPa_pqD4A',
      description: '세상이 궁금해? 쉽고 재밌는 지식 플랫폼, 뉴닉!',
      subscribeUrl: 'https://newneek.co/subscribe?previous_type=gnb',
      category: '트렌드/라이프',
      subscriberCount: 611,
      arrivalDays: '화·수·금',
    },
    {
      newsletterId: 82,
      name: '문화편의점',
      imageUrl: 'https://cdn.maily.so/202301/1675082728678691.jpeg',
      description:
        '문화편의점은 신선하고 맛있는 문화·예술·콘텐츠 업계의 트렌드를 전달하는 뉴스레터예요. 요즘 틱톡, 인스타그램, 유튜브 할 것 없이 유행이 정말 빠르게 변화하는 만큼 가끔은 따라가기 벅차다고 느껴지는 순간이 있잖아요. 그럴 때 간편하게 꺼내 먹을 수 있는 콘텐츠로, 문화편의점 하나면 든든해지는 기분을 느낄 수 있어요.',
      subscribeUrl: 'https://maily.so/munhwa.cvs?pop=up',
      category: '문화/예술',
      subscriberCount: 127,
      arrivalDays: '격주 화요일',
    },
    {
      newsletterId: 32,
      name: '부딩',
      imageUrl:
        'https://scs-phinf.pstatic.net/MjAyMTA1MTRfMjEz/MDAxNjIwOTk1MzEyMTEz.ewIJjTsFY11bpHF207FLLEhrGWOBp1XIXrzCYevzm70g.ZUb9NxDOC4xAkOX7Crm2HKcKogdS1b0Jb3aUyL0Qx98g.JPEG/image%7Cpremium%7Cchannel%7Cbooding%7Chome%7C2021%7C05%7C14%7C1620995312021.jpg?type=nfs200_200',
      description: '부.알.못 밀레니얼을 위한 구독형 부동산 뉴스레터, 부딩',
      subscribeUrl: 'https://www.booding.co/',
      category: '경제/재테크',
      subscriberCount: 378,
      arrivalDays: '화·금',
    },
    {
      newsletterId: 8,
      name: '북플래터',
      imageUrl:
        'https://s3.ap-northeast-2.amazonaws.com/img.stibee.com/45248_list_112470_subscriptions_header_image.png?v=1648792178',
      description:
        '도서관이나 서점에서 어떤 책을 읽을지 몰라 헤맨 적이 있나요? 북플래터와 함께 여러분의 취향을 찾아봐요🤗 수많은 책들 사이에서 헤매지 않도록, 다양한 취향의 조각들을 엄선해서 만든 ‘북플래터’. 수많은 책들 중 나의 시선이 머무는 책으로 나만의 북플래터를 만들어보고 싶다면, 책을 통해 나를 더 잘 알고 싶다면, 북플래터와 함께 매주 세 권의 책을 만나보세요!',
      subscribeUrl: 'https://page.stibee.com/subscriptions/112470',
      category: '문화/예술',
      subscriberCount: 235,
      arrivalDays: '가끔 월요일',
    },
    {
      newsletterId: 51,
      name: '어피티',
      imageUrl:
        'https://yt3.googleusercontent.com/tTCQRfOWX4Xww8qo3zyEmRGkw2tMA8Vi-O1_C89rCcH39raADiTJiOzWCGD8ej8cbjZ8QZ6H8o4=s900-c-k-c0x00ffffff-no-rj',
      description:
        '매일 아침 나에게 찾아오는 경제뉴스, 한국 경제 뉴스레터 1위 어피티입니다.',
      subscribeUrl: 'https://uppity.co.kr/subscription/',
      category: '경제/재테크',
      subscriberCount: 775,
      arrivalDays: '평일',
    },
    {
      newsletterId: 124,
      name: 'SUNDAY ENG CLUB',
      imageUrl:
        'https://img2.stibee.com/d485c076-512c-4375-b036-f6d2154ea0fa.png',
      description: '가장 트렌드하게 영어 배울 수 있는 곳',
      subscribeUrl: 'https://sunday-engclub.stibee.com/subscribe',
      category: '취미/자기개발',
      subscriberCount: 70,
      arrivalDays: '격주 월요일',
    },
    {
      newsletterId: 49,
      name: '점선면',
      imageUrl:
        'https://img2.stibee.com/64852059-9dbb-4a98-9d23-34e81c47cf3b.png',
      description:
        '뉴스를 점(사실)/선(맥락)/면(관점)으로 분석해 입체적으로 전합니다. 메일함에서 하루 10분으로 주요 뉴스를 모두 알 수 있습니다.',
      subscribeUrl:
        'https://page.stibee.com/subscriptions/228606?groupIds=226840',
      category: '시사/사회',
      subscriberCount: 274,
      arrivalDays: '월·수·금',
    },
    {
      newsletterId: 6,
      name: '밑미레터',
      imageUrl:
        'https://s3.ap-northeast-2.amazonaws.com/img.stibee.com/2c07e8c6-3790-4998-8835-d6e8485b6567.png',
      description:
        "매주 월요일 아침 '진짜 나'를 찾아가는 사람들의 이야기와 마음을 위로하는 이야기가 당신의 메일함으로 도착합니다. 나의 사소한 고민도 밑미레터에 털어놔보세요.",
      subscribeUrl: 'https://meetmeletter.stibee.com/subscribe',
      category: '취미/자기개발',
      subscriberCount: 181,
      arrivalDays: '매주 월요일',
    },
    {
      newsletterId: 138,
      name: '헤이팝',
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5urhK5GysnaTQkiZLFxZnEQRxJfhBn-bYR0Buh8VzZmj9F1xWgSvirho&s=10',
      description:
        '공간, 팝업, 전시 소식부터 디자인 인사이트까지 꼭 알아두면 좋은 트렌드 소식을 엄선해 보내 드릴게요.',
      subscribeUrl: 'https://heypop.kr/newsletter/',
      category: '문화/예술',
      subscriberCount: 35,
      arrivalDays: '매주 목요일',
    },
    {
      newsletterId: 102,
      name: '너겟 뉴스레터',
      imageUrl:
        'https://cdn.imweb.me/upload/S20201111334ad0e18520a/ccec03a322aae.png',
      description:
        '세상의 돈이 움직이는 이야기 수만 가지 중 사회초년생에게 꼭 필요한 소식만 쉽고 재밌게 큐레이션했어요.',
      subscribeUrl:
        'https://page.stibee.com/subscriptions/132031?groupIds=485576',
      category: '경제/재테크',
      subscriberCount: 130,
      arrivalDays: '월·수·금',
    },
    {
      newsletterId: 31,
      name: '디그',
      imageUrl:
        'https://s3.ap-northeast-2.amazonaws.com/img.stibee.com/a82ab710-ca85-4f2e-bda8-3c7abcbad46a.png',
      description:
        '세상 돌아가는 경제 이야기, 하루 5분 <디그>로 편하게 읽어보세요.',
      subscribeUrl: 'https://page.stibee.com/subscriptions/159161',
      category: '경제/재테크',
      subscriberCount: 495,
      arrivalDays: '월·수·금',
    },
    {
      newsletterId: 107,
      name: '미스터동',
      imageUrl: 'https://img2.stibee.com/24372_3444971_1781642846080091100.png',
      description: '세상 모든 일을 누구나 알기 쉽게 만듭니다.',
      subscribeUrl: 'https://mrdongnews.com/onboarding',
      category: '시사/사회',
      subscriberCount: 84,
      arrivalDays: '월·수·금',
    },
    {
      newsletterId: 26,
      name: 'Trend A Word',
      imageUrl:
        'https://cdn.maily.so/maily3a9ea478edb9ab39e568f7a2ef8019141616945993',
      description: '오늘 꼭 알아야 하는 트렌드 한 단어!',
      subscribeUrl: 'https://maily.so/trendaword',
      category: '트렌드/라이프',
      subscriberCount: 216,
      arrivalDays: '평일',
    },
    {
      newsletterId: 50,
      name: '머니네버슬립',
      imageUrl:
        'https://img.stibee.com/a91f6d85-092d-41b0-ba28-a16bf0857990.jpg',
      description:
        '미국의 경제와 기업, 그리고 주식에 대해 이야기해요. 읽다 보면 어느새 지식이 수북하게 쌓여있을 거에요! 남들과는 다른 지식을 쌓고 싶다면, 머니네버슬립만한 게 없어요😎',
      subscribeUrl: 'https://money.stibee.com/subscribe',
      category: '경제/재테크',
      subscriberCount: 308,
      arrivalDays: '평일',
    },
    {
      newsletterId: 110,
      name: '우리는 시를 사랑해',
      imageUrl:
        'https://img.stibee.com/c2c175cc-8175-4dc6-8309-8900e3b628c0.jpg',
      description:
        '바쁜 나날 속 작은 기쁨과 위로가 되어줄 한 통의 편지 매주 수요일, 시가 담긴 편지를 보내드립니다. 필진들의 일상, 그리고 그 안에 스민 한 편의 시를 만나보세요.',
      subscribeUrl: 'https://page.stibee.com/subscriptions/115607',
      category: '문화/예술',
      subscriberCount: 46,
      arrivalDays: '매주 수요일',
    },
    {
      newsletterId: 59,
      name: '목요 뇌과학 뉴스',
      imageUrl:
        'https://img2.stibee.com/d2f6fedd-23b7-437f-abc3-ed0668e58c9e.png',
      description:
        '최신 뇌과학 뉴스와 연구 사례를 소개합니다. 매주 목요일 밤 10시, 새 소식을 받아보세요!',
      subscribeUrl: 'https://brainletter.stibee.com/subscribe',
      category: '과학/환경',
      subscriberCount: 211,
      arrivalDays: '매주 목요일',
    },
    {
      newsletterId: 84,
      name: '1집구석',
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn04WUEp-ZuZ5bpIURqRe8JoC2EwNtIy7gvg&s',
      description:
        '<1집구석>은 혼자 살아서 더 즐거운 1인 가구의 나다움으로 완성한 특별한 구석을 들여다봅니다. 취향이 담긴 공간 스토리, 혼자 살아가는 태도와 방식, 소장 가치 1000% 리세일 아이템까지 오직 1인 가구만을 위한 정보를 전해드려요.',
      subscribeUrl: 'https://page.stibee.com/subscriptions/278969',
      category: '리빙/인테리어',
      subscriberCount: 78,
      arrivalDays: '매주 화요일',
    },
    {
      newsletterId: 71,
      name: '트렌드라이트',
      imageUrl:
        'https://img2.stibee.com/08691aab-7601-415e-a310-149a7cb7834e.png',
      description:
        "국내 최대 커머스 버티컬 뉴스레터, 트렌드라이트🥤입니다. 트렌드라이트는 우리가 매일 마주하는 '사고 파는 모든 것'에 대한 이야기를 다룹니다. 소비와 선택 뒤에 숨어 있는 전략과 구조를 쉽고 재미있게 풀어 전해드려요.",
      subscribeUrl:
        'https://page.stibee.com/subscriptions/41037?groupIds=96898',
      category: '트렌드/라이프',
      subscriberCount: 114,
      arrivalDays: '매주 수요일',
    },
    {
      newsletterId: 47,
      name: 'Daily Byte',
      imageUrl:
        'https://pbs.twimg.com/profile_images/1767482947962347520/avMogr0B_400x400.jpg',
      description: '하루 10분, 경제를 읽는 가장 쉬운 방법',
      subscribeUrl: 'https://page.stibee.com/subscriptions/81111',
      category: '경제/재테크',
      subscriberCount: 801,
      arrivalDays: '월~토',
    },
    {
      newsletterId: 103,
      name: '순살브리핑',
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTKE0i0N4oyRvw8VPcSxw32IQGSNgJwG7RKQ&s',
      description:
        '월, 화, 수, 목, 금, 매일 아침 10시, 글로벌 금융·경제·크립토 소식을 살코기만 발라드립니다!',
      subscribeUrl: 'https://page.stibee.com/subscriptions/51845',
      category: '경제/재테크',
      subscriberCount: 158,
      arrivalDays: '평일',
    },
    {
      newsletterId: 28,
      name: '미라클레터',
      imageUrl:
        'https://img2.stibee.com/280db095-90a8-472c-830c-bdc6cfe44ba1.png',
      description:
        '"혁신하는 이들을 위한" 미라클레터입니다. 테크 트렌드, 글로벌 트렌드, 실리콘밸리 현장 소식을 인사이트 있게 담아서, 주3회 발송합니다.',
      subscribeUrl: 'https://page.stibee.com/subscriptions/33271',
      category: '트렌드/라이프',
      subscriberCount: 135,
      arrivalDays: '월·수·금',
    },
    {
      newsletterId: 29,
      name: 'H:730',
      imageUrl:
        'https://flexible.img.hani.co.kr/flexible/normal/600/420/imgdb/original/2022/1221/20221221503535.jpg',
      description:
        '쉴 새 없이 쏟아지는 뉴스 더미에서 독자님께 꼭 필요한 뉴스를 골라 배달합니다. 하루를 여는 에디터들의 편지와 함께 일목요연하게 브리핑합니다.',
      subscribeUrl: 'https://page.stibee.com/subscriptions/70653',
      category: '시사/사회',
      subscriberCount: 204,
      arrivalDays: '평일',
    },
    {
      newsletterId: 19,
      name: '수플레',
      imageUrl: 'https://img.stibee.com/28544_1641128616.png',
      description: '단 하나의 음악을 보내드립니다. 아주 짧은 편지와 함께요.',
      subscribeUrl: 'https://sooplaylist.stibee.com/subscribe',
      category: '문화/예술',
      subscriberCount: 103,
      arrivalDays: '매주 수요일',
    },
    {
      newsletterId: 5,
      name: '사이드',
      imageUrl: 'https://cdn.maily.so/202502/1739271556468282.png',
      description:
        '좋아하는 것도 너무 많고, 나만의 어떤 것을 시작해보고 싶고, 이것저것 해보고 싶은게 너무 많아서 고민인 사람을 위한 레터',
      subscribeUrl: 'https://maily.so/side?pop=up',
      category: '취미/자기개발',
      subscriberCount: 236,
      arrivalDays: '매주 수요일',
    },
    {
      newsletterId: 108,
      name: '연금술사',
      imageUrl:
        'https://img2.stibee.com/5d18ad2c-9c3b-4023-9d00-9bf33c61abbd.png',
      description:
        '경제적 자유를 꿈꾸는 오늘의 내가 내일의 나에게 보내는 선물!🎁 키움증권에서 발행하는 연금술사 레터를 찾아오신 여러분 반가워요!👋 MZ세대를 위한 쉽고 재미있는 연금레터 연금술사는 사회초년생 입장에서 필요한 연금 자산 운용 방법 및 투자 꿀팁 등을 다룹니다. 꼭 알아두면 좋을 연금 이슈 및 투자 뉴스도 만날 수 있어요. 매주 화, 목요일 오전에 메일함으로 찾아갑니다.',
      subscribeUrl: 'https://page.stibee.com/subscriptions/160190',
      category: '경제/재테크',
      subscriberCount: 39,
      arrivalDays: '화·목',
    },
    {
      newsletterId: 43,
      name: '빈둥레터',
      imageUrl:
        'https://img.stibee.com/cd14986b-4d30-4410-b76d-ad64678fe700.jpg',
      description:
        '여행은 사랑하지만 어딜 가야 할지 모르겠는 우리 빈둥이! 해외여행 계획할 땐, 빈둥레터를 열어봐💌',
      subscribeUrl: 'https://bindungletter.stibee.com/subscribe',
      category: '지역/여행',
      subscriberCount: 112,
      arrivalDays: '격주 금요일',
    },
    {
      newsletterId: 41,
      name: '긱뉴스',
      imageUrl:
        'https://i.scdn.co/image/ab67656300005f1f53c555152622805b90dd3bce',
      description:
        '매주 월요일 아침, 지난 일주일간의 GeekNews 중 엄선한 뉴스들을 이메일로 보내드립니다.',
      subscribeUrl: 'https://news.hada.io/weekly',
      category: 'IT/테크',
      subscriberCount: 433,
      arrivalDays: '매주 월요일',
    },
    {
      newsletterId: 80,
      name: '조쉬의 뉴스레터',
      imageUrl: 'https://cdn.maily.so/202410/1728892524889005.png',
      description: '퀄리티 있는 AI, 비즈니스, 프로덕트 이야기를 들려드려요.',
      subscribeUrl: 'https://maily.so/josh?pop=up',
      category: 'AI',
      subscriberCount: 130,
      arrivalDays: '월·수·금',
    },
    {
      newsletterId: 117,
      name: '썸원의 SUMMARY&EDIT',
      imageUrl:
        'https://s3.ap-northeast-2.amazonaws.com/img.stibee.com/21067_list_50103_subscriptions_header_image.jpg?v=1609380447',
      description:
        '일주일 간 읽고 보는 것들 중에서 괜찮은 것들을 골라 주말에 뉴스레터로 공유해드립니다 :)',
      subscribeUrl: 'https://page.stibee.com/subscriptions/50103',
      category: '트렌드/라이프',
      subscriberCount: 53,
      arrivalDays: '주말',
    },
    {
      newsletterId: 38,
      name: '노마드코더',
      imageUrl:
        'https://yt3.googleusercontent.com/ytc/AIdro_kZGbEvWmB_2CZMcZVcCpjFsiQNVQZEehF8jinP6zlFJ7s=s900-c-k-c0x00ffffff-no-rj',
      description:
        '최신 개발 Dev 뉴스. IT 이슈 등 개발자의 일과 성장에 도움이 되는 정보를 모아 보내드려요. AI 소식, 사이드프로젝트, UIUX, 서비스기획 등 개발 이외의 주제도 다루고 있어요. 노마드코더의 각종 이벤트, 강의 업데이트, 챌린지 소식도 함께 전해요. 매주 금요일, 당신의 메일함으로 찾아갑니다. 강의 추천, 이벤트 정보 등의 광고성 정보가 함께 전송될 수 있습니다.',
      subscribeUrl:
        'https://nomadcoders.us16.list-manage.com/subscribe?u=a99b43453db5050f1f26b2744&id=4313d957c9',
      category: 'IT/테크',
      subscriberCount: 125,
      arrivalDays: '매주 금요일',
    },
    {
      newsletterId: 37,
      name: '뭐지 뉴스레터',
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD16rGFYStgzsEVrk5gAvxhPyPninsEyW7gQ&s',
      description:
        '개발자라면 기획자라면 디자이너라면 취준생이라면 프리랜서라면 IT에 관심이 조금이라도 있다면 매주 수요일 출근 · 등교 시간에 여러분의 메일함으로 조심히 찾아갈게요.',
      subscribeUrl: 'https://moji.or.kr/',
      category: 'IT/테크',
      subscriberCount: 97,
      arrivalDays: '매주 수요일',
    },
    {
      newsletterId: 97,
      name: 'COFFEEPOT',
      imageUrl:
        'https://s3.ap-northeast-2.amazonaws.com/inno.bucket.live/corp/logo/CP00010474.png',
      description:
        '현업 전문가들이 글로벌 산업의 구조를 읽고, 비즈니스의 맥락과 새로운 관점을 전합니다. 커피팟은 다양한 산업의 주요 이슈를 분석해 매일 뉴스레터를 전해드리고 있습니다. 거시경제부터 테크와 AI, 리테일과 미디어, 그리고 에너지까지 글로벌 산업 이슈의 맥락을 쉽게 짚고, 재밌게 해설합니다.',
      subscribeUrl: 'https://page.stibee.com/subscriptions/52057',
      category: '비즈/산업',
      subscriberCount: 53,
      arrivalDays: '화·금',
    },
  ],
};
