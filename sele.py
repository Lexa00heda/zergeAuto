from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pyotp
import sys
import time
import os
import json

with open('accounts.json', 'r') as file:
    data = json.load(file)

account = data["accounts"]
def count_files_in_directory(directory):
    return len([f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))])

def delete_all_files_recursively(directory):
    for root, dirs, files in os.walk(directory, topdown=False):
        for file in files:
            file_path = os.path.join(root, file)
            os.remove(file_path)
            print(f"Deleted: {file_path}")

count=0
args = sys.argv[1]
i=data["last_index"] + 1
j=i
refil_count = 8
counts = count_files_in_directory("./cookies")
if counts >=refil_count:
    refil_left = 8
else:
    refil_left = refil_count - counts
# mail = input("Enter your mail: ")
# fact = input("Enter your 2fact sec: ")
service = Service('/usr/local/bin/geckodriver')
while(i<(j+refil_left)):
    fact = account[i].split(":")[1]
    driver = webdriver.Firefox(service=service)
    driver.get('https://developer.samsung.com/remote-test-lab')
    try:
        wait = WebDriverWait(driver, 10)
        sign_in = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, 'util-group-sign-in')))
        sign_in.click()
        wait = WebDriverWait(driver, 10)
        time.sleep(14)
        email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="iptLgnPlnID"]')))
        # email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="account"]')))
        email_input.click()
        # email_input.send_keys(mail)
        email_input.send_keys(account[i].split(":")[0])
        sign_in_button =  driver.find_element(By.XPATH, '//*[@id="signInButton"]')
        # sign_in_button =  driver.find_element(By.XPATH, "//*[contains(text(), 'Next')]")
        sign_in_button.click()
        wait = WebDriverWait(driver, 10)
        time.sleep(14)
        email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="iptLgnPlnPD"]')))
        # email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="password"]')))
        email_input.click()
        email_input.send_keys('Lexa@heda12')
        sign_in_button =  driver.find_element(By.XPATH, '//*[@id="signInButton"]')
        # sign_in_button =  wait.until(EC.element_to_be_clickable((By.XPATH,  "//button[text()='Sign in']")))
        sign_in_button.click()
        wait = WebDriverWait(driver, 15)
        time.sleep(14)
        try:
            updated_policy_text = wait.until(EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Samsung account policies updated')]"))).text
            if updated_policy_text:
                print("Samsung account policies updated")
                wait.until(EC.element_to_be_clickable((By.XPATH, "(//*[contains(text(), 'Terms and Conditions')])[2]"))).click()
                wait.until(EC.element_to_be_clickable((By.XPATH, "(//*[contains(text(), 'Special terms')])[1]"))).click()
                wait.until(EC.element_to_be_clickable((By.XPATH, "(//*[contains(text(), 'Notice of Financial Incentives')])[2]"))).click()
                wait.until(EC.element_to_be_clickable((By.XPATH, "(//*[contains(text(), 'I agree to Samsung using my registered phone number for verification and customer support.')])[1]"))).click()
                wait.until(EC.element_to_be_clickable((By.XPATH,  "//button[text()='Agree']"))).click()
            else:
                print("auth page")
        except:
            print("auth page")
        email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="iptAuthNum"]')))
        # email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="otp"]')))
        totp = pyotp.TOTP(fact.replace(" ",""))
        email_input.click()
        email_input.send_keys(totp.now())
        sign_in_button =  driver.find_element(By.XPATH, '//*[@id="btnNext"]')
        sign_in_button.click()
        # wait.until(EC.element_to_be_clickable((By.XPATH,  "//button[text()='Verify']"))).click()
        wait = WebDriverWait(driver, 10)
        time.sleep(3)
        try:
            updated_policy_text = wait.until(EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Choose the option that best describes you to pick the account type most appropriate to you.')]"))).text
            if updated_policy_text:
                print("Choose your account type.")
                wait.until(EC.element_to_be_clickable((By.XPATH, "(//*[contains(text(), 'Personal Account')])[1]"))).click()
                time.sleep(1)
                wait.until(EC.element_to_be_clickable((By.XPATH,  "//span[text()='Next']"))).click()
                time.sleep(3)
                updated_policy_text = wait.until(EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'To use Samsung Developer Portal, you need to accept the Terms of Service.')]"))).text
                if updated_policy_text:
                    print("Privacy Policy and Terms of Service")
                    time.sleep(1)
                    wait.until(EC.element_to_be_clickable((By.XPATH, "(//*[contains(text(), '[Required] Samsung Developer Terms & Conditions')])[1]"))).click()
                    time.sleep(1)
                    wait.until(EC.element_to_be_clickable((By.XPATH, "(//*[contains(text(), '[Required] Samsung Developer Privacy Policy')])[1]"))).click()
                    time.sleep(1)
                    wait.until(EC.element_to_be_clickable((By.XPATH,  "//span[text()='Next']"))).click()
                time.sleep(3)
                updated_policy_text = wait.until(EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Enter your Personal information')]"))).text
                if updated_policy_text:
                    print("Enter your Personal information")
                    time.sleep(4)
                    wait.until(EC.presence_of_element_located((By.XPATH,  "//span[text()='Submit']"))).click()
                time.sleep(2)
                updated_policy_text = wait.until(EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Welcome to Samsung Developer Portal!')]"))).text
                if updated_policy_text:
                    print("Welcome to Samsung Developer Portal!")
                    time.sleep(4)
                    wait.until(EC.presence_of_element_located((By.XPATH,  "//span[text()='Go to the Dashboard']"))).click()
                time.sleep(2)
            else:
                # print("cookie page")
                pass
        except:
            # print("cookie page")
            pass
        try:
            updated_policy_text = wait.until(EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Samsung account Privacy Notice updated')]"))).text
            if updated_policy_text:
                print("Samsung account Privacy Notice updated")
                time.sleep(2)
                try:
                    wait.until(EC.element_to_be_clickable((By.XPATH, "(//*[contains(text(), 'Continue')])[1]"))).click()
                except:
                    pass
                try:
                    wait.until(EC.element_to_be_clickable((By.XPATH,"//button[text()='Continue']"))).click()
                except:
                    pass
                try:
                    wait.until(EC.element_to_be_clickable((By.XPATH, "(//*[contains(text(), 'Agree')])[1]"))).click()
                except:
                    pass
        except:
            print("cookie page")
            pass
        time.sleep(1)
        started = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="desktop-btn"]')))
        started.click()
        cookies = driver.get_cookies()
        if(len(sys.argv) > 1):
            if(args=="-1"):
                delete_all_files_recursively("./cookies")
                count=1
                args = "1"
            elif(args=="0"):
                if(count_files_in_directory("./cookies") >= refil_count):
                    delete_all_files_recursively("./cookies")
                    count=1
                else:
                    count=count_files_in_directory("./cookies") +1
                args = "1"
            else:
                if(sys.argv[1]!="0" and sys.argv[1]!="-1"):
                    count = sys.argv[1]
                else:
                    count=count_files_in_directory("./cookies") +1
        else:
            count=count_files_in_directory("./cookies") +1
        for cookie in cookies:
            print(cookie)
        with open(f'./cookies/cookies{count}.txt', 'w') as f:
            for cookie in cookies:
                f.write(f"{cookie['name']}={cookie['value']}\n")
        print("Finished...")
        data["last_index"] = data["last_index"] + 1
        with open('accounts.json', 'w') as file:
            json.dump(data, file, indent=4)
        i=i+1
        driver.quit()
        if(sys.argv[1]!="0" and sys.argv[1]!="-1"):
            break
    finally:
        # driver.quit()
        pass