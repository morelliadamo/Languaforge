package com.tengelyhatalmak.languaforge.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Enumeration;

@Entity
@Table(name = "login")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @JsonIgnoreProperties({"leaderboardList", "scores", "reviews", "achievementsOfUser", "userXCourses", "loginDataList", "lessonProgresses", "streak"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "user_id", insertable=false, updatable=false)
    private Integer userId;

    @Column(name = "login_time", nullable = false)
    private Timestamp loginTime = Timestamp.valueOf(LocalDateTime.now());

    @Column(name = "device_info")
    private String deviceInfo = logDeviceInfo();

    @Column(name = "ip_address")
    private String ipAddress = logIpAddress();

    @Column(name = "session_token", unique = true)
    private String sessionToken;


    @Column(name = "expires_at")
    private Timestamp expiresAt;

    @Column(name = "is_anonymized", nullable = false)
    private Boolean isAnonymized = false;

    @Column(name = "anonymized_at")
    private Timestamp anonymizedAt;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;


     public String logDeviceInfo() {
        StringBuilder deviceInfoBuilder = new StringBuilder();

        try {
            NetworkInterface networkInterface = NetworkInterface.getByInetAddress(InetAddress.getLocalHost());
            if (networkInterface != null) {
                deviceInfoBuilder.append("MAC: ").append(Arrays.toString(networkInterface.getHardwareAddress())).append("; ");
            }
            deviceInfoBuilder.append("OS: ").append(System.getProperty("os.name")).append(" ").append(System.getProperty("os.version")).append("; ");
            deviceInfoBuilder.append("Java: ").append(System.getProperty("java.version"));
        } catch (Exception e) {
            return "Unknown Device";
        }

        return deviceInfoBuilder.toString();
    }


    public String logIpAddress() {
        try {
            Enumeration<NetworkInterface> interfaces = NetworkInterface.getNetworkInterfaces();

            while (interfaces.hasMoreElements()) {
                NetworkInterface ni = interfaces.nextElement();

                if (!ni.isUp()) {
                    continue;
                }

                Enumeration<InetAddress> addresses = ni.getInetAddresses();
                while (addresses.hasMoreElements()) {
                    InetAddress addr = addresses.nextElement();

                    if (!addr.isLoopbackAddress()) {
                        return addr.getHostAddress();
                    }}
            }
            return InetAddress.getLocalHost().getHostAddress();


        } catch (Exception e) {
            return "Unknown IP";
        }
    }

}
