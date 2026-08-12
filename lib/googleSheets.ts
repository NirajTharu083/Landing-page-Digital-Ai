const SHEET_NAME = "Consultation Leads";

type Lead = {
  id: string;
  receivedAt: string;
  name: string;
  email: string;
  whatsapp: string;
  business: string;
  url: string;
  message: string;
};

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing server configuration: ${name}`);
  return value;
}

function base64Url(value: string | ArrayBuffer) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : new Uint8Array(value);
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function accessToken() {
  const clientEmail = required("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = required("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const signingInput = `${header}.${payload}`;
  const keyData = Uint8Array.from(
    atob(privateKey.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, "")),
    (char) => char.charCodeAt(0),
  );
  const key = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput),
  );
  const assertion = `${signingInput}.${base64Url(signature)}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!response.ok) throw new Error("Google authentication failed.");
  return (await response.json() as { access_token: string }).access_token;
}

async function googleFetch(path: string, token: string, init?: RequestInit) {
  const response = await fetch(`https://sheets.googleapis.com/v4/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error("Google Sheets request failed", response.status, detail.slice(0, 500));
    throw new Error("Unable to save the consultation request.");
  }
  return response.json();
}

async function ensurePremiumLayout(token: string, spreadsheetId: string) {
  const metadata = await googleFetch(
    `spreadsheets/${spreadsheetId}?fields=sheets.properties(sheetId,title)`,
    token,
  ) as { sheets?: Array<{ properties: { sheetId: number; title: string } }> };
  let leadSheet = metadata.sheets?.find((sheet) => sheet.properties.title === SHEET_NAME);

  if (!leadSheet) {
    const created = await googleFetch(`spreadsheets/${spreadsheetId}:batchUpdate`, token, {
      method: "POST",
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: SHEET_NAME, gridProperties: { rowCount: 2000, columnCount: 13, frozenRowCount: 7 } } } }] }),
    }) as { replies: Array<{ addSheet: { properties: { sheetId: number; title: string } } }> };
    leadSheet = { properties: created.replies[0].addSheet.properties };
  }

  const sheetId = leadSheet.properties.sheetId;
  const titleCheck = await googleFetch(
    `spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${SHEET_NAME}!A1`)}?majorDimension=ROWS`,
    token,
  ) as { values?: string[][] };
  if (titleCheck.values?.[0]?.[0] === "DIGITAL NIRAJ — CONSULTATION LEADS") return;

  await googleFetch(`spreadsheets/${spreadsheetId}/values:batchUpdate`, token, {
    method: "POST",
    body: JSON.stringify({
      valueInputOption: "USER_ENTERED",
      data: [
        { range: `${SHEET_NAME}!A1:M2`, values: [["DIGITAL NIRAJ — CONSULTATION LEADS", "", "", "", "", "", "", "", "", "", "", "", ""], ["A clean, live record of every AI marketing consultation request", "", "", "", "", "", "", "", "", "", "", "", ""]] },
        { range: `${SHEET_NAME}!A4:B5`, values: [["TOTAL LEADS", "=COUNTA(A8:A)"], ["NEW LEADS", "=COUNTIF(I8:I,\"New\")"]] },
        { range: `${SHEET_NAME}!D4:E5`, values: [["CONTACTED", "=COUNTIF(I8:I,\"Contacted\")"], ["BOOKED", "=COUNTIF(I8:I,\"Booked\")"]] },
        { range: `${SHEET_NAME}!G4:H5`, values: [["COMPLETED", "=COUNTIF(I8:I,\"Completed\")"], ["EMAIL ISSUES", "=COUNTIF(K8:K,\"<>Sent\")-COUNTBLANK(K8:K)"]] },
        { range: `${SHEET_NAME}!A7:M7`, values: [["Lead ID", "Received At", "Full Name", "Active Email", "WhatsApp Number", "Business Name", "Website / Facebook", "Marketing Challenge", "Status", "Owner Email", "Customer Email", "Source", "Notes"]] },
      ],
    }),
  });

  const brand = { primary: { red: 0.737, green: 0.31, blue: 0.31 }, dark: { red: 0.239, green: 0.141, blue: 0.141 }, cream: { red: 0.953, green: 0.804, blue: 0.592 }, pale: { red: 1, green: 0.98, blue: 0.945 }, white: { red: 1, green: 1, blue: 1 } };
  const requests: unknown[] = [
    { mergeCells: { range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 13 }, mergeType: "MERGE_ALL" } },
    { mergeCells: { range: { sheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 13 }, mergeType: "MERGE_ALL" } },
    { updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 7 }, tabColorStyle: { rgbColor: brand.primary } }, fields: "gridProperties.frozenRowCount,tabColorStyle" } },
    { repeatCell: { range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 13 }, cell: { userEnteredFormat: { backgroundColorStyle: { rgbColor: brand.dark }, textFormat: { foregroundColorStyle: { rgbColor: brand.white }, bold: true, fontSize: 18 }, horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE" } }, fields: "userEnteredFormat" } },
    { repeatCell: { range: { sheetId, startRowIndex: 1, endRowIndex: 2, startColumnIndex: 0, endColumnIndex: 13 }, cell: { userEnteredFormat: { backgroundColorStyle: { rgbColor: brand.dark }, textFormat: { foregroundColorStyle: { rgbColor: brand.cream }, italic: true, fontSize: 10 }, horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE" } }, fields: "userEnteredFormat" } },
    { repeatCell: { range: { sheetId, startRowIndex: 3, endRowIndex: 5, startColumnIndex: 0, endColumnIndex: 8 }, cell: { userEnteredFormat: { backgroundColorStyle: { rgbColor: brand.pale }, textFormat: { foregroundColorStyle: { rgbColor: brand.dark }, bold: true }, verticalAlignment: "MIDDLE", borders: { bottom: { style: "SOLID", colorStyle: { rgbColor: brand.cream } } } } }, fields: "userEnteredFormat" } },
    { repeatCell: { range: { sheetId, startRowIndex: 6, endRowIndex: 7, startColumnIndex: 0, endColumnIndex: 13 }, cell: { userEnteredFormat: { backgroundColorStyle: { rgbColor: brand.primary }, textFormat: { foregroundColorStyle: { rgbColor: brand.white }, bold: true }, horizontalAlignment: "CENTER", verticalAlignment: "MIDDLE", wrapStrategy: "WRAP" } }, fields: "userEnteredFormat" } },
    { repeatCell: { range: { sheetId, startRowIndex: 7, endRowIndex: 2000, startColumnIndex: 0, endColumnIndex: 13 }, cell: { userEnteredFormat: { backgroundColorStyle: { rgbColor: brand.white }, textFormat: { foregroundColorStyle: { rgbColor: brand.dark }, fontSize: 10 }, verticalAlignment: "MIDDLE", wrapStrategy: "WRAP", borders: { bottom: { style: "SOLID", colorStyle: { rgbColor: { red: 0.91, green: 0.86, blue: 0.82 } } } } } }, fields: "userEnteredFormat" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "ROWS", startIndex: 0, endIndex: 1 }, properties: { pixelSize: 42 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "ROWS", startIndex: 1, endIndex: 2 }, properties: { pixelSize: 28 }, fields: "pixelSize" } },
    { updateDimensionProperties: { range: { sheetId, dimension: "ROWS", startIndex: 6, endIndex: 7 }, properties: { pixelSize: 42 }, fields: "pixelSize" } },
    { setBasicFilter: { filter: { range: { sheetId, startRowIndex: 6, endRowIndex: 2000, startColumnIndex: 0, endColumnIndex: 13 } } } },
    { setDataValidation: { range: { sheetId, startRowIndex: 7, endRowIndex: 2000, startColumnIndex: 8, endColumnIndex: 9 }, rule: { condition: { type: "ONE_OF_LIST", values: ["New", "Contacted", "Booked", "Completed", "Not Qualified"].map((userEnteredValue) => ({ userEnteredValue })) }, strict: true, showCustomUi: true } } },
  ];

  [110, 150, 155, 200, 150, 175, 210, 300, 120, 115, 130, 110, 220].forEach((pixelSize, index) => {
    requests.push({ updateDimensionProperties: { range: { sheetId, dimension: "COLUMNS", startIndex: index, endIndex: index + 1 }, properties: { pixelSize }, fields: "pixelSize" } });
  });
  for (const [text, color] of [["New", brand.cream], ["Contacted", { red: 0.85, green: 0.91, blue: 1 }], ["Booked", { red: 0.82, green: 0.94, blue: 0.84 }], ["Completed", { red: 0.72, green: 0.88, blue: 0.74 }]] as const) {
    requests.push({ addConditionalFormatRule: { index: 0, rule: { ranges: [{ sheetId, startRowIndex: 7, endRowIndex: 2000, startColumnIndex: 8, endColumnIndex: 9 }], booleanRule: { condition: { type: "TEXT_EQ", values: [{ userEnteredValue: text }] }, format: { backgroundColorStyle: { rgbColor: color }, textFormat: { bold: true, foregroundColorStyle: { rgbColor: brand.dark } } } } } } });
  }
  await googleFetch(`spreadsheets/${spreadsheetId}:batchUpdate`, token, { method: "POST", body: JSON.stringify({ requests }) });
}

export async function saveLead(lead: Lead, emailStatus: { owner: string; customer: string }) {
  const spreadsheetId = required("GOOGLE_SHEET_ID");
  const token = await accessToken();
  await ensurePremiumLayout(token, spreadsheetId);
  const result = await googleFetch(
    `spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${SHEET_NAME}!A8:M`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&includeValuesInResponse=false`,
    token,
    {
      method: "POST",
      body: JSON.stringify({ values: [[lead.id, lead.receivedAt, lead.name, lead.email, lead.whatsapp, lead.business, lead.url, lead.message, "New", emailStatus.owner, emailStatus.customer, "Landing Page", ""]] }),
    },
  ) as { updates?: { updatedRange?: string } };
  return result.updates?.updatedRange;
}

export async function updateEmailStatus(updatedRange: string, owner: string, customer: string) {
  const spreadsheetId = required("GOOGLE_SHEET_ID");
  const row = updatedRange.match(/!(?:[A-Z]+)(\d+):/)?.[1];
  if (!row) return;
  const token = await accessToken();
  await googleFetch(`spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${SHEET_NAME}!J${row}:K${row}`)}?valueInputOption=RAW`, token, {
    method: "PUT",
    body: JSON.stringify({ values: [[owner, customer]] }),
  });
}
