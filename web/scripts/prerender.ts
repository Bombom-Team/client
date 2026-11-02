import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import { fetchDetailPageNewsletters, warn } from './newsletters';
import { PRERENDERED_ATTRIBUTE } from '../src/constants/prerender';
import { createNewsletterHead } from '../src/pages/newsletter-detail/utils/seo';
import {
  getNewsletterDetailPath,
  getNewsletterDetailUrl,
} from '../src/utils/url';
import type { BuildNewsletter } from './newsletters';
import type {
  NewsletterHead,
  NewsletterHeadMeta,
} from '../src/pages/newsletter-detail/utils/seo';

const PLUGIN_NAME = 'NewsletterPrerenderPlugin';
const WARNING_TITLE = 'prerender';

interface PrerenderedPage {
  fileName: string;
  html: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const renderMeta = (meta: NewsletterHeadMeta) => {
  if ('title' in meta) {
    return `<title ${PRERENDERED_ATTRIBUTE}>${escapeHtml(meta.title)}</title>`;
  }

  const [key, value] =
    'name' in meta ? ['name', meta.name] : ['property', meta.property];
  return `<meta ${PRERENDERED_ATTRIBUTE} ${key}="${escapeHtml(value)}" content="${escapeHtml(meta.content)}">`;
};

const renderHead = ({ meta, links, scripts }: NewsletterHead) =>
  [
    ...meta.map(renderMeta),
    ...links.map(
      ({ rel, href }) =>
        `<link ${PRERENDERED_ATTRIBUTE} rel="${escapeHtml(rel)}" href="${escapeHtml(href)}">`,
    ),
    // JSON 안의 `</script>`가 script 태그를 닫지 않도록 `<`를 escape합니다.
    ...scripts.map(
      ({ type, children }) =>
        `<script ${PRERENDERED_ATTRIBUTE} type="${escapeHtml(type)}">${children.replace(/</g, '\\u003c')}</script>`,
    ),
  ].join('');

const createNewsletterPage = (
  template: string,
  newsletter: BuildNewsletter,
): PrerenderedPage => {
  const { newsletterId, name } = newsletter;
  const url = getNewsletterDetailUrl(newsletterId, name);
  const head = renderHead(createNewsletterHead(newsletter, url));

  return {
    fileName: `${getNewsletterDetailPath(newsletterId, name).slice(1)}/index.html`,
    html: template.replace('</head>', `${head}</head>`),
  };
};

/**
 * 뉴스레터마다 SPA index.html의 head에 상세 메타 태그를 넣은 HTML을 만듭니다.
 * 조회에 실패해도 빌드를 막지 않고 HTML 없이 진행합니다. 이 경우 지금처럼 SPA index.html이 응답됩니다.
 */
const createNewsletterPages = async (
  template: string,
  apiBaseUrl: string | undefined,
): Promise<PrerenderedPage[]> => {
  if (!apiBaseUrl) {
    warn(
      WARNING_TITLE,
      'API_BASE_URL이 없어 뉴스레터 상세 HTML을 생성하지 않습니다.',
    );
    return [];
  }

  if (!template.includes('</head>')) {
    warn(
      WARNING_TITLE,
      'index.html에 </head>가 없어 뉴스레터 상세 HTML을 생성하지 않습니다.',
    );
    return [];
  }

  try {
    const newsletters = await fetchDetailPageNewsletters(apiBaseUrl);

    if (newsletters.length === 0) {
      warn(
        WARNING_TITLE,
        '조회된 뉴스레터가 없어 뉴스레터 상세 HTML을 생성하지 않습니다.',
      );
    }

    return newsletters.map((newsletter) =>
      createNewsletterPage(template, newsletter),
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    warn(
      WARNING_TITLE,
      `뉴스레터 목록 조회에 실패해 뉴스레터 상세 HTML을 생성하지 않습니다: ${reason}`,
    );
    return [];
  }
};

/**
 * HtmlWebpackPlugin이 만든 최종 index.html을 템플릿으로 뉴스레터 상세 HTML을 추가로 출력합니다.
 * 출력 경로: newsletters/{id}/{slug}/index.html
 */
export const createNewsletterPrerenderPlugin = (
  apiBaseUrl: string | undefined,
): webpack.WebpackPluginInstance => ({
  apply: (compiler) => {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      HtmlWebpackPlugin.getCompilationHooks(compilation).beforeEmit.tapPromise(
        PLUGIN_NAME,
        async (data) => {
          if (data.outputName !== 'index.html') return data;

          const pages = await createNewsletterPages(data.html, apiBaseUrl);
          pages.forEach(({ fileName, html }) => {
            compilation.emitAsset(
              fileName,
              new webpack.sources.RawSource(html),
            );
          });

          return data;
        },
      );
    });
  },
});
