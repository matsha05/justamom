# Lizi: managing your site with Codex

You can describe a change in ordinary language, look at it, refine it, and decide when to publish. Codex can handle the files and checks. Matt can keep contributing from his own laptop.

## How the project and instructions reach your Mac

For this website, your Codex project points to a folder on your Mac containing the website's files. GitHub holds the shared copy of those files. Each laptop has its own working copy; changes travel between them when Codex uploads and downloads updates through GitHub. This is not instant, simultaneous editing.

| Where | What it does |
| --- | --- |
| GitHub: `matsha05/justamom` | Holds the shared website files, instructions, and saved history. |
| Your Mac: `~/Projects/justamom` | Holds your working copy. `~` means your Mac user folder. |
| Your local project in Codex | Gives Codex access to that folder so it can help you edit and preview the site. |

The instructions are ordinary files in that same folder:

- `AGENTS.md` is for Codex. Codex automatically reads it when starting work in the project. It covers preserving your writing, working with Matt's changes, previewing, and getting your approval to publish.
- `docs/lizi-start-here.md` is this guide for you. `AGENTS.md` also tells Codex to read it for setup and author requests.
- `README.md` contains the technical setup and check commands Codex can use.

You do not need to paste these files into each conversation. Once the updated files are uploaded to GitHub and downloaded onto your Mac, they are available to your Codex. Your project needs to use the `justamom` folder as its primary folder. Matt's chat history is separate and is not transferred with the website.

