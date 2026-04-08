package com.tengelyhatalmak.frontendtests.config;

import com.codeborne.selenide.Selenide;
import com.codeborne.selenide.logevents.SelenideLogger;
import com.tengelyhatalmak.frontendtests.data.TestData;
import io.qameta.allure.selenide.AllureSelenide;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInstance;


@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public abstract class BaseTest {

    @BeforeAll
    void globalSetup() {
        SelenideLogger.addListener("AllureSelenide",
            new AllureSelenide()
                .screenshots(true)
                .savePageSource(false)
        );
    }

    @BeforeEach
    void setUp() {
      Selenide.open(TestData.BASE_URL);


        Selenide.clearBrowserCookies();
        Selenide.clearBrowserLocalStorage();
    }

    @AfterAll
    void globalTeardown() {
        SelenideLogger.removeListener("AllureSelenide");
        Selenide.closeWebDriver();
    }
}
