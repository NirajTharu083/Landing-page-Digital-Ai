import { saveLead } from "@/lib/googleSheets";

export const runtime = "nodejs";

function text(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const lead = {
      id: `DN-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 5).toUpperCase()}`,
      receivedAt: new Date().toISOString(),
      name: text(body.name, 120),
      email: text(body.email, 180).toLowerCase(),
      whatsapp: text(body.whatsapp, 40),
      business: text(body.business, 160),
      url: text(body.url, 300),
      message: text(body.message, 2000),
    };

    if (
      !lead.name ||
      !lead.email ||
      !lead.whatsapp ||
      !lead.business ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)
    ) {
      return Response.json({ error: "Please check the required fields." }, { status: 400 });
    }

    await saveLead(lead);
    return Response.json({ ok: true, id: lead.id });
  } catch (error) {
    console.error(
      "Consultation spreadsheet sync failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    return Response.json({ error: "Unable to save the consultation request." }, { status: 500 });
  }
}
