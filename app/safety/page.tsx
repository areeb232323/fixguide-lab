import { Breadcrumbs, WarningCallout } from "@/components/site-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safety Guidelines — FixGuide Lab",
  description: "Important safety information for all FixGuide Lab guides and projects.",
};

export default function SafetyPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Safety" }]} />

      <div className="mx-auto max-w-3xl space-y-10">
        <section>
          <h1 className="text-3xl font-semibold md:text-4xl">Safety Guidelines</h1>
          <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
            Your safety and the safety of your data and hardware come first. Please read
            these guidelines before following any guide or starting any project.
          </p>
        </section>

        <WarningCallout title="Critical" tone="danger">
          Always back up your important data before performing any OS installation,
          partition changes, or BIOS/UEFI modifications. Data loss from these procedures
          can be permanent and unrecoverable.
        </WarningCallout>

        <section>
          <h2 className="text-2xl font-semibold">Tech Support Guides</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--muted)]">
            <h3 className="text-lg font-semibold text-[var(--ink)]">Before You Start</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Back up all important files to an external drive or cloud storage.</li>
              <li>Note your current OS version, drivers, and product keys.</li>
              <li>Ensure your device is plugged in — never perform OS operations on battery.</li>
              <li>Read the entire guide before starting. Understand each step first.</li>
              <li>Check the testing status badge — prefer Community Verified guides.</li>
            </ul>

            <h3 className="text-lg font-semibold text-[var(--ink)]">During the Process</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Follow steps in order. Do not skip steps or jump ahead.</li>
              <li>Pay close attention to warning callouts — they highlight destructive steps.</li>
              <li>If something looks different from the guide, stop and check community notes.</li>
              <li>Never interrupt a firmware update, OS installation, or partition operation.</li>
            </ul>

            <h3 className="text-lg font-semibold text-[var(--ink)]">If Something Goes Wrong</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Do not panic. Most issues have recovery paths.</li>
              <li>Check the troubleshooting section of the guide.</li>
              <li>Review community notes for similar issues.</li>
              <li>If your system won&apos;t boot, refer to the BIOS/UEFI Recovery guide.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Engineering Projects</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--muted)]">
            <h3 className="text-lg font-semibold text-[var(--ink)]">Electrical Safety</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Always disconnect power before modifying circuits.</li>
              <li>Use appropriate voltage levels — most projects use 3.3V or 5V DC only.</li>
              <li>Never work with mains voltage (120V/240V AC) unless explicitly trained.</li>
              <li>Check polarity before connecting power supplies and batteries.</li>
              <li>Use a current-limiting power supply when testing new circuits.</li>
            </ul>

            <h3 className="text-lg font-semibold text-[var(--ink)]">Component Handling</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Use ESD protection when handling sensitive components (ICs, sensors).</li>
              <li>Verify component ratings before substituting parts.</li>
              <li>Double-check wiring against diagrams before powering on.</li>
              <li>Start with the budget parts list to minimize risk while learning.</li>
            </ul>

            <h3 className="text-lg font-semibold text-[var(--ink)]">Supervision</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Students under 14 should work with adult supervision.</li>
              <li>Projects involving soldering require proper ventilation and safety equipment.</li>
              <li>Keep a fire extinguisher accessible when working with batteries or power supplies.</li>
            </ul>
          </div>
        </section>

        <WarningCallout title="Disclaimer" tone="warning">
          FixGuide Lab provides educational content only. We are not responsible for
          damage to hardware, data loss, or injury resulting from following our guides
          or projects. Always exercise your own judgment and seek professional help
          when unsure.
        </WarningCallout>

        <section>
          <h2 className="text-2xl font-semibold">Reporting Safety Issues</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            If you find a safety issue in any guide or project — a missing warning,
            incorrect voltage, or dangerous procedure — please report it immediately
            using the report button on the content page. Safety reports are prioritized
            by our moderation team.
          </p>
        </section>
      </div>
    </div>
  );
}
