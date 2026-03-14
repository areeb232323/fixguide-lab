import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { useMdxComponents } from "@/components/mdx-components";

interface MdxRendererProps {
  source: string;
}

export function MdxRenderer({ source }: MdxRendererProps) {
  return (
    <div className="content-prose">
      <MDXRemote
        source={source}
        components={useMdxComponents()}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </div>
  );
}
