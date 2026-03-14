/**
 * AI Safety Gate — checks user messages for risk scenarios
 * and generates appropriate warnings.
 */

interface SafetyCheckResult {
  blocked: boolean;
  warnings: string[];
}

const RISK_PATTERNS: Array<{
  pattern: RegExp;
  warning: string;
  requiresAcknowledgement: boolean;
}> = [
  {
    pattern: /\b(reinstall|wipe|erase|format)\b.*\b(os|windows|linux|mac|disk|drive|partition)\b/i,
    warning:
      "This involves OS reinstallation or disk formatting. BACK UP ALL DATA before proceeding. Data loss is likely if you skip this step.",
    requiresAcknowledgement: true,
  },
  {
    pattern: /\b(partition|repartition|shrink|extend)\b.*\b(disk|drive|volume|ssd|hdd)\b/i,
    warning:
      "Disk partitioning can permanently destroy data if done incorrectly. Create a full backup first and verify you are selecting the correct partition.",
    requiresAcknowledgement: true,
  },
  {
    pattern: /\b(bios|uefi|firmware|cmos)\b.*\b(flash|update|change|modify|reset)\b|\b(flash|update|change|modify|reset)\b.*\b(bios|uefi|firmware|cmos)\b/i,
    warning:
      "Modifying BIOS/UEFI firmware can brick your device if interrupted or done incorrectly. Ensure stable power and follow manufacturer instructions exactly.",
    requiresAcknowledgement: true,
  },
  {
    pattern: /\b(dual.?boot|grub|boot.?loader|mbr|gpt)\b/i,
    warning:
      "Boot loader changes can make your system unbootable. Have a recovery USB ready before proceeding.",
    requiresAcknowledgement: false,
  },
  {
    pattern: /\b(solder|wir(e|ing)|high.?voltage|mains|ac.?power|battery|lipo)\b/i,
    warning:
      "This involves electrical components. Follow proper safety precautions: disconnect power before wiring, use appropriate voltage levels, and never work with mains electricity unless qualified.",
    requiresAcknowledgement: false,
  },
  {
    pattern: /\b(crack|pirate|keygen|bypass|license.?key|activation.?hack|serial.?number)\b/i,
    warning:
      "I cannot provide assistance with bypassing software licensing or security protections. This violates our safety policy.",
    requiresAcknowledgement: false,
  },
  {
    pattern: /\b(malware|virus|trojan|keylogger|exploit|backdoor)\b/i,
    warning:
      "I cannot assist with creating or deploying malicious software.",
    requiresAcknowledgement: false,
  },
];

const BLOCKED_PATTERNS = [
  /\b(crack|pirate|keygen|bypass|license.?key|activation.?hack)\b/i,
  /\b(create|write|build|make)\b.*\b(malware|virus|trojan|keylogger|exploit|backdoor)\b/i,
];

export function checkSafety(message: string): SafetyCheckResult {
  const warnings: string[] = [];
  let blocked = false;

  // Check for blocked patterns (refuse to answer)
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(message)) {
      blocked = true;
    }
  }

  // Check for risk patterns (warn but allow)
  for (const { pattern, warning } of RISK_PATTERNS) {
    if (pattern.test(message)) {
      warnings.push(warning);
    }
  }

  // Deduplicate warnings
  const uniqueWarnings = [...new Set(warnings)];

  return { blocked, warnings: uniqueWarnings };
}
