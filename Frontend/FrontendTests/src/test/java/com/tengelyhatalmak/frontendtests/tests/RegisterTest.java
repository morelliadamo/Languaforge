package com.tengelyhatalmak.frontendtests.tests;

import com.codeborne.selenide.WebDriverRunner;
import com.tengelyhatalmak.frontendtests.config.BaseTest;
import com.tengelyhatalmak.frontendtests.data.TestData;
import com.tengelyhatalmak.frontendtests.pages.LoginPage;
import com.tengelyhatalmak.frontendtests.pages.RegisterPage;
import com.tengelyhatalmak.frontendtests.pages.SuccessfulRegisterPage;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;


@DisplayName("Register Tests")
@Epic("Authentication")
@Feature("Register")
@Tag("register")
public class RegisterTest extends BaseTest {


    @Test
    @Tag("smoke")
    @Severity(SeverityLevel.CRITICAL)
    @DisplayName("REG-01: Valid registration redirects to success page")
    @Description("REG-01: Register with valid unique data, verify redirect to success page with Hungarian confirmation text and registered email")
    void validRegistrationRedirectsToSuccessPage() {
        String uniqueEmail = TestData.generateUniqueEmail();
        String uniqueUsername = TestData.generateUniqueUsername();

        new RegisterPage().open()
                .registerWith(uniqueUsername, uniqueEmail,
                        TestData.NEW_PASSWORD, TestData.NEW_PASSWORD);

        SuccessfulRegisterPage successPage = new SuccessfulRegisterPage();
        successPage.waitForPageLoad();

        assertThat(WebDriverRunner.url()).contains(TestData.REGISTER_SUCCESS_PATH);
        assertThat(successPage.getSuccessMessage()).contains(TestData.REGISTER_SUCCESS_TEXT);
        assertThat(successPage.getRegisteredEmail()).isEqualTo(uniqueEmail);
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("registerValidationCases")
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("Registration validation prevents invalid submissions")
    @Description("REG-02/03/04/05: Verify that various invalid registration scenarios are handled correctly")
    void registrationValidationPreventsSuccess(String scenario, String username, String email,
                                               String password, String confirmPassword,
                                               boolean expectErrorMessage) {
        RegisterPage registerPage = new RegisterPage().open();

        if (username != null) registerPage.enterUsername(username);
        if (email != null) registerPage.enterEmail(email);
        if (password != null) registerPage.enterPassword(password);
        if (confirmPassword != null) registerPage.enterConfirmPassword(confirmPassword);

        registerPage.clickRegisterButton();

        assertThat(WebDriverRunner.url()).doesNotContain(TestData.REGISTER_SUCCESS_PATH);

        if (expectErrorMessage) {
            assertThat(registerPage.getErrorMessage()).isNotEmpty();
        }
    }

    static Stream<Arguments> registerValidationCases() {
        return Stream.of(
                Arguments.of("REG-02: Duplicate email shows error",
                        TestData.generateUniqueUsername(), TestData.VALID_EMAIL,
                        TestData.NEW_PASSWORD, TestData.NEW_PASSWORD, true),
                Arguments.of("REG-03: Password mismatch prevents registration",
                        TestData.generateUniqueUsername(), TestData.generateUniqueEmail(),
                        TestData.NEW_PASSWORD, TestData.MISMATCHED_PASSWORD, false),
                Arguments.of("REG-04: Invalid email format prevents registration",
                        TestData.generateUniqueUsername(), TestData.INVALID_EMAIL_FORMAT,
                        TestData.NEW_PASSWORD, TestData.NEW_PASSWORD, false),
                Arguments.of("REG-05: Empty fields prevent registration",
                        null, null, null, null, false)
        );
    }

    @Test
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("REG-06: Login link navigates to login page")
    @Description("REG-06: Click the 'Bejelentkezés' link on register page, verify navigation to /login")
    void loginLinkNavigatesToLoginPage() {
        LoginPage loginPage = new RegisterPage().open()
                .clickLoginLink();

        loginPage.waitForPageLoad();

        assertThat(WebDriverRunner.url()).contains(TestData.LOGIN_PATH);
        assertThat(loginPage.isLoaded()).isTrue();
    }
}