The shared copy is [matsha05/justamom on GitHub](https://github.com/matsha05/justamom). Downloading that repository includes these instructions. After a later instruction update, ask Codex to bring your local copy up to date before starting a new task.

## The everyday routine

1. Open this project in Codex and ask it to start from the latest shared version.
2. Describe one change. Attach the exact photo or paste the words you want to use.
3. Look at the local preview on desktop and phone sizes. Ask for adjustments until it feels right.
4. When you are ready, explicitly ask Codex to publish that change and verify the live page.

Useful words:

| Word | What it means here |
| --- | --- |
| Project | This website's files and instructions. |
| GitHub | The shared copy and saved history that both laptops use. |
| Branch | A separate line of changes, so your work and Matt's can be combined deliberately. |
| Local preview | A working version on your laptop. It has not changed the live website. |
| Commit | A saved checkpoint. Saving one locally does not upload it. |
| Push | Upload saved changes to GitHub. This can also create a hosted preview. |
| Publish | Update the live website through its existing hosting connection, then check the result. |

## One-time setup on your Mac

Do the first setup together, with you using the keyboard.

1. Your GitHub account is [`lizicshaw`](https://github.com/lizicshaw). Matt can invite that account to [the existing repository](https://github.com/matsha05/justamom), then accept the invitation. There is no need to make a second repository. You can download and preview this public project while access is being arranged.
2. Install the [official desktop app](https://learn.chatgpt.com/docs/app) for your Mac and sign in with your existing ChatGPT account. OpenAI's current download documentation calls the desktop app ChatGPT; choose Codex for this project. Check the download's Mac compatibility and your account's available access during setup.
3. Follow [Download the website and open it in Codex](#download-the-website-and-open-it-in-codex) below. Then have Codex authenticate GitHub publishing as **you**, using your own browser sign-in, and set the Git author name/email for this repository to your chosen identity (your GitHub private email is an option). Verify the signed-in account before the first push; cloning this public repository alone does not prove write access.
4. Have Codex check Git and Node/npm, install missing prerequisites from their official sources, and run `npm ci`. Before its first browser check, have it run `npx playwright install chromium`. The project's Run action does not install dependencies automatically. Codex should choose a supported Node version compatible with the existing project and report the version used; routine setup should not upgrade the site's packages or rewrite its lockfile.
5. Have Codex create `.env.local` from `.env.local.example` **only if no local configuration already exists**. This example disables newsletter and contact delivery. Do not copy Matt's credentials to get a visual preview working.
6. Ask Codex to start the preview with `npm run dev` and show [localhost:3001](http://localhost:3001). The page should load. Contact/newsletter forms intentionally cannot deliver with the example configuration; a delivery error in this preview is expected. Codex can check their behavior with the browser tests documented in the README.
7. Before your first publication, verify that your GitHub account can complete the existing Vercel deployment workflow. Use the existing site/project/domain; do not create another production site. Hosting permissions and plan settings need a one-time check. Later direct hosting administration may require your own Vercel access.

The project instructions and this guide travel with the repository. Matt's conversations, account connections, personal settings, and laptop-only tools are not prerequisites and should not be assumed available to your Codex. For new preferences, ask Codex to update the shared project instructions when you want both laptops to follow them.

## Download the website and open it in Codex

This is a one-time download of the existing website. **You do not need to create a folder named `justamom` first.** The commands create the folders for you.

1. Open **Terminal** on your Mac (use Spotlight to find it). Paste these two lines, then press Return:

   ```sh
   mkdir -p ~/Projects
   git clone https://github.com/matsha05/justamom.git ~/Projects/justamom
   ```

   The first line creates a `Projects` folder if needed. The second line creates `justamom` inside it and downloads the website and instructions. If macOS prompts you to install command line tools for Git, finish that installation and run the lines again. If the destination already exists, have Codex inspect it before retrying; do not delete or replace it. A successful clone includes an `AGENTS.md` file and the `docs` folder.
2. In the desktop app, add a **local project** and select that downloaded `justamom` folder. You can call the project **Lizi's website**; its display name does not rename the website. If the project was created without a folder, its menu has **Edit project → Add folder**. Select `justamom` and make it the primary folder if there is more than one.
   In the Mac folder picker, press **Command–Shift–G**, enter `~/Projects/justamom`, and press Return to find it directly. Select that folder.
3. Start a new **Codex** chat inside that project. Paste the first message below. Codex can now read the website instructions, finish setup, and open a local preview.

Opening the repository's GitHub webpage shows the shared files in a browser. Selecting the downloaded folder in Codex is what lets Codex work on them. After this setup, open the same project from the app's sidebar whenever you want to make a change.

## Your first message after opening the project

> I'm Lizi, and I'm learning to manage my website. Read AGENTS.md, README.md, and docs/lizi-start-here.md. Explain things in ordinary language and handle routine technical steps for me. Inspect this checkout, preserve any existing work, and help me start from the latest shared version. Set up a local preview with message delivery disabled. Don't publish or upload anything yet. Tell me the next small step I need to take.

Setup is ready for everyday editing when Codex confirms the instructions loaded, the website opens locally, and the preview uses disabled delivery. It should separately tell you whether GitHub publishing and the existing hosting connection have been verified. If access is still pending, you can continue editing and previewing locally.

## Requests you can reuse

### Change a sentence

> On the About page, replace this sentence: “[old sentence]” with “[new sentence].” Keep the rest of the page as it is. Show me the local result on desktop and phone sizes before publishing.

### Replace a photo

> Replace the main photo on the About page with the photo I've attached. Show me the crop on desktop and mobile. Keep the other photos. Don't publish yet.

### Add a note

> Add this as a new Note using the site's existing note workflow. The title is “[title]” and the date is “[date].” Keep my wording exactly as provided, including the greeting, but leave out the newsletter P.S. If an excerpt is missing, suggest one for me to approve. Show me a local preview and keep the writing on my laptop until I approve uploading it. Here is the text: …

### Ask for ideas without changing anything

> This section feels too formal. Suggest two small ways to make it feel more like me. Don't change the site yet.

### Publish a change you have reviewed

> Publish the change I just approved to lizishaw.com. Include only this change, preserve anything Matt has added, and run the relevant checks. Use the existing repository and hosting project. Verify the actual live page and tell me when it is live. Publishing this does not authorize sending a newsletter.

### Undo a change

> Undo only the change we just made to [specific part of the page]. Preserve everything else, including Matt's work. Show me the restored local preview. If the change is already live, prepare the reversal for my review before publishing it.

## Working together without overwriting each other

Both of you use the same GitHub project, with a separate local copy and a separate task branch for each change. Start by checking for newer shared changes. Codex can handle this; you do not need to memorize Git commands.

For the first few sessions, publish one change at a time. Before publishing, Codex checks whether the shared version has moved forward and combines changes in an isolated checkout. If both of you changed the same words or photo, it should show the overlap and ask which result you want. It should not discard work, force-push, or assume Matt's version wins.

A pull request is a useful way to review a proposed change on GitHub. It does not inherently require Matt to approve everything: access and repository rules determine who can publish. The intended outcome is that you can make and approve your own normal updates. Any new required checks or review rules should be agreed on and configured separately.

## Writing, privacy, and newsletters

The repository was public when checked on September 4, 2026. A branch pushed to that repository exposes its files even if the change has not reached lizishaw.com. Keep unpublished or personal writing local until you intend to share it. Repository visibility can be reviewed separately before using GitHub to share private drafts.

This site does not currently have scheduled publishing or a draft flag. A future date does not keep a note off the website after deployment. Tell Codex to keep a draft local until you approve publication.

Adding a note to the website does not send it to newsletter subscribers. Sending through MailerLite is a separate action that needs your explicit instruction.

## First lesson together

Allow about half an hour after setup. Choose one small change you actually want, such as replacing a sentence or photo.

- You describe the change to Codex while Matt watches.
- You inspect the preview and ask for one adjustment.
- You ask what has changed and whether it is live.
- You try undoing the local change, then restore the version you want.
- Once you are happy and publishing access has been checked, you approve publication and check the live page yourself.

The next session should be the same routine with you driving independently. Matt can help if you get stuck, while the project instructions give Codex the recurring details.

## References for Codex

- [Desktop setup and sign-in](https://learn.chatgpt.com/docs/app)
- [Local projects and choosing the primary folder](https://learn.chatgpt.com/docs/projects)
- [How Codex reads shared project instructions](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Separate task worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees)
- [Vercel's Git deployment and access behavior](https://vercel.com/docs/git)
- Project implementation details: `README.md`; note formatting and publishing checks: `.agent/workflows/add-note.md`.
