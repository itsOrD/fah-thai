# User to-do: Google TTS key (one paste, ~3 minutes)

The audio pipeline needs a Google Cloud TTS API key once. Everything stays
inside the recurring free tier (1M Neural2 chars/month; the entire T0 pilot
is ~819 chars × voices).

## If you have `gcloud` installed — one paste

```bash
gcloud projects create fah-thai-tts --name="fah-thai-tts" 2>/dev/null; \
gcloud config set project fah-thai-tts && \
gcloud services enable texttospeech.googleapis.com && \
gcloud alpha services api-keys create --display-name="fah-tts" \
  --api-target=service=texttospeech.googleapis.com \
  --format="value(response.keyString)"
```

Copy the printed key into `.env` at the repo root (gitignored):

```
GOOGLE_TTS_API_KEY=<the key>
```

## No gcloud — four clicks

1. https://console.cloud.google.com/ → new project (any name).
2. Search "Text-to-Speech API" → Enable. (New accounts may need billing
   enabled — the free tier still applies; this batch costs $0.)
3. APIs & Services → Credentials → Create credentials → **API key**.
4. Paste it into `.env` as above.

Then tell the build session "key's in" — it runs the pilot
(`pnpm tts -- --pilot`), you ear-check ~5 minutes of minimal pairs in the
Lab, and the full batch follows.
