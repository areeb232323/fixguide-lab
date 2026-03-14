-- FixGuide Lab: Seed Data
-- NOTE: In production, user_profiles are created via the auth trigger.
-- For seed data, we insert directly (assumes matching auth.users rows exist in dev).

-- ============================================================
-- SAMPLE USERS (IDs must match Supabase Auth dev users if testing auth)
-- ============================================================

INSERT INTO user_profiles (id, email, display_name, role) VALUES
  ('00000000-0000-4000-8000-000000000001', 'alice@fixguide.dev', 'Alice Chen', 'admin'),
  ('00000000-0000-4000-8000-000000000002', 'bob@fixguide.dev', 'Bob Martinez', 'contributor'),
  ('00000000-0000-4000-8000-000000000003', 'carol@fixguide.dev', 'Carol Davis', 'moderator'),
  ('00000000-0000-4000-8000-000000000004', 'dave@fixguide.dev', 'Dave Kim', 'user')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- GUIDES
-- ============================================================

INSERT INTO guides (id, slug, title, summary, content_markdown, difficulty, time_estimate_minutes, os, tags, testing_status, author_id, published) VALUES
(
  '10000000-0000-4000-8000-000000000001',
  'windows-to-linux-migration',
  'Windows to Linux Migration Guide',
  'Step-by-step guide for migrating from Windows to Linux, with backup procedures and common pitfalls.',
  E'# Windows to Linux Migration\n\n## Pre-flight Checklist\n- [ ] Back up ALL data to an external drive\n- [ ] Note all installed applications\n- [ ] Export browser bookmarks\n- [ ] Save Wi-Fi passwords\n\n## Warning\n> **DATA LOSS RISK**: This process will erase your Windows partition if you choose a full install. Always back up first.\n\n## Steps\n1. Download your chosen Linux distribution ISO\n2. Create a bootable USB with Rufus or Balena Etcher\n3. Boot from USB (change boot order in BIOS/UEFI)\n4. Follow the installer — choose "Erase disk" or "Install alongside" carefully\n5. Install drivers and updates\n6. Restore your data from backup\n\n## Common Mistakes\n- Not backing up before install\n- Choosing wrong partition\n- Skipping driver installation\n\n## Verification\n- [ ] System boots to Linux\n- [ ] Wi-Fi works\n- [ ] All files restored from backup',
  'Intermediate', 120, 'Linux',
  ARRAY['migration', 'linux', 'windows', 'os-install'],
  'InternallyTested',
  '00000000-0000-4000-8000-000000000001',
  true
),
(
  '10000000-0000-4000-8000-000000000002',
  'dual-boot-uefi-setup',
  'Dual Boot Setup with UEFI',
  'How to set up a Windows + Linux dual boot on a UEFI system safely.',
  E'# Dual Boot (UEFI)\n\n## Pre-flight Checklist\n- [ ] Back up all data\n- [ ] Confirm UEFI mode (not Legacy/CSM)\n- [ ] Have both OS installers ready\n- [ ] At least 50GB free for second OS\n\n## Warning\n> **DISK PARTITIONING**: Incorrect partitioning can destroy all data. Triple-check partition selections.\n\n## Steps\n1. Disable Secure Boot temporarily in UEFI settings\n2. Shrink Windows partition using Disk Management\n3. Boot Linux installer from USB\n4. Choose "Install alongside Windows"\n5. Select the free space — do NOT format the Windows partition\n6. Complete install and reboot\n7. GRUB should show both OS options\n\n## Recovery\nIf GRUB is missing: boot from USB, open terminal, run `sudo update-grub`.',
  'Advanced', 90, 'Any',
  ARRAY['dual-boot', 'uefi', 'linux', 'windows'],
  'InternallyTested',
  '00000000-0000-4000-8000-000000000001',
  true
),
(
  '10000000-0000-4000-8000-000000000003',
  'linux-to-windows-migration',
  'Linux to Windows Migration Guide',
  'Migrating from Linux back to Windows, including driver preparation and data backup.',
  E'# Linux to Windows Migration\n\n## Pre-flight Checklist\n- [ ] Back up home directory\n- [ ] Export application configs\n- [ ] Download Windows ISO from Microsoft\n- [ ] Have product key ready\n\n## Steps\n1. Create a bootable Windows USB (use another computer if needed)\n2. Back up /home and any server configs\n3. Boot from Windows USB\n4. Install Windows — it will overwrite Linux\n5. Install drivers from manufacturer website\n6. Restore your files\n\n## Common Mistakes\n- Forgetting to back up hidden config files (dotfiles)\n- Not having network drivers ready offline',
  'Intermediate', 90, 'Windows',
  ARRAY['migration', 'windows', 'linux', 'os-install'],
  'Draft',
  '00000000-0000-4000-8000-000000000002',
  true
);

