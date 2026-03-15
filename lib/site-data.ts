import { z } from "zod";
import {
  CommentSchema,
  ModeratorActionSchema,
  PartSchema,
  ReportSchema,
  UserProfileSchema,
} from "@contracts/schemas";

const users = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    email: "alice@fixguide.dev",
    display_name: "Alice Chen",
    role: "admin",
    avatar_url: null,
    bio: "Platform steward focused on migration safety and editorial accuracy.",
    created_at: "2026-01-04T12:00:00.000Z",
    updated_at: "2026-03-09T18:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    email: "bob@fixguide.dev",
    display_name: "Bob Martinez",
    role: "contributor",
    avatar_url: null,
    bio: "Builds low-cost Arduino labs and writes test procedures students can actually follow.",
    created_at: "2026-01-09T12:00:00.000Z",
    updated_at: "2026-03-11T18:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    email: "carol@fixguide.dev",
    display_name: "Carol Davis",
    role: "moderator",
    avatar_url: null,
    bio: "Moderation lead with a bias for clear evidence and reversible actions.",
    created_at: "2026-01-15T12:00:00.000Z",
    updated_at: "2026-03-08T18:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    email: "dave@fixguide.dev",
    display_name: "Dave Kim",
    role: "user",
    avatar_url: null,
    bio: "Student tinkerer verifying community notes one lab bench at a time.",
    created_at: "2026-02-01T12:00:00.000Z",
    updated_at: "2026-03-10T18:00:00.000Z",
  },
] as const;

export const userProfiles = users.map((user) => UserProfileSchema.parse(user));
export const currentProfile = userProfiles[3];

const userMap = new Map(userProfiles.map((user) => [user.id, user]));

