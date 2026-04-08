package com.tengelyhatalmak.frontendtests.tests;

import com.codeborne.selenide.Selenide;
import com.codeborne.selenide.WebDriverRunner;
import com.tengelyhatalmak.frontendtests.config.BaseTest;
import com.tengelyhatalmak.frontendtests.data.TestData;
import com.tengelyhatalmak.frontendtests.pages.LoginPage;
import com.tengelyhatalmak.frontendtests.pages.RegisterPage;
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

/**
 * Login flow E2E tests (LOGIN-01 through LOGIN-06).
 * Tests valid login, invalid credentials, empty fields, and navigation.
 * Extends BaseTest for Allure listener, cookie clearing, and browser lifecycle.
 *
 * Allure hierarchy: Epic("Authentication") > Feature("Login")
 * Tags: "login" (all tests), "smoke" (happy path only)
 * Parameterized: LOGIN-02/03/04/05 consolidated into one @ParameterizedTest (ADV-01)
 */
@DisplayName("Login Tests")
@Epic("Authentication")
@Feature("Login")
@Tag("login")
public class LoginTest extends BaseTest {

    /**
     * LOGIN-01: Valid credentials → redirect to dashboard.
     * Uses loginWith() convenience method which chains enter+enter+click.
     * Waits for Angular router navigation to complete before asserting URL.
     */
    @Test
    @Tag("smoke")
    @Severity(SeverityLevel.CRITICAL)
    @DisplayName("LOGIN-01: Valid credentials redirect to dashboard")
    @Description("LOGIN-01: Log in with valid email and password, verify URL changes to dashboard path")
    void validLoginRedirectsToDashboard() {
        new LoginPage().open()
                .loginWith(TestData.VALID_EMAIL, TestData.VALID_PASSWORD);

        // Wait for Angular router.navigate(['/dashboard']) to complete
        Selenide.Wait().until(driver ->
                driver.getCurrentUrl().contains(TestData.DASHBOARD_PATH));

        assertThat(WebDriverRunner.url()).contains(TestData.DASHBOARD_PATH);
    }


    @ParameterizedTest(name = "{0}")
    @MethodSource("loginValidationCases")
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("Login validation prevents unauthorized access")
    @Description("LOGIN-02/03/04/05: Verify that various invalid login scenarios are handled correctly")
    void loginValidationPreventsAccess(String scenario, String email, String password,
                                       boolean expectButtonDisabled) {
        LoginPage loginPage = new LoginPage().open();

        if (email != null) {
            loginPage.enterEmailOrUsername(email);
        }
        if (password != null) {
            loginPage.enterPassword(password);
        }

        if (expectButtonDisabled) {
            assertThat(loginPage.isLoginButtonEnabled()).isFalse();
        } else {
            loginPage.clickLoginButton();
            assertThat(loginPage.getErrorMessage()).isNotEmpty();
        }
    }

    static Stream<Arguments> loginValidationCases() {
        return Stream.of(
                Arguments.of("LOGIN-02: Invalid password shows error",
                        TestData.VALID_EMAIL, TestData.WRONG_PASSWORD, false),
                Arguments.of("LOGIN-03: Empty email keeps button disabled",
                        null, TestData.VALID_PASSWORD, true),
                Arguments.of("LOGIN-04: Empty password keeps button disabled",
                        TestData.VALID_EMAIL, null, true),
                Arguments.of("LOGIN-05: Nonexistent user shows error",
                        TestData.NONEXISTENT_EMAIL, TestData.VALID_PASSWORD, false)
        );
    }

    @Test
    @Severity(SeverityLevel.NORMAL)
    @DisplayName("LOGIN-06: Register link navigates to register page")
    @Description("LOGIN-06: Click the 'Regisztráció' link on login page, verify navigation to /register")
    void registerLinkNavigatesToRegisterPage() {
        RegisterPage registerPage = new LoginPage().open()
                .clickRegisterLink();

        registerPage.waitForPageLoad();

        assertThat(WebDriverRunner.url()).contains(TestData.REGISTER_PATH);
        assertThat(registerPage.isLoaded()).isTrue();
    }
}
