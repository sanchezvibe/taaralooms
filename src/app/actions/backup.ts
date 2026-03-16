"use server";

import fs from "fs";
import path from "path";

export async function syncBackup(products: any[]) {
  try {
    const filePath = path.join(process.cwd(), "backup.json");
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    return { success: true };
  } catch (err) {
    console.error("Failed to sync backup:", err);
    return { success: false };
  }
}
