import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.nuke(ns.args[0] as string);
}
