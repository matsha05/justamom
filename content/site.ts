import { analyticsEvents, type AnalyticsEventName, type AnalyticsEventProperties } from "@/lib/analytics/events";

export interface ContentActionLink {
  href: string;
  label: string;
  eventName?: AnalyticsEventName;
  eventProperties?: AnalyticsEventProperties;
}

export interface NewsletterPanelContent {
  eyebrow: string;
  heading: string;
  description: string;
  trust: string;
  source: string;
  sampleDownload?: {
    title: string;
    description: string;
    href: string;
    filePath: string;
    ctaLabel: string;
  };
}

export const marketingContent = {
  newsletter: {
    buttonLabel: "Join A Note for Moms",
    homePanel: {
      eyebrow: "Newsletter",
      heading: "A Note for Moms, twice a month.",
      description:
        "Sent twice a month: honest stories and biblical reminders to keep moms grounded in truth over cultural noise.",
      trust:
        "Twice a month. Quiet, biblical encouragement for the middle of real life.",
      source: "home_panel",
    } satisfies NewsletterPanelContent,
    aboutPanel: {
      eyebrow: "Newsletter",
      heading: "Want the quiet notes, not just the highlights?",
      description:
        "Join the twice-monthly notes for biblical encouragement shaped by the holy, ordinary work of motherhood.",
      trust: "Gentle cadence. Grounded in Scripture. Written for real life.",
      source: "about_panel",
    } satisfies NewsletterPanelContent,
    workPanel: {
      eyebrow: "Newsletter",
      heading: "Follow the writing as it takes shape",
      description:
        "The newsletter is where new ideas, honest stories, and the heartbeat behind the project often show up first.",
      trust: "Twice a month. No fluff. Just steady encouragement and occasional project updates.",
      source: "work_panel",
    } satisfies NewsletterPanelContent,
    speakingPanel: {
      eyebrow: "Newsletter",
      heading: "Not booking right now? Start with the notes.",
      description:
        "If you want to get a feel for Lizi's voice and message before inviting her, the newsletter is the best place to begin.",
      trust: "A simple way to stay connected until the timing is right.",
      source: "speaking_panel",
    } satisfies NewsletterPanelContent,
    notePanel: {
      eyebrow: "Stay Connected",
      heading: "Get A Note for Moms in your inbox",
      description:
        "If this note met you in a tender place, I send two quiet, biblical notes each month for the middle of real life.",
      trust: "Twice a month. No noise, no pressure, just steady encouragement.",
      source: "note_panel",
    } satisfies NewsletterPanelContent,
  },
  home: {
    hero: {
      heading: "You are not just a mom.",
      description:
        "A steady note for women carrying unseen weight, holy work, and the tension between 'just a mom' and 'do it all.'",
      primaryCta: {
        href: "#newsletter",
        label: "Join A Note for Moms",
        eventName: analyticsEvents.newsletterCtaClick,
        eventProperties: {
          location: "home_hero",
        },
      } satisfies ContentActionLink,
      secondaryCta: {
        href: "/notes",
        label: "Read all notes",
      } satisfies ContentActionLink,
      trust: "Twice a month. Quiet, biblical encouragement for the middle of real life.",
    },
    work: {
      eyebrow: "Current Work",
      heading: "Just a Mom",
      excerpt:
        "Just a mom. It's wild how a three-word sentence can feel both true and entirely wrong at the same time. How it can shrink something as monumental as raising a human into something that feels small and slightly apologetic. As if caring for an image-bearer of God is somehow insignificant unless you add a title or a paycheck or something more 'productive' to go with it.",
      cta: {
        href: "/work",
        label: "Read about the project",
      } satisfies ContentActionLink,
    },
    notes: {
      eyebrow: "Latest Notes",
      heading: "For the mom in the thick of it",
      cta: {
        href: "/notes",
        label: "Read all notes",
      } satisfies ContentActionLink,
    },
    speaking: {
      eyebrow: "Speaking",
      heading: "Topics I often share",
      description:
        "For churches, retreats, and women's gatherings. Messages rooted in Scripture and shaped by ordinary life.",
      cta: {
        href: "/speaking",
        label: "Invite me to speak",
        eventName: analyticsEvents.speakingCtaClick,
        eventProperties: {
          location: "home_speaking_section",
        },
      } satisfies ContentActionLink,
    },
    contact: {
      eyebrow: "Contact",
      description:
        "For literary, editorial, or speaking inquiries, email directly:",
    },
  },
  about: {
    metadataDescription:
      "About Lizi Shaw, Christian writer and speaker behind A Note for Moms.",
    hero: {
      eyebrow: "About Me",
      heading: "Hi, I'm Lizi Shaw.",
      paragraphs: [
        "I'm a wife and mom of three, and I know how motherhood can feel holy and disorienting in the same breath. The days are full and loud, and it's easy to feel pulled between two exhausting stories: that you're 'just a mom,' or that you have to do it all.",
        "My heart is to help moms step out of that noise and back into God's story. Scripture gives us something steadier: identity received before performance, and purpose that does not depend on perfect kids, perfect homes, or perfect plans.",
        "Through speaking and writing, I want moms to leave with clear truth, practical encouragement, and the quiet confidence that comes from belonging to Christ.",
      ],
    },
    invitation: {
      heading: "Need a speaker for your women's event?",
      description:
        "I'd love to serve your moms with grounded biblical encouragement for real motherhood.",
      cta: {
        href: "/speaking",
        label: "Invite me to speak",
        eventName: analyticsEvents.speakingCtaClick,
        eventProperties: {
          location: "about_invitation",
        },
      } satisfies ContentActionLink,
    },
  },
  work: {
    metadataDescription:
      "A long-form project on motherhood, identity, and the steadier place where worth is received before it is performed.",
    hero: {
      eyebrow: "Current Work",
      heading: "Just a Mom",
      description:
        "A long-form project on motherhood, identity, and the steadier place where worth is received before it is performed.",
    },
    thesis: {
      eyebrow: "Project thesis",
      body:
        "Motherhood today is shaped by cultural lies that distort a woman's identity, whether by shrinking it to 'just a mom' or inflating it into 'do it all.' Both extremes steal joy and create pressure because they hinge identity on performance. But God tells a better story. From the very beginning, He defined women as image bearers first, and only then gave them purpose. By returning to the creation story, exposing the lies that echo from the garden into modern motherhood, and rediscovering God's pursuit and redemption, mothers can finally live from a secure identity rather than striving to earn one.",
    },
    excerpt: {
      eyebrow: "Selected excerpt",
      description: "Excerpt from the opening chapter.",
      paragraphs: [
        "I still remember the first time someone asked me what I did after my daughter was born. It was an innocent question. One I've asked a million times. The kind of small-talk line people toss out to get to know you or to fill a gap in conversation. But for me, it dropped a new weight on top of the already heavy load pressing down on my shoulders. I opened my mouth to answer and realized I wasn't entirely sure what to say.",
        "What did I do? I could have answered honestly. 'Well... today I changed about twenty diapers, battled for several naps, folded tiny clothes, cleaned spit-up off the couch, and produced enough milk to make me feel like a dairy cow.' But that felt... weird. Not because it wasn't true, it was very true, but because it didn't feel like an answer that counted.",
      ],
    },
    themes: {
      eyebrow: "Themes",
      items: [
        "Identity received before performance",
        "The cultural pressure to shrink or over-extend motherhood",
        "The creation story as a steadier center for modern moms",
        "Redemption from striving into quiet, durable confidence",
      ],
    },
    contact: {
      eyebrow: "For editors & agents",
      description:
        "For proposal materials, the full manuscript, or speaking inquiries, email",
      cta: {
        href: "/contact",
        label: "Contact",
      } satisfies ContentActionLink,
    },
  },
  speaking: {
    metadataDescription:
      "Speaking topics from Lizi Shaw on motherhood, identity, and everyday faithfulness, grounded in Scripture.",
    hero: {
      eyebrow: "Speaking",
      heading: "Speaking",
      description:
        "I speak to moms about the holy work of motherhood, the quiet places where God meets us, and the steadier identity we can live from when the noise gets loud.",
    },
    topics: {
      eyebrow: "Topics I share",
      heading: "Messages I return to",
      description:
        "These are a few talks I come back to often. Each can be shaped for your church, retreat, or women's gathering.",
      items: [
        {
          title: "Identity in the Noise",
          description:
            "A steadying look at the cultural pressure points shaping modern motherhood and how to live from a secure identity instead of performance.",
        },
        {
          title: "Finding God in the Ordinary",
          description:
            "A reflective message about the sacred weight of everyday motherhood and the quiet faithfulness that carries it.",
        },
        {
          title: "A Calling, Not a Consequence",
          description:
            "A biblical reframe that restores dignity to motherhood without diminishing calling, gifts, or work outside the home.",
        },
      ],
    },
    bio: {
      eyebrow: "Short bio (third-person)",
      description: "For host intros, event pages, or printed programs.",
      body:
        "Lizi Shaw is a Christian writer and speaker who helps moms live from identity received in Christ, not performance. Her teaching is grounded in Scripture and shaped by the holy, ordinary work of motherhood. With honest stories and practical encouragement, she helps moms find steadier footing in seasons that feel loud and overwhelming. Lizi lives in Niwot, Colorado, with her husband, Matt, and their three children. She loves skiing, running, and baking.",
    },
    inquiry: {
      eyebrow: "Inquiries",
      heading: "Invite me to speak",
      description:
        "For availability, dates, and event details, share a few basics below, or email.",
      followUp: "I'll follow up personally.",
    },
  },
} as const;