-- ============================================================
-- PROJECTS
-- ============================================================

INSERT INTO projects (id, slug, title, summary, content_markdown, difficulty, time_estimate_minutes, cost_range_min, cost_range_max, tags, testing_status, author_id, published) VALUES
(
  '20000000-0000-4000-8000-000000000001',
  'arduino-temperature-monitor',
  'Arduino Temperature Monitor',
  'Build a simple temperature and humidity monitor with an Arduino and DHT11 sensor.',
  E'# Arduino Temperature Monitor\n\n## Parts Needed\nSee parts list below.\n\n## Wiring\n- DHT11 VCC → Arduino 5V\n- DHT11 GND → Arduino GND\n- DHT11 DATA → Arduino Pin 2 (with 10kΩ pull-up resistor)\n\n## Code\n```cpp\n#include <DHT.h>\n#define DHTPIN 2\nDHT dht(DHTPIN, DHT11);\nvoid setup() { Serial.begin(9600); dht.begin(); }\nvoid loop() {\n  float t = dht.readTemperature();\n  float h = dht.readHumidity();\n  Serial.print(\"Temp: \"); Serial.print(t); Serial.print(\"C  Humidity: \"); Serial.println(h);\n  delay(2000);\n}\n```\n\n## Safety\n- No high voltage involved\n- Handle components with care to avoid static damage\n\n## Test Procedure\n- Upload code, open Serial Monitor at 9600 baud\n- Breathe on sensor — humidity should increase',
  'Beginner', 60, 10, 25,
  ARRAY['arduino', 'sensor', 'temperature', 'beginner'],
  'CommunityVerified',
  '00000000-0000-4000-8000-000000000002',
  true
),
(
  '20000000-0000-4000-8000-000000000002',
  'smart-plant-watering',
  'Smart Plant Watering System',
  'Automatic plant watering system using Arduino and a soil moisture sensor.',
  E'# Smart Plant Watering System\n\n## How It Works\nA soil moisture sensor detects when the soil is dry and activates a small water pump.\n\n## Safety Warning\n> **WATER + ELECTRONICS**: Keep the pump and wiring away from water splashes. Use a relay module rated for your pump.\n\n## Steps\n1. Connect soil moisture sensor to analog pin A0\n2. Connect relay module to digital pin 7\n3. Connect water pump through relay\n4. Upload code that reads moisture level and triggers pump when dry\n\n## Test Procedure\n- Insert sensor in dry soil → pump should activate\n- Insert sensor in wet soil → pump should stop',
  'Intermediate', 120, 20, 45,
  ARRAY['arduino', 'automation', 'plants', 'sensor'],
  'InternallyTested',
  '00000000-0000-4000-8000-000000000002',
  true
),
(
  '20000000-0000-4000-8000-000000000003',
  'budget-robot-starter',
  'Budget Robotics Starter Kit',
  'Build a basic obstacle-avoiding robot for under $30.',
  E'# Budget Robot Starter\n\n## Parts\nSee parts list below.\n\n## Assembly\n1. Mount motors to chassis\n2. Attach wheels\n3. Wire motor driver (L298N) to Arduino\n4. Mount ultrasonic sensor on front\n5. Upload obstacle avoidance code\n\n## The Science\nThe ultrasonic sensor sends sound pulses and measures the time for echoes to return, calculating distance.\n\n## Troubleshooting\n- Robot spins in circles → check motor wiring polarity\n- Sensor always reads 0 → check trigger/echo pin connections',
  'Beginner', 180, 15, 30,
  ARRAY['robotics', 'arduino', 'beginner', 'budget'],
  'Draft',
  '00000000-0000-4000-8000-000000000001',
  true
);

