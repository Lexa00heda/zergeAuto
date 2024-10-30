from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pyotp
import time
import json


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
    email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="iptLgnPlnID"]')))
    email_input.click()
    email_input.send_keys(mail)
    sign_in_button =  driver.find_element(By.XPATH, '//*[@id="signInButton"]')
    sign_in_button.click()
    wait = WebDriverWait(driver, 10)
    time.sleep(14)
    email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="iptLgnPlnPD"]')))
    email_input.click()
    email_input.send_keys('Lexa@heda12')
    sign_in_button =  driver.find_element(By.XPATH, '//*[@id="signInButton"]')
    sign_in_button.click()
    wait = WebDriverWait(driver, 15)
    time.sleep(14)
    email_input = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="iptAuthNum"]')))
    totp = pyotp.TOTP(fact.replace(" ",""))
    email_input.click()
    email_input.send_keys(totp.now())
    sign_in_button =  driver.find_element(By.XPATH, '//*[@id="btnNext"]')
    sign_in_button.click()
    wait = WebDriverWait(driver, 10)
    time.sleep(2)
    started = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="desktop-btn"]')))
    started.click()
    cookies = driver.get_cookies()
    for cookie in cookies:
        print(cookie)
    with open('cookies.txt', 'w') as f:
        for cookie in cookies:
            f.write(f"{cookie['name']}={cookie['value']}\n")
    print("Finished...")

finally:
    # driver.quit()
    pass