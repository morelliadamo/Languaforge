package com.tengelyhatalmak.frontendtests.pages;

import com.codeborne.selenide.Selenide;
import com.codeborne.selenide.SelenideElement;
import io.qameta.allure.Step;

import static com.codeborne.selenide.Condition.visible;
import static com.codeborne.selenide.Selenide.$;


public class RegisterPage extends BasePage {

    private final SelenideElement registerForm = $("#registerForm");
    private final SelenideElement emailField = $("#email");
    private final SelenideElement registerButton = $("#registerBtn");
    private final SelenideElement usernameField = $("#registerForm input[type='text']");
    private final SelenideElement passwordField = $("input[placeholder='Jelszó *']");
    private final SelenideElement confirmPasswordField = $("input[placeholder='Jelszó újra *']");
    private final SelenideElement emailTakenError = $(".text-red-600");
    private final SelenideElement loginLink = $("#login-link");

    @Step("Open register page")
    public RegisterPage open() {
        Selenide.open("/register");
        return this;
    }

    @Override
    public boolean isLoaded() {
        return registerForm.exists() && registerButton.exists();
    }

    @Step("Enter username: {username}")
    public RegisterPage enterUsername(String username) {
        usernameField.shouldBe(visible).setValue(username);
        return this;
    }

    @Step("Enter email: {email}")
    public RegisterPage enterEmail(String email) {
        emailField.shouldBe(visible).setValue(email);
        return this;
    }

    @Step("Enter password")
    public RegisterPage enterPassword(String password) {
        passwordField.shouldBe(visible).setValue(password);
        return this;
    }

    @Step("Enter confirm password")
    public RegisterPage enterConfirmPassword(String confirmPassword) {
        confirmPasswordField.shouldBe(visible).setValue(confirmPassword);
        return this;
    }

    @Step("Click register button")
    public RegisterPage clickRegisterButton() {
        registerButton.shouldBe(visible).click();
        return this;
    }

    @Step("Register with: {username}, {email}")
    public RegisterPage registerWith(String username, String email, String password, String confirmPassword) {
        enterUsername(username)
                .enterEmail(email)
                .enterPassword(password)
                .enterConfirmPassword(confirmPassword)
                .clickRegisterButton();
        return this;
    }

    @Step("Click login link")
    public LoginPage clickLoginLink() {
        loginLink.click();
        return new LoginPage();
    }

    @Override
    @Step("Get registration error message")
    public String getErrorMessage() {
        return emailTakenError.shouldBe(visible).getText();
    }
}
