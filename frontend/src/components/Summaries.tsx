import hljs from "highlight.js";
import { Brain } from "lucide-react";

interface Summary {
  content: string;
  summary: string;
}

interface PageProps {
  summaries: Summary[] | undefined;
}

const Summaries = ({ summaries }: PageProps) => {
  if (!summaries) return;
  // console.log(summaries);
  function formatMessage(text: string) {
    // 1. Handle multi-line code blocks (```)
    text = text.replace(/```([\s\S]+?)```/g, (_match, code) => {
      const firstWordMatch = code.match(/^(\S+)\s+(.*)$/s); // Extract first word before space
      if (!firstWordMatch)
        return `<pre class="code-block"><code>${code}</code></pre>`; // If there's no space, treat it as a single word

      const firstWord = firstWordMatch[1]; // First word before space
      const restOfCode = firstWordMatch[2].trim(); // Trim leading/trailing spaces in the rest
      const highlightedCode = hljs.highlightAuto(restOfCode).value;

      return `<pre class="code-block"><span class="code-lang">${firstWord}</span><code>${highlightedCode}</code></pre>`;
    });

    const regex = /\*\*(.*?)\*\*/g;
    text = text.replace(
      regex,
      (_match, p1) => `<h1 class="code-heading">${p1}</h1>`
    );
    text = text
      .split("\n") // Split the string into lines
      .map((line) => {
        if (line.startsWith("* ")) {
          return `<li>${line.slice(2)}</li>`; // Convert to <li> if it starts with "* "
        }
        return line; // Keep non-list lines unchanged
      })
      .join("\n"); // Join the lines back together

    // Wrap consecutive <li> items in a single <ul>
    text = text.replace(/(<li>.*<\/li>*)+/g, "<ul>$&</ul>");
    text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    return text;
  }

  return (
    <div className="h-full p-2 text-white overflow-y-auto">
      <div className="min-h-[700px] max-h-[700px] overflow-y-auto">
        {summaries.length === 0 ? (
          <h3 className="text-center text-3xl">Nothing to show here!</h3>
        ) : (
          summaries.map((summary, idx) => {
            return (
              <div className="mb-4" key={idx}>
                <div className="ml-auto w-fit mb-2 max-w-3xl bg-white/2 p-3 rounded-xl text-wrap bg-gradient-to-l to-purple-700">
                  <p>{summary.content}</p>
                </div>

                <div className="flex gap-2 items-start">
                  <Brain />
                  <div className="mr-auto w-fit max-w-4xl">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(summary.summary),
                      }}
                    ></p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Summaries;
