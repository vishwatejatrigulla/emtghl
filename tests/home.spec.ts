import { test, expect, Locator } from '@playwright/test';

test("EaseMyTrip end-to-end automation", async ({ page }) => {
// Step 1: Visiting the EaseMyTrip homepage
await page.goto('https://www.easemytrip.com/');
await expect(page).toHaveTitle('EaseMyTrip.com - Book Flights, Hotels, Holidays, Bus & Train Tickets');


// Step 2: Selecting "Flights" as the travel type
await page.click('text="Flights"'); 
await page.waitForURL('https://www.easemytrip.com/flights.html', { timeout: 10000 });
console.log("Redirected to Flights page");

   
 // Step 3: Entering "From" city details
const fromInput = page.locator('//*[@id="frmcity"]'); 
await fromInput.click();
// Waiting for the dropdown to appear
const fromDropdown = page.locator('//*[@id="fromautoFill"]'); 
await fromDropdown.waitFor({ state: 'visible', timeout: 10000 }); 
// Selecting the desired option from the "From" dropdown
const delhiOption = page.locator('//*[@id="fromautoFill"]/ul/li[1]');
await delhiOption.click();

const toInput = page.locator('//*[@id="tocity"]');
await toInput.click();
// Waiting for the dropdown to appear
const toDropdown = page.locator('//*[@id="toautoFill"]');
await toDropdown.waitFor({ state: 'visible', timeout: 10000 });
// Selecting the desired option from the "To" dropdown
const mumbaiOption =page.locator('//*[@id="toautoFill"]/ul/li[3]');
await mumbaiOption.click();



// Step 4: Selecting the date with the lowest fare in December
await page.click('//*[@id="dvfarecal"]'); // Opening date picker
const decemberFares = await page.locator('//*[@id="dvcalendar"]/div/div[1]/div//div[contains(@class, "fare-info")]').evaluateAll((nodes) =>
    nodes.map((node) => ({
        date: node.parentElement?.getAttribute('data-date'),
        fare: parseInt(node.textContent || '', 10),
    })).sort((a, b) => a.fare - b.fare)
);
// Selecting  the date with the lowest fare in December
const bestDecemberDate = decemberFares[0]?.date; // The first entry after sorting
if (bestDecemberDate) {
    await page.locator(`//*[@id="dvcalendar"]/div/div[1]/div//div[@data-date="${bestDecemberDate}"]`).click(); // Adjust XPath for December dates
} else {
    throw new Error("No fares available for December 2024");
}
console.log("Extracted December fares:", decemberFares);



// Step 5: Searching for flights and go to the next page
await page.click('//*[@id="divSearchFlight"]/button');
await page.waitForURL('https://flight.easemytrip.com/FlightList/Index?srch=DEL-Delhi-India|BOM-Mumbai-India|18/12/2024&px=1-0-0&cbn=0&ar=undefined&isow=true&isdm=true&lang=en-us&ompAff=&IsDoubleSeat=false&CCODE=IN&curr=INR&apptype=&apptype=B2C', { timeout: 10000 });
console.log("Redirected to Flights booking page");
// clicking the button booknow
const bookNowButton = page.locator('//*[@id="ResultDiv"]/div/div/div[4]/div[2]/div[1]/div[1]/div[6]/button[1]').first();
await bookNowButton.waitFor({ state: 'visible', timeout: 10000 });
console.log("Book Now button is visible.");
await bookNowButton.click();
console.log("Clicked on the 'Book Now' button.");

//Step6: Identifying the flight details section
await page.waitForURL('https://flight.easemytrip.com/Review/CheckOut?CSU=&SearchID=jjolr7vaj7p&ft=7&Ift=7&bc=&ISWL=&curr=INR&lang=en-us&CCODE=IN&apptype=FALSE&utm_campaign=&utm_source=&utm_medium=&utm_term=&adgroupid=&gad_source=&gclid=', { timeout: 10000 });
console.log("Redirected to the Review/Checkout page.");
const flightDetailsSection = page.locator('//*[@id="divReview"]/div[1]');
await flightDetailsSection.waitFor({ state: 'visible', timeout: 10000 });
console.log("Flight details section is visible.");



//Step7: invalid promocode and valid promocode
//Locating the Promo Code Section
const promoCodeSection = page.locator('//*[@id="sidebar"]/div/div[1]/div[1]/div[5]');
await promoCodeSection.waitFor({ state: 'visible', timeout: 10000 });
console.log("Promo Code section is visible.");
//Entering an invalid promo code
const promoCodeInput = page.locator('//*[@id="txtCouponCode"]');
await promoCodeInput.fill('FIRST56');
console.log("Entered the invalid promo code: FIRST56");
// Submiting the promo code and Locate the Apply button
const applyPromoButton = page.locator('//*[@id="divCouponCodeApply"]/div[2]/div'); 
await applyPromoButton.click();
console.log("Clicked on the 'Apply' button.");
//  Checking for the error message 
const promoerrorMessage = page.locator('//*[@id="easeFareDetails1_promodiv"]'); 
await promoerrorMessage.waitFor({ state: 'visible', timeout: 10000 });
console.log("Error message is displayed for the invalid promo code.");

//Entering an valid promo code
const promoCodeInput1 = page.locator('//*[@id="txtCouponCode"]');
await promoCodeInput1.fill('EMTNCF');
console.log("Entered the valid promo code: EMTNCF");
// Submiting the promo code and Locate the Apply button
const applyPromoButton1 = page.locator('//*[@id="divCouponCodeApply"]/div[2]/div'); 
await applyPromoButton1.click();
console.log("Clicked on the 'Apply' button.");
//  Checking for the confirm message 
const promosucessMessage = page.locator('//*[@id="easeFareDetails1_promodiv"]'); 
await promosucessMessage.waitFor({ state: 'visible', timeout: 10000 });
console.log("sucess msg is displayed for the valid promo code.");

});
