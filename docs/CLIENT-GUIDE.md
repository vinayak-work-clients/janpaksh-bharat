# Janpaksh Bharat — Editor's Guide

This guide explains how to run the website from the dashboard. No technical
knowledge is needed. Keep it open the first few times you publish.

The dashboard lives at **yourdomain.com/admin** (replace with the real
address once the site is live).

---

## 1. Logging in

1. Open `/admin` in your browser. You will see the sign-in page.
2. Enter the admin email and password.
3. Tap **Sign in**. You land on the **Overview** page.

Only the admin account can log in. If someone else signs in with another
account, they are sent straight back out.

**Forgot the password?** On the sign-in page, type your email first, then tap
**Forgot password?**. A reset link is emailed to you. Open it and choose a
new password on the **Account** page.

**Changing the password later:** open **Account** in the left menu and use
the *Change password* box.

Five wrong attempts in ten minutes lock the sign-in form for a few minutes.
That is normal; wait and try again.

---

## 2. The 30-day rule (read this first)

Every story lives on the website for **30 days from the moment it is first
saved** — not from when it is published. After 30 days it disappears from the
site automatically and is deleted for good, along with its pictures, video or
audio, in a nightly clean-up at 3:00 am.

What this means for you:

- The countdown starts when you first save a draft. If you save a draft and
  publish it a week later, readers get it for 23 days, not 30.
