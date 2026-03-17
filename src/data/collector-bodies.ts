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
  accent: 'primary' | 'sage';
  start: {
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
          href: ROUTES.roadTrip,
          title: 'Road Trip Chill Kit',
          description:
            'Cooling + calming setup for long drives — wraps, chews, lick mats, window shades, and fans that help a dog stay cool and calm on the road.',
          linkLabel: 'Read the guide ->',
          dataToPage: ROUTES.roadTrip,
        },
      ],
    },
  ],
  showCalmingDisclaimer: true,
  disclosureShowSafety: false,
};

export const carCoolingGuideCollectorBody: CollectorBodyConfig = {
  fromPage: 'car-cooling-guide',
  accent: 'primary',
  start: {
    href: ROUTES.coolingCar,
    title: 'Best Car Cooling Products for Dogs',
    description:
      'Window shades, clip-on fans, cooling mats, and collapsible water bowls — the practical gear that works when AC doesn\'t reach the back seat.',
    dataToPage: ROUTES.coolingCar,
  },
  sections: [
    {
      heading: 'Quick Fixes for the Back Seat',
      intro:
        'These products address the real problem: the back seat gets significantly hotter than the front, even with AC running.',
      cards: [
        {
          href: ROUTES.coolingCar,
          title: 'Car Cooling for Dogs',
          description: 'Window shades, fans, and mats — the core setup for keeping the back seat tolerable on any drive.',
          linkLabel: 'See our picks ->',
          dataToPage: ROUTES.coolingCar,
          dataCategory: 'car-cooling',
        },
        {
          href: ROUTES.coolingMats,
          title: 'Cooling Mats',
          description: 'A pressure-activated mat on the seat surface provides steady relief without any power source.',
          linkLabel: 'See our picks ->',
          dataToPage: ROUTES.coolingMats,
          dataCategory: 'cooling-mats',
        },
        {
          href: ROUTES.coolingBandanas,
          title: 'Cooling Bandanas',
          description: 'Lightweight and fast to prep — ideal for shorter trips and rest-stop walks.',
          linkLabel: 'See our picks ->',
          dataToPage: ROUTES.coolingBandanas,
          dataCategory: 'cooling-bandanas',
        },
      ],
    },
    {
      heading: 'Planning a Longer Drive?',
      cards: [
        {
          href: ROUTES.roadTrip,
          title: 'Road Trip Chill Kit',
          description: 'The full setup for longer drives: cooling and calming gear together, with a practical checklist.',
          linkLabel: 'Read the guide ->',
          dataToPage: ROUTES.roadTrip,
          dataCategory: 'road-trip',
        },
        {
          href: ROUTES.coolingSafety,
          title: 'How Hot Is Too Hot for Dogs?',
          description: 'Understand heat thresholds and overheating signs before you hit the road.',
          linkLabel: 'Read the guide ->',
          dataToPage: ROUTES.coolingSafety,
          dataCategory: 'safety-guide',
        },
      ],
    },
  ],
  showCalmingDisclaimer: false,
  disclosureShowSafety: true,
};
