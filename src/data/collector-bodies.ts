import { ROUTES } from './routes';

export interface CollectorCard {
  href: string;
  title: string;
  description: string;
  linkLabel: string;
  dataToPage: string;
  dataCategory?: string;
}

export interface CollectorSection {
  heading: string;
  intro?: string;
  cards: CollectorCard[];
}

export interface CollectorBodyConfig {
  fromPage: string;
  accent: 'primary' | 'sage' | 'terracotta';
  start?: {
    href: string;
    title: string;
    description: string;
    dataToPage: string;
  };
  sections: CollectorSection[];
  showCalmingDisclaimer?: boolean;
  disclosureShowSafety?: boolean;
}

export const coolingCollectorBody: CollectorBodyConfig = {
  fromPage: 'cooling-hub',
  accent: 'primary',
  start: {
    href: ROUTES.coolingTop,
    title: '10 Best Cooling Products for Dogs',
    description:
      'Our complete guide covering mats, bandanas, vests, and toys — with quick picks, comparisons, and heat safety tips.',
    dataToPage: ROUTES.coolingTop,
  },
  sections: [
    {
      heading: 'Shop by Category',
      cards: [
        {
          href: ROUTES.coolingMats,
          title: 'Cooling Mats',
          description: 'Pressure-activated and water-based mats for instant relief at home or on the go.',
          linkLabel: 'See our picks ->',
          dataToPage: ROUTES.coolingMats,
          dataCategory: 'cooling-mats',
        },
        {
          href: ROUTES.coolingBandanas,
          title: 'Cooling Bandanas',
          description: 'Lightweight, soak-and-go cooling for daily walks in the heat.',
          linkLabel: 'See our picks ->',
          dataToPage: ROUTES.coolingBandanas,
          dataCategory: 'cooling-bandanas',
        },
        {
          href: ROUTES.coolingVests,
          title: 'Cooling Vests',
          description: 'Evaporative vests for hikes, runs, and extended outdoor time.',
          linkLabel: 'See our picks ->',
          dataToPage: ROUTES.coolingVests,
          dataCategory: 'cooling-vests',
        },
        {
          href: ROUTES.coolingToys,
          title: 'Freezable Toys',
          description: 'Stuff, freeze, and let your dog work for a cold treat.',
          linkLabel: 'See our picks ->',
          dataToPage: ROUTES.coolingToys,
          dataCategory: 'freezable-dog-toys',
        },
        {
          href: ROUTES.roadTrip,
          title: 'Road Trip Chill Kit',
          description:
            'Cooling + calming setup for long drives — window shades, fans, mats, and anxiety picks.',
          linkLabel: 'Read the guide ->',
          dataToPage: ROUTES.roadTrip,
          dataCategory: 'road-trip',
        },
      ],
    },
    {
      heading: 'Cooling Safety Guides',
      intro:
        'Practical guides to help you understand heat risks and keep your dog safe in warm weather.',
      cards: [
        {
          href: ROUTES.coolingCarGuide,
          title: 'Keep a Dog Cool in a Car',
          description:
            'What actually works when the AC doesn\'t reach the back seat — and which gear to use on short trips and long drives.',
          linkLabel: 'Read the guide ->',
          dataToPage: ROUTES.coolingCarGuide,
          dataCategory: 'car-cooling-guide',
        },
        {
          href: ROUTES.coolingSafety,
          title: 'How Hot Is Too Hot for Dogs?',
          description:
            'A practical temperature guide explaining when outdoor heat becomes dangerous and how to protect dogs from overheating.',
          linkLabel: 'Read the guide ->',
          dataToPage: ROUTES.coolingSafety,
          dataCategory: 'safety-guide',
        },
      ],
    },
  ],
};

export const calmingCollectorBody: CollectorBodyConfig = {
  fromPage: 'calming-hub',
  accent: 'sage',
  start: {
    href: ROUTES.calmingTop,
    title: 'Best Calming Products for Anxious Dogs',
    description:
      'Our main guide covers ThunderShirt, calming chews, lick mats, and snuffle mats using the exact tools most dog owners consider first.',
    dataToPage: ROUTES.calmingTop,
  },
  sections: [
    {
      heading: 'Featured Guides',
      cards: [
        {
          href: ROUTES.calmingTop,
          title: 'Best Calming Products for Anxious Dogs',
          description:
            "Quick picks and scenario-based guidance for storms, fireworks, separation, and grooming stress — covering all 8 products we've compared.",
          linkLabel: 'Read the guide ->',
          dataToPage: ROUTES.calmingTop,
        },
        {
          href: ROUTES.calmingAlternatives,
          title: 'Best ThunderShirt Alternatives for Dogs',
          description:
            'Who should buy ThunderShirt, who should skip it, and which alternatives work better for different anxiety triggers.',
          linkLabel: 'Compare options ->',
          dataToPage: ROUTES.calmingAlternatives,
        },
        {
          href: ROUTES.calmingCar,
          title: 'Car Anxiety for Dogs',
          description:
            'Travel-focused calming picks for dogs who pant, pace, or struggle to settle once the drive starts.',
          linkLabel: 'See travel picks ->',
          dataToPage: ROUTES.calmingCar,
        },
        {
          href: ROUTES.roadTrip,
          title: 'Road Trip Chill Kit',
          description:
            'Cooling + calming setup for long drives — wraps, chews, lick mats, window shades, and fans that help a dog stay cool and calm on the road.',
          linkLabel: 'Read the guide ->',
          dataToPage: ROUTES.roadTrip,
        },
        {
          href: ROUTES.comfortCalmingBeds,
          title: 'Best Calming Dog Beds',
          description:
            'Donut beds, cuddler beds, and bolster beds for dogs who curl up, burrow, or press against something when they sleep.',
          linkLabel: 'See our picks ->',
          dataToPage: ROUTES.comfortCalmingBeds,
        },
      ],
    },
    {
      heading: 'When Anxiety Makes Dogs Run',
      intro: 'Loud sounds, sudden wildlife, unfamiliar terrain — some anxiety triggers cause dogs to bolt before any calming tool can help. These guides cover what happens next.',
      cards: [
        {
          href: ROUTES.rhysRanAway,
          title: 'The Day Rhys Ran Off on Cerro San Luis Obispo',
          description:
            'A real story about a foggy summit, a 30-minute search, and what it taught us about GPS trackers and why cellular collars fail exactly when you need them.',
          linkLabel: 'Read the story ->',
          dataToPage: ROUTES.rhysRanAway,
        },
        {
          href: ROUTES.dogRanAwaySafety,
          title: 'What To Do If Your Dog Runs Away',
          description:
            'Step-by-step action guide for the first 10 minutes, the first hour, and the days after — with practical search and recovery tips.',
          linkLabel: 'Read the guide ->',
          dataToPage: ROUTES.dogRanAwaySafety,
        },
        {
          href: ROUTES.trackingTop,
          title: 'Best Dog GPS Trackers',
          description:
            'Cellular, off-grid, and Bluetooth — three categories that solve different problems. Know which type fits your terrain before you need it.',
          linkLabel: 'Compare trackers ->',
          dataToPage: ROUTES.trackingTop,
        },
      ],
    },
  ],
  showCalmingDisclaimer: true,
  disclosureShowSafety: false,
};

