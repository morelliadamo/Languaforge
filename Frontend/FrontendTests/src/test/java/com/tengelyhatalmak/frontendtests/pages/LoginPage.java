package com.tengelyhatalmak.frontendtests.pages;

import com.codeborne.selenide.Selenide;
import com.codeborne.selenide.SelenideElement;
import io.qameta.allure.Step;
import org.openqa.selenium.By;

import static com.codeborne.selenide.Condition.enabled;
import static com.codeborne.selenide.Condition.visible;
import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.webdriver;


public class LoginPage extends BasePage {

    private final SelenideElement emailOrUsernameField = $("#email-or-username-field");
    private final SelenideElement passwordField = $("#password-field");
    private final SelenideElement loginButton = $("#login-btn");
    private final SelenideElement errorMessage = $(".text-red-500.text-sm");
    private final SelenideElement registerLink = $("#register-link");

    @Step("Open login page")
    public LoginPage open() {
        Selenide.open("/login");
        return this;
    }

    @Override
    public boolean isLoaded() {
        return emailOrUsernameField.exists() && loginButton.exists();
    }

    @Step("Enter email or username: {value}")
    public LoginPage enterEmailOrUsername(String value) {
        emailOrUsernameField.shouldBe(visible).setValue(value);
        return this;
    }

    @Step("Enter password")
    public LoginPage enterPassword(String password) {
        passwordField.shouldBe(visible).setValue(password);
        return this;
    }

    @Step("Click login button")
    public LoginPage clickLoginButton() {
        loginButton.shouldBe(enabled).click();
        return this;
    }

    @Step("Login with credentials: {emailOrUsername}")
    public LoginPage loginWith(String emailOrUsername, String password) {
        enterEmailOrUsername(emailOrUsername)
                .enterPassword(password)
                .clickLoginButton();
        return this;
    }

    @Step("Click register link")
    public RegisterPage clickRegisterLink() {
        registerLink.click();
        return new RegisterPage();
    }

    @Override
    @Step("Get login error message")
    public String getErrorMessage() {
        return errorMessage.shouldBe(visible).getText();
    }

    public boolean isLoginButtonEnabled() {
        return loginButton.isEnabled();
    }
}