- The dashboard shows the exact deletion date on every post ("Auto-deletes
  on …") and warns you in orange, then red, as the date gets close.
- If you want a story to stay longer, **duplicate** it (Posts → ⋯ → Duplicate)
  and publish the copy. The copy gets a fresh 30 days.
- Nothing is recoverable after deletion. Keep your own copies of anything
  important.

---

## 3. Posting a story

Tap **New post** (top right) and choose a type. Every type has the same
basic fields: **title**, **slug** (the web address, made automatically from
the title), **excerpt** (the short summary shown on cards), **section**,
**category**, a **cover image**, and **Publish** or **Save draft** at the
bottom.

| Type | Use it for | What is special |
| --- | --- | --- |
| **Photo news** | A story led by a picture | The cover image is the story's hero picture. Body text is optional but recommended. |
| **Blog** | Long-form writing | Needs some body text before it can be published. |
| **Video** | A film | Upload an MP4 (up to 50 MB) **or** paste a YouTube, Instagram or Facebook link in the *Embed link* tab. You can grab a frame from an uploaded video as the cover. |
| **Podcast** | An episode | Upload audio (MP3/M4A, up to 50 MB) **or** paste a Spotify or YouTube link. Show notes go in the body. |
| **Breaking** | An urgent update | Goes into the red ticker at the top of every page immediately. Keep the title short. |

Tips:

- **Cover image:** landscape pictures work best. Add **alt text** (a one-line
  description) so screen readers and Google understand the picture.
- **Body text:** use the **+** button between paragraphs to add a heading,
  a quote, a list or a picture.
- **Hindi title:** optional. When present it is shown under the English
  headline.
- **Featured:** ticks the story as eligible for the big lead slot on the front
  page.
- **Save draft** keeps it private. **Publish** makes it live within a minute.
- **Preview** (bottom bar) shows the story exactly as readers will see it.
- If you close the page with unsaved changes the dashboard warns you, and it
  keeps a local backup you can restore next time.

**Editing:** open **Posts**, tap the story, change what you need and tap
**Update**.

**Deleting:** Posts → ⋯ → Delete. This removes the story and its files at
once.

---

## 4. Breaking news

- Any story can be marked **Breaking** with the red switch in the editor, or
  from Posts → ⋯ → *Mark as Breaking*.
- Breaking stories run in the red ticker at the top of every page, lead the
  hero on the front page, appear in the *Breaking* band and on the
  `/breaking` page.
- When the story is no longer urgent, switch Breaking off again. It stays
  published as a normal story.
- The ticker itself can be switched off entirely under **Settings → Site**.

---

## 5. Sections

Every story belongs to one **section**: a region (National, Uttar Pradesh,
Uttarakhand, Delhi-NCR, International) or a topic (Politics, Business,
Sports). Sections appear in the bar under the header, each has its own page,
and the front page shows the latest stories from each region.

The **category** is the small label on the card ("Environment", "Economy").
Type anything; the editor suggests ones you have used before.

Sections cannot be added from the dashboard. Ask the developer if you need a
new one.

---

## 6. Ads

Open **Ads**. The site has twelve ad slots; the page lists them by where they
appear (Home, Sections, Articles, Listings, Podcast). Each slot shows its
pixel size, e.g. *Billboard 970×250 · mobile 320×100*.

- **Ads enabled** (top switch) turns every ad on the site on or off at once.
- **Add creative** on a slot: enter the sponsor's name, upload the picture
  (JPG, PNG, WebP, GIF or SVG, up to 2 MB, ideally the exact slot size — the
  dashboard warns if the shape does not match), paste the link the ad should
  open, add alt text, optionally set start and end dates, and a **weight**
  from 1 to 10. When a slot has several active creatives, higher weights show
  more often.
- Each creative can be **edited**, switched off with the **power** button, or
  **deleted**.
- A slot with no active creative shows an orange note and is hidden on the
  site — nothing broken is shown to readers.

---

## 7. Messages

Every message sent through the website's contact form lands in **Messages**.
Unread messages show a number in the left menu.

- Tap a message to read it. It is marked read automatically.
- **Reply by email** opens your email app with the reader's address filled
  in. **WhatsApp** appears when the reader gave a phone number.
- **Archive** tidies it away (find it under the *Archived* tab). **Delete**
  removes it for good.

If email notifications are set up, you also receive each message by email.

---

## 8. Settings

**Settings** has five tabs. Each tab has its own **Save** button; a small
orange dot on a tab means it has unsaved changes.

- **Brand:** site name (English and Hindi), the Hindi and English taglines,
  the description Google shows, the **logo** (a light version for paper
  backgrounds and a dark version for the black header and footer), the hero
  poster picture and background style, and the small line above the hero
  headline.
- **Contact:** the name, role, email, phone and location shown on the
  Contact page and in the footer.
- **Social & CTAs:** the WhatsApp community link (must be a `wa.me` or
  `chat.whatsapp.com` link), Instagram, YouTube, X and Facebook, and the
  labels and links of the buttons in the hero.
- **Podcast:** the show name, blurb and the Spotify / Apple / YouTube links.
- **Site:** the breaking ticker switch, the ads switch, the footer's archive
  notice, and **Run cleanup now**, which deletes expired stories immediately
  instead of waiting for 3:00 am.

Changes appear on the website within about a minute.

### The logo

Under **Settings → Brand**, upload a PNG or SVG with a transparent
background. The *light* logo is used on pale backgrounds, the *dark* logo on
the black header, footer and loading screen. The preview boxes show both. If
no logo is uploaded, the site shows the text lockup with the saffron square.

---

## 9. Before you publish — checklist

- [ ] Title reads well and is under about 90 characters.
- [ ] Excerpt is one or two clear sentences.
- [ ] Cover image is landscape, sharp, and has alt text.
- [ ] Right section and a sensible category.
- [ ] Body text has been proof-read; quotes are attributed.
- [ ] Video or audio plays in **Preview**.
- [ ] Breaking switch is on only if it is genuinely breaking.
- [ ] You have noted the auto-delete date shown in the sidebar.
- [ ] Tap **Publish**, then open the story on the live site once.

---

## 10. If something looks wrong

- The site updates within a minute of saving. Reload the page.
- "Wrong email or password": check both; use *Forgot password?* if needed.
- An upload fails: check the file size limits above and try again. Very large
  pictures are resized automatically.
- Anything else: contact the developer with the page address and a
  screenshot.
