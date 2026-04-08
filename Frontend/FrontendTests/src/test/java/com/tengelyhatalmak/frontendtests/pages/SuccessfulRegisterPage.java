package com.tengelyhatalmak.frontendtests.pages;

import com.codeborne.selenide.SelenideElement;
import io.qameta.allure.Step;

import static com.codeborne.selenide.Condition.visible;
import static com.codeborne.selenide.Selenide.$;


public class SuccessfulRegisterPage extends BasePage {

    private final SelenideElement successHeading = $("h2");
    private final SelenideElement emailDisplay = $("h3 b");

    @Override
    public boolean isLoaded() {
        return successHeading.exists() && successHeading.getText().contains("Sikeresen");
    }

    @Step("Get success message")
    public String getSuccessMessage() {
        return successHeading.shouldBe(visible).getText();
    }

    @Step("Get registered email")
    public String getRegisteredEmail() {
        return emailDisplay.shouldBe(visible).getText();
    }
}
