package com.tengelyhatalmak.languaforge.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "login_time", nullable = false)
    private Timestamp loginTime = Timestamp.valueOf(LocalDateTime.now());

    @Column(name = "device_info")
    private String deviceInfo = logDeviceInfo();

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "session_token", unique = true)
    private String sessionToken;


    @Column(name = "expires_at", nullable = false)
    private Timestamp expiresAt;

    @Column(name = "is_anonymized", nullable = false)
    private Boolean isAnonymized = false;

    @Column(name = "anonymized_at")
    private Timestamp anonymizedAt;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;


    private String logDeviceInfo() {
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

}
