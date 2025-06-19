package com.linzeen.lzeWeb.dto.system.system;

public class send_system {
    private float cpuUsage;
    private long totalMemory;
    private long usedMemory;
    private long totalDisk;
    private long usedDisk;
    private float networkRx;
    private float networkTx;

    public float getCpuUsage() {
        return cpuUsage;
    }

    public void setCpuUsage(float cpuUsage) {
        this.cpuUsage = cpuUsage;
    }

    public long getTotalMemory() {
        return totalMemory;
    }

    public void setTotalMemory(long totalMemory) {
        this.totalMemory = totalMemory;
    }

    public long getUsedMemory() {
        return usedMemory;
    }

    public void setUsedMemory(long usedMemory) {
        this.usedMemory = usedMemory;
    }

    public long getTotalDisk() {
        return totalDisk;
    }

    public void setTotalDisk(long totalDisk) {
        this.totalDisk = totalDisk;
    }

    public long getUsedDisk() {
        return usedDisk;
    }

    public void setUsedDisk(long usedDisk) {
        this.usedDisk = usedDisk;
    }

    public float getNetworkRx() {
        return networkRx;
    }

    public void setNetworkRx(float networkRx) {
        this.networkRx = networkRx;
    }

    public float getNetworkTx() {
        return networkTx;
    }

    public void setNetworkTx(float networkTx) {
        this.networkTx = networkTx;
    }
}
