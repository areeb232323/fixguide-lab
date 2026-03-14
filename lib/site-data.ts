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
  {
    id: "30000000-0000-4000-8000-000000000001",
    name: "Arduino Uno-compatible board",
    description: "Entry-level microcontroller board for quick sensor experiments.",
    price_budget: 8,
    price_best: 24,
    url: null,
    project_id: "20000000-0000-4000-8000-000000000001",
    created_at: "2026-02-04T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    name: "DHT11 sensor",
    description: "Low-cost humidity and temperature sensor for beginners.",
    price_budget: 2,
    price_best: 6,
    url: null,
    project_id: "20000000-0000-4000-8000-000000000001",
    created_at: "2026-02-04T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    name: "Breadboard and jumper bundle",
    description: "Reusable prototyping platform with color-coded wires.",
    price_budget: 4,
    price_best: 12,
    url: null,
    project_id: "20000000-0000-4000-8000-000000000001",
    created_at: "2026-02-04T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000004",
    name: "Capacitive moisture probe",
    description: "Longer-lasting soil probe that resists corrosion.",
    price_budget: 4,
    price_best: 9,
    url: null,
    project_id: "20000000-0000-4000-8000-000000000002",
    created_at: "2026-02-05T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000005",
    name: "5V relay module",
    description: "Isolates the microcontroller from the pump circuit.",
    price_budget: 2,
    price_best: 5,
    url: null,
    project_id: "20000000-0000-4000-8000-000000000002",
    created_at: "2026-02-05T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000006",
    name: "Mini water pump",
    description: "Low-voltage pump suitable for controlled watering demos.",
    price_budget: 4,
    price_best: 9,
    url: null,
    project_id: "20000000-0000-4000-8000-000000000002",
    created_at: "2026-02-05T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000007",
    name: "2WD robot chassis kit",
    description: "Base frame with wheels and motor mounts.",
    price_budget: 8,
    price_best: 18,
    url: null,
    project_id: "20000000-0000-4000-8000-000000000003",
    created_at: "2026-02-09T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000008",
    name: "Ultrasonic distance sensor",
    description: "Obstacle detection sensor for mobile robots.",
    price_budget: 2,
    price_best: 6,
    url: null,
    project_id: "20000000-0000-4000-8000-000000000003",
    created_at: "2026-02-09T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000009",
    name: "L298N motor driver",
    description: "Dual H-bridge driver board for small DC motors.",
    price_budget: 4,
    price_best: 8,
    url: null,
    project_id: "20000000-0000-4000-8000-000000000003",
    created_at: "2026-02-09T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000010",
    name: "ESP32 dev board",
    description: "Wi-Fi-enabled board for lightweight telemetry projects.",
    price_budget: 7,
    price_best: 14,
    url: null,
    project_id: "20000000-0000-4000-8000-000000000004",
    created_at: "2026-02-14T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000011",
    name: "BME280 sensor",
    description: "More accurate environmental sensor for pressure, humidity, and temperature.",
    price_budget: 5,
    price_best: 11,
    url: null,
    project_id: "20000000-0000-4000-8000-000000000004",
    created_at: "2026-02-14T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000012",
    name: "Mini solar panel",
    description: "5V trickle source for daylight-only charging demos.",
    price_budget: 8,
    price_best: 15,
    url: null,
    project_id: "20000000-0000-4000-8000-000000000004",
    created_at: "2026-02-14T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000013",
    name: "Magnetic reed switch",
    description: "Simple contact sensor for doors and lids.",
    price_budget: 1,
    price_best: 4,
    url: null,
    project_id: "20000000-0000-4000-8000-000000000005",
    created_at: "2026-02-18T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000014",
    name: "Piezo buzzer",
    description: "Low-power audible alert for state changes.",
    price_budget: 1,
    price_best: 3,
    url: null,
    project_id: "20000000-0000-4000-8000-000000000005",
    created_at: "2026-02-18T12:00:00.000Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000015",
    name: "2xAA battery holder",
    description: "Safer low-voltage power source for student bench testing.",
    price_budget: 2,
    price_best: 5,
    url: null,
    project_id: "20000000-0000-4000-8000-000000000005",
    created_at: "2026-02-18T12:00:00.000Z",
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

const notes = [
  {
    id: "40000000-0000-4000-8000-000000000001",
    body: "This migration flow worked on my older ThinkPad. Exporting SSH keys saved me a second trip through setup.",
    author_id: "00000000-0000-4000-8000-000000000004",
    target_type: "guide",
    target_id: "10000000-0000-4000-8000-000000000001",
    hidden: false,
    created_at: "2026-03-03T18:00:00.000Z",
    updated_at: "2026-03-03T18:00:00.000Z",
    helpful_count: 12,
    unhelpful_count: 1,
  },
  {
    id: "40000000-0000-4000-8000-000000000002",
    body: "Boot-repair from a live USB restored GRUB after my first dual-boot attempt. I added that to my own notes.",
    author_id: "00000000-0000-4000-8000-000000000004",
    target_type: "guide",
    target_id: "10000000-0000-4000-8000-000000000002",
    hidden: false,
    created_at: "2026-03-04T18:00:00.000Z",
    updated_at: "2026-03-04T18:00:00.000Z",
    helpful_count: 7,
    unhelpful_count: 0,
  },
  {
    id: "40000000-0000-4000-8000-000000000003",
    body: "I had to keep one offline NIC driver on a second USB drive before reinstalling Windows on a lab desktop.",
    author_id: "00000000-0000-4000-8000-000000000002",
    target_type: "guide",
    target_id: "10000000-0000-4000-8000-000000000005",
    hidden: false,
    created_at: "2026-03-06T18:00:00.000Z",
    updated_at: "2026-03-06T18:00:00.000Z",
    helpful_count: 9,
    unhelpful_count: 0,
  },
  {
    id: "40000000-0000-4000-8000-000000000004",
    body: "Using a clone DHT11 still worked for our classroom demo, but we had to slow the sampling interval to two seconds.",
    author_id: "00000000-0000-4000-8000-000000000004",
    target_type: "project",
    target_id: "20000000-0000-4000-8000-000000000001",
    hidden: false,
    created_at: "2026-03-01T18:00:00.000Z",
    updated_at: "2026-03-01T18:00:00.000Z",
    helpful_count: 16,
    unhelpful_count: 1,
  },
  {
    id: "40000000-0000-4000-8000-000000000005",
    body: "A capacitive probe lasts much longer than the cheap resistive stick sensors. Worth the tiny price bump.",
    author_id: "00000000-0000-4000-8000-000000000002",
    target_type: "project",
    target_id: "20000000-0000-4000-8000-000000000002",
    hidden: false,
    created_at: "2026-03-05T18:00:00.000Z",
    updated_at: "2026-03-05T18:00:00.000Z",
    helpful_count: 11,
    unhelpful_count: 0,
  },
  {
    id: "40000000-0000-4000-8000-000000000006",
    body: "The L298N got warm but stayed within spec on our small motors. A heatsink helped when we let the robot run for twenty minutes straight.",
    author_id: "00000000-0000-4000-8000-000000000004",
    target_type: "project",
    target_id: "20000000-0000-4000-8000-000000000003",
    hidden: false,
    created_at: "2026-03-07T18:00:00.000Z",
    updated_at: "2026-03-07T18:00:00.000Z",
    helpful_count: 5,
    unhelpful_count: 2,
  },
  {
    id: "40000000-0000-4000-8000-000000000007",
    body: "Our weather station brown-out problem disappeared once we added a capacitor between 5V and GND on the display rail.",
    author_id: "00000000-0000-4000-8000-000000000001",
    target_type: "project",
    target_id: "20000000-0000-4000-8000-000000000004",
    hidden: false,
    created_at: "2026-03-08T18:00:00.000Z",
    updated_at: "2026-03-08T18:00:00.000Z",
    helpful_count: 8,
    unhelpful_count: 0,
  },
  {
    id: "40000000-0000-4000-8000-000000000008",
    body: "The reed switch project is a good first soldering exercise as long as you keep it battery-only and verify polarity before closing the case.",
    author_id: "00000000-0000-4000-8000-000000000003",
    target_type: "project",
    target_id: "20000000-0000-4000-8000-000000000005",
    hidden: false,
    created_at: "2026-03-09T18:00:00.000Z",
    updated_at: "2026-03-09T18:00:00.000Z",
    helpful_count: 6,
    unhelpful_count: 0,
  },
] as const;

export const communityNotes = notes.map((note) =>
  noteSchema.parse({
    ...note,
    user_profiles: {
      display_name: userMap.get(note.author_id)?.display_name ?? "Unknown",
      avatar_url: userMap.get(note.author_id)?.avatar_url ?? null,
    },
  }),
);

const reports = [
  {
    id: "50000000-0000-4000-8000-000000000001",
    reporter_id: "00000000-0000-4000-8000-000000000004",
    target_type: "comment",
    target_id: "40000000-0000-4000-8000-000000000006",
    reason: "inaccurate",
    details: "The motor driver note needs clearer context about load and airflow. It reads more absolute than the bench data suggests.",
    status: "pending",
    created_at: "2026-03-10T12:00:00.000Z",
    updated_at: "2026-03-10T12:00:00.000Z",
  },
  {
    id: "50000000-0000-4000-8000-000000000002",
    reporter_id: "00000000-0000-4000-8000-000000000004",
    target_type: "guide",
    target_id: "10000000-0000-4000-8000-000000000004",
    reason: "unsafe",
    details: "Please add a stronger warning that BIOS resets can break classroom-managed boot policies on shared machines.",
    status: "reviewing",
    created_at: "2026-03-11T12:00:00.000Z",
    updated_at: "2026-03-12T12:00:00.000Z",
  },
  {
    id: "50000000-0000-4000-8000-000000000003",
    reporter_id: "00000000-0000-4000-8000-000000000002",
    target_type: "project",
    target_id: "20000000-0000-4000-8000-000000000004",
    reason: "other",
    details: "Needs an extra weatherproofing note before we promote it on the home page.",
    status: "pending",
    created_at: "2026-03-12T12:00:00.000Z",
    updated_at: "2026-03-12T12:00:00.000Z",
  },
] as const;

export const moderationReports = reports.map((report) => ReportSchema.parse(report));

export const moderationActions = [
  ModeratorActionSchema.parse({
    id: "60000000-0000-4000-8000-000000000001",
    moderator_id: "00000000-0000-4000-8000-000000000003",
    report_id: "50000000-0000-4000-8000-000000000002",
    action_type: "edit_content",
    target_type: "guide",
    target_id: "10000000-0000-4000-8000-000000000004",
    reason: "Requested stronger BIOS-change warning and a reversible rollback step.",
    created_at: "2026-03-12T17:00:00.000Z",
  }),
];

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
