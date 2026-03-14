// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MDXComponents = Record<string, React.ComponentType<any>>;
import { WarningCallout } from "@/components/site-ui";
import { CodeBlock, ImageGallery, PartsList, StepList } from "@/components/interactive-widgets";
import { slugify } from "@/lib/utils";

function headingText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map((child: React.ReactNode) => headingText(child)).join("");
  if (children && typeof children === "object" && "props" in children) {
    return headingText((children as { props?: { children?: React.ReactNode } }).props?.children);
  }
  return "";
}

export function useMdxComponents(): MDXComponents {
  return {
    h2: ({ children }: { children?: React.ReactNode }) => {
      const text = headingText(children);
      return <h2 id={slugify(text)}>{children}</h2>;
    },
    h3: ({ children }: { children?: React.ReactNode }) => {
      const text = headingText(children);
      return <h3 id={slugify(text)}>{children}</h3>;
    },
    DangerCallout: ({ title, children }: { title: string; children: React.ReactNode }) => (
      <WarningCallout title={title} tone="danger">{children}</WarningCallout>
    ),
    WarningCallout: ({ title, children }: { title: string; children: React.ReactNode }) => (
      <WarningCallout title={title}>{children}</WarningCallout>
    ),
    StepList,
    PartsList,
    ImageGallery,
    pre: ({ children }: { children?: React.ReactNode }) => {
      if (
        children &&
        typeof children === "object" &&
        "props" in children &&
        typeof (children as { props?: { children?: string } }).props?.children === "string"
      ) {
        return <CodeBlock>{(children as { props?: { children?: string } }).props?.children ?? ""}</CodeBlock>;
      }
      return <pre>{children}</pre>;
    },
  };
}
