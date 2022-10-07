import { NS } from "@ns";
import { Constants } from "/bin/lib/constants";

export async function main(ns: NS): Promise<void> {
  //
  await loop(ns);
}

async function loop(ns: NS): Promise<void> {
  //
  while (true) {
    await ns.sleep(Constants.SERVER_DELAY);
  }
}
