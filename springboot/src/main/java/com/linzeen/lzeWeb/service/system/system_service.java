package com.linzeen.lzeWeb.service.system;
import com.linzeen.lzeWeb.dto.system.system.*;
import org.springframework.stereotype.Service;
import java.io.File;
import java.util.List;
import oshi.SystemInfo;
import oshi.hardware.CentralProcessor;
import oshi.hardware.GlobalMemory;
import oshi.hardware.NetworkIF;
@Service
public class system_service {
    public send_system sys(){
       send_system sys_data=new send_system();
        float cpuUsage;
        long totalMemory;
        long usedMemory;
        long totalDisk;
        long usedDisk;
        float networkRx;
        float networkTx;
        SystemInfo si = new SystemInfo();
        // cpu
        CentralProcessor processor = si.getHardware().getProcessor();
        long[] prevTicks = processor.getSystemCpuLoadTicks();
        // mem
        GlobalMemory memory = si.getHardware().getMemory();
        totalMemory=memory.getTotal();
        usedMemory=totalMemory-memory.getAvailable();
        totalMemory=totalMemory/1024/1024;
        usedMemory=usedMemory/1024/1024;
        // disk
        File root = File.listRoots()[0];
        totalDisk= root.getTotalSpace();
        usedDisk= totalDisk- root.getUsableSpace();
        totalDisk=totalDisk/1024;
        usedDisk=usedDisk/1024;
        // net
        List<NetworkIF> networkIFs = si.getHardware().getNetworkIFs();
        NetworkIF net = networkIFs.get(0);
        net.updateAttributes();
        long rx1 = net.getBytesRecv();
        long tx1 = net.getBytesSent();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        net.updateAttributes();
        long rx2 = net.getBytesRecv();
        long tx2 = net.getBytesSent();
        networkRx = (float) (rx2-rx1);
        networkTx = (float)    (tx2-tx1);
        // cpu
        cpuUsage = (float)processor.getSystemCpuLoadBetweenTicks(prevTicks);
        cpuUsage=(Math.round(cpuUsage * 100f) / 100f)*100;
        // set data
       sys_data.setCpuUsage(cpuUsage);
       sys_data.setTotalMemory(totalMemory);
        sys_data.setUsedMemory(usedMemory);
        sys_data.setTotalDisk(totalDisk);
        sys_data.setUsedDisk(usedDisk);
        sys_data.setNetworkRx(networkRx);
        sys_data.setNetworkTx(networkTx);
        return sys_data;
    }
}
