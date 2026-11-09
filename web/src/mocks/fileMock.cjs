// jest는 webpack의 asset module을 거치지 않아 이미지·폰트 import를 파싱하려다 실패한다.
// jest.config.cjs의 moduleNameMapper가 이 스텁으로 대체한다.
module.exports = 'test-file-stub';
