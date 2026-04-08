package com.tengelyhatalmak.frontendtests.pages;

import com.codeborne.selenide.Selenide;
import io.qameta.allure.Step;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class BasePage {

    protected final Logger logger = LoggerFactory.getLogger(getClass());

    public abstract boolean isLoaded();


    @Step("Wait for page to load")
    public void waitForPageLoad() {
        Selenide.Wait().until(driver -> isLoaded());
    }

    @Step("Get error message")
    public String getErrorMessage() {
        return "";
    }
}
