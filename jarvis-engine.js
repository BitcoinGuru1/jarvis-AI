const angles = {
  "Problem + solution": [
    "Most founders do not need more options. They need a smaller decision surface.",
    "The problem is rarely effort. It is usually misdirected effort.",
    "A clear weekly constraint beats a vague quarterly ambition."
  ],
  "Founder mistake": [
    "The expensive mistake is solving the loud problem before the important one.",
    "A founder can lose a month optimizing the part of the business nobody values.",
    "Speed without a decision filter turns momentum into noise."
  ],
  "Strategy framework": [
    "Use a three-part filter: customer pain, revenue impact, founder energy.",
    "Before you scale, separate signal from activity.",
    "Good strategy is a weekly operating system, not a slide deck."
  ],
  "Client win teaser": [
    "The win came from narrowing the next move, not adding another tactic.",
    "A sharper offer can change the quality of every sales conversation.",
    "When the founder stopped chasing every lead, the right leads became easier to see."
  ],
  "Direct CTA": [
    "If your business feels busy but unclear, that is a fixable strategy problem.",
    "A focused hour can remove weeks of scattered effort.",
    "You do not need to carry every decision alone."
  ],
  "Engagement question": [
    "What decision is taking up more space than it deserves this week?",
    "Where is your business pretending activity is the same as progress?",
    "Which problem would make everything else easier if solved first?"
  ]
};

const templates = [
  ({ topic, audience, proof, cta, angle }) =>
    `${angle}\n\nFor ${audience}, ${topic} gets easier when the next move is specific enough to act on today.\n\n${proof}\n\n${cta}`,
  ({ topic, proof, cta }) =>
    `A founder stuck on ${topic} usually asks, "What should I do next?"\n\nBetter question:\n"What decision would remove the most drag this week?"\n\n${proof}\n\n${cta}`,
  ({ topic, audience, cta }) =>
    `${capitalize(topic)} is not solved by adding 12 more tactics.\n\nFor ${audience}, the unlock is often one clean priority, one measurable bet, and one honest constraint.\n\n${cta}`,
  ({ topic, proof }) =>
    `Your business is giving you signals about ${topic} every day.\n\nSeparate:\n- noise\n- symptoms\n- the actual constraint\n\n${proof}`
];

function capitalize(value) {
  const text = String(value || "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function normalizePost(text) {
  const compact = String(text || "")
    .replace(/\n\n+/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n /g, "\n")
    .trim();

  if (compact.length <= 276) return compact;

  const tighter = compact
    .replace(/For bootstrapped founders and solo operators, /g, "")
    .replace(/specific enough to act on today/g, "specific enough to act on")
    .replace(/Clarity compounds faster than hustle/g, "Clarity beats hustle")
    .replace(/This is what I help founders solve\./g, "I help founders solve this.");

  if (tighter.length <= 276) return tighter;
  return `${tighter.slice(0, 273).trimEnd()}...`;
}

function scorePost(text, cta) {
  let score = 64;
  if (text.length <= 240) score += 11;
  if (text.length <= 280) score += 8;
  if (/\b(founder|business|strategy|clarity|customer|revenue|decision)\b/i.test(text)) score += 8;
  if (cta !== "No CTA, pure value." && text.includes(cta)) score += 6;
  if (text.includes("?")) score += 4;
  if (text.split("\n").filter(Boolean).length <= 5) score += 3;
  return Math.min(98, score);
}

function createDrafts(brief = {}) {
  const audience = String(brief.audience || "founders").trim() || "founders";
  const topic = String(brief.topic || "decision-making clarity").trim();
  const contentType = String(brief.contentType || "Problem + solution").trim();
  const proof = String(
    brief.proof ||
      "Clarity compounds faster than hustle when the founder knows which problem matters most this week."
  ).trim();
  const cta = String(brief.cta || "If this resonates, let's talk.").trim();
  const tones = Array.isArray(brief.tones) && brief.tones.length ? brief.tones : ["direct", "premium"];
  const pickedAngles = angles[contentType] || angles["Problem + solution"];

  return templates
    .map((template, index) => {
      const selectedCta = index === 3 && contentType !== "Direct CTA" ? "No CTA, pure value." : cta;
      const post = normalizePost(
        template({
          audience,
          topic,
          contentType,
          proof,
          angle: pickedAngles[index % pickedAngles.length],
          cta: selectedCta === "No CTA, pure value." ? "" : selectedCta
        })
      );

      return {
        id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
        post,
        hook: post.split("\n")[0],
        score: scorePost(post, selectedCta),
        chars: post.length,
        tone: tones.join(", "),
        topic,
        contentType,
        createdAt: new Date().toISOString()
      };
    })
    .sort((a, b) => b.score - a.score);
}

module.exports = {
  createDrafts,
  normalizePost,
  scorePost
};
