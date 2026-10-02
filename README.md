# Playwright Test Automation

Automated UI testing project using Playwright.

## Test Coverage

- Login
- Search
- Product selection
- Cart
- Checkout
- Negative test cases

## Technologies

- Playwright
- JavaScript
- Node.js
- Git
- GitHub

---

## 🎯 Project Overview

This repository demonstrates a practical end-to-end test automation project for an e-commerce web application using **Playwright** and **JavaScript**. It applies established Quality Assurance (QA) practices, including the **Page Object Model (POM)** design pattern, asynchronous network synchronization, reliable locator strategies, and negative and boundary test coverage.

The target system under test is the public practice e-commerce platform:
👉 **[Practice Software Testing (Toolshop Demo)](https://practicesoftwaretesting.com)**

---

## 📁 Repository Structure

```text
playwright-test-automation/
│
├── tests/
│   ├── login.spec.js           # Authentication, negative logins, and session tests
│   ├── search.spec.js          # Product search, filters, case-insensitivity, sorting
│   └── checkout.spec.js        # Product selection, cart management, checkout wizard
│
├── pages/
│   ├── LoginPage.js            # Page Object Model for Authentication
│   ├── SearchPage.js           # Page Object Model for Search & Catalog
│   └── CheckoutPage.js         # Page Object Model for Cart & Checkout
│
├── playwright.config.js        # Playwright test runner configuration
├── package.json                # Project dependencies and test runner scripts
└── README.md                   # Project documentation
```

---

## 🧪 Test Scenarios

### 1. Authentication & Login (`tests/login.spec.js`)
- ✅ **Positive Flow:** Verify successful login with valid demo credentials (`customer@practicesoftwaretesting.com` / `welcome01`), checking redirect to `/account` and user profile banner.
- 🛑 **Negative Flow (Invalid Password):** Submit valid email with wrong password; verify error message *"Invalid email or password"*.
- 🛑 **Negative Flow (Unregistered Email):** Submit non-existent user; assert generic error message.
- 🛑 **Negative Flow (Empty Submission):** Click submit with blank form; verify inline field validation errors for email and password.
- ⚠️ **Boundary / Syntax Validation:** Submit malformed email format (`not-an-email`); verify client-side validation.
- 🔄 **Session Lifecycle:** Perform user logout; verify auth token cleanup and navigation bar updates.

### 2. Product Search & Catalog (`tests/search.spec.js`)
- 🔍 **Keyword Search:** Search for known tool keyword (`Pliers`); verify all returned items match query string.
- 🔤 **Case-Insensitive Search:** Search with lowercase (`hammer`); assert matching products are correctly identified.
- 🛑 **Negative Search (0 Results):** Search for non-existent keyword; verify empty results state banner.
- 🔄 **Catalog Reset:** Filter catalog, trigger search reset, and assert catalog restores complete product listing.
- 📊 **Sorting:** Verify sorting catalog items alphabetically and by price order.

### 3. Shopping Cart & Checkout (`tests/checkout.spec.js`)
- 📦 **Product Selection & Details:** Navigate from catalog to product detail view; verify title, price, description, and stock status.
- 🛒 **Cart Operations:** Adjust item quantities, trigger Add-to-Cart, assert confirmation notification, and verify badge counter.
- 🧾 **Cart Review & Subtotals:** Verify cart item line totals and subtotal display.
- 💳 **Checkout Wizard:** Step through multi-step checkout (Cart Summary -> Sign-in Confirmation -> Shipping Address -> Payment Selection).
- 🛑 **Negative Flow (Empty Cart):** Attempt checkout with empty basket; verify empty state handling.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0 or higher recommended)
- **npm** (v9.0 or higher)

### Installation
Clone this repository and install the project dependencies along with Playwright browser binaries:

```bash
# Clone the repository
git clone https://github.com/your-username/playwright-test-automation.git
cd playwright-test-automation

# Install npm dependencies
npm install

# Install Playwright browser engines (Chromium)
npx playwright install chromium
```

---

## 🏃 Running Tests

| Command | Description |
|:---|:---|
| `npm test` | Runs the full test suite in headless mode |
| `npm run test:headed` | Runs tests with visible browser window for visual observation |
| `npm run test:login` | Runs only the Authentication & Login test suite |
| `npm run test:search` | Runs only the Product Search & Filtering test suite |
| `npm run test:checkout` | Runs only the Cart & Checkout test suite |
| `npm run test:ui` | Launches Playwright's interactive visual UI Mode |
| `npm run test:report` | Opens the HTML execution report |

---

## 📊 Test Reporting & Artifacts

Playwright automatically generates screenshots, video recordings, and detailed network traces on test retries:

```bash
# View the HTML test execution report
npm run test:report

# Inspect trace viewer for debugging failed tests
npx playwright show-trace test-results/<folder-name>/trace.zip
```
