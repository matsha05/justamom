import { analyticsEvents, type AnalyticsEventName, type AnalyticsEventProperties } from "@/lib/analytics/events";
import { conversionSources, type ConversionSource } from "@/lib/conversions";

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
  source: ConversionSource;
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
      heading: "A Note for Moms.",
      description:
        "Twice a month, I send honest stories and Scripture for moms.",
      trust: "",
      source: conversionSources.homePanel,
    } satisfies NewsletterPanelContent,
    aboutPanel: {
      eyebrow: "Newsletter",
      heading: "Want the notes in your inbox?",
      description:
        "I send A Note for Moms twice a month with honest stories, Scripture, and encouragement for motherhood.",
      trust: "Twice a month, and easy to keep up with.",
      source: conversionSources.aboutPanel,
    } satisfies NewsletterPanelContent,
    workPanel: {
      eyebrow: "Newsletter",
      heading: "Follow along as the writing takes shape",
      description:
        "The newsletter is where I often share new ideas, honest stories, and early glimpses of the project.",
      trust: "Two notes a month, plus a look at the writing as it grows.",
      source: conversionSources.workPanel,
    } satisfies NewsletterPanelContent,
    speakingPanel: {
      eyebrow: "Newsletter",
      heading: "Want to get a feel for my voice first?",
      description:
        "The newsletter is the easiest place to start.",
      trust: "A simple way to read a few notes before reaching out.",
      source: conversionSources.speakingPanel,
    } satisfies NewsletterPanelContent,
    notePanel: {
      eyebrow: "Stay Connected",
      heading: "Get A Note for Moms in your inbox",
      description:
        "If this note encouraged you, I send A Note for Moms twice a month.",
      trust: "Twice a month. Honest, biblical, and easy to keep up with.",
      source: conversionSources.notePanel,
    } satisfies NewsletterPanelContent,
  },
  home: {
    hero: {
      eyebrow: "",
      heading: "You are not just a mom.",
      description:
        "Short notes for moms who feel pulled between 'just a mom' and 'do it all.'",
      primaryCta: {
        href: "#newsletter",
        label: "Join A Note for Moms",
        eventName: analyticsEvents.newsletterCtaClick,
        eventProperties: {
          location: conversionSources.homeHero,
        },
      } satisfies ContentActionLink,
      secondaryCta: {
        href: "/notes",
        label: "Read recent notes",
      } satisfies ContentActionLink,
      trust: "Read a few notes, or get them in your inbox twice a month.",
    },
    work: {
      heading: "The project taking shape behind the notes",
      description:
        "A simple look at the manuscript and the ideas behind it.",
      cta: {
        href: "/work",
        label: "Read about the project",
      } satisfies ContentActionLink,
    },
    notes: {
      eyebrow: "Latest Notes",
      heading: "Start with a recent note",
      description:
        "If you're new here, start with a note or two.",
      cta: {
        href: "/notes",
        label: "Read all notes",
      } satisfies ContentActionLink,
    },
    speaking: {
      heading: "Speaking for women's gatherings",
      description:
        "Topics, host details, and a simple way to reach out.",
      cta: {
        href: "/speaking",
        label: "See speaking topics",
        eventName: analyticsEvents.speakingCtaClick,
        eventProperties: {
          location: conversionSources.homeSpeakingSection,
        },
      } satisfies ContentActionLink,
    },
    contact: {
      heading: "Get in touch",
      description: "For literary, editorial, or speaking inquiries.",
    },
    more: {
      eyebrow: "A few other things",
      heading: "If you want to keep looking around",
    },
  },
  about: {
    metadataDescription:
      "About Lizi Shaw, Christian writer and speaker behind A Note for Moms.",
    hero: {
      eyebrow: "About Me",
      heading: "Hi, I'm Lizi Shaw.",
      paragraphs: [
        "I'm a wife and mom of three, and I know motherhood can feel beautiful and disorienting at the same time. The days are full, and it is easy to feel pulled between feeling small and feeling like you should be able to do everything.",
        "I want to help moms come back to what is true. Scripture reminds us who we are before it asks anything from us, and that changes how we live through the ordinary work of motherhood.",
        "In my writing and speaking, I hope moms leave encouraged, grounded in truth, and reminded that they belong to Christ.",
      ],
    },
    invitation: {
      heading: "Need a speaker for your women's event?",
      description:
        "I'd love to serve your moms with biblical encouragement that meets them where they are.",
      cta: {
        href: "/speaking",
        label: "Invite me to speak",
        eventName: analyticsEvents.speakingCtaClick,
        eventProperties: {
          location: conversionSources.aboutInvitation,
        },
      } satisfies ContentActionLink,
    },
  },
  work: {
    metadataDescription:
      "I'm working on a book about motherhood, identity, and what it means to know your worth is not something you have to prove.",
    hero: {
      eyebrow: "Current Work",
      heading: "Just a Mom",
      description:
        "I'm working on a book about motherhood, identity, and what it means to know your worth is not something you have to prove.",
    },
    thesis: {
      eyebrow: "Project thesis",
      body:
        "The heart of this project is simple: many moms feel stuck between feeling like they are 'just a mom' and feeling like they have to do everything well. Both are heavy. I want to write toward a better story from Scripture, one that reminds women who they are before what they do.",
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
        "Who you are before what you do",
        "The pressure moms feel to disappear or do everything",
        "What the creation story says about women and worth",
        "How the gospel frees us from constant striving",
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
        "I speak to moms about identity, motherhood, and following Jesus in everyday life.",
    },
    topics: {
      eyebrow: "Topics I share",
      heading: "Messages I return to",
      description:
        "These are a few messages I often share. I'm always happy to shape them for your church, retreat, or gathering.",
      items: [
        {
          title: "Identity in the Noise",
          description:
            "A talk about the noise and pressure around modern motherhood, and the steadier identity Scripture offers.",
        },
        {
          title: "Finding God in the Ordinary",
          description:
            "A message about meeting God in ordinary motherhood and the quiet faithfulness of everyday life.",
        },
        {
          title: "A Calling, Not a Consequence",
          description:
            "A talk about the dignity of motherhood and the freedom to honor it without shrinking the rest of a woman's calling.",
        },
      ],
    },
    bio: {
      eyebrow: "Short bio (third-person)",
      description: "For host intros, event pages, or printed programs.",
      body:
        "Lizi Shaw is a writer and speaker based in Niwot, Colorado. She writes and speaks to moms about motherhood, identity, and everyday faithfulness. Her work is rooted in Scripture and shaped by her own life as a wife and mother of three.",
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
