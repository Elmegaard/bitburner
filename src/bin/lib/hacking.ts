import { NS, Server } from "@ns";
import { Constants } from "/bin/lib/constants";

export class Hacking {
  /**
   * Hack the target server and finish at the given time in ms
   * @param ns
   * @param server The server to run the script on
   * @param target The target to hack
   * @param threads The amount of threads to start
   * @param finishTime Optional the time the script should complete
   * @returns The PID of the process started, 0 if it failed
   */
  hack(
    ns: NS,
    server: Server,
    target: Server,
    threads: number,
    finishTime = 0
  ): number {
    return ns.exec(
      "/bin/lib/remote/hack.js",
      server.hostname,
      threads,
      target.hostname,
      finishTime
    );
  }

  /**
   * Grow the target server and finish at the given time in ms
   * @param ns
   * @param server The server to run the script on
   * @param target The target to grow
   * @param threads The amount of threads to start
   * @param finishTime Optional the time the script should complete
   * @returns The PID of the process started, 0 if it failed
   */
  grow(
    ns: NS,
    server: Server,
    target: Server,
    threads: number,
    finishTime = 0
  ): number {
    return ns.exec(
      "/bin/lib/remote/grow.js",
      server.hostname,
      threads,
      target.hostname,
      finishTime
    );
  }

  /**
   * Weaken the target server and finish at the given time in ms
   * @param ns
   * @param server The server to run the script on
   * @param target The target to weaken
   * @param threads The amount of threads to start
   * @param finishTime Optional the time the script should complete
   * @returns The PID of the process started, 0 if it failed
   */
  weaken(
    ns: NS,
    server: Server,
    target: Server,
    threads: number,
    finishTime = 0
  ): number {
    return ns.exec(
      "/bin/lib/remote/weaken.js",
      server.hostname,
      threads,
      target.hostname,
      finishTime
    );
  }

  /**
   * Nuke the target server
   * @param ns
   * @param target The target server to nuke
   * @returns True if the nuke succeeded
   */
  async nuke(ns: NS, target: Server): Promise<boolean> {
    // If we already have root access, we don't need to nuke
    if (target.hasAdminRights) {
      return false;
    }

    // Not high enough level to nuke
    if (target.requiredHackingSkill > ns.getHackingLevel()) {
      return false;
    }

    // More ports required than we can open
    const portsAvail = this.getPortsAvailable(ns);
    const portsReq = target.numOpenPortsRequired;
    if (portsReq > portsAvail) {
      return false;
    }

    let nuked = false;
    let timeout = 0;
    while (!nuked && timeout < 10) {
      const pid = ns.exec("/bin/lib/remote/nuke.js", target.hostname);

      while (ns.isRunning(pid, target.hostname)) {
        await ns.sleep(Constants.SERVER_DELAY);
      }

      if (ns.hasRootAccess(target.hostname)) {
        nuked = true;
        break;
      }

      timeout++;
    }
    return nuked;
  }

  /**
   * Get the amount of port that is possible to open
   * @param ns
   * @returns The amount of ports possible to open
   */
  getPortsAvailable(ns: NS): number {
    let portsAvail = 0;
    if (ns.fileExists("BruteSSH.exe", "home")) {
      portsAvail++;
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
      portsAvail++;
    }
    if (ns.fileExists("relaySMTP.exe", "home")) {
      portsAvail++;
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
      portsAvail++;
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
      portsAvail++;
    }
    return portsAvail;
  }

  /**
   * Backdoor the target server
   * @param ns
   * @param target The target server to backdoor
   * @returns True if successful
   */
  backdoor(ns: NS, target: Server): boolean {
    if (target.backdoorInstalled) {
      return false;
    }

    if (!target.hasAdminRights) {
      return false;
    }

    // Change this to automatic when available
    let jumpString = "";
    let currentParent = ns.scan(target.hostname)[0];
    while (currentParent !== "home") {
      jumpString = `connect ${currentParent};${jumpString}`;
      currentParent = ns.scan(currentParent)[0];
    }

    const backdoorString = `home;${jumpString} connect ${target.hostname};backdoor`;
    ns.tprint(backdoorString);

    return true;
  }
}
