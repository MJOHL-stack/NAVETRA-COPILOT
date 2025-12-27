export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

  const workflowId = "wf_694ea47966c88190b2340f88414443b60366b1386dcfa02a";

  // basic “user” identity (can be improved later)
  const user = req.body?.user || "purplewins-web";

  const r = await fetch("https://api.openai.com/v1/chatkit/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "OpenAI-Beta": "chatkit_beta=v1",
    },
    body: JSON.stringify({
      user,
      workflow: { id: workflowId },
    }),
  });

  const data = await r.json();
  if (!r.ok) return res.status(r.status).json(data);

  // data.client_secret is what your frontend needs
  return res.status(200).json({ client_secret: data.client_secret });
}
