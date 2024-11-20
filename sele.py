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

def count_files_in_directory(directory):
    return len([f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))])

def delete_all_files_recursively(directory):
    for root, dirs, files in os.walk(directory, topdown=False):
        for file in files:
            file_path = os.path.join(root, file)
            os.remove(file_path)
            print(f"Deleted: {file_path}")

count=0
mail = input("Enter your mail: ")
fact = input("Enter your 2fact sec: ")
service = Service('/usr/local/bin/geckodriver')
driver = webdriver.Firefox(service=service)
driver.get('https://developer.samsung.com/remote-test-lab')
try:
    wait = WebDriverWait(driver, 10)
    sign_in = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, 'util-group-sign-in')))
    sign_in.click()
    wait = WebDriverWait(driver, 10)
    time.sleep(14)
    # email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="iptLgnPlnID"]')))
    email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="account"]')))
    email_input.click()
    # email_input.send_keys(mail)
    email_input.send_keys(mail)
    # sign_in_button =  driver.find_element(By.XPATH, '//*[@id="signInButton"]')
    sign_in_button =  driver.find_element(By.XPATH, "//*[contains(text(), 'Next')]")
    sign_in_button.click()
    wait = WebDriverWait(driver, 10)
    time.sleep(14)
    # email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="iptLgnPlnPD"]')))
    email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="password"]')))
    email_input.click()
    email_input.send_keys('Lexa@heda12')
    # sign_in_button =  driver.find_element(By.XPATH, '//*[@id="signInButton"]')
    sign_in_button =  wait.until(EC.element_to_be_clickable((By.XPATH,  "//button[text()='Sign in']")))
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
    # email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="iptAuthNum"]')))
    email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="otp"]')))
    totp = pyotp.TOTP(fact.replace(" ",""))
    email_input.click()
    email_input.send_keys(totp.now())
    # sign_in_button =  driver.find_element(By.XPATH, '//*[@id="btnNext"]')
    wait.until(EC.element_to_be_clickable((By.XPATH,  "//button[text()='Verify']"))).click()
    wait = WebDriverWait(driver, 10)
    time.sleep(2)
    started = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="desktop-btn"]')))
    started.click()
    cookies = driver.get_cookies()
    if(len(sys.argv) > 1):
        if(sys.argv[1]=="0"):
            delete_all_files_recursively("./cookies")
            count=1
        else:
            count = sys.argv[1]
    else:
        count=count_files_in_directory("./cookies") +1
    for cookie in cookies:
        print(cookie)
    with open(f'./cookies/cookies{count}.txt', 'w') as f:
        for cookie in cookies:
            f.write(f"{cookie['name']}={cookie['value']}\n")
    print("Finished...")

finally:
    # driver.quit()
    pass