export const comfortCollectorBody: CollectorBodyConfig = {
  fromPage: 'comfort-hub',
  accent: 'terracotta',
  sections: [
    {
      heading: 'Shop by Rest Setup',
      intro: 'Beds and crates for different rest needs — calming beds for dogs who seek security, orthopedic beds for joint support, and puppy crates for training.',
      cards: [
        {
          href: ROUTES.comfortCalmingBeds,
          title: 'Best Calming Dog Beds',
          description: 'Donut beds, cuddler beds, and bolster beds for dogs who curl up, burrow, or press against something when they sleep.',
          linkLabel: 'See our picks ->',
          dataToPage: ROUTES.comfortCalmingBeds,
          dataCategory: 'calming-beds',
        },
        {
          href: ROUTES.comfortOrthopedicBeds,
          title: 'Best Orthopedic Dog Beds',
          description: 'Dense foam beds for larger breeds, older dogs, and heavy resters who need consistent joint support through the night.',
          linkLabel: 'See our picks ->',
          dataToPage: ROUTES.comfortOrthopedicBeds,
          dataCategory: 'orthopedic-beds',
        },
        {
          href: ROUTES.comfortPuppyCrates,
          title: 'Best Puppy Crates',
          description: 'Divider-based wire crates for housebreaking, quiet-time practice, and a first crate-training setup.',
          linkLabel: 'See our picks ->',
          dataToPage: ROUTES.comfortPuppyCrates,
          dataCategory: 'crates',
        },
        {
          href: ROUTES.comfortAnxietyCrates,
          title: 'Best Dog Crates for Anxiety',
          description: 'Wire, enclosed, and heavy-duty crates for different anxiety and escape-risk patterns.',
          linkLabel: 'Compare options ->',
          dataToPage: ROUTES.comfortAnxietyCrates,
          dataCategory: 'crates',
        },
        {
          href: ROUTES.comfortTravelCrates,
          title: 'Best Travel Crates for Road Trips',
          description: 'Hard-sided and soft folding crates for car travel, hotels, and road trip setup.',
          linkLabel: 'Compare travel crates ->',
          dataToPage: ROUTES.comfortTravelCrates,
          dataCategory: 'crates',
        },
      ],
    },
    {
      heading: 'More Crate Paths',
      intro: 'Different crate jobs call for different pages — flying, decorative indoor placement, and stronger reinforced containment all need a separate decision.',
      cards: [
        {
          href: ROUTES.comfortAirlineCrates,
          title: 'Best Airline Crates for Flying With Your Dog',
          description: 'Rigid hard-sided kennels for flight prep, airline requirements, and cargo-style travel decisions.',
          linkLabel: 'Compare airline crates ->',
          dataToPage: ROUTES.comfortAirlineCrates,
          dataCategory: 'crates',
        },
        {
          href: ROUTES.comfortFurnitureCrates,
          title: 'Best Furniture Dog Crates',
          description: 'Decorative crate tables and room-friendly indoor kennel options for homes where the crate stays visible.',
          linkLabel: 'See furniture crates ->',
          dataToPage: ROUTES.comfortFurnitureCrates,
          dataCategory: 'crates',
        },
        {
          href: ROUTES.comfortHeavyDutyCrates,
          title: 'Best Heavy-Duty Dog Crates',
          description: 'Reinforced crate options for escape artists and dogs that overpower standard wire crates.',
          linkLabel: 'See heavy-duty picks ->',
          dataToPage: ROUTES.comfortHeavyDutyCrates,
          dataCategory: 'crates',
        },
      ],
    },
    {
      heading: 'Sleep & Rest Guides',
      intro: 'Practical guides on how dogs sleep, what disrupts rest, and how to help your dog settle better.',
      cards: [
        {
          href: ROUTES.comfortSleepArticle,
          title: 'How Much Do Dogs Sleep?',
          description: 'What normal rest looks like across life stages, why dogs dream, and what to check when your dog can\'t settle.',
          linkLabel: 'Read the guide ->',
          dataToPage: ROUTES.comfortSleepArticle,
          dataCategory: 'sleep-guide',
        },
      ],
    },
  ],
  disclosureShowSafety: false,
};