const parts = [
  // ── Arduino Temperature Monitor ──
  {
    id: "30000000-0000-4000-8000-000000000001",
    name: "Arduino Uno R3 (budget clone)",
    description: "Entry-level microcontroller board. Budget: Elegoo clone. Best: Official Arduino Uno R3.",
    price_budget: 8,
    price_best: 28,
    url: "https://www.amazon.com/ELEGOO-Board-ATmega328P-ATMEGA16U2-Compliant/dp/B01EWOE0UU",
    project_id: "20000000-0000-4000-8000-000000000001",
    created_at: "2026-02-04T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    name: "DHT11 temperature & humidity sensor",
    description: "Budget: basic DHT11 module. Best: DHT22 (wider range, ±0.5°C accuracy).",
    price_budget: 2,
    price_best: 7,
    url: "https://www.amazon.com/HiLetgo-Temperature-Humidity-Digital-3-3V-5V/dp/B01DKC2GQ0",
    project_id: "20000000-0000-4000-8000-000000000001",
    created_at: "2026-02-04T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    name: "Breadboard + jumper wire kit",
    description: "830-point breadboard with 65-piece jumper wire set. Essential for all projects.",
    price_budget: 4,
    price_best: 12,
    url: "https://www.amazon.com/ELEGOO-Breadboard-Solderless-Distribution-Connecting/dp/B01EV6LJ7G",
    project_id: "20000000-0000-4000-8000-000000000001",
    created_at: "2026-02-04T12:00:00.000Z",
  },
  // ── Smart Plant Watering ──
  {
    id: "30000000-0000-4000-8000-000000000004",
    name: "Capacitive soil moisture sensor v1.2",
    description: "Corrosion-resistant capacitive probe. Lasts far longer than resistive type.",
    price_budget: 4,
    price_best: 9,
    url: "https://www.amazon.com/Gikfun-Capacitive-Corrosion-Resistant-Detection/dp/B07H3P1NRM",
    project_id: "20000000-0000-4000-8000-000000000002",
    created_at: "2026-02-05T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000005",
    name: "5V single-channel relay module",
    description: "Opto-isolated relay for safely switching pump power on/off.",
    price_budget: 2,
    price_best: 5,
    url: "https://www.amazon.com/HiLetgo-Channel-optocoupler-Support-Trigger/dp/B00LW15A4W",
    project_id: "20000000-0000-4000-8000-000000000002",
    created_at: "2026-02-05T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000006",
    name: "Mini submersible water pump (3–5V DC)",
    description: "Low-voltage pump for controlled watering. Budget: generic. Best: Gikfun branded.",
    price_budget: 4,
    price_best: 9,
    url: "https://www.amazon.com/Gikfun-Submersible-Pump-Arduino-EK1893/dp/B07BHD6KXS",
    project_id: "20000000-0000-4000-8000-000000000002",
    created_at: "2026-02-05T12:00:00.000Z",
  },
  // ── Budget Robot Starter ──
  {
    id: "30000000-0000-4000-8000-000000000007",
    name: "2WD smart car robot chassis kit",
    description: "Acrylic chassis with 2 DC gear motors, wheels, and caster. Everything to get rolling.",
    price_budget: 8,
    price_best: 18,
    url: "https://www.amazon.com/perma-proto-Chassis-Encoder-Battery-Arduino/dp/B01LXY7CM3",
    project_id: "20000000-0000-4000-8000-000000000003",
    created_at: "2026-02-09T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000008",
    name: "HC-SR04 ultrasonic distance sensor",
    description: "Measures distance 2–400 cm via 40 kHz sound pulse. The standard obstacle detector.",
    price_budget: 2,
    price_best: 6,
    url: "https://www.amazon.com/SainSmart-HC-SR04-Ranging-Detector-Distance/dp/B004U8TOE6",
    project_id: "20000000-0000-4000-8000-000000000003",
    created_at: "2026-02-09T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000009",
    name: "L298N dual H-bridge motor driver",
    description: "Controls speed and direction of 2 DC motors. Handles up to 2A per channel.",
    price_budget: 4,
    price_best: 8,
    url: "https://www.amazon.com/HiLetgo-Controller-Stepper-H-Bridge-Mega2560/dp/B07BK1QL5T",
    project_id: "20000000-0000-4000-8000-000000000003",
    created_at: "2026-02-09T12:00:00.000Z",
  },
  // ── Solar Weather Station ──
  {
    id: "30000000-0000-4000-8000-000000000010",
    name: "ESP32 development board",
    description: "Wi-Fi + Bluetooth microcontroller. Budget: generic ESP32-WROOM. Best: Adafruit ESP32 Feather.",
    price_budget: 7,
    price_best: 22,
    url: "https://www.amazon.com/ESP-WROOM-32-Development-Microcontroller-Integrated-Compatible/dp/B08D5ZD528",
    project_id: "20000000-0000-4000-8000-000000000004",
    created_at: "2026-02-14T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000011",
    name: "BME280 barometric sensor breakout",
    description: "Measures temperature (±1°C), humidity (±3%), and pressure. I2C interface.",
    price_budget: 5,
    price_best: 15,
    url: "https://www.amazon.com/HiLetgo-Atmospheric-Pressure-Temperature-Humidity/dp/B01N47LZ4P",
    project_id: "20000000-0000-4000-8000-000000000004",
    created_at: "2026-02-14T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000012",
    name: "6V 1W mini solar panel + TP4056 charger",
    description: "Solar panel for daylight charging plus lithium battery charge controller with protection.",
    price_budget: 8,
    price_best: 15,
    url: "https://www.amazon.com/Pieces-Volts-Solar-Panel-Charger/dp/B0736W4HK1",
    project_id: "20000000-0000-4000-8000-000000000004",
    created_at: "2026-02-14T12:00:00.000Z",
  },
  // ── Magnetic Door Alarm ──
  {
    id: "30000000-0000-4000-8000-000000000013",
    name: "Magnetic reed switch (5-pack)",
    description: "Normally-open contact sensor. Closes when magnet is within ~1 cm.",
    price_budget: 1,
    price_best: 4,
    url: "https://www.amazon.com/Gikfun-Stitch-Sensor-Magnet-Arduino/dp/B0154PTDFI",
    project_id: "20000000-0000-4000-8000-000000000005",
    created_at: "2026-02-18T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000014",
    name: "Piezo buzzer module",
    description: "Active buzzer — apply voltage and it beeps. No frequency code needed for basic alarm.",
    price_budget: 1,
    price_best: 3,
    url: "https://www.amazon.com/Cylewet-Electronic-Magnetic-Continuous-Arduino/dp/B01N7NHRIO",
    project_id: "20000000-0000-4000-8000-000000000005",
    created_at: "2026-02-18T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000015",
    name: "4xAA battery holder with switch",
    description: "6V supply for Arduino VIN. Built-in on/off switch. Safer than lithium for students.",
    price_budget: 2,
    price_best: 5,
    url: "https://www.amazon.com/LAMPVPATH-Battery-Holder-Switch-Leads/dp/B07T7MTRZX",
    project_id: "20000000-0000-4000-8000-000000000005",
    created_at: "2026-02-18T12:00:00.000Z",
  },
  // ── NEW: Raspberry Pi Home Server ──
  {
    id: "30000000-0000-4000-8000-000000000016",
    name: "Raspberry Pi 5 (4GB)",
    description: "Budget: Pi 4 (2GB). Best: Pi 5 (8GB) for multi-service hosting.",
    price_budget: 50,
    price_best: 80,
    url: "https://www.amazon.com/Raspberry-Broadcom-Cortex-A76-Quad-core-Computer/dp/B0CTQ3BQLS",
    project_id: "20000000-0000-4000-8000-000000000006",
    created_at: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000017",
    name: "Samsung EVO 128GB microSD card",
    description: "Budget: 32GB generic. Best: Samsung EVO 128GB for fast read/write and reliability.",
    price_budget: 8,
    price_best: 18,
    url: "https://www.amazon.ca/Samsung-microSDXC-Adapter-MB-ME128KA-AM/dp/B09B1HMJ9Z",
    project_id: "20000000-0000-4000-8000-000000000006",
    created_at: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000018",
    name: "Official Raspberry Pi 27W USB-C power supply",
    description: "5.1V 5A power supply. Critical — underpowered supplies cause crashes.",
    price_budget: 10,
    price_best: 15,
    url: "https://www.amazon.com/Raspberry-USB-C-Power-Supply-Recommended/dp/B0CTYVC8VN",
    project_id: "20000000-0000-4000-8000-000000000006",
    created_at: "2026-03-01T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000019",
    name: "Argon ONE Pi 5 aluminum case with fan",
    description: "Budget: basic plastic case. Best: Argon ONE with passive+active cooling and GPIO access.",
    price_budget: 8,
    price_best: 35,
    url: "https://www.amazon.com/Argon-Raspberry-Aluminum-Passive-Cooling/dp/B0CY62WG9N",
    project_id: "20000000-0000-4000-8000-000000000006",
    created_at: "2026-03-01T12:00:00.000Z",
  },
  // ── NEW: LED Matrix Display ──
  {
    id: "30000000-0000-4000-8000-000000000020",
    name: "MAX7219 LED dot matrix module (4-in-1)",
    description: "Four 8x8 LED matrices daisy-chained. Displays scrolling text, animations, clocks.",
    price_budget: 5,
    price_best: 10,
    url: "https://www.amazon.com/MAX7219-Display-Arduino-Microcontroller-Control/dp/B0BXYSC1CG",
    project_id: "20000000-0000-4000-8000-000000000007",
    created_at: "2026-03-05T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000021",
    name: "Arduino Nano (budget clone)",
    description: "Compact Arduino for space-constrained builds. Budget: clone. Best: official Arduino Nano Every.",
    price_budget: 4,
    price_best: 15,
    url: "https://www.amazon.com/ELEGOO-Arduino-ATmega328P-Without-Compatible/dp/B0713XK923",
    project_id: "20000000-0000-4000-8000-000000000007",
    created_at: "2026-03-05T12:00:00.000Z",
  },
  // ── NEW: Home Network Pi-hole ──
  {
    id: "30000000-0000-4000-8000-000000000022",
    name: "Raspberry Pi Zero 2 W",
    description: "Budget: Pi Zero 2 W ($15). Best: Pi 4 2GB ($45) if running multiple services.",
    price_budget: 15,
    price_best: 45,
    url: "https://www.amazon.com/Raspberry-Zero-Bluetooth-RPi-2W/dp/B09LH5SBPS",
    project_id: "20000000-0000-4000-8000-000000000008",
    created_at: "2026-03-08T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000023",
    name: "32GB microSD card",
    description: "Plenty for Pi-hole. Pre-flash with Raspberry Pi Imager.",
    price_budget: 6,
    price_best: 12,
    url: "https://www.amazon.ca/SanDisk-Ultra-microSDHC-Memory-Adapter/dp/B073JWXGNT",
    project_id: "20000000-0000-4000-8000-000000000008",
    created_at: "2026-03-08T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000024",
    name: "Ethernet adapter for Pi Zero",
    description: "USB OTG Ethernet adapter. Not needed if using Pi 4 (has built-in Ethernet).",
    price_budget: 8,
    price_best: 15,
    url: "https://www.amazon.com/Cable-Matters-Ethernet-Adapter-Supporting/dp/B00ET4KHJ2",
    project_id: "20000000-0000-4000-8000-000000000008",
    created_at: "2026-03-08T12:00:00.000Z",
  },
] as const;