-- ============================================================
-- PARTS
-- ============================================================

INSERT INTO parts (id, name, description, price_budget, price_best, url, project_id) VALUES
('30000000-0000-4000-8000-000000000001', 'Arduino Uno R3', 'Microcontroller board', 8.00, 25.00, NULL, '20000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000002', 'DHT11 Sensor', 'Temperature and humidity sensor', 1.50, 5.00, NULL, '20000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000003', 'Breadboard + Jumper Wires', 'Prototyping supplies', 2.00, 8.00, NULL, '20000000-0000-4000-8000-000000000001'),
('30000000-0000-4000-8000-000000000004', 'Soil Moisture Sensor', 'Capacitive soil moisture sensor', 2.00, 6.00, NULL, '20000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000005', 'Relay Module', '5V single-channel relay', 1.50, 4.00, NULL, '20000000-0000-4000-8000-000000000002'),
('30000000-0000-4000-8000-000000000006', 'Mini Water Pump', '3-6V submersible pump', 2.50, 6.00, NULL, '20000000-0000-4000-8000-000000000002');

-- ============================================================
-- COMMENTS / NOTES
-- ============================================================

INSERT INTO comments (id, body, author_id, target_type, target_id) VALUES
('40000000-0000-4000-8000-000000000001', 'This guide saved me when I migrated my laptop. One tip: make sure to also export your SSH keys!', '00000000-0000-4000-8000-000000000004', 'guide', '10000000-0000-4000-8000-000000000001'),
('40000000-0000-4000-8000-000000000002', 'I had trouble with GRUB not showing up. Fixed it by running boot-repair from a live USB.', '00000000-0000-4000-8000-000000000004', 'guide', '10000000-0000-4000-8000-000000000002'),
('40000000-0000-4000-8000-000000000003', 'Used a clone DHT11 and it worked fine. Great beginner project!', '00000000-0000-4000-8000-000000000004', 'project', '20000000-0000-4000-8000-000000000001'),
('40000000-0000-4000-8000-000000000004', 'Tip: use a capacitive moisture sensor instead of resistive — lasts much longer.', '00000000-0000-4000-8000-000000000002', 'project', '20000000-0000-4000-8000-000000000002'),
('40000000-0000-4000-8000-000000000005', 'The L298N motor driver gets hot. Consider adding a small heatsink.', '00000000-0000-4000-8000-000000000004', 'project', '20000000-0000-4000-8000-000000000003'),
('40000000-0000-4000-8000-000000000006', 'Can someone verify this works on Ubuntu 24.04? I tested on 22.04 only.', '00000000-0000-4000-8000-000000000002', 'guide', '10000000-0000-4000-8000-000000000001');

-- ============================================================
-- REPORTS
-- ============================================================

INSERT INTO reports (id, reporter_id, target_type, target_id, reason, details, status) VALUES
('50000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000004', 'comment', '40000000-0000-4000-8000-000000000005', 'inaccurate', 'The L298N does not actually overheat at normal loads. This advice could cause unnecessary purchases.', 'pending'),
('50000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000004', 'guide', '10000000-0000-4000-8000-000000000003', 'inaccurate', 'Step 3 does not mention that Secure Boot must be disabled first on some systems.', 'pending');

-- ============================================================
-- OFFICIAL SOURCES
-- ============================================================

INSERT INTO official_sources (title, url, topic) VALUES
('Ubuntu Installation Guide', 'https://ubuntu.com/tutorials/install-ubuntu-desktop', 'linux-install'),
('Microsoft Windows Download', 'https://www.microsoft.com/software-download/windows11', 'windows-install'),
('Arduino Getting Started', 'https://www.arduino.cc/en/Guide', 'arduino'),
('UEFI Specification', 'https://uefi.org/specifications', 'uefi');
