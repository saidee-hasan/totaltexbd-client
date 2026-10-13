import { NextResponse } from 'next/server';
import JSZip from 'jszip';

const MAX_SKUS = 200;
const MAX_SKU_LENGTH = 64;

// Escapes a value for safe inclusion in a CSV cell: wraps in quotes and doubles
// embedded quotes. Also neutralises spreadsheet formula injection by prefixing
// values that start with =, +, -, @, tab or CR with an apostrophe.
const csvCell = (value: string): string => {
  let v = value.replace(/"/g, '""');
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return `"${v}"`;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { skus } = body;

    if (!skus || !Array.isArray(skus)) {
      return NextResponse.json({ error: 'Invalid request. Expected array of SKUs.' }, { status: 400 });
    }

    const cleanedSkus = skus
      .filter((sku): sku is string => typeof sku === 'string')
      .map((sku) => sku.trim())
      .filter(Boolean)
      .slice(0, MAX_SKUS)
      .map((sku) => sku.slice(0, MAX_SKU_LENGTH));

    if (cleanedSkus.length === 0) {
      return NextResponse.json({ error: 'At least one valid SKU string is required.' }, { status: 400 });
    }

    const zip = new JSZip();

    // 1. Generate Shopify CSV
    // Headers: Handle, Title, Body (HTML), Vendor, Type, Tags, Published, Option1 Name, Option1 Value, Variant SKU, Variant Inventory Qty, Variant Price
    let csvContent = "Handle,Title,Body (HTML),Vendor,Type,Tags,Published,Option1 Name,Option1 Value,Variant SKU,Variant Inventory Qty,Variant Price\n";
    cleanedSkus.forEach((sku) => {
      const handle = sku.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const title = `Premium Heavyweight Hoodie (${sku})`;
      const desc = `<p>Elevate your streetwear collection with this premium heavyweight blank.</p>`;
      csvContent += `${csvCell(handle)},${csvCell(title)},${csvCell(desc)},${csvCell('Total Apparel')},${csvCell('Hoodie')},${csvCell('streetwear, blank, heavyweight')},TRUE,${csvCell('Size')},${csvCell('L')},${csvCell(sku)},50,65.00\n`;
    });
    zip.file("shopify_import.csv", csvContent);

    // 2. Generate AI-style descriptions
    let aiContent = "=== Product Descriptions ===\n\n";
    cleanedSkus.forEach((sku) => {
      aiContent += `SKU: ${sku}\n`;
      aiContent += `Meta Title: Buy Premium ${sku} Blank Hoodie Online\n`;
      aiContent += `Meta Description: Shop the ultimate heavyweight blank hoodie. Perfect for streetwear brands and custom printing. 400 GSM luxury fleece. Order ${sku} today.\n\n`;
    });
    zip.file("ai_descriptions.txt", aiContent);

    // 3. Generate social captions
    let socialContent = "=== Social Media Captions & Hashtags ===\n\n";
    cleanedSkus.forEach((sku) => {
      socialContent += `SKU: ${sku}\n`;
      socialContent += `Caption 1: The foundation of a great fit starts here. Our new heavyweight blanks have arrived. Tap to shop the ${sku} collection.\n`;
      socialContent += `Caption 2: No branding. No compromise. Just pure quality. Grab the ${sku} before it's gone.\n`;
      socialContent += `Hashtags: #streetwear #blankhoodie #apparel #customclothing #fashion\n\n`;
    });
    zip.file("social_captions.txt", socialContent);

    // Generate zip blob buffer
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // Return the file response
    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="marketing_kit.zip"'
      }
    });

  } catch (error) {
    console.error("Marketing Kit Generation Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
