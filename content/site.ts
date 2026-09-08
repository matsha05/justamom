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
    homePanel: {
      eyebrow: "Newsletter",
      heading: "A Note for Moms.",
      description:
        "Once a month, I send A Note for Moms and include links to recent posts.",
      trust: "",
      source: conversionSources.homePanel,
    } satisfies NewsletterPanelContent,
    aboutPanel: {
      eyebrow: "Newsletter",
      heading: "Want the notes in your inbox?",
      description:
        "Once a month, I send A Note for Moms with honest stories, Scripture, and links to recent posts.",
      trust: "Once a month, and easy to keep up with.",
      source: conversionSources.aboutPanel,
    } satisfies NewsletterPanelContent,
    workPanel: {
      eyebrow: "Newsletter",
      heading: "Follow along as the writing takes shape",
      description:
        "The newsletter is where I often share new ideas, honest stories, and early glimpses of the project.",
      trust: "Once a month, plus a look at the writing as it grows.",
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
        "If this encouraged you, I send A Note for Moms once a month.",
      trust: "Honest, biblical, and easy to keep up with.",
      source: conversionSources.notePanel,
    } satisfies NewsletterPanelContent,
    notesArchivePanel: {
      eyebrow: "Newsletter",
      heading: "Join A Note for Moms",
      description:
        "Once a month, I send A Note for Moms and include links to recent posts.",
      trust: "",
      source: conversionSources.notesArchive,
    } satisfies NewsletterPanelContent,
    blogArchivePanel: {
      eyebrow: "Newsletter",
      heading: "Join A Note for Moms",
      description:
        "Once a month, I send A Note for Moms and include links to recent posts.",
      trust: "",
      source: conversionSources.blogArchive,
    } satisfies NewsletterPanelContent,
  },
  home: {
    hero: {
      heading: "Hi, I’m Lizi.",
      description:
        "I love to write and point women towards Jesus.",
      primaryCta: {
        href: "/notes",
        label: "Read recent notes",
      } satisfies ContentActionLink,
      secondaryCta: {
        href: "/about",
        label: "More about me",
      } satisfies ContentActionLink,
    },
    notes: {
      eyebrow: "Recent Notes",
      heading: "A Note for Moms",
      description:
        "Monthly notes about following Jesus through motherhood and ordinary life.",
      cta: {
        href: "/notes",
        label: "See all notes",
      } satisfies ContentActionLink,
    },
    speaking: {
      heading: "Speaking for women's gatherings",
      description:
        "I speak to moms about identity, motherhood, and following Jesus in everyday life.",
      cta: {
        href: "/speaking",
        label: "Learn about speaking",
        eventName: analyticsEvents.speakingCtaClick,
        eventProperties: {
          location: conversionSources.homeSpeakingSection,
        },
      } satisfies ContentActionLink,
    },
    contact: {
      heading: "Get in touch",
      description: "Want to say hi? Have a question or something on your mind? I’d love to hear from you!",
    },
  },
  about: {
    metadataDescription:
      "About Lizi Shaw, a Christian writer and speaker who points women towards Jesus.",
    hero: {
      eyebrow: "About Me",
      heading: "Hi, I’m Lizi Shaw",
      paragraphs: [
        "I may love to write, but I don’t love writing this “about me” section. I find it awkward listing a bunch of generic traits about myself when I’d really rather sit next to you with a hot cup of coffee (black of course) with our feet kicked up on the coffee table having half a conversation while our kids run wild. Or at a park before the morning sun starts to beat down and the slides get too hot and our tiny humans can’t make it another moment without food in their bellies. For me, that’s when time blinks by and my heart feels the fullest.",
        "I love to write and I love Jesus. I love when I am able to get a glimpse of how He is working in the mundane moments of motherhood. I am on a search to recognize Him in the baby giggles and side walk chalk as well as in the tears and the uncomfortable unknown. Ultimately, I just want to know Him more and share His goodness any way I can.",
        "I hope you find a lot of encouragement here. I hope this page is one that brings you a lot of peace in a world that is full of confusion. And I hope we get to see each other face to face sometimes so that we can continue to build each other up as we continue to serve our King Jesus.",
      ],
    },
    facts: {
      heading: "Some Fun Facts",
      items: [
        "I am a wife to Matt and mom to three; Emma, Cooper & Elliana + 1 puppy, Banks",
        "Born and raised in Boulder, CO, lived in Montana, Georgia & Texas, traveled to over 40 countries and finally made my way back home to Colorado.",
        "If you’d like to bring me coffee, I’ll take it black and won’t say no to something sweet!",
        "I love to run and hope that watching enough Ultra Documentaries will make me an Ultra Runner… or at least inspire me to go on adventure runs through the woods.",
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
      "Lizi Shaw speaks to moms about motherhood, identity, and following Jesus in everyday life.",
    hero: {
      eyebrow: "Speaking",
      heading: "Speaking",
      description:
        "I speak to moms about identity, motherhood, and following Jesus in everyday life.",
      cta: {
        href: "#book",
        label: "Invite me to speak",
        eventName: analyticsEvents.speakingCtaClick,
        eventProperties: {
          location: conversionSources.speakingPage,
        },
      } satisfies ContentActionLink,
    },
    bio: {
      eyebrow: "For event hosts",
      body:
        "Lizi Shaw is a writer and speaker based in Niwot, Colorado. She writes and speaks to moms about motherhood, identity, and everyday faithfulness. Her work is rooted in Scripture and shaped by her own life as a wife and mother of three.",
    },
    inquiry: {
      eyebrow: "Inquiries",
      heading: "Invite me to speak",
      description:
        "If you'd like to invite me to your church, retreat, or gathering, your name and email are enough to start. Share any event details you already know, or send me an email.",
      followUp: "I'll follow up personally.",
    },
  },
} as const;
