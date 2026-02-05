package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.LoginData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LoginDataRepository extends JpaRepository<LoginData, Integer> {

    @Query("SELECT ld FROM LoginData ld WHERE ld.user.id = :userId")
    public List<LoginData> findLoginDatasByUserId(Integer userId);


    @Query("SELECT ld FROM LoginData ld WHERE ld.ipAddress = :ipAddress")
    public List<LoginData> findLoginDatasByIpAddress(String ipAddress);


    @Query("SELECT ld FROM LoginData ld WHERE ld.user.username =:username")
    public List<LoginData> findLoginDatasByUsername(String username);


    @Query("SELECT ld.ipAddress FROM LoginData ld WHERE ld.user.username = :username")
    public List<String> findIpAddressesByUsername(String username);


    @Query("SELECT ld.user.username FROM LoginData ld WHERE ld.ipAddress = :ipAddress")
    public List<String> findUsernamesByIpAddress(String ipAddress);


    @Query("SELECT ld.deviceInfo FROM LoginData ld WHERE ld.user.username = :username")
    public List<String> findDeviceInfosByUsername(String username);

    @Query("SELECT ld.deviceInfo FROM LoginData ld WHERE ld.ipAddress = :ipAddress")
    public List<String> findDeviceInfosByIpAddress(String ipAddress);
}
