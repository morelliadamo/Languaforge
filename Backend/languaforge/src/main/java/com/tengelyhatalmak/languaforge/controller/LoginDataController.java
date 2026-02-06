package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.LoginData;
import com.tengelyhatalmak.languaforge.service.LoginDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/logindata")
public class LoginDataController {


    @Autowired
    private LoginDataService loginDataService;

    @GetMapping("/")
    public List<LoginData> getLoginData(){
        return loginDataService.findAllLoginDatas();
    }


    @GetMapping("/{id}")
    public LoginData getLoginDataById(@PathVariable Integer id){
        return loginDataService.findLoginDataById(id);
    }

    @GetMapping("/{userId}")
    public List<LoginData> getLoginDatasByUserId(@PathVariable Integer userId){
        return loginDataService.findLoginDatasByUserId(userId);
    }

    @GetMapping("/{ipAddress}")
    public List<LoginData> getLoginDataById(@PathVariable String ipAddress){
        return loginDataService.findLoginDatasByIpAddress(ipAddress);
    }

    @GetMapping("/{username}")
    public List<LoginData> getLoginDatasByUsername(@PathVariable String username){
        return loginDataService.findLoginDataByUsername(username);
    }

    @GetMapping("/{username}/ip")
    public List<String> getIpAddressByUsername(@PathVariable String username){
        return loginDataService.findIpAddressByUsername(username);
    }

    @GetMapping("/{ipAddress}/username")
    public List<String> getUsernameByIpAddress(@PathVariable String ipAddress){
        return loginDataService.findUsernameByIpAddress(ipAddress);
    }

    @PostMapping("createLoginData")
    public LoginData createLoginData(LoginData loginData){
        return loginDataService.saveLoginData(loginData);
    }

    @PutMapping("/updateLoginData/{id}")
    public LoginData updateLoginData(@RequestBody LoginData loginData ,@PathVariable Integer id){
        return loginDataService.updateLoginData(loginData, id);
    }

    @PatchMapping("/softDeleteLoginData/{id}")
    public LoginData softDeleteLoginData(@PathVariable Integer id){
        return loginDataService.softDeleteLoginData(id);
    }


    @PatchMapping("/anonymizeLoginData/{id}")
    public LoginData anonymizeLoginData(@PathVariable Integer id){
        return loginDataService.anonymizeLoginData(id);
    }

    @DeleteMapping("/hardDeleteLoginData/{id}")
    public void hardDeleteLoginData(@PathVariable Integer id){
        loginDataService.hardDeleteLoginData(id);
    }
}
