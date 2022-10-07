import { NS } from "@ns";
import { Utility } from "/bin/lib/utility";

export async function main(ns: NS): Promise<void> {
  if (ns.args.length > 0 && ns.args[1] > 0) {
    const time = Utility.getCurrentTime();
    const sleepTime = Math.max((ns.args[1] as number) - time, 0);
    await ns.sleep(sleepTime);
  }

  await ns.weaken(ns.args[0] as string);
}
