import { getDiskInfoSync } from 'node-disk-info';
import os from 'os';

export const SystemInfo = () => {
    return {
        hostname: os.hostname(),
        osType: os.type(),              // 'Linux', 'Darwin', 'Windows_NT'
        platform: os.platform(),        // 'linux', 'win32', 'darwin'
        arch: os.arch(),                // 'x64', 'arm', etc.
        release: os.release(),
        uptime: os.uptime(),
        totalMemory: os.totalmem(),     // in bytes
        freeMemory: os.freemem(),       // in bytes
        cpus: os.cpus(),                // array of CPU info
        disks: getDiskInfoSync()
    };
}
