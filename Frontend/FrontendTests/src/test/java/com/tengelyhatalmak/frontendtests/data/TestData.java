package com.tengelyhatalmak.frontendtests.data;


public final class TestData {

  public static final String BASE_URL = "http:/localhost:4200";



    // === Valid login credentials (must exist in backend DB) ===
    public static final String VALID_EMAIL = "kqhm6@dollicons.com";
    public static final String VALID_USERNAME = "testUser6";
    public static final String VALID_PASSWORD = "testUser6";

    // === Invalid credentials ===
    public static final String WRONG_PASSWORD = "wrongpassword";
    public static final String NONEXISTENT_EMAIL = "nonexistent@example.com";
    public static final String INVALID_EMAIL_FORMAT = "not-an-email";
    public static final String SHORT_PASSWORD = "abc";

    // === Registration passwords ===
    public static final String NEW_PASSWORD = "newpass123";
    public static final String MISMATCHED_PASSWORD = "different123";

    // === URL paths ===
    public static final String LOGIN_PATH = "/login";
    public static final String REGISTER_PATH = "/register";
    public static final String REGISTER_SUCCESS_PATH = "/register/success";
    public static final String DASHBOARD_PATH = "/dashboard";

    // === Expected Hungarian UI text ===
    public static final String LOGIN_ERROR_TEXT = "Sikertelen bejelentkezés";
    public static final String REGISTER_SUCCESS_TEXT = "Sikeresen regisztráltál";

    /**
     * Generates a unique email address using System.currentTimeMillis().
     * Each test run produces a different email, avoiding "email already taken"
     * conflicts from prior registration test runs (DATA-02).
     */
    public static String generateUniqueEmail() {
        return "testuser_" + System.currentTimeMillis() + "@example.com";
    }

    /**
     * Generates a unique username using System.currentTimeMillis().
     */
    public static String generateUniqueUsername() {
        return "user_" + System.currentTimeMillis();
    }

    private TestData() {
        // Prevent instantiation — constants-only class
    }
}
