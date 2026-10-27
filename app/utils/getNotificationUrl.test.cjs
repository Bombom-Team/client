const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');

const sourcePath = path.join(
  path.dirname(process.argv[1]),
  'getNotificationUrl.ts',
);
const source = fs.readFileSync(sourcePath, 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
});

const outputPath = path.join(os.tmpdir(), 'bombom-getNotificationUrl.cjs');
fs.writeFileSync(outputPath, outputText);
const { getNotificationUrl } = require(outputPath);

assert.equal(getNotificationUrl(null), null);
assert.equal(getNotificationUrl(undefined), null);
assert.equal(getNotificationUrl({}), null);
assert.equal(getNotificationUrl({ notificationType: 'EVENT' }), '/event');
assert.equal(
  getNotificationUrl({ notificationType: 'ARTICLE', articleId: '42' }),
  '/articles/42',
);
assert.equal(
  getNotificationUrl({
    notificationType: 'INQUIRY_MESSAGE_ARRIVAL',
    roomId: '7',
  }),
  '/support/inquiry/7',
);
assert.equal(
  getNotificationUrl({
    notificationType: 'INQUIRY_MESSAGE_ARRIVAL',
    roomId: 'not-a-number',
  }),
  null,
);
assert.equal(getNotificationUrl({ notificationType: 'UNKNOWN' }), null);
