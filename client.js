window.__ModuleLoader__.load({
  id: 'dsh-compact-header',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'compact-header';
    const STYLE_ID = 'dsh-compact-header-style';

    // CSS-module class prefix of the shipped conversation header. It changes
    // between DSH builds (mAYO5W_ -> an3WzG_ on 0.2.2-rc.2).
    // After a DSH upgrade, re-read the prefix from the packaged client bundle
    // and update this single line.
    const PREFIX = 'an3WzG_';

    // Below this width (CSS px) the View tabs keep their own row.
    const INLINE_MIN_WIDTH = 900;

    // The shipped activity/usage pills under the composer repeat numbers the
    // cost meter already reports; hide them. Set false to bring them back.
    const HIDE_DOCK_STATS = true;

    const ZH = {
      'clock.title': '本地时间',
      'stats.turns': '{n} 轮',
      'stats.steps': '{n} 步',
      'stats.tip': '会话统计 · 模型 {m} + 工具 {tool}',
    };

    const EN = {
      'clock.title': 'Local time',
      'stats.turns': '{n} turns',
      'stats.steps': '{n} steps',
      'stats.tip': 'Session stats · model {m} + tool {tool}',
    };

    const pad2 = (n) => String(n).padStart(2, '0');

    function formatMs(ms) {
      const total = Math.max(0, Math.round(ms / 1000));
      if (total < 60) return `${total}s`;
      const minutes = Math.floor(total / 60);
      const seconds = total % 60;
      if (minutes < 60) return seconds === 0 ? `${minutes}m` : `${minutes}m${pad2(seconds)}s`;
      const hours = Math.floor(minutes / 60);
      return `${hours}h${pad2(minutes % 60)}m`;
    }

    function css() {
      return `
/* Wide layout: one header row — title cluster | View tabs | utilities | corner.
   The shipped title row becomes display:contents so its children join the
   header grid directly. */
@media (min-width: ${INLINE_MIN_WIDTH}px) {
  .${PREFIX}header {
    min-height: 0 !important;
    padding: 4px 24px 0 20px !important;
    display: grid !important;
    grid-template-columns: auto minmax(0, 1fr) auto auto auto !important;
    grid-template-rows: auto !important;
    align-items: center !important;
  }
  .${PREFIX}titleRow { display: contents !important; }
  .${PREFIX}headerLeading { grid-column: 1; grid-row: 1; }
  .${PREFIX}titleCluster { grid-column: 2; grid-row: 1; }
  .${PREFIX}tabs {
    grid-column: 3; grid-row: 1;
    width: auto !important;
    min-height: 0 !important;
    margin-top: 0 !important;
    padding-left: 16px !important;
    align-self: stretch;
    align-items: stretch;
  }
  .${PREFIX}viewTabs {
    flex-wrap: nowrap !important;
    min-height: 0 !important;
    gap: 24px !important;
    align-items: stretch;
  }
  .${PREFIX}tab {
    min-height: 30px !important;
    margin: 0 !important;
    padding: 0 var(--dsh-tab-hit-inline) !important;
    display: inline-flex !important;
    align-items: center;
  }
  .${PREFIX}viewsMore { margin-top: 0 !important; }
  .${PREFIX}headerUtilities { grid-column: 4; grid-row: 1; margin-left: 12px !important; }
  .${PREFIX}headerCorner { grid-column: 5; grid-row: 1; }
}

/* Narrow layout: keep the shipped two-row grid, only tighten it a little. */
@media (max-width: ${INLINE_MIN_WIDTH - 1}px) {
  .${PREFIX}header { min-height: 0 !important; padding-top: 4px !important; }
  .${PREFIX}titleRow { min-height: 26px !important; }
  .${PREFIX}tabs { margin-top: 6px !important; }
  .${PREFIX}viewTabs { gap: 24px !important; }
  .${PREFIX}tab { min-height: 30px !important; padding-top: 6px !important; padding-bottom: 6px !important; }
}

/* Header clock + session stats. */
.dsh-ch-info {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-label-tertiary);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.dsh-ch-info__clock { color: var(--dsw-alias-label-secondary); }
.dsh-ch-info__sep { opacity: 0.55; }
${HIDE_DOCK_STATS ? `
/* Hide the duplicate stats pills under the composer; the cost meter keeps them. */
[data-composer-dock] [data-composer-stat="activity"],
[data-composer-dock] [data-composer-stat="usage"] { display: none !important; }
` : ''}
`;
    }

    function installStyles() {
      let el = document.getElementById(STYLE_ID);
      if (!el) {
        el = document.createElement('style');
        el.id = STYLE_ID;
        document.head.appendChild(el);
      }
      el.textContent = css();
    }

    function removeStyles() {
      const el = document.getElementById(STYLE_ID);
      if (el) el.remove();
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh: ZH, en: EN }), 'compact-header: dictionaries');
        installStyles();
        ctx.effect(() => () => removeStyles(), 'compact-header: styles');

        function useTranslate() {
          const [, force] = React.useState(0);
          React.useEffect(() => ctx.locale.subscribe(() => force((n) => n + 1)), []);
          return ctx.locale.bind(NS);
        }

        function HeaderInfo(props) {
          const t = useTranslate();
          const stats = props.useProjection('sessionStats');
          const [now, setNow] = React.useState(() => new Date());

          React.useEffect(() => {
            const timer = setInterval(() => setNow(new Date()), 20000);
            return () => clearInterval(timer);
          }, []);

          const clock = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;

          let summary = null;
          let tip = null;
          if (stats !== undefined && stats !== null) {
            const parts = [];
            if (Number(stats.turns) > 0) parts.push(t('stats.turns', { n: stats.turns }));
            if (Number(stats.steps) > 0) parts.push(t('stats.steps', { n: stats.steps }));
            const llm = Number(stats.llmMs) || 0;
            const tool = Number(stats.toolMs) || 0;
            if (llm + tool > 0) parts.push(formatMs(llm + tool));
            if (parts.length > 0) {
              summary = parts.join(' · ');
              tip = t('stats.tip', { m: formatMs(llm), tool: formatMs(tool) });
            }
          }

          return h(
            'div',
            { className: 'dsh-ch-info' },
            h('span', { className: 'dsh-ch-info__clock', title: `${t('clock.title')} · ${now.toLocaleString()}` }, clock),
            summary === null ? null : h('span', { className: 'dsh-ch-info__sep', 'aria-hidden': 'true' }, '·'),
            summary === null ? null : h('span', { className: 'dsh-ch-info__stats', title: tip }, summary),
          );
        }

        ctx.slots.inject('conversation.session.header.utilities', () =>
          ctx.slots.register(
            {
              name: 'conversation.session.header.utilities',
              id: 'compact-header-info',
              order: 40,
            },
            HeaderInfo,
          ),
        );
      },
    };
  },
});

