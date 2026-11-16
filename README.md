# terminalDeck

A dev dashboard for Android that behaves like a terminal. It's the React Native version of my old PWA, DashDeck, with more stuff added. The look is inspired by Watch Dogs ctOS: dark canvas, cyan and magenta, HUD corners, boot screens.

Everything is stored on the phone. No account, no server of mine.

## The terminal - feature that connects to all other features

There's a command line built into the app. Type instead of tapping through menus:

```
task fix auth bug        add a task
note shipped the login   add to today's standup
snip title |&| code      save a snippet
pomo start|pause|reset   control the timer
go tasks|feed|tools|me   jump to a screen (or a tool by id, like go dns)
start brave|termux|...   open an installed app
help
```

## What's in it

**Tasks**: types, tags, notes, search. Reminders can repeat daily, on weekdays or weekly. The notification has +10 MIN / +1 HOUR / TOMORROW buttons so you can snooze without opening the app.

**Tools (19)**
- Network: IP and port check, ping, SSL expiry, DNS lookup
- Security: hash generator, password/token, UUID, AES-256 encrypt/decrypt
- Converters: Base64, URL, timestamp, color
- Developer: JSON formatter, regex tester, diff checker
- Reference: HTTP status codes, git / JS / Python cheatsheets (tap to copy)

**Snippet vault** and a daily standup note (yesterday / today / blocked).

**Dev feed**: top stories from Hacker News, dev.to and Lobsters, status pages (GitHub, npm, Vercel, Netlify, Render, Docker, Cloudflare, AWS), latest package versions and releases.

**GitHub stats** for your username.

**Weather** with hourly and daily forecast, air quality and animations (Open-Meteo, no API key).

**Pomodoro**: 25 / 5 / 15, long break after four sessions.

**Launcher** for the apps I use (Brave, Firefox, Termux, Tor Browser, Fing and so on) plus quick links and search shortcuts.

**Boot screens**: Linux, CTOS or QCK. Pick one in your profile.

**Backup**: export everything to a JSON file or the clipboard, restore it later.

## Stack

Expo (SDK 57), React Native, Expo Router, Zustand.

## Run it

```
npm install
npx expo run:android
```

Notifications and a few other things don't work in Expo Go, so use a dev build.

Release APK:

```
npx expo prebuild --clean --platform android
cd android
./gradlew assembleRelease
```

On Windows keep the project in a short path like `E:\td`. The native build fails on long folder names (260 character limit).

## Notes

- Reminders need "Alarms & reminders" switched on for the app in Android settings, otherwise they can show up late.
- On Xiaomi, Realme, Oppo and Vivo you also have to allow autostart and set battery to unrestricted, or the phone kills the alarms.
- Android only for now.
