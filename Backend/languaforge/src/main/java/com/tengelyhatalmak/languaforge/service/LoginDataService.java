package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.LoginData;

import java.util.List;

public interface LoginDataService {

        LoginData findLoginDataById(Integer id);

        List<LoginData> findLoginDataByUserId(Integer userId);
        List<LoginData> findLoginDatasByIpAddress(String ipAddress);
        List<LoginData> findLoginDataByUsername(String username);
        List<LoginData> findAllLoginDatas();

        List<String> findIpAddressByUsername(String username);

        List<String> findUsernameByIpAddress(String ipAddress);

        List<String> findDeviceInfoByUsername(String username);

        List<String> findDeviceInfoByIpAddress(String ipAddress);

        LoginData saveLoginData(LoginData loginData);

        LoginData updateLoginData(LoginData loginData, Integer id);


        LoginData anonymizeLoginData(Integer id);
        LoginData softDeleteLoginData(Integer id);
        void hardDeleteLoginData(Integer id);
}
