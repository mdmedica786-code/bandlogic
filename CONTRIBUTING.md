# Contributing to BandLogic

Thanks for your interest in BandLogic! Whether you're fixing a typo, adding IELTS practice content, or improving the scoring pipeline, contributions of every size are welcome.

## Ways to contribute

- **Report bugs**: open an issue with steps to reproduce, expected vs. actual behaviour, and screenshots if relevant.
- **Suggest features**: open an issue describing the problem it solves for IELTS learners.
- **Pick up an issue**: look for the `good first issue` and `help wanted` labels.
- **Improve docs**: README, setup guides, translations.
- **Add content**: practice prompts, reading/listening passages (only content you have the right to share).

## Development setup

```bash
git clone https://github.com/mdmedica786-code/professor-ielts.git
cd professor-ielts
cp .env.example .env   # add your OPENAI_API_KEY

cd server && npm install && node index.js     # backend on :3001
cd ../client && npm install && npm run dev    # frontend on :5173
```

Or run everything with Docker: `docker-compose up --build`.

**Never commit your `.env` file or any API keys.**

## Pull request process

1. Fork the repo and create a branch: `git checkout -b fix/short-description`.
2. Keep changes focused: one fix or feature per PR.
3. Test your change locally (frontend + backend running).
4. Write a clear PR description: what changed, why, and how you tested it.
5. Link the related issue (e.g. `Closes #12`).

## Code style

- JavaScript/React: follow the existing style; use clear names and small components.
- Python (pronunciation service): PEP 8.
- Commit messages: short imperative summary, e.g. `Fix band rounding in writing scorer`.

## Code of conduct

Be respectful and constructive. Harassment or discrimination of any kind isn't tolerated.

## Questions?

Open an issue with the `question` label.
