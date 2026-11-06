# First-time setup

Runs once, or when the user asks to change their settings. Keep it short: nothing is touched here except the settings file. Use the user's language, and use current values as defaults when re-running.

## 1. Check what is connected

Call these in parallel and report in one line each:
- `whoami`: name and email.
- `search_gmail_messages` with `in:inbox`, `page_size: 1`: Gmail works.
- `drag_boards`: the boards, with `id`, `name`, `members`, `reply_as` and `columns`.

If Gmail fails, stop and pass on the fix from the error. If Drag fails, offer to continue with Gmail only, save `boards: []`, and explain that re-running setup adds boards later.

## 2. Pick the boards

**This is the one question that always gets asked. Never pick boards for the user.** Show a numbered list, because there can be more boards than a multiple-choice prompt can hold:

```
Which Drag boards should your inbox cover?

1. Support (7 members)
2. Web and Project (7 members)
3. My personal board (just you)

Answer with numbers ("1,3"), "all" or "none".
```

The boards not picked go in `declined_boards`, so they aren't offered again until setup is re-run.

## 3. Match the waiting column

For each chosen board, find the column cards go to after a reply: the column whose name contains both "wait" and "repl", ignoring case. Boards name it differently ("Waiting on reply", "Waiting for Reply"). Some have none.

Show the result and let the user correct it in one go:

```
After you reply, cards move to:
- Support → Waiting on reply
- Web and Project → Waiting for reply
- My personal board → no such column, the card stays where it is

OK, or anything to change?
```

If a column is a close match but not certain, ask. Save the exact column name, or `null`.

## 4. The remaining preferences

Ask these together in one prompt, with the recommended option first. If no question tool is available, list them in one message with the defaults, so the user can answer "defaults".

1. **Which cards on those boards?**
   - Mine, plus unread cards nobody owns (recommended): `mine_and_unassigned`
   - Only mine: `mine`
   - All open cards: `all`, which suits someone who runs the board
2. **Log time after replying?**
   - No: `enabled: false`
   - Yes: `enabled: true`. Then ask for the default minutes (15), the default budget name (Ad-Hoc) and the description language (Danish).
3. **Timezone?** Offer `Europe/Copenhagen` and `Asia/Bangkok`, and take any other IANA name as free text.
4. **Include by default?** (multi-select, may be none) Slack unreads, open Alpha One tasks. Both can always be asked for in a single run.

Then ask one open question: **"Any mail you always want archived without asking, or always kept?"** For example leave and approval emails, or a specific sender. Save the answers as plain sentences. Blank is fine.

## 5. Save

Write `~/.claude/alpha-skills/inbox.json`, creating the folder if needed:

```json
{
  "email": "you@example.com",
  "boards": [
    { "id": 123, "name": "Support", "reply_as": "support@example.com", "waiting_column": "Waiting on reply" },
    { "id": 456, "name": "My personal board", "reply_as": null, "waiting_column": null }
  ],
  "declined_boards": [{ "id": 789, "name": "Marketing" }],
  "card_scope": "mine_and_unassigned",
  "timezone": "Europe/Copenhagen",
  "time_logging": {
    "enabled": false,
    "default_minutes": 15,
    "default_budget": "Ad-Hoc",
    "description_language": "Danish"
  },
  "include_slack": false,
  "include_tasks": false,
  "always_archive": ["Leave and approval emails"],
  "always_keep": []
}
```

The file holds preferences only, never tokens. Tell the user where it is, and that "/inbox:inbox setup" or "change my inbox boards" changes it. Then go on with the inbox, unless they only asked to change settings.

**No file system** (for example claude.ai chat): skip the save, say that the choices last for this conversation only, and use them from memory.
