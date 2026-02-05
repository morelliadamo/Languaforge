package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.LoginData;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.repository.LoginDataRepository;
import com.tengelyhatalmak.languaforge.repository.UserRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoginDataServiceImpl implements LoginDataService{

    @Autowired
    private LoginDataRepository loginDataRepository;

    @Override
    public LoginData findLoginDataById(Integer id) {
        return loginDataRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("LoginData not found"));
    }

    @Override
    public List<LoginData> findLoginDataByUserId(Integer userId) {
        return loginDataRepository.findLoginDatasByUserId(userId);
    }

    @Override
    public List<LoginData> findLoginDatasByIpAddress(String ipAddress) {
        return loginDataRepository.findLoginDatasByIpAddress(ipAddress);
    }

    @Override
    public List<LoginData> findLoginDataByUsername(String username) {
        return loginDataRepository.findLoginDatasByUsername(username);
    }

    @Override
    public List<LoginData> findAllLoginDatas() {
        return loginDataRepository.findAll();
    }

    @Override
    public List<String> findIpAddressByUsername(String username) {
        return loginDataRepository.findIpAddressesByUsername(username);
    }

    @Override
    public List<String> findUsernameByIpAddress(String ipAddress) {
        return loginDataRepository.findUsernamesByIpAddress(ipAddress);
    }

    @Override
    public List<String> findDeviceInfoByUsername(String username) {
        return loginDataRepository.findDeviceInfosByUsername(username);
    }

    @Override
    public List<String> findDeviceInfoByIpAddress(String ipAddress) {
        return loginDataRepository.findDeviceInfosByIpAddress(ipAddress);
    }

    @Override
    public LoginData saveLoginData(LoginData loginData) {
        return loginDataRepository.save(loginData);
    }

    @Override
    public LoginData updateLoginData(LoginData loginData, Integer id) {
        LoginData existingLoginData = loginDataRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("LoginData not found"));

        existingLoginData.setIpAddress(loginData.getIpAddress());
        existingLoginData.setDeviceInfo(loginData.getDeviceInfo());
        existingLoginData.setExpiresAt(loginData.getExpiresAt());
        existingLoginData.setIsAnonymized(loginData.getIsAnonymized());
        existingLoginData.setSessionToken(loginData.getSessionToken());

        return loginDataRepository.save(existingLoginData);
    }

    @Override
    public LoginData softDeleteLoginData(Integer id) {
        LoginData loginDataToSoftDelete = loginDataRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("LoginData not found"));

        loginDataToSoftDelete.setIsDeleted(true);

        return loginDataRepository.save(loginDataToSoftDelete);

    }


    @Override
    public LoginData anonymizeLoginData(Integer id) {
        LoginData loginDataToAnonymize = loginDataRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("LoginData not found"));

        loginDataToAnonymize.setIsAnonymized(true);
        loginDataToAnonymize.setIpAddress("NULL");
        loginDataToAnonymize.setDeviceInfo("NULL");
        loginDataToAnonymize.setUser(null);

        return loginDataRepository.save(loginDataToAnonymize);
    }



    @Override
    public void hardDeleteLoginData(Integer id) {
        System.out.println("Deleting LoginData with id: "+id);
        loginDataRepository.deleteById(id);
    }
}
