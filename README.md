# dsh-compact-header

Header polish for the DeepSeek Harness Web UI: a compact conversation header, View tabs inlined into the title row on wide windows, a local clock with session statistics in the top-right corner, and the duplicate composer statistics pills hidden.

## Requirements

- DeepSeek Harness with the Web UI. The package declares both `dsh.bundle` and `dsh.client`, and its `engines.dsh` is `>=0.2.0-rc.1 || >=0.2.1-rc.1 || >=0.2.2-rc.1`.
- No other plugin is required.

## Install

```sh
dsh plugin --profile web add dsh-compact-header
```

Installed from the repository instead:

```sh
dsh plugin add yunxiao11xie/dsh-compact-header
```

## What it does

- **Header** — removes the shipped minimum height and tightens the vertical padding.
- **View tabs** — on windows at least 900 CSS px wide the Chat / Trajectory / … tab row moves up into the title row; below that width it keeps its own row.
- **Top-right corner** — a local `HH:MM` clock and the session totals (turns, steps, model plus tool time) from the host's `sessionStats` projection. Hover a figure for the model/tool breakdown.
- **Composer** — hides the two shipped statistics pills under the input, because the cost meter entry reports the same numbers. Set `HIDE_DOCK_STATS = false` in `client.js` to bring them back.

## Notes

- The style overrides target the shipped conversation header's CSS-module class prefix. It is read from `PREFIX` in `client.js`; a Harness upgrade can rename it, and the visible symptom is that the header looks unchanged. Fixing it is one line.

## License

MIT
