package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.LoginData;
import com.tengelyhatalmak.languaforge.service.LoginDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    



    @PostMapping("createLoginData")
    public LoginData createLoginData(LoginData loginData){
        return loginDataService.saveLoginData(loginData);
    }



}