export const projectParts = parts.map((part) => PartSchema.parse(part));

const noteSchema = CommentSchema.extend({
  helpful_count: z.number().int().nonnegative(),
  unhelpful_count: z.number().int().nonnegative(),
  user_profiles: z.object({
    display_name: z.string().nullable(),
    avatar_url: z.string().nullable(),
  }),
});

export type CommunityNote = z.infer<typeof noteSchema>;

const notes: Array<{
  id: string;
  body: string;
  author_id: string;
  target_type: string;
  target_id: string;
  hidden: boolean;
  created_at: string;
  updated_at: string;
  helpful_count: number;
  unhelpful_count: number;
}> = [];

export const communityNotes = notes.map((note) =>
  noteSchema.parse({
    ...note,
    user_profiles: {
      display_name: userMap.get(note.author_id)?.display_name ?? "Unknown",
      avatar_url: userMap.get(note.author_id)?.avatar_url ?? null,
    },
  }),
);

export const moderationReports: Array<z.infer<typeof ReportSchema>> = [];

export const moderationActions: Array<z.infer<typeof ModeratorActionSchema>> = [];

export const officialSources = [
  {
    title: "Ubuntu installation guide",
    url: "https://ubuntu.com/tutorials/install-ubuntu-desktop",
    topic: "linux install",
  },
  {
    title: "Microsoft Windows download",
    url: "https://www.microsoft.com/software-download/windows11",
    topic: "windows install",
  },
  {
    title: "Arduino getting started",
    url: "https://www.arduino.cc/en/Guide",
    topic: "arduino",
  },
  {
    title: "UEFI specifications",
    url: "https://uefi.org/specifications",
    topic: "uefi",
  },
];

export const quickPrompts = [
  "Generate project ideas under $50",
  "Troubleshoot my setup",
  "Recommend parts for my project",
];

export const missionPrinciples = [
  "Backups and rollback paths come before destructive steps.",
  "Every guide and project declares its testing status plainly.",
  "Community notes are evidence-first, not hype-first.",
  "Student projects stay in safer low-voltage territory by default.",
];

export function getAuthorById(authorId: string) {
  return userMap.get(authorId) ?? currentProfile;
}

export function getPartsForProject(projectId: string) {
  return projectParts.filter((part) => part.project_id === projectId);
}

export function getNotesForTarget(targetId: string) {
  return communityNotes.filter((note) => note.target_id === targetId && !note.hidden);
}

export function getProfileNotes(authorId: string) {
  return communityNotes.filter((note) => note.author_id === authorId);
}

export function getReportsForDashboard() {
  return moderationReports.map((report) => ({
    ...report,
    reporter: getAuthorById(report.reporter_id),
  }));
}
