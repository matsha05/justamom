# Conversion System

This site has two main conversion paths:

- Newsletter signup through homepage, about, work, speaking, and note panels.
- Personal inquiry through the contact and speaking forms.

## Source Contract

Conversion sources live in `lib/conversions.ts`. Use those values instead of
typing source strings by hand.

Examples:

- `home_panel`
- `note_panel`
- `contact_page`
- `speaking_page`

Newsletter forms send `source`, `variant`, and `page_path` to
`/api/newsletter`. Contact and speaking forms send `source`, `form_type`, and
`page_path` to `/api/contact`.

## Newsletter Attribution

MailerLite only accepts custom field values when the field already exists in
the MailerLite account. To forward signup source into MailerLite, create a text
custom field there and set:

```bash
MAILERLITE_SIGNUP_SOURCE_FIELD=signup_source
```

Without that environment variable, the site still validates the source and uses
it for client analytics, but it does not send an unknown custom field upstream.

## Inquiry Attribution

Contact and speaking submissions forward attribution to Formspree as normal form
fields:

- `source`
- `form_type`
- `page_path`

That keeps a reply-focused inbox while still showing where the inquiry started.

## Regression Checks

The API tests protect the main contracts:

- newsletter submissions can carry a valid source
- configured MailerLite source fields are forwarded
- contact submissions forward source and page path to Formspree
- speaking submissions are validated as speaking inquiries

The content tests also check that reusable newsletter panels use distinct,
approved sources.
